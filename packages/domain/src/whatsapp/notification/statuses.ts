import { Schema as S } from "effect"
import { WhatsAppId, WhatsAppMessageId } from "../common.js"
import { NotificationError } from "./error.js"

const ConversationId = S.String.pipe(S.brand("ConversationId"))

const Conversation = S.Struct({
  id: ConversationId,
  origin: S.Struct({
    type: S.Literal("authentication", "marketing", "utility", "service", "referral_conversation")
  }),
  expiration_timestamp: S.Date.pipe(S.optional)
}).pipe(
  S.rename({
    expiration_timestamp: "expirationTimestamp"
  })
)

export const NotificationStatus = S.Struct({
  biz_opaque_callback_data: S.String,
  conversation: Conversation,
  errors: S.Array(NotificationError),
  id: WhatsAppMessageId,
  pricing: S.Struct({
    category: S.Literal(
      "authentication",
      "authentication_international",
      "marketing",
      "utility",
      "service",
      "referral_conversion"
    ),
    pricing_model: S.Literal("CPB")
  }).pipe(S.rename({ pricing_model: "pricingModel" })),
  recipient_id: WhatsAppId,
  status: S.Literal("delivered", "read", "sent"),
  timestamp: S.Date
}).pipe(
  S.rename({
    biz_opaque_callback_data: "bizOpaqueCallbackData",
    recipient_id: "recipientId"
  }),
  S.filter(({ conversation: { expirationTimestamp }, status }) =>
    Boolean(expirationTimestamp) && status === "sent" ||
    "expiration_timestamp field should only be present when  status is sent"
  )
)
