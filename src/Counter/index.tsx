import { useMachine } from "@xstate/react";
import { counterMachine } from "./counterMachine";

export default function Counter() {
  const [state, send] = useMachine(counterMachine);

  return (
    <section>
      <output>{state.context.count}</output>
      <br/>
      <button onClick={() => send({ type: "INCREMENT" })}>INCREMENT</button>
      <button onClick={() => send({ type: "DECREMENT" })}>DECREMENT</button>
    </section>
  );
}
