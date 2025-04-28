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
})
