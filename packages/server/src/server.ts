import * as NodeHttpServer from "@effect/platform-node/NodeHttpServer"
import * as NodeRuntime from "@effect/platform-node/NodeRuntime"
import * as HttpApiBuilder from "@effect/platform/HttpApiBuilder"
import * as HttpMiddleware from "@effect/platform/HttpMiddleware"
import * as Layer from "effect/Layer"
import { createServer } from "node:http"
import { ApiLive } from "./Api.js"
import { DatabaseService } from "./Database.js"
import { WhatsAppRepository } from "./WhatsAppRepository.js"

const HttpLive = HttpApiBuilder.serve(HttpMiddleware.logger).pipe(
  Layer.provide(ApiLive),
  Layer.provide(WhatsAppRepository.Default),
  Layer.provide(DatabaseService.Default),
  Layer.provide(NodeHttpServer.layer(createServer, { port: Number(process.env.PORT || 3000) }))
)

Layer.launch(HttpLive).pipe(
  NodeRuntime.runMain
)
