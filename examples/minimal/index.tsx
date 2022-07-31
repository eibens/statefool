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
};

// INSTANCE

const {
  getActor,
  getStore,
  getStores,
  insert,
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
  counters: Id[];
  onReset: () => void;
  onIncrementAll: () => void;
  onDecrementAll: () => void;
}) {
  return (
    <div>
      {props.counters.map((id) => (
        <CounterContainer
          key={id}
          id={id}
        />
      ))}
      <button onClick={props.onIncrementAll}>Increment All</button>
      <button onClick={props.onDecrementAll}>Decrement All</button>
      <button onClick={props.onReset} disabled={props.resetting}>
        Reset (async)
      </button>
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
  }, (props) => [props.value]);
});

const AppContainer = update(function App() {
  const App = getActor("App");
  const resetting = getStore("flag", "resetting");
  const numbers = getStores("number");

  return render(AppComponent, {
    resetting: resetting.get(),
    counters: Object.keys(numbers),
    onReset: App.requestReset,
    onIncrementAll: App.incrementAll,
    onDecrementAll: App.decrementAll,
  }, (props) => [props.resetting]);
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
