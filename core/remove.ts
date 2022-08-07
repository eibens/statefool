/** LOCALS **/

import { Id, State } from "./state.ts";

/** MAIN **/

export function remove<Actors, Stores, Name extends keyof Stores>(
  state: State<Actors, Stores>,
  name: Name,
  id: Id,
) {
  const states = (state.mutableStates ?? state.states)[name];
  const stores = state.stores[name];

  if (!(id in stores)) {
    throw new Error(
      `store ${
        String(name)
      }.${id} does not exist and can therefore not be removed`,
    );
  }

  delete stores[id];
  delete states[id];
}
