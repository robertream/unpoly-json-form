// unpoly-json-form extension
// Handles application/json form submissions

up.compiler('form[enctype="application/json"]', function(form) {
  form.addEventListener('submit', function(event) {
    event.preventDefault()

    const formData = {}
    const elements = form.elements

    for (let element of elements) {
      if (!element.name || element.disabled) continue

      let value = element.value

      if (element.type === 'number') {
        value = (value === '') ? null : Number(value)
      } else if (element.type === 'checkbox') {
        value = element.checked
      }

      formData[element.name] = value
    }

    up.submit(form, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    })
  })
})
