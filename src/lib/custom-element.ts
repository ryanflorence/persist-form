import { clear, persist, restore } from "./persist-form.js";

/**
 * A custom element that automatically persists form values to session storage
 * by key, if no key is provided the location.pathname is used.
 *
 * ```html
 * <form>
 *   <rf-persist-form key="some-key" />
 *   <input name="name" placeholder="your name" />
 * </form>
 */
class PersistForm extends HTMLElement {
  private getForm() {
    let form = this.closest("form");
    if (!form) {
      console.error(
        "<rf-persist-form> should be rendered inside a form element",
      );
      return null;
    }
    return form;
  }

  private getKey() {
    let key = this.getAttribute("key");
    if (!key) {
      console.log("<rf-persist-form> should have a key attribute");
      return null;
    }
    return key;
  }

  connectedCallback() {
    let key = this.getKey();
    let form = this.getForm();
    if (key && form) {
      restore(key, form);
    }
  }

  disconnectedCallback() {
    let key = this.getKey();
    let form = this.getForm();
    if (key && form) {
      persist(key, form);
    }
  }

  formResetCallback() {
    let key = this.getKey();
    if (key) {
      clear(key);
    }
  }
}

customElements.define("rf-persist-form", PersistForm);
