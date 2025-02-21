import { Schema } from "effect"
import { WhatsAppMessage } from "./WhatsAppMessage.js"

export const WhatsAppCustomerId = Schema.NonEmptyTrimmedString.pipe(Schema.brand("WhatsAppCustomerId"))

export const WhatsAppCustomerProfile = Schema.Struct({
  name: Schema.NonEmptyTrimmedString
})

export const WhatsAppUserId = Schema.NonEmptyTrimmedString.pipe(Schema.brand("WhatsAppUserId"))

export const WhatsAppNotificationChangeValueContact = Schema.Struct({
  wa_id: WhatsAppCustomerId,
  user_id: WhatsAppUserId,
  profile: WhatsAppCustomerProfile
})

export const WhatsAppNotificationChangeValueMetadata = Schema.Struct({
  display_phone_number: Schema.NonEmptyTrimmedString,
  phone_number_id: Schema.NonEmptyTrimmedString
})

export const WhatsAppNotificationChangeValueStatuses = Schema.Struct({})

export const WhatsAppNotificationChangeValue = Schema.Struct({
  contacts: Schema.Array(WhatsAppNotificationChangeValueContact),
  messaging_product: Schema.Literal("whatsapp"),
  messages: Schema.Array(WhatsAppMessage),
  metadata: WhatsAppNotificationChangeValueMetadata,
  statuses: WhatsAppNotificationChangeValueStatuses,

  errors: Schema.Array(Schema.Any)
})

export const WhatsAppNotificationChangeField = Schema.Literal("messages").pipe(
  Schema.brand("WhatsAppNotificationChangeField")
)
export const WhatsAppNotificationChange = Schema.Struct({
  field: WhatsAppNotificationChangeField,
  value: WhatsAppNotificationChangeValue
})

export const WhatsAppBusinessAccountId = Schema.NonEmptyTrimmedString.pipe(Schema.brand("WhatsAppBusinessAccountId"))
export const WhatsAppNotificationEntry = Schema.Struct({
  id: WhatsAppBusinessAccountId,
  changes: Schema.Array(WhatsAppNotificationChange)
})

export class WhatsAppNotification extends Schema.Class<WhatsAppNotification>("WhatsAppNotification")({
  object: Schema.Literal("whatsapp_business_account"),
  entry: Schema.Array(WhatsAppNotificationEntry)
}) { }
