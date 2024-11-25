# persist-form

Form persistence for browser applications. Automatically saves form state to sessionStorage as users type and restores it when they return. Includes optional React Router components and hooks.

## Installation

```bash
npm install @ryanflorence/persist-form
```

## Usage

### Core Package

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

### React Router Integration

```tsx
import { PersistedForm } from "@ryanflorence/persist-form/react";

function MyForm() {
  return (
    <PersistedForm method="post" action="/submit">
      <input name="name" />
      <input name="email" type="email" />
      <button type="submit">Submit</button>
    </PersistedForm>
  );
}
```

Or use the hooks for more control:

```tsx
import {
  usePersistedForm,
  usePersistedFormProps,
} from "@ryanflorence/persist-form/react";

// Option 1: usePersistedForm hook
function MyForm() {
  const { persist, restore, clear } = usePersistedForm();
  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (formRef.current) {
      restore(formRef.current);
    }
  }, [restore]);

  return (
    <form ref={formRef} onChange={e => persist(e.currentTarget)}>
      {/* form fields */}
    </form>
  );
}

// Option 2: usePersistedFormProps hook
function MyForm() {
  const persistedProps = usePersistedFormProps();
  return <form {...persistedProps}>{/* form fields */}</form>;
}
```

## API Reference

### Core Package

#### `persist(key: string, form: HTMLFormElement): void`

Saves the current state of all form inputs to sessionStorage.

#### `restore(key: string, form: HTMLFormElement): void`

Restores previously saved form state from sessionStorage.

#### `clear(key: string): void`

Removes saved form state from sessionStorage.

### React Router Integration

#### `PersistedForm`

A wrapper component around React Router's `Form` component that automatically handles form persistence.

Props:

- Accepts all props from React Router's `Form` component
- Automatically persists on change and restores on mount

#### `usePersistedForm()`

Hook that returns form persistence utilities:

```ts
{
  persist: (form: HTMLFormElement) => void;
  persistFormEvent: (event: FormEvent<HTMLFormElement>) => void;
  restore: (form: HTMLFormElement | null) => void;
  clear: () => void;
}
```

#### `usePersistedFormProps()`

Hook that returns props for adding persistence to form elements:

```ts
{
  ref: (form: HTMLFormElement | null) => void;
  onChange: (event: FormEvent<HTMLFormElement>) => void;
}
```

## Notes

- Uses sessionStorage, so form data persists only for the current browser session
- For React Router integration, form data is keyed by location to support multiple forms across routes
- Handles all form input types including text fields, checkboxes, radio buttons, etc. (Files aren't supported due to browser limitations)
- TypeScript types included

## Warning

This has no tests yet, just making sure it does what I want before clamping it down.

## License

MIT
