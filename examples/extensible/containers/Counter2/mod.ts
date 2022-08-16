/** LOCALS **/

import { getActor, getStore, render, update } from "../../core.ts";
import { Counter as Component } from "../../components/mod.ts";

/** MAIN **/

export default update(() => {
  const Counter = getActor("Counter2");
  const number = getStore("number", "number2");

  return render(Component, {
    value: number.get(),
    onIncrement: Counter.increment,
    onDecrement: Counter.decrement,
  }, (props) => [props.value]);
});
