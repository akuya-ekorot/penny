import { Schema as S } from "effect"
import { BaseNotificationMessage, WhatsAppMessageType } from "../messages/index.js"

export const BaseNotificationTextMessage = S.Struct({
  type: WhatsAppMessageType.pipe(S.pickLiteral("text")),
  text: S.Struct({ body: S.String })
})

export const BaseNotificationAudioMessage = S.Struct({
  type: WhatsAppMessageType.pipe(S.pickLiteral("audio")),
  audio: S.Struct({
    id: S.String.pipe(S.brand("AudioId")),
    mime_type: S.String
  }).pipe(S.rename({ mime_type: "mimeType" }))
})

export const NotificationMessage = S.asSchema(
  BaseNotificationMessage.pipe(
    S.extend(
      S.Union(
        BaseNotificationTextMessage,
        BaseNotificationAudioMessage
      )
    )
  )
)
