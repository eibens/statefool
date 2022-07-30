/** EXTERNALS **/

import produce from "immer";

/** LOCALS **/

import { State, StatesOf } from "./state.ts";

/** MAIN **/

export function flush<Actors, Stores>(state: State<Actors, Stores>) {
  const { queue, states: oldStates } = state;
  if (queue.length === 0) return;

  state.states = produce(state.states, (states: StatesOf<Stores>) => {
    state.mutableStates = states;
    while (queue.length > 0) {
      const action = queue.shift();
      if (action === undefined) continue;

      const key = String(action.name) + "." + String(action.prop);
      const func = state.actions.get(key);
      if (func === undefined) return;
      state.stack.push(action);
      func(...action.args);
      state.stack.pop();
    }
    state.mutableStates = undefined;
  });

  if (state.states !== oldStates) {
    state.tick++;
    for (const listener of state.listeners) {
      listener(state.tick);
    }
  }
}
