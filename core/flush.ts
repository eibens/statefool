/** EXTERNALS **/

import produce, { enableMapSet } from "immer";
import { createError } from "./create_error.ts";

/** LOCALS **/

import { State, StatesOf } from "./state.ts";

/** MAIN **/

enableMapSet();

export function flush<Actors, Stores>(state: State<Actors, Stores>) {
  const { queue, states: oldStates } = state;
  if (queue.length === 0) return;

  let success = true;

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
        console.error(e);
        const message =
          "An error was thrown during an action. The original error is logged above.";
        console.warn(createError(state, message).message);
        state.stack = [];
        success = false;
        break;
      }

      state.stack.pop();
    }

    state.mutableStates = undefined;
  });

  if (success && newStates !== oldStates) {
    state.states = newStates;
    state.tick++;
    for (const listener of state.listeners) {
      listener(state.tick);
    }
  }
}
