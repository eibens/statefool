/** LOCALS **/

import { flush } from "./flush.ts";
import {
  ActorsOf,
  Call,
  ModelsOf,
  State,
  StatesOf,
  StoresOf,
} from "./state.ts";

/** HELPERS **/

function wrapped<T>(
  map: T,
  wrap: (call: Call) => void,
) {
  const out: Record<PropertyKey, Record<PropertyKey, unknown>> = {};
  for (const [name, value] of Object.entries(map)) {
    out[name] = {};
    for (const [prop, f] of Object.entries(value)) {
      if (typeof f !== "function") continue;
      const func = (...args: unknown[]) => {
        return f(...args);
      };
      out[name][prop] = (...args: unknown[]) => {
        const call: Call = { func, name, prop, args };
        return wrap(call);
      };
    }
  }
  return out;
}

function createActions<T>(map: T) {
  const out = new Map();
  for (const [name, value] of Object.entries(map)) {
    for (const [prop, f] of Object.entries(value)) {
      if (typeof f !== "function") continue;
      const key = `${name}.${prop}`;
      out.set(key, f);
    }
  }
  return out;
}

/** MAIN **/

export function create<Actors, Stores>(options: {
  actors: Actors;
  stores: Stores;
  states: StatesOf<Stores>;
}): State<Actors, Stores> {
  const { actors, stores, states } = options;

  const state: State<Actors, Stores> = {
    tick: 0,
    queue: [],
    stack: [],
    states,
    listeners: new Set(),
    actions: createActions(actors),
    actors: wrapped(actors, (call) => {
      state.queue.push(call);
      if (state.stack.length === 0) flush(state);
    }) as ActorsOf<Actors>,
    models: wrapped(stores, (call) => {
      const stateSlice = state.states[call.name as keyof Stores];
      return call.func(stateSlice, ...call.args);
    }) as ModelsOf<Stores>,
    stores: wrapped(stores, (call) => {
      const stateSlice = state.states[call.name as keyof Stores];
      return call.func(stateSlice, ...call.args);
    }) as StoresOf<Stores>,
  };

  return state;
}
