import { HttpApiBuilder } from "@effect/platform"
import { AppApi } from "@template/domain/Api"
import { Effect, Layer } from "effect"
import { TodosRepository } from "./TodosRepository.js"
import { WhatsAppRepository } from "./WhatsAppRepository.js"

const TodosApiLive = HttpApiBuilder.group(AppApi, "todos", (handlers) =>
  Effect.gen(function*() {
    const todos = yield* TodosRepository

    return handlers
      .handle("getAllTodos", () => todos.getAll)
      .handle("getTodoById", ({ path: { id } }) => todos.getById(id))
      .handle("createTodo", ({ payload: { text } }) => todos.create(text))
      .handle("completeTodo", ({ path: { id } }) => todos.complete(id))
      .handle("removeTodo", ({ path: { id } }) => todos.remove(id))
  }))

const WhatsAppApiLive = HttpApiBuilder.group(AppApi, "whatsapp", (handlers) =>
  Effect.gen(function*() {
    const notifications = yield* WhatsAppRepository

    return handlers
      .handle("receiveNoification", ({ payload }) => notifications.create(payload))
      .handle("getAllNotifications", () => notifications.getAll)
      .handle("verifyWebhookEndpoint", ({ urlParams }) => notifications.verify(urlParams))
  }))

export const ApiLive = HttpApiBuilder.api(AppApi).pipe(
  Layer.provide(TodosApiLive),
  Layer.provide(WhatsAppApiLive)
)
