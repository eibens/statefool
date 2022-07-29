/** LOCALS **/

import { State } from "./state.ts";

/** MAIN **/

export function getActor<Actors, Stores, Name extends keyof Actors>(
  state: State<Actors, Stores>,
  name: Name,
) {
  return state.actors[name];
}
