import { useLocation } from "react-router";
import { useMemo } from "react";
import { clear, persist, restore } from "./persist-form.js";

/**
 * Utilities for persisting form values to session storage for the current React
 * Router location.
 *
 * ```tsx
 * import { usePersistedForm } from "@ryanflorence/persist-form/react";
 * ```
 */
export function usePersistedForm(key?: string) {
  let location = useLocation();
  let persistKey = key || location.key;

  return useMemo(
    () => ({
      /**
       * Persists a form values to session storage for the current location as a
       * ref.  Requires React 19.
       *
       * ```tsx
       * let { persistFormRef } = usePersistedForm();
       * <form ref={persistFormRef} />
       * ```
       */
      persistFormRef: (form: HTMLFormElement | null) => {
        if (form) {
          restore(persistKey, form);
        }
        return () => {
          if (form) {
            persist(persistKey, form);
          }
        };
      },

      /**
       * Persists form values to session storage for the current location.
       *
       * ```tsx
       * let { persist } = usePersistedForm();
       *
       * // on a form event
       * <form onChange={e => persist(e.currentTarget)} />
       *
       * // or anywhere you have a form ref
       * useEffect(() => {
       *   persist(someFormRef.current)
       * }, [])
       *
       * ```
       */
      persist: (form: HTMLFormElement) => persist(persistKey, form),

      /**
       * Restores form values at the current location from session storage.
       *
       * ```tsx
       * let { restore } = usePersistedForm();
       *
       * // as a ref (React 18 compatible)
       * <form ref={restore} />
       *
       * // or anywhere you have a form ref
       * useEffect(() => {
       *   restore(someFormRef.current)
       * }, [])
       * ```
       */
      restore: (form: HTMLFormElement | null) => {
        if (!form) return;
        restore(persistKey, form);
      },

      /**
       * Clears form values from session storage for the current location
       */
      clear: () => clear(persistKey),
    }),
    [persistKey],
  );
}
