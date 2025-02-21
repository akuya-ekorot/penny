import type { WhatsAppMessageId } from "@template/domain/whatsapp/common"
import { type Notification, type VerificationUrlParams } from "@template/domain/WhatsAppApi"
import { Effect, HashMap, Ref } from "effect"

export class WhatsAppRepository extends Effect.Service<WhatsAppRepository>()("api/WhatsAppRepository", {
  effect: Effect.gen(function*() {
    const notifications = yield* Ref.make(HashMap.empty<typeof WhatsAppMessageId.Type, Notification>())

    const getAll = Ref.get(notifications).pipe(
      Effect.map((notifications) => Array.from(HashMap.values(notifications)))
    )

    function create(notification: Notification): Effect.Effect<Notification> {
      return Ref.modify(notifications, (map) => {
        const id = notification.entry[0].changes[0].value.messages[0].id
        return [notification, HashMap.set(map, id, notification)]
      })
    }

    function verify(urlParams: VerificationUrlParams): Effect.Effect<number> {
      return Effect.succeed(urlParams.challenge)
    }

    return { getAll, create, verify } as const
  })
}) {}
