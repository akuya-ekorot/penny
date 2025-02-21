import { HttpApiEndpoint, HttpApiGroup } from "@effect/platform"
import { Schema } from "effect"
import { WhatsAppMessageId } from "./whatsapp/common.js"
import { Notification as NSchema } from "./whatsapp/notification/index.js"

export class Notification extends Schema.Class<Notification>("Notification")(NSchema) {}

export class NotificationNotFound extends Schema.TaggedError<NotificationNotFound>()(
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
    HttpApiEndpoint.get("getAllNotifications", "/notifications")
      .addSuccess(Schema.Array(Notification))
  )
  .prefix("/whatsapp")
{}
