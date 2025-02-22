import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema as S } from "effect"
import { VerifyWebhookParamsSchema, WhatsAppMessageId } from "./whatsapp/common.js"
import { Notification } from "./whatsapp/notification/index.js"

export class VerifyWebhookParams
  extends S.Class<VerifyWebhookParams>("VerificationUrlParams")(VerifyWebhookParamsSchema.to)
{}

export class NotificationNotFound extends S.TaggedError<NotificationNotFound>()(
  "NotificationNotFound",
  { id: WhatsAppMessageId }
) {}

export class WhatsAppApiGroup extends HttpApiGroup.make("whatsapp")
  .add(
    HttpApiEndpoint.post("receiveWebhook", "/webhook")
      .addSuccess(Notification)
      .setPayload(Notification)
  )
  .add(
    HttpApiEndpoint.get("verifyWebhook", "/webhook")
      .setUrlParams(VerifyWebhookParamsSchema)
      .addSuccess(VerifyWebhookParams.fields.challenge)
  )
  .add(
    HttpApiEndpoint.get("getAllNotifications", "/notifications")
      .addSuccess(S.Array(Notification))
  )
  .prefix("/whatsapp")
{}
