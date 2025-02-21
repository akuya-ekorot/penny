import type { WhatsAppMessageId } from "@template/domain/whatsapp/common"
import type { Notification } from "@template/domain/WhatsAppApi"
import { NotificationNotFound } from "@template/domain/WhatsAppApi"
import { Effect, HashMap, Ref } from "effect"

export class WhatsAppRepository extends Effect.Service<WhatsAppRepository>()("api/WhatsAppRepository", {
  effect: Effect.gen(function*() {
    const notifications = yield* Ref.make(HashMap.empty<typeof WhatsAppMessageId.Type, Notification>())

    const getAll = Ref.get(notifications).pipe(
      Effect.map((notifications) => Array.from(HashMap.values(notifications)))
    )

    function getById(id: typeof WhatsAppMessageId.Type): Effect.Effect<Notification, NotificationNotFound> {
      return Ref.get(notifications).pipe(
        Effect.flatMap(HashMap.get(id)),
        Effect.catchTag("NoSuchElementException", () => new NotificationNotFound({ id }))
      )
    }

    function create(notification: Notification): Effect.Effect<Notification> {
      return Ref.modify(notifications, (map) => {
        const id = notification.entry[0].changes[0].value.messages[0].id
        return [notification, HashMap.set(map, id, notification)]
      })
    }

    return { getAll, getById, create } as const
  })
}) {}
