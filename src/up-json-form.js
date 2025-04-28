// unpoly-json-form extension
// Handles application/json form submissions

up.compiler('form[enctype="application/json"]', function(form) {
  form.addEventListener('submit', function(event) {
    event.preventDefault()

    const jsonBody = {}

    up.submit(form, {
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(jsonBody)
    })
  })
})
