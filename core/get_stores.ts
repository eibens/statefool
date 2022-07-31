/** LOCALS **/

import { Id, State, StoreOf } from "./state.ts";

/** MAIN **/

export function getStores<Actors, Stores, Name extends keyof Stores>(
  state: State<Actors, Stores>,
  name: Name,
): Record<Id, StoreOf<Stores[Name]>> {
  return state.stores[name];
}
