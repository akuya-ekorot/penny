import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema as S } from "effect"
import { WhatsAppMessageId } from "./whatsapp/common.js"
import { Notification as NSchema } from "./whatsapp/notification/index.js"

export const UrlParams = S.transform(
  S.Struct({
    "hub.mode": S.Literal("subscribe"),
    "hub.challenge": S.NumberFromString,
    "hub.verify_token": S.String
  }),
  S.Struct({
    mode: S.Literal("subscribe"),
    challenge: S.Number,
    verifyToken: S.String
  }),
  {
    strict: true,
    decode: (from) => ({
      mode: from["hub.mode"],
      challenge: from["hub.challenge"],
      verifyToken: from["hub.verify_token"]
    }),
    encode: (to) => ({
      "hub.mode": to.mode,
      "hub.verify_token": to.verifyToken,
      "hub.challenge": to.challenge
    })
  }
)

export class Notification extends S.Class<Notification>("Notification")(NSchema) {}
export class VerificationUrlParams extends S.Class<VerificationUrlParams>("VerificationUrlParams")(UrlParams.to) {}

export class NotificationNotFound extends S.TaggedError<NotificationNotFound>()(
  "NotificationNotFound",
  { id: WhatsAppMessageId }
) {}

export class WhatsAppApiGroup extends HttpApiGroup.make("whatsapp")
  .add(
    HttpApiEndpoint.post("receiveNoification", "/webhook")
      .addSuccess(Notification)
      .setPayload(Notification)
  )
  .add(
    HttpApiEndpoint.get("verifyWebhookEndpoint", "/webhook")
      .setUrlParams(UrlParams)
      .addSuccess(S.Number)
  )
  .add(
    HttpApiEndpoint.get("getAllNotifications", "/notifications")
      .addSuccess(S.Array(Notification))
  )
  .prefix("/whatsapp")
{}
