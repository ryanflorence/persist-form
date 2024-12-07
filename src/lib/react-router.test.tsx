import { test, expect } from "vitest";
import { render } from "vitest-browser-react";
import { MemoryRouter, Route, Routes, Link, useNavigate } from "react-router";
import { usePersistedForm } from "./react-router.js";
import { useState } from "react";

test("persistFormRef", async () => {
  function Subject() {
    let { persistFormRef } = usePersistedForm();
    return (
      <form ref={persistFormRef}>
        <input name="name" placeholder="your name" />
      </form>
    );
  }

  let NAME1 = "Ryan Florence";
  let NAME2 = "Rocky Cincinnati";

  let screen = render(<App subject={<Subject />} />);

  // fill out form, navigate away, come back
  await screen.getByPlaceholder("your name").fill(NAME1);
  await screen.getByRole("link", { name: "about link" }).click(); // [f1, a1]
  await screen.getByText("go back").click(); // [f1*, a1]
  expect
    .element(screen.getByPlaceholder("your name"))
    .toHaveValue("Ryan Florence");

  // two forms at different locations in the history stack
  await screen.getByRole("link", { name: "about link" }).click(); // [f1, a2*]
  await screen.getByRole("link", { name: "form link" }).click(); //  [f1, a2, f2*]
  expect.element(screen.getByPlaceholder("your name")).toHaveValue("");

  await screen.getByPlaceholder("your name").fill(NAME2);
  await screen.getByRole("link", { name: "about link" }).click(); // [f1, a2, f2, a3*]
  await screen.getByText("go back").click(); // [f1, a2, f2*, a3]
  expect.element(screen.getByPlaceholder("your name")).toHaveValue(NAME2);

  await screen.getByText("go back").click(); // [f1, a2*, f2, a3]
  await screen.getByText("go back").click(); // [f1*, a2, f2, a3]
  expect.element(screen.getByPlaceholder("your name")).toHaveValue(NAME1);
});

test("persist/restore/clear", async () => {
  function Subject() {
    let { persist, restore, clear } = usePersistedForm();
    return (
      <form
        data-test-id="form"
        ref={restore}
        onChange={e => persist(e.currentTarget)}
        onSubmit={e => {
          e.preventDefault();
          clear();
        }}
      >
        <input name="name" placeholder="your name" />
        <button type="submit">submit</button>
      </form>
    );
  }

  let NAME1 = "Ryan Florence";
  let NAME2 = "Rocky Cincinnati";

  let screen = render(<App subject={<Subject />} />);

  // fill out form, navigate away, come back
  await screen.getByPlaceholder("your name").fill(NAME1);
  await screen.getByRole("link", { name: "about link" }).click(); // [f1, a1]
  await screen.getByText("go back").click(); // [f1*, a1]
  expect
    .element(screen.getByPlaceholder("your name"))
    .toHaveValue("Ryan Florence");

  // two forms at different locations in the history stack
  await screen.getByRole("link", { name: "about link" }).click(); // [f1, a2*]
  await screen.getByRole("link", { name: "form link" }).click(); //  [f1, a2, f2*]
  expect.element(screen.getByPlaceholder("your name")).toHaveValue("");

  await screen.getByPlaceholder("your name").fill(NAME2);
  await screen.getByRole("link", { name: "about link" }).click(); // [f1, a2, f2, a3*]
  await screen.getByText("go back").click(); // [f1, a2, f2*, a3]
  expect.element(screen.getByPlaceholder("your name")).toHaveValue(NAME2);

  await screen.getByText("go back").click(); // [f1, a2*, f2, a3]
  await screen.getByText("go back").click(); // [f1*, a2, f2, a3]
  expect.element(screen.getByPlaceholder("your name")).toHaveValue(NAME1);

  // submit the form to clear it
  await screen.getByText("submit").click();
  await screen.getByRole("link", { name: "about link" }).click(); // [f1, a4*]
  await screen.getByText("go back").click(); // [f1*, a4]
  expect.element(screen.getByPlaceholder("your name")).toHaveValue("");
});

function App({ subject }: { subject: React.ReactNode }) {
  let [n, increment] = useState(0);
  return (
    <MemoryRouter>
      <button onClick={() => increment(n + 1)}>rerender {n}</button>
      <nav>
        <Link to="/">form link</Link>
        <Link to="/about">about link</Link>
        <HistoryButtons />
      </nav>
      <hr />
      <Routes>
        <Route index element={subject} />
        <Route path="/about" element={<About />} />
      </Routes>
    </MemoryRouter>
  );
}

function HistoryButtons() {
  let navigate = useNavigate();
  return (
    <>
      <button onClick={() => navigate(-1)}>go back</button>
      <button onClick={() => navigate(1)}>go forward</button>
    </>
  );
}

function About() {
  return <h1>about page</h1>;
}
