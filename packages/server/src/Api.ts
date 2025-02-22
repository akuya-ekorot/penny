import { HttpApiBuilder } from "@effect/platform"
import { AppApi } from "@template/domain/AppApi"
import { Effect, Layer } from "effect"
import { WhatsAppRepository } from "./WhatsAppRepository.js"

const WhatsAppApiLive = HttpApiBuilder.group(AppApi, "whatsapp", (handlers) =>
  Effect.gen(function* () {
    const wa = yield* WhatsAppRepository

    return handlers
      .handle("verifyWebhook", ({ urlParams }) => wa.verifyWebhook(urlParams))
      .handle("receiveWebhook", ({ payload }) => wa.receiveWebhook(payload))
      .handle("getAllNotifications", () => wa.getAllNotifications)
  }))

export const ApiLive = HttpApiBuilder.api(AppApi).pipe(
  Layer.provide(WhatsAppApiLive)
)
