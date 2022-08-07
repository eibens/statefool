/** LOCALS **/

import { createError } from "./create_error.ts";
import { Id, State, StateOf, StoreOf } from "./state.ts";

/** MAIN **/

export function insert<Actors, Stores, Name extends keyof Stores>(
  state: State<Actors, Stores>,
  name: Name,
  id: Id,
  data: StateOf<Stores[Name]>,
): StoreOf<Stores[Name]> {
  const states = (state.mutableStates ?? state.states)[name];
  const stores = state.stores[name];

  if (id in stores) {
    throw createError(state, `store ${String(name)}.${id} already exists`);
  }

  const type = state.schema[name];
  const partial: Partial<StoreOf<Stores[Name]>> = {};
  for (const [prop, f] of Object.entries(type)) {
    if (typeof f !== "function") continue;
    const func = (...args: unknown[]) => {
      return f(...args);
    };
    const wrapped = (...args: unknown[]) => {
      const stateSlice = (state.mutableStates ?? state.states)[name][id];
      return func(stateSlice, ...args);
    };
    // @ts-ignore  I'm too lazy to type the function above.
    partial[prop] = wrapped;
  }

  const store = partial as StoreOf<Stores[Name]>;
  // @ts-ignore  FIXME
  stores[id] = store;
  // @ts-ignore  FXIME
  states[id] = data;

  return store;
}
