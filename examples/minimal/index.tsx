/** EXTERNALS **/

import React from "react";
import { createRoot } from "react-dom-client";
import { Id } from "../../core/state.ts";

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

const Counter = {
  increment: (id: Id) => {
    getStore("number", id).add(1);
  },
  decrement: (id: Id) => {
    getStore("number", id).sub(1);
  },
  create: () => {
    const id = "counter-" + Math.random().toString(36).substring(2);

    insert("number", id, {
      value: 0,
    });
  },
  remove: (id: Id) => {
    remove("number", id);
  },
};

const App = {
  incrementAll() {
    const Counter = getActor("Counter");
    for (const id in getStores("number")) {
      Counter.increment(id);
    }
  },
  decrementAll() {
    const Counter = getActor("Counter");
    for (const id in getStores("number")) {
      Counter.decrement(id);
    }
  },
  requestReset() {
    getStore("flag", "resetting").set();
    setTimeout(() => {
      getActor("App").handleReset();
    }, 3000);
  },
  handleReset() {
    getStore("flag", "resetting").unset();
    for (const id in getStores("number")) {
      getStore("number", id).reset();
    }
  },
  throwError() {
    throw new Error("this error was thrown intentionally");
  },
};

// INSTANCE

const {
  getActor,
  getStore,
  getStores,
  insert,
  remove,
  render,
  update,
} = create({
  schema: {
    number,
    flag,
  },
  actors: {
    App,
    Counter,
  },
});

// COMPONENTS

function CounterComponent(props: {
  value: number;
  onIncrement: () => void;
  onDecrement: () => void;
  onRemove: () => void;
}) {
  return (
    <div>
      <button onClick={props.onIncrement}>Increment</button>
      <span>{props.value}</span>
      <button onClick={props.onDecrement}>Decrement</button>
      <button onClick={props.onRemove}>Remove</button>
    </div>
  );
}

function AppComponent(props: {
  resetting: boolean;
  counters: Id[];
  onReset: () => void;
  onCreateCounter: () => void;
  onIncrementAll: () => void;
  onDecrementAll: () => void;
  onThrowError: () => void;
}) {
  return (
    <div>
      <button onClick={props.onCreateCounter}>New Counter</button>
      <button onClick={props.onIncrementAll}>Increment All</button>
      <button onClick={props.onDecrementAll}>Decrement All</button>
      <button onClick={props.onReset} disabled={props.resetting}>
        Reset (async)
      </button>
      <button onClick={props.onThrowError}>Throw error</button>
      {props.counters.map((id) => (
        <CounterContainer
          key={id}
          id={id}
        />
      ))}
    </div>
  );
}

// CONTAINERS

const CounterContainer = update((props: {
  id: Id;
}) => {
  const { id } = props;
  const Counter = getActor("Counter");
  const number = getStore("number", id);

  return render(CounterComponent, {
    value: number.get(),
    onIncrement: () => Counter.increment(id),
    onDecrement: () => Counter.decrement(id),
    onRemove: () => Counter.remove(id),
  }, (props) => [props.value]);
});

const AppContainer = update(function App() {
  const App = getActor("App");
  const Counter = getActor("Counter");
  const resetting = getStore("flag", "resetting");
  const numbers = getStores("number");

  return render(AppComponent, {
    resetting: resetting.get(),
    counters: Object.keys(numbers),
    onReset: App.requestReset,
    onIncrementAll: App.incrementAll,
    onDecrementAll: App.decrementAll,
    onThrowError: App.throwError,
    onCreateCounter: Counter.create,
  }, (props) => [
    props.resetting,
    props.counters,
  ]);
});

/** MAIN **/

if (globalThis.document) {
  insert("flag", "resetting", { value: false });
  insert("number", "counter-1", { value: 0 });
  insert("number", "counter-2", { value: 0 });

  const container = document.createElement("div");
  document.body.appendChild(container);
  const root = createRoot(container);
  root.render(<AppContainer />);
}
