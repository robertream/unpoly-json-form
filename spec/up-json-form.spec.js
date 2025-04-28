describe('up-json-form', function() {
  it('submits an empty object for an empty form', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(submittedForm).toBe(form)
      expect(options.headers['Content-Type']).toBe('application/json')
      expect(options.body).toBe('{}')
      done()
    })

    button.click()
  })

  it('submits a flat object for text input', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'username'
    input.value = 'bob'
    form.appendChild(input)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ username: 'bob' })
      done()
    })

    button.click()
  })

  it('submits a number input as a number', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input = document.createElement('input')
    input.type = 'number'
    input.name = 'age'
    input.value = '42'
    form.appendChild(input)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ age: 42 })
      done()
    })

    button.click()
  })

  it('submits a checked checkbox as true', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input = document.createElement('input')
    input.type = 'checkbox'
    input.name = 'subscribe'
    input.checked = true
    form.appendChild(input)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ subscribe: true })
      done()
    })

    button.click()
  })

  it('skips an unchecked checkbox', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input = document.createElement('input')
    input.type = 'checkbox'
    input.name = 'subscribe'
    input.checked = false
    form.appendChild(input)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({})
      done()
    })

    button.click()
  })

  it('submits multiple fields correctly', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const username = document.createElement('input')
    username.type = 'text'
    username.name = 'username'
    username.value = 'alice'

    const age = document.createElement('input')
    age.type = 'number'
    age.name = 'age'
    age.value = '30'

    const subscribe = document.createElement('input')
    subscribe.type = 'checkbox'
    subscribe.name = 'subscribe'
    subscribe.checked = true

    form.appendChild(username)
    form.appendChild(age)
    form.appendChild(subscribe)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({
        username: 'alice',
        age: 30,
        subscribe: true
      })
      done()
    })

    button.click()
  })

  it('submits nested fields into objects', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input = document.createElement('input')
    input.name = 'user[name]'
    input.value = 'bob'
    form.appendChild(input)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ user: { name: 'bob' } })
      done()
    })

    button.click()
  })

  it('submits deeply nested fields', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input = document.createElement('input')
    input.type = 'number'
    input.name = 'user[details][age]'
    input.value = '42'
    form.appendChild(input)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ user: { details: { age: 42 } } })
      done()
    })

    button.click()
  })

  it('submits multiple array fields into array', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const item1 = document.createElement('input')
    item1.name = 'items[]'
    item1.value = 'apple'

    const item2 = document.createElement('input')
    item2.name = 'items[]'
    item2.value = 'banana'

    form.appendChild(item1)
    form.appendChild(item2)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ items: ['apple', 'banana'] })
      done()
    })

    button.click()
  })

  it('submits multiple fields with same name into array', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input1 = document.createElement('input')
    input1.name = 'tag'
    input1.value = 'a'

    const input2 = document.createElement('input')
    input2.name = 'tag'
    input2.value = 'b'

    form.appendChild(input1)
    form.appendChild(input2)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ tag: ['a', 'b'] })
      done()
    })

    button.click()
  })

  it('submits value of checked radio button', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const radio1 = document.createElement('input')
    radio1.type = 'radio'
    radio1.name = 'gender'
    radio1.value = 'male'

    const radio2 = document.createElement('input')
    radio2.type = 'radio'
    radio2.name = 'gender'
    radio2.value = 'female'
    radio2.checked = true

    form.appendChild(radio1)
    form.appendChild(radio2)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ gender: 'female' })
      done()
    })

    button.click()
  })

  it('skips unchecked radio button', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const radio = document.createElement('input')
    radio.type = 'radio'
    radio.name = 'gender'
    radio.checked = false
    form.appendChild(radio)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({})
      done()
    })

    button.click()
  })

  it('submits value of selected option in select', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const select = document.createElement('select')
    select.name = 'color'

    const option1 = document.createElement('option')
    option1.value = ''
    option1.textContent = 'Choose...'

    const option2 = document.createElement('option')
    option2.value = 'red'
    option2.textContent = 'Red'
    option2.selected = true

    select.appendChild(option1)
    select.appendChild(option2)
    form.appendChild(select)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ color: 'red' })
      done()
    })

    button.click()
  })

  it('skips empty select', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const select = document.createElement('select')
    select.name = 'color'
    form.appendChild(select)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({  })
      done()
    })

    button.click()
  })

  it('submits array for select[multiple] with multiple selected options', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const select = document.createElement('select')
    select.name = 'fruits'
    select.multiple = true

    const apple = document.createElement('option')
    apple.value = 'apple'
    apple.selected = true

    const banana = document.createElement('option')
    banana.value = 'banana'
    banana.selected = true

    const cherry = document.createElement('option')
    cherry.value = 'cherry'

    select.appendChild(apple)
    select.appendChild(banana)
    select.appendChild(cherry)
    form.appendChild(select)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ fruits: ['apple', 'banana'] })
      done()
    })

    button.click()
  })

  it('submits single-element array for select[multiple] with one selected option', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const select = document.createElement('select')
    select.name = 'colors'
    select.multiple = true

    const red = document.createElement('option')
    red.value = 'red'
    red.selected = true

    const blue = document.createElement('option')
    blue.value = 'blue'

    select.appendChild(red)
    select.appendChild(blue)
    form.appendChild(select)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ colors: ['red'] })
      done()
    })

    button.click()
  })

  it('skips select[multiple] with no selected options', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const select = document.createElement('select')
    select.name = 'hobbies'
    select.multiple = true

    const swim = document.createElement('option')
    swim.value = 'swimming'

    const run = document.createElement('option')
    run.value = 'running'

    select.appendChild(swim)
    select.appendChild(run)
    form.appendChild(select)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({})
      done()
    })

    button.click()
  })

  it('submits hidden inputs normally', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input = document.createElement('input')
    input.type = 'hidden'
    input.name = 'csrf_token'
    input.value = 'abcdef123456'
    form.appendChild(input)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ csrf_token: 'abcdef123456' })
      done()
    })

    button.click()
  })

  it('skips disabled form fields', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input1 = document.createElement('input')
    input1.name = 'username'
    input1.value = 'bob'
    input1.disabled = true

    const input2 = document.createElement('input')
    input2.name = 'age'
    input2.type = 'number'
    input2.value = '30'

    form.appendChild(input1)
    form.appendChild(input2)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ age: 30 })
      done()
    })

    button.click()
  })

  it('skips inputs without a name attribute', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input = document.createElement('input')
    input.type = 'text'
    input.value = 'should be skipped'
    form.appendChild(input)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({})
      done()
    })

    button.click()
  })

  it('submits empty string for empty text input', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input = document.createElement('input')
    input.type = 'text'
    input.name = 'nickname'
    input.value = ''
    form.appendChild(input)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ nickname: '' })
      done()
    })

    button.click()
  })

  it('submits empty string for empty textarea', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const textarea = document.createElement('textarea')
    textarea.name = 'bio'
    textarea.value = ''
    form.appendChild(textarea)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({ bio: '' })
      done()
    })

    button.click()
  })

  it('submits empty string for empty text-like inputs', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const types = ['text', 'textarea', 'email', 'password', 'search', 'tel', 'url', 'hidden']
    const expected = {}

    for (const type of types) {
      let input
      if (type === 'textarea') {
        input = document.createElement('textarea')
      } else {
        input = document.createElement('input')
        input.type = type
      }
      input.name = type
      input.value = ''
      form.appendChild(input)

      expected[type] = ''
    }

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual(expected)
      done()
    })

    button.click()
  })

  it('skips file inputs without explicit enctype', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.name = 'avatar'

    const blob = new Blob(['Hello world'], { type: 'text/plain' })
    const file = new File([blob], 'hello.txt', { type: 'text/plain' })

    Object.defineProperty(fileInput, 'files', { value: [file] })

    form.appendChild(fileInput)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({})
      done()
    })

    button.click()
  })

  it('submits file input as base64 when enctype is application/base64', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.name = 'document'
    fileInput.setAttribute('enctype', 'application/base64')

    const blob = new Blob(['Hello base64'], { type: 'text/plain' })
    const file = new File([blob], 'base64.txt', { type: 'text/plain' })

    Object.defineProperty(fileInput, 'files', { value: [file] })

    form.appendChild(fileInput)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(async function(submittedForm, options) {
      const parsedBody = JSON.parse(options.body)
      expect(parsedBody.document.name).toBe('base64.txt')
      expect(parsedBody.document.type).toBe('text/plain')
      expect(parsedBody.document.size).toBe(file.size)
      expect(parsedBody.document.enctype).toBe('application/base64')
      expect(typeof parsedBody.document.content).toBe('string')
      expect(parsedBody.document.content.length).toBeGreaterThan(0)
      done()
    })

    button.click()
  })

  it('submits file input as binary when enctype is application/octet-stream', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const fileInput = document.createElement('input')
    fileInput.type = 'file'
    fileInput.name = 'binaryfile'
    fileInput.setAttribute('enctype', 'application/octet-stream')

    const blob = new Blob(['Hello binary'], { type: 'application/octet-stream' })
    const file = new File([blob], 'binaryfile.dat', { type: 'application/octet-stream' })

    Object.defineProperty(fileInput, 'files', { value: [file] })

    form.appendChild(fileInput)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)

    up.hello(form)

    spyOn(up, 'submit').and.callFake(async function(submittedForm, options) {
      const parsedBody = JSON.parse(options.body)
      expect(parsedBody.binaryfile.name).toBe('binaryfile.dat')
      expect(parsedBody.binaryfile.type).toBe('application/octet-stream')
      expect(parsedBody.binaryfile.size).toBe(file.size)
      expect(parsedBody.binaryfile.enctype).toBe('application/octet-stream')
      expect(typeof parsedBody.binaryfile.content).toBe('string')
      expect(parsedBody.binaryfile.content.length).toBeGreaterThan(0)
      done()
    })

    button.click()
  })

  it('rejects only the input change that would cause size to exceed the limit', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const goodInput = document.createElement('input')
    goodInput.type = 'file'
    goodInput.name = 'goodfile'
    goodInput.setAttribute('enctype', 'application/base64')

    const badInput = document.createElement('input')
    badInput.type = 'file'
    badInput.name = 'badfile'
    badInput.setAttribute('enctype', 'application/base64')

    // Good file is small (3MB)
    const goodBlob = new Blob([new Uint8Array(3 * 1024 * 1024)], { type: 'application/octet-stream' })
    const goodFile = new File([goodBlob], 'goodfile.dat', { type: 'application/octet-stream' })

    // Bad file is too big (8MB)
    const badBlob = new Blob([new Uint8Array(8 * 1024 * 1024)], { type: 'application/octet-stream' })
    const badFile = new File([badBlob], 'badfile.dat', { type: 'application/octet-stream' })

    Object.defineProperty(goodInput, 'files', { value: [goodFile] })
    Object.defineProperty(badInput, 'files', { value: [badFile] })

    form.appendChild(goodInput)
    form.appendChild(badInput)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)

    up.hello(form)

    let fileSizeErrorEmitted = false

    up.on('up:form:fileSizeExceeded', function(event) {
      fileSizeErrorEmitted = true
    })

    // Manually dispatch 'change' event to simulate user selection
    goodInput.dispatchEvent(new Event('change', { bubbles: true }))
    badInput.dispatchEvent(new Event('change', { bubbles: true }))

    setTimeout(function() {
      expect(fileSizeErrorEmitted).toBeTrue()

      // Good input should still have files
      expect(goodInput.files.length).toBe(1)

      // Bad input should be cleared
      expect(badInput.value).toBe('')

      done()
    }, 50)
  })

  it('enforces form size limits specified in the up-form-size-limit attribute', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')
    form.setAttribute('up-form-size-limit', '9999')

    const badInput = document.createElement('input')
    badInput.type = 'file'
    badInput.name = 'badfile'
    badInput.setAttribute('enctype', 'application/base64')

    const badBlob = new Blob([new Uint8Array(10000)], { type: 'application/octet-stream' })
    const badFile = new File([badBlob], 'badfile.dat', { type: 'application/octet-stream' })

    Object.defineProperty(badInput, 'files', { value: [badFile] })

    form.appendChild(badInput)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)

    document.body.appendChild(form)

    up.hello(form)

    let fileSizeErrorEmitted = false

    up.on('up:form:fileSizeExceeded', function(event) {
      fileSizeErrorEmitted = true
    })

    // Manually dispatch 'change' event to simulate user selection
    badInput.dispatchEvent(new Event('change', { bubbles: true }))

    setTimeout(function() {
      expect(fileSizeErrorEmitted).toBeTrue()

      expect(badInput.value).toBe('')

      done()
    }, 50)
  })

  it('skips fields inside a disabled fieldset', function(done) {
    const form = document.createElement('form')
    form.setAttribute('enctype', 'application/json')
    form.setAttribute('method', 'POST')
    form.setAttribute('action', '/submit')

    const input = document.createElement('input')
    input.name = 'should_be_skipped'
    input.value = 'value'

    const fieldset = document.createElement('fieldset')
    fieldset.disabled = true
    fieldset.appendChild(input)
    form.appendChild(fieldset)

    const button = document.createElement('button')
    button.type = 'submit'
    form.appendChild(button)
    document.body.appendChild(form)
    up.hello(form)

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(JSON.parse(options.body)).toEqual({})
      done()
    })

    button.click()
  })
})