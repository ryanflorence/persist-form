export function persist(key: string, form: HTMLFormElement) {
  sessionStorage.setItem(
    `persist-form:${key}`,
    JSON.stringify(Object.fromEntries(new FormData(form))),
  );
}

export function restore(key: string, form: HTMLFormElement) {
  let storage = sessionStorage.getItem(`persist-form:${key}`);
  if (!storage) return;
  let values = JSON.parse(storage) as Record<string, any>;
  Object.entries(values).forEach(([name, value]) => {
    let input = form.elements.namedItem(name) as HTMLInputElement;
    if (input.type === "radio") {
      input.checked = input.value === value;
    } else if (input.type === "checkbox") {
      input.checked = Boolean(value);
    } else {
      input.value = value;
    }
  });
}

export function clear(key: string) {
  sessionStorage.removeItem(key);
}
