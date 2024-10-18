import { createMachine, assign } from "xstate";

export const counterMachine = createMachine({
  types: {} as {
    context: { count: number };
    events: { type: "INCREMENT" | "DECREMENT" };
  },
  id: "counter",
  context: { count: 0 },
  on: {
    INCREMENT: {
      actions: assign({ count: ({ context }) => context.count + 1 }),
    },
    DECREMENT: {
      actions: assign({ count: ({ context }) => context.count - 1 }),
    },
  },
});
