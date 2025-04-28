describe('up-json-form', function() {
  it('submits an empty object for an empty form', function(done) {
    const form = document.createElement('form');
    form.setAttribute('enctype', 'application/json');
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/submit');

    const button = document.createElement('button');
    button.type = 'submit';
    form.appendChild(button);

    document.body.appendChild(form);

    up.hello(form);

    spyOn(up, 'submit').and.callFake(function(submittedForm, options) {
      expect(submittedForm).toBe(form);
      expect(options.headers['Content-Type']).toBe('application/json');
      expect(options.body).toBe('{}');
      done();
    });

    button.click();
  });
});
