import { HttpApiEndpoint, HttpApiError, HttpApiGroup } from "@effect/platform"
import { Schema as S } from "effect"
import { VerifyWebhookParamsSchema, WhatsAppMessageId } from "./whatsapp/common.js"
import { NotificationPayload } from "./whatsapp/notification/index.js"

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
      .addSuccess(NotificationPayload)
      .setPayload(NotificationPayload)
      .addError(HttpApiError.InternalServerError)
  )
  .add(
    HttpApiEndpoint.get("verifyWebhook", "/webhook")
      .setUrlParams(VerifyWebhookParamsSchema)
      .addSuccess(VerifyWebhookParams.fields.challenge)
      .addError(HttpApiError.Unauthorized)
  )
  .prefix("/whatsapp")
{}
