import { assert, it } from "vitest";
import * as pf from "./persist-form.js";

it("persists forms", async () => {
  let markup = html`
    <input id="name" type="text" name="name" />
    <input id="age" type="number" name="age" />
    <input id="active" type="radio" name="active" value="1" />
    <input id="inactive" type="radio" name="active" value="0" />
    <input id="married" type="checkbox" name="married" />
    <textarea id="bio" name="bio"></textarea>
  `;

  // initial form state
  let form = document.createElement("form");
  form.innerHTML = markup;
  document.body.appendChild(form);
  let formData = new FormData(form);
  assert.equal(formData.get("name"), "");
  assert.equal(formData.get("age"), "");
  assert.equal(formData.get("active"), null);
  assert.equal(formData.get("married"), null);
  assert.equal(formData.get("bio"), "");

  // fill it out
  fill("name", "Ryan Florence");
  fill("age", "43");
  click("active");
  click("married");
  fill("bio", "He wrote this test");

  formData = new FormData(form);
  assert.equal(formData.get("name"), "Ryan Florence");
  assert.equal(formData.get("age"), "43");
  assert.equal(formData.get("active"), "1");
  assert.equal(formData.get("married"), "on");
  assert.equal(formData.get("bio"), "He wrote this test");

  // persist
  pf.persist("my-form", form);
  document.body.removeChild(form);

  // create a new empty form
  form = document.createElement("form");
  form.innerHTML = markup;
  document.body.appendChild(form);
  formData = new FormData(form);
  assert.equal(formData.get("name"), "");
  assert.equal(formData.get("age"), "");
  assert.equal(formData.get("active"), null);
  assert.equal(formData.get("married"), null);
  assert.equal(formData.get("bio"), "");

  // restore it and assert
  pf.restore("my-form", form);
  formData = new FormData(form);
  assert.equal(formData.get("name"), "Ryan Florence");
  assert.equal(formData.get("age"), "43");
  assert.equal(formData.get("active"), "1");
  assert.equal(formData.get("married"), "on");
  assert.equal(formData.get("bio"), "He wrote this test");

  // clear it
  document.body.removeChild(form);
  pf.clear("my-form");
  form = document.createElement("form");
  form.innerHTML = markup;
  document.body.appendChild(form);
  pf.restore("my-form", form);
  formData = new FormData(form);
  assert.equal(formData.get("name"), "");
  assert.equal(formData.get("age"), "");
  assert.equal(formData.get("active"), null);
  assert.equal(formData.get("married"), null);
  assert.equal(formData.get("bio"), "");
});

////////////////////////////////////////////////////////////////////////////////
const html = String.raw;

function fill(id: string, value: string) {
  let el = document.getElementById(id) as HTMLInputElement;
  el.value = value;
  return el as HTMLInputElement;
}

function click(id: string) {
  let el = document.getElementById(id) as HTMLInputElement;
  el.click();
}
