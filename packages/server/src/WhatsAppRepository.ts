import * as Config from "effect/Config"
import * as Effect from "effect/Effect"
import * as Redacted from "effect/Redacted"

import { InternalServerError, Unauthorized } from "@effect/platform/HttpApiError"
import type { NotificationPayload } from "@template/domain/whatsapp/notification/index"
import type { VerifyWebhookParams } from "@template/domain/WhatsAppApi"
import { DatabaseService } from "./Database.js"
import { changes, contacts, entries, messages, notifications, textMessages } from "./db/schema.js"

export class WhatsAppRepository extends Effect.Service<WhatsAppRepository>()("api/WhatsAppRepository", {
  effect: Effect.gen(function*() {
    const verifyToken = Redacted.value(yield* Config.redacted("VERIFY_TOKEN"))

    function verifyWebhook(urlParams: VerifyWebhookParams): Effect.Effect<number, Unauthorized> {
      if (verifyToken === urlParams.verifyToken) {
        return Effect.succeed(urlParams.challenge)
      }
      return Effect.fail(new Unauthorized())
    }

    function receiveWebhook(notification: NotificationPayload) {
      return Effect.gen(function*() {
        const { db } = yield* DatabaseService

        return yield* Effect.tryPromise({
          try: () =>
            db.transaction(async (tx) => {
              const notificationResponse = await tx.insert(notifications)
                .values({ object: notification.object })
                .returning({
                  notificationId: notifications.id
                })

              const { notificationId } = notificationResponse[0]

              for await (const entry of notification.entry) {
                const entryResponse = await tx.insert(entries).values({
                  notificationId,
                  whatsappBusinessAccountId: entry.whatsappBusinessAccountId
                }).returning({ entryId: entries.id })

                const { entryId } = entryResponse[0]

                for await (const change of entry.changes) {
                  const changeResponse = await tx.insert(changes).values({
                    entryId,
                    displayPhoneNumber: change.value.metadata.displayPhoneNumber,
                    field: change.field,
                    messagingProduct: change.value.messagingProduct,
                    phoneNumberId: change.value.metadata.phoneNumberId
                  }).returning({ changeId: changes.id })

                  const { changeId } = changeResponse[0]

                  await Promise.all([
                    change.value.contacts.length ?
                      change.value.contacts.map(async (contact) =>
                        await tx.insert(contacts).values({
                          changeId,
                          waId: contact.waId,
                          whatsappUserId: contact.whatsAppUserId,
                          name: contact.profile.name
                        })
                      ) :
                      [],
                    change.value.messages.length ?
                      change.value.messages.filter((m) => m.type === "text").map(
                        async (message) => {
                          const messageResponse = await tx.insert(messages).values({
                            changeId,
                            messageId: message.id,
                            type: message.type,
                            fromWaId: message.from,
                            timestamp: message.timestamp
                          }).returning({ messageId: messages.id })

                          const { messageId } = messageResponse[0]

                          await tx.insert(textMessages).values({
                            messageId,
                            textBody: message.text.body
                          })
                        }
                      ) :
                      []
                  ])
                }
              }

              return notification
            }),
          catch: () => new InternalServerError()
        })
      })
    }

    return { receiveWebhook, verifyWebhook } as const
  })
}) {}
