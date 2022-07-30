/** MAIN **/

export type StateOf<M> = M[keyof M] extends
  (state: infer State, ...args: infer _Args) => void ? State : never;

export type ActorOf<M> = {
  [K in keyof M]: M[K] extends (...args: infer _Args) => void
    ? (...args: _Args) => void
    : never;
};

export type ModelOf<M> = {
  [K in keyof M]: M[K] extends
    (state: infer _State, ...args: infer Args) => infer Return
    ? (...args: Args) => Return
    : never;
};

export type StoreOf<M> = {
  readonly [K in keyof M]: M[K] extends
    (state: infer _State, ...args: infer Args) => infer Return
    ? Return extends void ? never : (...args: Args) => Return
    : never;
};

export type StatesOf<M> = {
  [K in keyof M]: StateOf<M[K]>;
};

export type ActorsOf<M> = {
  [K in keyof M]: ActorOf<M[K]>;
};

export type ModelsOf<M> = {
  [K in keyof M]: ModelOf<M[K]>;
};

export type StoresOf<M> = {
  [K in keyof M]: StoreOf<M[K]>;
};

export type Listener = (
  tick: number,
) => void;

export type Call = {
  prev?: Call;
  func: (...args: unknown[]) => void;
  name: PropertyKey;
  prop: PropertyKey;
  args: unknown[];
};

export type State<Actors, Stores> = {
  tick: number;
  queue: Call[];
  states: StatesOf<Stores>;
  mutableStates?: StatesOf<Stores>;
  stack: Call[];
  readonly actions: Map<string, (...args: unknown[]) => void>;
  readonly listeners: Set<Listener>;
  readonly actors: ActorsOf<Actors>;
  readonly models: ModelsOf<Stores>;
  readonly stores: StoresOf<Stores>;
};
