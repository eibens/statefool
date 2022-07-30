/** EXTERNALS **/

import React from "react";
import { createRoot } from "react-dom-client";

/** LOCALS **/

import { create } from "../../mod.ts";

/** HELPERS **/

// STORES

type NumberState = {
  value: number;
};

const number = {
  get: (state: NumberState) => state.value,
  add(state: NumberState, value: number) {
    state.value += value;
  },
  sub(state: NumberState, value: number) {
    state.value -= value;
  },
  reset(state: NumberState) {
    state.value = 0;
  },
};

type FlagState = {
  value: boolean;
};

const flag = {
  get: (state: FlagState) => state.value,
  set: (state: FlagState) => {
    state.value = true;
  },
  unset: (state: FlagState) => {
    state.value = false;
  },
};

// ACTORS

const Counter1 = {
  increment: () => {
    getModel("number1").add(1);
  },
  decrement: () => {
    getModel("number1").sub(1);
  },
};

const Counter2 = {
  increment: () => {
    getModel("number2").add(1);
  },
  decrement: () => {
    getModel("number2").sub(1);
  },
};

const App = {
  incrementAll() {
    getActor("Counter1").increment();
    getActor("Counter2").increment();
  },
  decrementAll() {
    getActor("Counter1").decrement();
    getActor("Counter2").decrement();
  },
  requestReset() {
    getModel("resetting").set();
    setTimeout(() => {
      getActor("App").handleReset();
    }, 3000);
  },
  handleReset() {
    getModel("resetting").unset();
    getModel("number1").reset();
    getModel("number2").reset();
  },
};

// INSTANCE

const {
  getActor,
  getModel,
  getStore,
  render,
  update,
} = create({
  stores: {
    number1: number,
    number2: number,
    resetting: flag,
  },
  actors: {
    App,
    Counter1,
    Counter2,
  },
  states: {
    number1: { value: 0 },
    number2: { value: 0 },
    resetting: { value: false },
  },
});

// COMPONENTS

function CounterComponent(props: {
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

function AppComponent(props: {
  resetting: boolean;
  onReset: () => void;
  onIncrementAll: () => void;
  onDecrementAll: () => void;
}) {
  return (
    <div>
      <Counter1Container />
      <Counter2Container />
      <button onClick={props.onIncrementAll}>Increment All</button>
      <button onClick={props.onDecrementAll}>Decrement All</button>
      <button onClick={props.onReset} disabled={props.resetting}>
        Reset (async)
      </button>
    </div>
  );
}

// CONTAINERS

const Counter1Container = update(() => {
  const Counter = getActor("Counter1");
  const number = getStore("number1");

  return render(CounterComponent, {
    value: number.get(),
    onIncrement: Counter.increment,
    onDecrement: Counter.decrement,
  }, (props) => [props.value]);
});

const Counter2Container = update(() => {
  const Counter = getActor("Counter2");
  const number = getStore("number2");

  return render(CounterComponent, {
    value: number.get(),
    onIncrement: Counter.increment,
    onDecrement: Counter.decrement,
  }, (props) => [props.value]);
});

const AppContainer = update(function App() {
  const App = getActor("App");
  const resetting = getStore("resetting");

  return render(AppComponent, {
    resetting: resetting.get(),
    onReset: App.requestReset,
    onIncrementAll: App.incrementAll,
    onDecrementAll: App.decrementAll,
  }, (props) => [props.resetting]);
});

/** MAIN **/

if (globalThis.document) {
  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<AppContainer />);
}
