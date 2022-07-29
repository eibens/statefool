/** LOCALS **/

import { State, StoreOf } from "./state.ts";

/** MAIN **/

export function getStore<Actors, Stores, Name extends keyof Stores>(
  state: State<Actors, Stores>,
  name: Name,
): StoreOf<Stores[Name]> {
  return state.models[name] as StoreOf<Stores[Name]>;
}
