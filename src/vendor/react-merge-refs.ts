/*!
 * @license react-merge-refs v1.0.2
 * Copyright (c) 2020 Greg Bergé
 * MIT License
 * https://github.com/gregberge/react-merge-refs
 */
import type * as React from "react";

export function mergeRefs<T = any>(
  refs: Array<
    React.MutableRefObject<T> | React.LegacyRef<T> | undefined | null
  >,
): React.RefCallback<T> {
  return value => {
    refs.forEach(ref => {
      if (typeof ref === "function") {
        ref(value);
      } else if (ref != null) {
        (ref as React.MutableRefObject<T | null>).current = value;
      }
    });
  };
}
