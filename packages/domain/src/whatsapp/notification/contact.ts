import { Schema as S } from "effect"
import { WhatsAppId, WhatsAppUserId } from "../common.js"

export const NotificationContact = S.Struct({
  wa_id: WhatsAppId,
  user_id: WhatsAppUserId,
  profile: S.Struct({ name: S.String })
}).pipe(
  S.rename({
    wa_id: "waId",
    user_id: "userId"
  })
)
