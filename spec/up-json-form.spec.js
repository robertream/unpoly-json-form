describe('up-json-form', function() {
  it('works in headless Chrome', function() {
    expect(window).toBeDefined();
    expect(document).toBeDefined();
    expect(typeof document.createElement).toBe('function');
  });
});
