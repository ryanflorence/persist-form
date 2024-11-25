import type { Route } from "./+types/home";
import { PersistedForm } from "../../../../dist/react";

export default function NewNote({}: Route.ComponentProps) {
  return (
    <PersistedForm
      method="post"
      className="m-auto space-y-6 bg-white p-6 rounded-lg shadow-sm max-w-2xl"
    >
      <div className="space-y-2">
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <input
          type="text"
          id="title"
          name="title"
          className="w-full rounded-md border-gray-300 px-2 py-1 text-lg border shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      {/* draft checkbox */}
      <div className="space-y-2">
        <label htmlFor="draft" className="block font-medium text-gray-700">
          <input
            type="checkbox"
            id="draft"
            name="draft"
            className="rounded-md border-gray-300 px-2 py-1 text-lg border shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />{" "}
          Is draft
        </label>
      </div>

      {/* type radio box "public" | "private" */}
      <div className="space-y-2">
        <label className="block font-medium text-gray-700">
          <input
            type="radio"
            id="type:public"
            name="type"
            value="public"
            className="rounded-md border-gray-300 px-2 py-1 text-lg border shadow-sm focus:border-blue-500 focus:ring-blue-500"
            defaultChecked
          />{" "}
          Public
        </label>
        <label className="block font-medium text-gray-700">
          <input
            type="radio"
            id="type:private"
            name="type"
            value="private"
            className="rounded-md border-gray-300 px-2 py-1 text-lg border shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />{" "}
          Private
        </label>
      </div>

      <div className="space-y-2">
        <label
          htmlFor="content"
          className="block text-sm font-medium text-gray-700"
        >
          Body
        </label>
        <textarea
          id="body"
          name="body"
          rows={4}
          className="w-full rounded-md border-gray-300 px-2 py-1 border shadow-sm focus:border-blue-500 focus:ring-blue-500"
        />
      </div>

      <button
        type="submit"
        className="w-full rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Go!
      </button>
    </PersistedForm>
  );
}
