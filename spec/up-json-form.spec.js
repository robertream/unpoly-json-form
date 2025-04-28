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
})
