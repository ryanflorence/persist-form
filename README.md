# @ryanflorence/persist-form

Brings the browser's default HTML form value persistence to client side rendering with both a Custom Element or a React Hook.

## Installation

```bash
npm install @ryanflorence/persist-form
```

## Usage

### Custom Element

```html
<html>
  <head>
    <!-- include the module however you do -->
    <script
      type="module"
      href="https://esm.sh/@ryanflorence/persist-form/html"
    ></script>
  </head>
  <body>
    <form method="post">
      <!-- render the custom element -->
      <rf-persist-form key="login" />

      <input name="name" />
      <input name="email" type="email" />
      <button type="submit">Submit</button>
    </form>
  </body>
</html>
```

If no key is given, `window.location.pathname` is used.

### React Router Integration

With React 19 you can use a ref:

```tsx
import { usePersistedForm } from "@ryanflorence/persist-form/react";

function MyForm() {
  let { persistFormRef } = usePersistedForm();
  return (
    <form ref={persistFormRef} method="post">
      <input name="name" />
      <input name="email" type="email" />
      <button type="submit">Submit</button>
    </form>
  );
}
```

Or use the hooks for more control (and if you're on React 18):

```tsx
import { usePersistedForm } from "@ryanflorence/persist-form/react";

function MyForm() {
  const { persist, restore, clear } = usePersistedForm();
  return (
    <form
      // restore when the form mounts
      ref={node => node && restore(node)}
      // persist on change of form elements
      onChange={e => persist(e.currentTarget)}
      // clear after submission
      onSubmit={e => {
        e.preventDefault();
        clear();
      }}
    >
      {/* form fields */}
    </form>
  );
}
```

### Core Package

Integrate with any setup:

```ts
import { persist, restore, clear } from "@ryanflorence/persist-form";

// Save form state
let form = document.querySelector("form");
persist("my-form", form);

// Restore form state
restore("my-form", form);

// Clear saved state
clear("my-form");

// Example with event handlers
form.addEventListener("change", () => {
  persist("my-form", form);
});

document.addEventListener("DOMContentLoaded", () => {
  restore("my-form", form);
});
```

## Notes

- Uses sessionStorage, so form data persists only for the current browser session
- For React Router integration, form data is keyed by location.key, so the same form can be persisted with different data across the history stack
- Handles all form input types including text fields, checkboxes, radio buttons, etc. (Files aren't supported due to browser limitations)

## License

MIT
