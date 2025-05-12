# 📄 `up-json-form` — HTML JSON Form Submission for Unpoly

An [Unpoly](https://unpoly.com/) extension that enables standards-aligned, structured JSON form submission using `enctype="application/json"`. according to the [W3C HTML JSON Form Submission](https://www.w3.org/TR/html-json-forms/) specification. It serializes standard form controls—including nested names and checkboxes—into a deeply nested JSON object. The extension also supports file uploads via base64 or binary encoding and gracefully skips disabled, unnamed, or non-submittable fields. Designed for modern APIs, it enhances Unpoly's progressive enhancement model with clean, interoperable JSON form data.

---

## ✨ Features

- Parses standard form inputs, selects, and textareas
- Handles checkbox and radio states
- Supports deeply nested object paths and array notation (e.g. `user[emails][]`)
- File input support via base64 or binary array encoding
- Emits `up:form:oversize` if file uploads exceed a configurable byte limit
- Skips disabled fields, unnamed fields, and display-only elements like `<output>`

---

## 🚀 Usage

Set the form’s `enctype` to `application/json`:

```html
<form enctype="application/json" up-target=".result">
  <input name="user[name]" value="Caden">
  <input type="checkbox" name="subscribe" checked>
  <textarea name="bio">Hello world</textarea>
  <input type="file" name="avatar" enctype="application/base64">
  <button>Submit</button>
</form>
```

When submitted, the form will be encoded as a JSON object and sent as the request body.

---

## 📦 Installation

```bash
npm install up-json-form
```

Then import it in your app:

```js
import 'up-json-form'
```

---

# 📐 Standards Compliance and Extensions

This library is **compliant** with ([W3C Working Group Note – 29 September 2015](https://www.w3.org/TR/html-json-forms/)) where applicable and also includes **pragmatic enhancements**.

## ✅ Compliant with:
- Serialization of successful form controls
    - `<input>` (text, password, hidden, checkbox, radio, etc.)
    - `<textareas>`
    - `<select>`
- Skipping of disabled/unnamed/display-only elements
    - Disabled fields
    - Fields without a `name`
    - Non-submittable tags: `<output>`, `<progress>`, `<meter>`, `<datalist>`, etc.
- Bracketed field names to express object/array nesting
- Empty strings are allowed and serialized
- Empty multi-select fields result in no key in the final object
- Reset behavior reflects current DOM value

## 🧩 Extensions:
- Support for `<input type="file">` via:
    - `application/base64` — Base64 encoded content
    - `application/octet-stream` — Byte array content
- Type coercion: converts `<input>` numeric types into numbers and checkbox into booleans
- Emits `up:form:fileSizeExceeded` event if file content exceeds `up-form-size-limit` attribute of a `<form>` (Default: 10000000 or 10MB)

---

# 🧬 Form Serialization Details

## 🔣 Name-Based Object Structure
| Field Name         | Output JSON |
|--------------------|-------------|
| `user[name]`       | `{ "user": { "name": "..." } }` |
| `emails[]`         | `{ "emails": ["..."] }` |
| `items[][id]`      | `{ "items": [{ "id": "..." }] }` |


## 🎛️ Control Value Serialization
| Element Type | Serialization Behavior |
|:--|:--|
| `<input type="checkbox">` | `value` if checked, or ⚠️`true` if checked and `value` is omitted |
| `<input type="radio">` | `value` if selected |
| `<input type="file">` (single) | structured JSON object if supported `encenctype` is specified (see below) |
| `<input type="file" multiple>` | array of structured JSON objects |
| `<input>` (all other types) | `value` as string or ⚠️ a number for numeric types |
| `<textarea>` | raw text content |
| `<select>` (single) | selected option `value` as string |
| `<select multiple>` | selected option `value` as an array of strings |

⚠️ type coersion extensions, not supported by W3C spec


# 📄 Input File Serialization
File input support is enabled by specifying an `enctype` attribute on the `<input type="file">` element. To include file content in the JSON payload, use either `application/base64` to encode the file as a base64 string, or `application/octet-stream` to serialize the file content as a raw byte array. Each file is submitted as a structured object containing the file's name, type, size, encoding format, and content.

🧩 The `enctype` field is an extension beyond the W3C JSON form submission spec, in which `application/base64` is the only encoding specified. The `application/octet-stream` encoding is particularly useful for API endpoints that wish to accept inline file data without having to handle multipart uploads or Base64 decoding.

## 📚 File Object Field Reference

| Field     | Description |
|----------|-------------|
| `name`   | The original file name (`File.name`) as provided by the user |
| `type`   | The MIME type of the file (`File.type`) |
| `enctype` 🧩| How the file was serialized (`application/base64` or `application/octet-stream`) |
| `body`| The file's contents:<br>- A base64-encoded string if `application/base64`<br>- A numeric array if `application/octet-stream` |

### 📝 Example: Base64 Encoding (`enctype="application/base64"`)

```json
{
  "name": "binary.dat",
  "type": "application/octet-stream",
  "enctype": "application/base64",
  "body": "AP8RIg=="
}
```

### 🤖 Example: Byte Array Encoding (`enctype="application/octet-stream"`)

```json
{
  "name": "example.txt",
  "type": "text/plain",
  "enctype": "application/octet-stream",
  "body": [72, 101, 108, 108, 111, 32, 87, 111, 114, 108, 100]
}
```

## 🧷 Input File Notes

- The `body` is always encoded — not raw file data
- Use `application/base64` encoding for more a compact encoding, but it may not be supported out of the box by your web framework
- Use `application/octet-stream` encoding for an easy implementation or for structured byte-level analysis or validation
- For large files, consider streaming or multipart uploads instead

---

# 📎 License

MIT © 2025 Robert Ream