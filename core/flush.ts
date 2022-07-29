/** EXTERNALS **/

import produce from "https://esm.sh/immer@9.0.15";

/** LOCALS **/

import { State, StatesOf } from "./state.ts";

/** MAIN **/

export function flush<Actors, Stores>(state: State<Actors, Stores>) {
  const { queue, states: oldStates } = state;
  if (queue.length === 0) return;

  while (queue.length > 0) {
    const action = queue.shift();
    if (action === undefined) continue;

    state.states = produce(state.states, (states: StatesOf<Stores>) => {
      state.states = states;
      const key = String(action.name) + "." + String(action.prop);
      const func = state.actions.get(key);
      if (func === undefined) return;
      state.stack.push(action);
      func(...action.args);
      state.stack.pop();
    });
  }

  if (oldStates !== state.states) {
    state.tick++;
    for (const listener of state.listeners) {
      listener(state.tick);
    }
  }
}
