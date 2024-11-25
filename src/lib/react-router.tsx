import { Form, type FormProps, useLocation } from "react-router";
import {
  type FormEvent,
  forwardRef,
  useLayoutEffect,
  useMemo,
  useRef,
} from "react";
import { clear, persist, restore } from "./persist-form.js";
import { mergeRefs } from "../vendor/react-merge-refs.js";

export function usePersistedForm() {
  let location = useLocation();

  return useMemo(
    () => ({
      /**
       * Persists form values to session storage for the current location.
       *
       *
       * ```tsx
       * let { persist } = usePersistedForm();
       *
       * useEffect(() => {
       *   persist(someFormRef.current)
       * }, [someValue])
       * ```
       */
      persist: (form: HTMLFormElement) => persist(location.key, form),

      /**
       * On a form event, persists form values to session storage for the current location.
       *
       * ```tsx
       * let { persist } = usePersistedForm();
       * <form onChange={persist} />
       * ```
       */
      persistFormEvent: (event: FormEvent<HTMLFormElement>) =>
        persist(location.key, event.currentTarget),

      /**
       * Restores form values at the current location.
       *
       * ```tsx
       * let { restore } = usePersistedForm();
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

/**
 * Wraps React Router `Form` to persist form values by location.
 */
export let PersistedForm = forwardRef<HTMLFormElement, FormProps>(
  (props, forwardedRef) => {
    let { restore, persistFormEvent } = usePersistedForm();
    let localRef = useRef<HTMLFormElement>(null);
    let ref = mergeRefs<HTMLFormElement>([localRef, forwardedRef]);

    useLayoutEffect(() => {
      restore(localRef.current);
    }, []);

    return (
      <Form
        ref={ref}
        {...props}
        onChange={event => {
          props.onChange?.(event);
          if (event.defaultPrevented) return;
          persistFormEvent(event);
        }}
      />
    );
  },
);

/**
 * Returns props to be spread on a form element to persist form values by
 * location.
 *
 * ```tsx
 * let formProps = usePersistedFormProps();
 * <fetcher.Form {...formProps} />
 * ```
 */
export function usePersistedFormProps() {
  let { restore, persistFormEvent } = usePersistedForm();
  return {
    ref: restore,
    onChange: persistFormEvent,
  };
}
