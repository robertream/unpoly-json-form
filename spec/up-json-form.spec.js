describe('up-json-form', function() {
  it('submits an empty object for an empty form', function(done) {
    const { button } = createForm([])
    expectSubmittedJson({}, done)
    button.click()
  })

  it('submits text input fields as text', function(done) {
    const input = createElement('input', { type: 'text', name: 'username', value: 'bob' })
    const { button } = createForm([input])
    expectSubmittedJson({ username: 'bob' }, done)
    button.click()
  })

  it('submits a number input as a number', function(done) {
    const input = createElement('input', { type: 'number', name: 'age', value: '42' })
    const { button } = createForm([input])
    expectSubmittedJson({ age: 42 }, done)
    button.click()
  })

  it('submits a checked checkbox as true', function(done) {
    const input = createElement('input', { type: 'checkbox', name: 'subscribe', checked: true })
    const { button } = createForm([input])
    expectSubmittedJson({ subscribe: true }, done)
    button.click()
  })

  it('skip an unchecked checkbox', function(done) {
    const input = createElement('input', { type: 'checkbox', name: 'subscribe' })
    const { button } = createForm([input])
    expectSubmittedJson({}, done)
    button.click()
  })

  it('submits multiple fields', function(done) {
    const inputs = [
      createElement('input', { type: 'text', name: 'username', value: 'alice' }),
      createElement('input', { type: 'number', name: 'age', value: '30' }),
      createElement('input', { type: 'checkbox', name: 'subscribe', checked: true })
    ]
    const { button } = createForm(inputs)
    expectSubmittedJson({ username: 'alice', age: 30, subscribe: true }, done)
    button.click()
  })

  it('submits nestedname path fields into nested objects', function(done) {
    const input = createElement('input', { type: 'text', name: 'user[name]', value: 'bob' })
    const { button } = createForm([input])
    expectSubmittedJson({ user: { name: 'bob' } }, done)
    button.click()
  })

  it('submits deeply nested fields into deeply nested objects', function(done) {
    const input = createElement('input', { type: 'number', name: 'user[details][age]', value: '42' })
    const { button } = createForm([input])
    expectSubmittedJson({ user: { details: { age: 42 } } }, done)
    button.click()
  })

  it('submits multiple array fields into array', function(done) {
    const inputs = [
      createElement('input', { name: 'items[]', value: 'apple' }),
      createElement('input', { type: 'text', name: 'items[]', value: 'banana' }),
    ]
    const { button } = createForm(inputs)
    expectSubmittedJson({ items: ['apple', 'banana'] }, done)
    button.click()
  })

  it('submits multiple fields with the same name into an array', function(done) {
    const inputs = [
      createElement('input', { type: 'text', name: 'tags', value: 'one' }),
      createElement('input', { type: 'text', name: 'tags', value: 'two' })
    ]
    const { button } = createForm(inputs)
    expectSubmittedJson({ tags: ['one', 'two'] }, done)
    button.click()
  })

  it('submits value of checked radio button', function(done) {
    const inputs = [
      createElement('input', { type: 'radio', name: 'gender', value: 'male' }),
      createElement('input', { type: 'radio', name: 'gender', value: 'female', checked: true })
    ]
    const { button } = createForm(inputs)
    expectSubmittedJson({ gender: 'female' }, done)
    button.click()
  })

  it('skip unchecked radio button', function(done) {
    const inputs = [
      createElement('input', { type: 'radio', name: 'gender', value: 'male' }),
      createElement('input', { type: 'radio', name: 'gender', value: 'female' })
    ]
    const { button } = createForm(inputs)
    expectSubmittedJson({}, done)
    button.click()
  })

  it('submits selected option in select', function(done) {
    const select = createSelect({ name: 'color', options: [
      { value: '', textContent: 'Choose...' },
      { value: 'red', selected: true }
    ]})
    const { button } = createForm([select])
    expectSubmittedJson({ color: 'red' }, done)
    button.click()
  })

  it('skip empty select', function(done) {
    const select = createElement('select', { name: 'color' })
    const { button } = createForm([select])
    expectSubmittedJson({}, done)
    button.click()
  })

  it('submits array for select[multiple] with multiple selected options', function(done) {
    const select = createSelect({ name: 'fruits', multiple: true, options: [
      { value: 'apple', selected: true },
      { value: 'banana', selected: true },
      { value: 'cherry' }
    ]})
    const { button } = createForm([select])
    expectSubmittedJson({ fruits: ['apple', 'banana'] }, done)
    button.click()
  })

  it('submits single-element array for select[multiple] with one selected option', function(done) {
    const select = createSelect({ name: 'colors', multiple: true, options: [
      { value: 'red', selected: true },
      { value: 'blue' }
    ]})
    const { button } = createForm([select])
    expectSubmittedJson({ colors: ['red'] }, done)
    button.click()
  })

  it('skip select[multiple] with no selected options', function(done) {
    const select = createSelect({ name: 'hobbies', multiple: true, options: [
      { value: 'swimming' },
      { value: 'running' }
    ]})
    const { button } = createForm([select])
    expectSubmittedJson({}, done)
    button.click()
  })

  it('submits hidden inputs normally', function(done) {
    const input = createElement('input', { type: 'hidden', name: 'csrf_token', value: 'abcdef123456' })
    const { button } = createForm([input])
    expectSubmittedJson({ csrf_token: 'abcdef123456' }, done)
    button.click()
  })

  it('skip disabled form fields', function(done) {
    const inputs = [
      createElement('input', { type: 'text', name: 'username', value: 'bob' }),
      createElement('input', { type: 'text', name: 'should_skip', disabled: true, value: 'nope' })
    ]
    const { button } = createForm(inputs)
    expectSubmittedJson({ username: 'bob' }, done)
    button.click()
  })

  it('skip inputs without a name attribute', function(done) {
    const input = createElement('input', { type: 'hidden', name: 'csrf_token', value: 'abcdef123456' })
    const { button } = createForm([input])
    expectSubmittedJson({ csrf_token: 'abcdef123456' }, done)
    button.click()

  })

  it('submits empty string for empty text-like inputs', function(done) {
    const types = ['text', 'email', 'password', 'search', 'tel', 'url', 'hidden']
    const inputs = []
    const expected = {}
    for (const type of types) {
      inputs.push(createElement('input', { type: type, name: type }))
      expected[type] = ""
    }
    const { button } = createForm(inputs)
    expectSubmittedJson(expected, done)
    button.click()
  })

  it('submits textarea', function(done) {
    const textarea = createElement('textarea', { name: 'message', value: 'Hello World' })
    const { button } = createForm([textarea])
    expectSubmittedJson({ message: 'Hello World' }, done)
    button.click()
  })

  it('submits empty string for empty textarea', function(done) {
    const textarea = createElement('textarea', { name: 'text' })
    const { button } = createForm([textarea])
    expectSubmittedJson({ text: '' }, done)
    button.click()
  })

  it('skip file inputs without explicit enctype', function(done) {
    const input = createFileInput({
      name: 'avatar',
      files: [{ name: 'hello.txt', data: 'Hello World' }]
    })
    const { button } = createForm([input])
    expectSubmittedJson({}, done)
    button.click()
  })

  it('submits file input as base64 when enctype is application/base64', function(done) {
    const input = createFileInput({
      name: 'binaryfile',
      enctype: 'application/base64',
      files: [{ name: 'binaryfile.dat', data: [0, 1, 2] }]
    })
    const { button } = createForm([input])
    expectSubmittedJson({
      binaryfile: {
        name: 'binaryfile.dat',
        type: 'application/octet-stream',
        enctype: 'application/base64',
        body: "AAEC"
      }
    }, done)
    button.click()
  })

  it('submits file input as binary when enctype is application/octet-stream', function(done) {
    const input = createFileInput({
      name: 'textfile',
      enctype: 'application/octet-stream',
      files: [{ name: 'plain.txt', data: 'Hello World'}]
    })
    const { button } = createForm([input])
    expectSubmittedJson({
      textfile: {
        name: 'plain.txt',
        type: 'text/plain',
        enctype: 'application/octet-stream',
        body: [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]
      }
    }, done)
    button.click()
  })

  it('rejects only the input change that would cause size to exceed the limit', function(done) {
    const goodInput = createFileInput({
      name: 'goodfile',
      enctype: 'application/base64',
      files: [{ name: 'goodfile.dat', data: new Uint8Array(3 * 1024 * 1024)}]
    })
    const badInput = createFileInput({
      name: 'badfile',
      enctype: 'application/base64',
      files: [{ name: 'badfile.dat', data: new Uint8Array(8 * 1024 * 1024) }]
    })

    createForm([goodInput, badInput])

    let fileSizeErrorEmitted = false
    up.on('up:form:fileSizeExceeded', function(event) {
      fileSizeErrorEmitted = true
    })

    goodInput.dispatchEvent(new Event('change', { bubbles: true }))
    badInput.dispatchEvent(new Event('change', { bubbles: true }))

    setTimeout(function() {
      expect(fileSizeErrorEmitted).toBeTrue()
      expect(goodInput.files.length).toBe(1)
      expect(badInput.value).toBe('')
      done()
    }, 50)
  })

  it('enforces form size limits specified in the up-form-size-limit attribute', function(done) {
    const input = createFileInput({
      name: 'badfile',
      enctype: 'application/base64',
      files: [{ name: 'badfile.dat', data: new Uint8Array(10000)}]
    })

    createForm([input], { 'up-form-size-limit': '9999' })

    let fileSizeErrorEmitted = false
    up.on('up:form:fileSizeExceeded', function(event) {
      fileSizeErrorEmitted = true
    })

    input.dispatchEvent(new Event('change', { bubbles: true }))

    setTimeout(function() {
      expect(fileSizeErrorEmitted).toBeTrue()
      expect(input.value).toBe('')
      done()
    }, 50)
  })

  it('skip fields inside a disabled fieldset', function(done) {
    const fieldset = createElement('fieldset', { disabled: true, children: [
      createElement('input', { type: 'text', name: 'insideFieldset', value: 'nope' })
    ]})
    const { button } = createForm([fieldset])
    expectSubmittedJson({}, done)
    button.click()
  })

  it('skip non-submittable form fields', function(done) {
    const ignore = [
      createElement('output', { name: 'output', value: 1 }),
      createElement('progress', { name: 'progress', value: 2 }),
      createElement('meter', { name: 'meter', value: 3 }),
      createElement('datalist', { name: 'datalist', value: 4 }),
    ]
    const { button } = createForm(ignore)
    expectSubmittedJson({}, done)
    button.click()
  })

  it('serializes sparse arrays with explicit indexes', function(done) {
    const input0 = createElement('input', { name: 'hearbeat[0]', value: 'thunk' })
    const input2 = createElement('input', { name: 'hearbeat[2]', value: 'thunk' })
    const { button } = createForm([input0, input2])
    expectSubmittedJson({ hearbeat: ['thunk', null, 'thunk'] }, done)
    button.click()
  })

  it('serializes deep nested and sparse array structure', function(done) {
    const input = createElement('input', { name: 'wow[such][deep][3][much][power][!]', value: 'Amaze' })
    const { button } = createForm([input])
    expectSubmittedJson({
      wow: {
        such: {
          deep: [null, null, null, { much: { power: { '!': 'Amaze' } } }]
        }
      }
    }, done)
    button.click()
  })

  it('treats invalid key syntax as a flat key', function(done) {
    const inputGood = createElement('input', { name: 'error[good]', value: 'BOOM!' })
    const inputBad = createElement('input', { name: 'error[bad', value: 'BOOM BOOM!' })
    const { button } = createForm([inputGood, inputBad])
    expectSubmittedJson({
      error: { good: 'BOOM!' },
      'error[bad': 'BOOM BOOM!'
    }, done)
    button.click()
  })
})

// Helper functions

function createForm(children = [], attributes = {}) {
  attributes.children = children

  const form = createElement('form', attributes)
  form.setAttribute('enctype', 'application/json')
  form.setAttribute('method', 'POST')
  form.setAttribute('action', '/submit')
  form.setAttribute('up-submit', true)

  const button = document.createElement('button')
  button.type = 'submit'
  form.appendChild(button)

  document.body.appendChild(form)
  up.hello(form)

  return { form, button }
}

function expectSubmittedJson (expected, done) {
  const expectations = function(event) {
    const form = event.origin?.form
    if (!form) return null

    const request = event.request
    request.payload.then(payload => {
      expect(form).toBeDefined()
      expect(event.request.contentType).toBe('application/json')
      expect(JSON.parse(payload)).toEqual(expected)
    }).finally(() => {
      event.preventDefault()
      up.off('up:request:load', expectations)
      done()
    })
  }
  up.on('up:request:load', expectations)
}

function createElement(tagName, attributes = {}) {
  const el = document.createElement(tagName)
  const children = attributes.children
  delete attributes.children
  for (const [key, value] of Object.entries(attributes)) {
    if (value === undefined) continue
    switch (key) {
      case 'value':
        el.value = value
        break
      case 'checked':
        el.checked = value
        break
      case 'selected':
        el.selected = value
        break
      default:
        el.setAttribute(key, value)
    }
  }
  if (children) {
    for (const child of children) {
      el.appendChild(child)
    }
  }
  return el
}

function createSelect(attributes = {}) {
  let children
  if (attributes.options) {
    attributes. children = attributes.options.map(option => {
      return createElement('option', option)
    })
    delete attributes.options
  }
  const select = createElement('select', attributes)
  return select
}

function createFileInput(attributes = {}) {
  attributes.type = 'file'
  let files
  if (attributes.files) {
    files = attributes.files.map(createFile)
    if (files.length > 1) {
      attributes.multiple = true
    }
    delete attributes.files
  }
  const input = createElement('input', attributes)
  if (files) {
    Object.defineProperty(input, 'files', { value: files })
  }
  return input
}

function createFile(file) {
  if (typeof file.data === 'string') {
    return new File([new TextEncoder().encode(file.data)], file.name, { type: 'text/plain' })
  } else if (Array.isArray(file.data)) {
    return new File([new Uint8Array(file.data)], file.name, { type: 'application/octet-stream' })
  } else if (file.data instanceof Uint8Array) {
    return new File([file.data], file.name, { type: 'application/octet-stream' })
  } else {
    throw new Error(`Unsupported data type for file "${file.name}": ${typeof file.data}`)
  }
}