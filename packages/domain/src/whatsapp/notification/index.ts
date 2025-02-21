import { Schema as S } from "effect"
import { NotificationEntry } from "./entry.js"

export const NotificationObject = S.Literal("whatsapp_business_account")

export const Notification = S.Struct({
  object: NotificationObject,
  entry: S.Array(NotificationEntry)
})
