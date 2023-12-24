import Image from "next/image";
import { addTodos } from "./actions";

export default function Home() {
  return (
    <>
      <h1>hello amplify</h1>
      <form
        action={addTodos}
      >
        <button> button</button>
      </form>
    </>
  );
}
