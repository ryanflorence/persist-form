import { useLocation } from "react-router";
import { useMemo } from "react";
import { clear, persist, restore } from "./persist-form.js";

/**
 * Utilities for persisting form values to session storage for the current React
 * Router location.
 */
export function usePersistedForm() {
  let location = useLocation();

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
          restore(location.key, form);
        }
        return () => {
          if (form) {
            persist(location.key, form);
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
      persist: (form: HTMLFormElement) => persist(location.key, form),

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
        restore(location.key, form);
      },

      /**
       * Clears form values from session storage for the current location
       */
      clear: () => clear(location.key),
    }),
    [location.key],
  );
}
