/** LOCALS **/

import { getModel } from "../../core.ts";

/** MAIN **/

export function increment() {
  getModel("number2").add(1);
}

export function decrement() {
  getModel("number2").sub(1);
}
