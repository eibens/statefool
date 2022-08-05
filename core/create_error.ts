/** LOCALS **/

import type { Call, State } from "./state.ts";

/** HELPERS **/

function listFromCallstack(call?: Call) {
  const list = [];
  while (call) {
    list.unshift(call);
    call = call.prev;
  }
  return list;
}

function stringifyCall(call: Call) {
  return `  - ${String(call.name)}.${String(call.prop)}`;
}

function stringifyCallStack(call: Call) {
  return listFromCallstack(call)
    .map(stringifyCall)
    .join("\n");
}

/** MAIN **/

export function createError<Actors, Stores>(
  state: State<Actors, Stores>,
  message: string,
) {
  const stackTrace = stringifyCallStack(state.stack[state.stack.length - 1]);
  return new Error(message + "\n\n" + stackTrace);
}
