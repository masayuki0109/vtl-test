"use server";
import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";
import config from "@/src/amplifyconfiguration.json";
import { batchAddTodo } from "@/src/graphql/mutations";
Amplify.configure(config);

const client = generateClient();

export async function addTodos() {
  console.log("addTodos");
  const result = await client.graphql({
    query: batchAddTodo,
    variables: {
      todos: [{ name: "todo1" }, { name: "todo2" }],
    },
  });
  console.log(result)
}
