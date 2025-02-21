import { Schema as S } from "effect"
import { WhatsAppPhoneNumber } from "../common.js"

export const NotificationMetadata = S.Struct({
  display_phone_number: S.String,
  phone_number_id: WhatsAppPhoneNumber
}).pipe(
  S.rename({
    display_phone_number: "displayPhoneNumber",
    phone_number_id: "phoneNumberId"
  })
)
