/** LOCALS **/

import { getStore } from "../../core.ts";

/** MAIN **/

export function increment() {
  getStore("number", "number2").add(1);
}

export function decrement() {
  getStore("number", "number2").sub(1);
}
