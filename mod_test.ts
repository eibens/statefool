/** EXTERNALS **/

import { assertEquals } from "https://deno.land/std@0.151.0/testing/asserts.ts";

/** LOCALS **/

import { create } from "./mod.ts";

/** HELPERS **/

type TestStoreState = {
  value: number;
};

const testStoreState: TestStoreState = {
  value: 0,
};

/** MAIN **/

Deno.test("prevents state change when an error ocurrs during action", () => {
  const { getActor, getStore, insert } = create({
    schema: {
      store: {
        inc(state: TestStoreState) {
          state.value++;
        },
        getValue(state: TestStoreState) {
          return state.value;
        },
      },
    },
    actors: {
      Actor: {
        run() {
          const store = getStore("store", "store");
          store.inc();
          throw new Error("cancel this action");
        },
      },
    },
  });

  insert("store", "store", testStoreState);
  getActor("Actor").run();

  const store = getStore("store", "store");
  assertEquals(store.getValue(), 0);
});
