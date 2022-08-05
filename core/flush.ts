/** EXTERNALS **/

import produce, { enableMapSet } from "immer";

/** LOCALS **/

import { State, StatesOf } from "./state.ts";

/** MAIN **/

enableMapSet();

export function flush<Actors, Stores>(state: State<Actors, Stores>) {
  const { queue, states: oldStates } = state;
  if (queue.length === 0) return;

  let error: Error | null = null;
  const newStates = produce(state.states, (states: StatesOf<Stores>) => {
    state.mutableStates = states;
    while (queue.length > 0) {
      const action = queue.shift();
      if (action === undefined) continue;

      const key = String(action.name) + "." + String(action.prop);
      const func = state.actions.get(key);
      if (func === undefined) return;
      state.stack.push(action);

      try {
        func(...action.args);
      } catch (e) {
        error = e;
        state.stack = [];
        break;
      }

      state.stack.pop();
    }

    state.mutableStates = undefined;
  });

  if (!error) {
    state.states = newStates;
  } else {
    throw error;
  }

  if (state.states !== oldStates) {
    state.tick++;
    for (const listener of state.listeners) {
      listener(state.tick);
    }
  }
}
