export type State = {
  value: number;
};

export function get(state: State) {
  return state.value;
}

export function add(state: State, value: number) {
  state.value += value;
}

export function sub(state: State, value: number) {
  state.value -= value;
}
