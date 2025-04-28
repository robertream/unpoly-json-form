// unpoly-json-form extension
// Handles application/json form submissions

async function parseFormElements(form) {
  const formData = {}

  const elements = form.elements

  for (let element of elements) {
    if (!element.name || element.disabled || element.closest('fieldset:disabled')) continue

    if (element.tagName.toLowerCase() === 'select' && element.multiple) {
      const selectedOptions = Array.from(element.options).filter(o => o.selected && o.value.trim() !== '')
      if (selectedOptions.length === 0) continue
      const values = selectedOptions.map(o => o.value)
      assignField(formData, element.name, values)
      continue
    }

    if (element.tagName.toLowerCase() === 'select' && element.value.trim() === '') {
      continue
    }

    let value = element.value

    if (element.type === 'checkbox') {
      if (!element.checked) continue
      value = true
    } else if (element.type === 'radio') {
      if (!element.checked) continue
      value = value
    } else if (element.type === 'number') {
      value = (value.trim() === '') ? null : Number(value)
    } else if (['text', 'textarea', 'email', 'password', 'search', 'tel', 'url'].includes(element.type)) {
      value = value
    }

    if (element.type === 'file') {
      const enctype = element.getAttribute('enctype')
      if (enctype === 'application/base64' || enctype === 'application/octet-stream') {
        if (element.files.length === 0) continue
        const files = Array.from(element.files)
        const fileObjects = await Promise.all(files.map(file => serializeFile(file, enctype)))
        formData[element.name] = (element.multiple) ? fileObjects : fileObjects[0]
      }
      continue // Always continue after file input (even if not serialized)
    }

    assignField(formData, element.name, value)
  }

  return formData
}

async function serializeFile(file, enctype) {
  const arrayBuffer = await file.arrayBuffer()
  const binaryString = new Uint8Array(arrayBuffer).reduce((acc, byte) => acc + String.fromCharCode(byte), '')
  const base64String = btoa(binaryString)

  return {
    name: file.name,
    type: file.type,
    size: file.size,
    enctype: enctype,
    content: base64String
  }
}

function assignField(obj, name, value) {
  const parts = []
  name.replace(/\[([^\]]*)\]/g, (_, inner) => {
    parts.push(inner)
    return ''
  })
  const firstBracket = name.indexOf('[')
  const base = firstBracket === -1 ? name : name.substring(0, firstBracket)
  parts.unshift(base)

  let current = obj
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i]
    const nextPart = parts[i + 1]

    if (i === parts.length - 1) {
      if (part === '') {
        if (!Array.isArray(current)) {
          current = []
        }
        current.push(value)
      } else if (current[part] === undefined) {
        current[part] = value
      } else if (Array.isArray(current[part])) {
        current[part].push(value)
      } else {
        current[part] = [current[part], value]
      }
    } else {
      if (part === '') {
        if (!Array.isArray(current)) {
          current = []
        }
        if (!current[current.length - 1]) {
          current.push({})
        }
        current = current[current.length - 1]
      } else {
        if (current[part] === undefined) {
          current[part] = (nextPart === '' || /^\d+$/.test(nextPart)) ? [] : {}
        }
        current = current[part]
      }
    }
  }
}

up.compiler('form[enctype="application/json"]', function(form) {
  form.addEventListener('submit', async function(event) {
    event.preventDefault()

    const jsonBody = await parseFormElements(form)

    up.submit(form, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonBody)
    })
  })
})

up.compiler('form[enctype="application/json"]', function(form) {
  const DEFAULT_FORM_SIZE_LIMIT = 10 * 1024 * 1024

  form.addEventListener('change', function(event) {
    if (event.target.type !== 'file') return

    const limitAttr = form.getAttribute('up-form-size-limit')
    const sizeLimit = limitAttr ? parseInt(limitAttr, 10) : DEFAULT_FORM_SIZE_LIMIT
    if (isNaN(sizeLimit) || sizeLimit <= 0) {
      console.warn('Invalid up-form-size-limit attribute; using default 10MB')
      return
    }

    const fileInputs = form.querySelectorAll('input[type="file"]')
    let totalSize = 0
    for (const input of fileInputs) {
      if (input === event.target) {
        // Skip the changed input for now; we'll validate it separately below
        continue
      }
      for (const file of input.files) {
        totalSize += file.size
      }
    }

    let newFilesSize = 0
    for (const file of event.target.files) {
      newFilesSize += file.size
    }

    if ((totalSize + newFilesSize) > sizeLimit) {
      // Reject this input's files
      event.target.value = ''

      // Emit file size error event
      up.emit(form, 'up:form:fileSizeExceeded', {
        target: event.target,
        totalSize: totalSize + newFilesSize,
        maxSize: sizeLimit
      })
    }
  })
})
