/** LOCALS **/

import { Listener, State } from "./state.ts";

/** MAIN **/

export function listen<Actors, Stores>(
  state: State<Actors, Stores>,
  listener: Listener,
) {
  state.listeners.add(listener);
  return () => {
    state.listeners.delete(listener);
  };
}
