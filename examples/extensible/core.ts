/** LOCALS **/

import { create } from "../../mod.ts";
import * as schema from "./stores/mod.ts";
import * as actors from "./actors/mod.ts";

/** MAIN **/

export const {
  getActor,
  getStore,
  render,
  insert,
  update,
} = create({
  actors,
  schema,
});
