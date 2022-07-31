/** LOCALS **/

import { createError } from "./create_error.ts";
import { State, StoreOf } from "./state.ts";

/** MAIN **/

export function getStore<Actors, Stores, Name extends keyof Stores>(
  state: State<Actors, Stores>,
  name: Name,
  id: string,
): StoreOf<Stores[Name]> {
  const store = state.stores[name][id];
  if (!store) {
    throw createError(state, `store ${String(name)}.${id} not found`);
  }
  return store as StoreOf<Stores[Name]>;
}
