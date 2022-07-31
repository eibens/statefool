/** LOCALS **/

import { flush } from "./flush.ts";
import { ActorsOf, Call, State, StatesOf, StoresOf } from "./state.ts";

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
  schema: Stores;
}): State<Actors, Stores> {
  const { actors, schema } = options;

  const stores: Partial<StoresOf<Stores>> = {};
  const states: Partial<StatesOf<Stores>> = {};
  for (const name in schema) {
    stores[name] = {};
    states[name] = {};
  }

  const state: State<Actors, Stores> = {
    tick: 0,
    queue: [],
    stack: [],
    listeners: new Set(),
    schema,
    stores: stores as StoresOf<Stores>,
    states: states as StatesOf<Stores>,
    actions: createActions(actors),
    actors: wrapped(actors, (call) => {
      state.queue.push({
        ...call,
        prev: state.stack[state.stack.length - 1],
      });
      if (state.stack.length === 0) flush(state);
    }) as ActorsOf<Actors>,
  };

  return state;
}
