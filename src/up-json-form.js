async function parseFormElements(form) {
  const formData = {}
  const elements = form.elements

  for (let element of elements) {
    let value = await getElementValue(element)
    if (value != null) {
      assignField(formData, element.name, value)
    }
  }
  return formData
}

async function getElementValue(element) {
  if (!element.name || element.disabled || element.closest('fieldset:disabled')) return null      
  switch (element.tagName.toLowerCase()) {
    case 'textarea':
      return element.value
    case 'select':
      return getSelectValue(element)
    case 'input':
      return getInputValue(element)
    default:
      return null
  }
}

function getSelectValue(element) {
  if (element.multiple) {
    const selectedOptions = Array.from(element.options).filter(o => o.selected && o.value.trim() !== '')
    if (selectedOptions.length === 0) return null
    const values = selectedOptions.map(o => o.value)
    return values
  } else if (element.value.trim() !== '') {
    return element.value
  }
}

async function getInputValue(element) {
  switch (element.type) {
    case 'checkbox':
      return (element.checked) ? true : null
    case 'radio':
      return (element.checked) ? element.value : null
    case 'number':
      return (element.value.trim() === '') ? null : Number(element.value)
    case 'file':
      return getFileInputValue(element)
    case 'text':
    case 'email':
    case 'password':
    case 'search':
    case 'tel':
    case 'url':
    case 'hidden':
      return element.value
    default:
      return element.value
  }
}

async function getFileInputValue(element) {
  const enctype = element.getAttribute('enctype')
  switch (enctype) {
    case 'application/base64':
    case 'application/octet-stream':
      if (element.files.length === 0) return null
      const files = Array.from(element.files)
      const fileObjects = await Promise.all(files.map(file => serializeFile(file, enctype)))
      return element.multiple ? fileObjects : fileObjects[0]
    default:
      return null
  }
}

function uint8ArrayToBase64(uint8Array) {
  const CHUNK_SIZE = 0x8000; // 32KB per chunk
  let result = '';
  for (let i = 0; i < uint8Array.length; i += CHUNK_SIZE) {
    const chunk = uint8Array.subarray(i, i + CHUNK_SIZE);
    result += String.fromCharCode(...chunk)
  }
  return btoa(result);
}

async function serializeFile(file, enctype) {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);

  if (enctype === 'application/base64') {
    const base64String = uint8ArrayToBase64(uint8Array);
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      enctype,
      content: base64String
    };
  } else if (enctype === 'application/octet-stream') {
    return {
      name: file.name,
      type: file.type,
      size: file.size,
      enctype,
      content: Array.from(uint8Array)
    };
  }
}
function assignField(obj, name, value) {
  const path = parseFormNamePath(name);
  setNestedValue(obj, path, value);
}

function parseFormNamePath(name) {
  const path = [];
  name.replace(/\[([^\]]*)\]/g, (_, inner) => {
    path.push(inner);
    return '';
  });
  const firstBracket = name.indexOf('[');
  const base = firstBracket === -1 ? name : name.substring(0, firstBracket);
  path.unshift(base);
  return path;
}

function setNestedValue(obj, path, value) {
  let current = obj;

  for (let i = 0; i < path.length; i++) {
    const part = path[i];
    const next = path[i + 1];

    const isLast = i === path.length - 1;

    if (isLast) {
      if (part === '') {
        if (!Array.isArray(current)) current = [];
        current.push(value);
      } else if (current[part] === undefined) {
        current[part] = value;
      } else if (Array.isArray(current[part])) {
        current[part].push(value);
      } else {
        current[part] = [current[part], value];
      }
    } else {
      if (part === '') {
        if (!Array.isArray(current)) current = [];
        if (!current[current.length - 1]) current.push({});
        current = current[current.length - 1];
      } else {
        if (current[part] === undefined) {
          current[part] = (next === '' || /^\d+$/.test(next)) ? [] : {};
        }
        current = current[part];
      }
    }
  }
}

const DEFAULT_FORM_SIZE_LIMIT = 10 * 1024 * 1024
up.compiler('form[enctype="application/json"]', function(form) {
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
      if (input === event.target) continue
      for (const file of input.files) {
        totalSize += file.size
      }
    }

    let newFilesSize = 0
    for (const file of event.target.files) {
      newFilesSize += file.size
    }

    if ((totalSize + newFilesSize) > sizeLimit) {
      event.target.value = ''
      up.emit(form, 'up:form:fileSizeExceeded', {
        target: event.target,
        totalSize: totalSize + newFilesSize,
        maxSize: sizeLimit
      })
    }
  })

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