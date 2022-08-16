/** EXTERNALS **/

import React from "react";

/** LOCALS **/

import { Counter1, Counter2 } from "../mod.ts";

/** MAIN **/

export default function (props: {
  onIncrementAll: () => void;
  onDecrementAll: () => void;
}) {
  return (
    <div>
      <Counter1 />
      <Counter2 />
      <button onClick={props.onIncrementAll}>Increment All</button>
      <button onClick={props.onDecrementAll}>Decrement All</button>
    </div>
  );
}
