/** LOCALS **/

import { State } from "./state.ts";

/** MAIN **/

export function getModel<Actors, Stores, Name extends keyof Stores>(
  state: State<Actors, Stores>,
  name: Name,
) {
  return state.models[name];
}
