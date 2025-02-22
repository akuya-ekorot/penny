import * as Effect from "effect/Effect"

import { HttpApiDecodeError } from "@effect/platform/HttpApiError"
import { WhatsAppId } from "@template/domain/whatsapp/common"
import type { Notification } from "@template/domain/whatsapp/notification/index"
import type { VerifyWebhookParams } from "@template/domain/WhatsAppApi"
import { DatabaseService } from "./Database.js"

export class WhatsAppRepository extends Effect.Service<WhatsAppRepository>()("api/WhatsAppRepository", {
  effect: Effect.gen(function* () {
    const db = yield* DatabaseService

    const getAllNotifications = Effect.tryPromise({
      try: async () => {
        const notifications = await db.query.notifications.findMany({
          with: {
            entries: true
          }
        })

        return notifications.map((n) => ({
          object: "whatsapp_business_account" as const,
          entry: n.entries.map((e) => ({
            whatsAppId: WhatsAppId.make(e.whatsAppId),
            changes: []
          }))
        }))
      },
      catch: () => HttpApiDecodeError.make({ issues: [{ _tag: "Unexpected", message: "", path: [] }], message: "" })
    })

    function verifyWebhook(
      urlParams: VerifyWebhookParams
    ): Effect.Effect<typeof VerifyWebhookParams.Type.challenge> {
      return Effect.succeed(urlParams.challenge)
    }

    function receiveWebhook(notification: Notification): Effect.Effect<Notification> {
      return Effect.succeed(notification)
    }

    return { getAllNotifications, receiveWebhook, verifyWebhook } as const
  })
}) { }
