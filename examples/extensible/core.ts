/** LOCALS **/

import { create } from "../../mod.ts";
import * as stores from "./stores/mod.ts";
import * as actors from "./actors/mod.ts";

/** MAIN **/

export const {
  getActor,
  getModel,
  getStore,
  render,
  update,
} = create({
  stores,
  actors,
  states: {
    number1: { value: 0 },
    number2: { value: 0 },
  },
});
