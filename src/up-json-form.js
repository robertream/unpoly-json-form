// unpoly-json-form extension
// Handles application/json form submissions

function parseFormElements(form) {
  const formData = {}

  const elements = form.elements

  for (let element of elements) {
    if (!element.name || element.disabled) continue
  
    if (element.tagName.toLowerCase() === 'select' && element.value.trim() === '') continue
  
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
  
    assignField(formData, element.name, value)
  }  

  return formData
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
  form.addEventListener('submit', function(event) {
    event.preventDefault()

    const jsonBody = parseFormElements(form)

    up.submit(form, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonBody)
    })
  })
})
