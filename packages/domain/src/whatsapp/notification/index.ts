import { Schema as S } from "effect"
import { NotificationEntry } from "./entry.js"

export class Notification extends S.Class<Notification>("Notification")(
  S.Struct({
    object: S.Literal("whatsapp_business_account"),
    entry: S.Array(NotificationEntry)
  })
) { }
