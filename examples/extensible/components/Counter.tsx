/** EXTERNALS **/

import React from "react";

/** MAIN **/

export default function (props: {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
}) {
  return (
    <div>
      <button onClick={props.onIncrement}>Increment</button>
      <span>{props.value}</span>
      <button onClick={props.onDecrement}>Decrement</button>
    </div>
  );
}
