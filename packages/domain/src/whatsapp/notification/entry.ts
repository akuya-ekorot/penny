import { Schema as S } from "effect"
import { WhatsAppId } from "../common.js"
import { NotificationChange } from "./change.js"

export const NotificationEntry = S.Struct({
  id: WhatsAppId,
  changes: S.Array(NotificationChange)
})
