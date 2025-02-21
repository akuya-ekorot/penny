import { Schema as S } from "effect"
import { DateFromUnixTime, MessagingProduct, WhatsAppId, WhatsAppMessageId, WhatsAppPhoneNumber } from "../common.js"
import { NotificationError } from "../notification/error.js"

export const WhatsAppMessageType = S.Union(
  S.Literal("audio"),
  S.Literal("contacts"),
  S.Literal("document"),
  S.Literal("image"),
  S.Literal("interactive"),
  S.Literal("location"),
  S.Literal("reaction"),
  S.Literal("sticker"),
  S.Literal("template"),
  S.Literal("text"),
  S.Literal("video")
)

export const BaseMessage = S.Struct({
  type: WhatsAppMessageType,
  messaging_product: S.Literal("whatsapp").pipe(S.required),
  recipient_type: S.Literal("individual").pipe(S.optional),
  context: S.Struct({
    message_id: WhatsAppMessageId
  }).pipe(S.rename({ message_id: "messageId" }), S.optional)
}).pipe(S.rename({
  messaging_product: "messagingProduct",
  recipient_type: "recipientType"
}))

export const BasePostMessage = S.Struct({
  to: WhatsAppPhoneNumber,
  messaging_product: MessagingProduct.pipe(S.required)
})

export const BaseNotificationMessage = S.Struct({
  context: S.Struct({
    forwarded: S.Boolean,
    frequently_forwarded: S.Boolean,
    from: WhatsAppId,
    id: WhatsAppMessageId
  }).pipe(S.optional),
  errors: S.Array(NotificationError).pipe(S.optional),
  from: WhatsAppId,
  id: WhatsAppMessageId,
  timestamp: DateFromUnixTime
})
