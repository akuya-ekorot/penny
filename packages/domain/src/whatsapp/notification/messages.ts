import { Schema as S } from "effect"
import { BaseNotificationMessage, WhatsAppMessageType } from "../messages/index.js"

export const BaseNotificationTextMessage = S.Struct({
  type: WhatsAppMessageType.pipe(S.pickLiteral("text")),
  text: S.Struct({ body: S.String })
})

export const NotificationMessage = S.asSchema(
  BaseNotificationMessage.pipe(
    S.extend(S.Union(BaseNotificationTextMessage))
  )
)
