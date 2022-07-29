/** LOCALS **/

import { getModel } from "../../core.ts";

/** MAIN **/

export function increment() {
  getModel("number1").add(1);
}

export function decrement() {
  getModel("number1").sub(1);
}
