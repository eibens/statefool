/** LOCALS **/

import { getActor, getStore, render, update } from "../../core.ts";
import Component from "../../components/Counter.tsx";

/** MAIN **/

export default update(() => {
  const Counter = getActor("Counter1");
  const number = getStore("number", "number1");

  return render(Component, {
    value: number.get(),
    onIncrement: Counter.increment,
    onDecrement: Counter.decrement,
  }, (props) => [props.value]);
});
