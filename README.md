# unpoly-json-form

An [Unpoly](https://unpoly.com/) extension for submitting HTML forms as JSON according to the [W3C HTML JSON Form Submission](https://www.w3.org/TR/html-json-forms/) specification.

## Status

🚧 Initial development in progress.

## Planned Features

- [x] Submit empty form as `{}` 
- [x] Serialize flat key/value fields
- [x] Auto-convert field values into `boolean`, `number`, `null`, or `string`
- [x] Parse nested objects via bracket syntax (e.g., `user[name]`)
- [x] Parse arrays via bracket syntax (e.g., `tags[]`)
- [x] Skip unchecked checkboxes and radios
- [x] Skip disabled form controls
- [x] Handle multiple values for the same name
- [x] Preserve empty fields properly (optional, spec-compliant)
- [x] Support `<select multiple>` arrays
- [ ] Skip or error `<input type="file">`
- [ ] Fine-grain W3C compliance (unnamed fields, deeper skipping)

## License

MIT © 2025 Robert Ream
