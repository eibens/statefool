/** LOCALS **/

import { getStore } from "../../core.ts";

/** MAIN **/

export function increment() {
  getStore("number", "number1").add(1);
}

export function decrement() {
  getStore("number", "number1").sub(1);
}
