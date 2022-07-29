/** EXTERNALS **/

import React from "react";

/** LOCALS **/

import { State } from "./state.ts";

/** MAIN **/

export function render<Actors, Stores, Props>(
  _state: State<Actors, Stores>,
  Component: React.ComponentType<Props>,
  props: Props,
  deps?: unknown[] | ((props: Props) => unknown[]),
): React.ReactElement {
  const actualDeps = Array.isArray(deps) ? deps : deps?.(props) ?? [];
  return React.useMemo(() => {
    return React.createElement(Component, props);
  }, actualDeps);
}
