import { HttpApiBuilder, HttpMiddleware } from "@effect/platform"
import { NodeHttpServer, NodeRuntime } from "@effect/platform-node"
import { Layer } from "effect"
import { createServer } from "node:http"
import { ApiLive } from "./Api.js"
import { TodosRepository } from "./TodosRepository.js"
import { WhatsAppRepository } from "./WhatsAppRepository.js"

const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(ApiLive),
  Layer.provide(TodosRepository.Default),
  Layer.provide(WhatsAppRepository.Default),
  Layer.provide(NodeHttpServer.layer(createServer, { port: Number(process.env.PORT || 3000) }))
)

Layer.launch(HttpLive).pipe(
  NodeRuntime.runMain
)
