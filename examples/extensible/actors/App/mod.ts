/** LOCALS **/

import { getActor } from "../../core.ts";

/** MAIN **/

export function incrementAll() {
  getActor("Counter1").increment();
  getActor("Counter2").increment();
}

export function decrementAll() {
  getActor("Counter1").decrement();
  getActor("Counter2").decrement();
}
