import { Schema } from "effect"
import { WhatsAppCustomerId } from "./WhatsAppNotification.js"

export const WhatsAppMessageId = Schema.NonEmptyTrimmedString.pipe(Schema.brand("WhatsAppMessageId"))

export const WhatsAppMessageContext = Schema.Struct({
  /** Set to true if the message received by the business has been forwarded */
  forwarded: Schema.Boolean,
  /** Set to true if the message received by the business has been forwarded more than 5 times. */
  frequently_forwarded: Schema.Boolean,
  /** The WhatsApp ID for the customer who replied to an inbound message. */
  from: WhatsAppCustomerId,
  /** The message ID for the sent message for an inbound reply. */
  id: WhatsAppMessageId
})
export const WhatsAppBaseMessage = Schema.Struct({
  id: WhatsAppMessageId,
  from: WhatsAppCustomerId,
  timestamp: Schema.DateTimeUtc,
  context: Schema.optional(WhatsAppMessageContext)
})

export const WhatsAppMessageTextTypeType = Schema.Literal("text")
export const WhatsAppMessageTextType = Schema.Struct({
  ...WhatsAppBaseMessage.fields,
  type: WhatsAppMessageTextTypeType,
  [WhatsAppMessageTextTypeType.Type]: Schema.Struct({
    preview_url: Schema.Boolean,
    body: Schema.String
  })
})

export const WhatsAppMessageSystemTypeType = Schema.Literal("system")
export const WhatsAppMessageSystemType = Schema.Struct({
  ...WhatsAppBaseMessage.omit("context").fields,
  type: WhatsAppMessageSystemTypeType,
  [WhatsAppMessageSystemTypeType.Type]: Schema.Struct({
    /** Describes the change to the customer's identity or phone number. */
    body: Schema.NonEmptyTrimmedString,
    /** Hash for the identity fetched from server. */
    identity: Schema.NonEmptyTrimmedString,
    /** New WhatsApp ID for the customer when their phone number is updated. Available on webhook versions v12.0 and later. */
    wa_id: WhatsAppCustomerId,
    /** Type of system update. Will be one of the following
     * `customer_changed_number` | `customer_identity_changed`
     */
    type: Schema.Union(Schema.Literal("customer_changed_number"), Schema.Literal("customer_identity_changed")),
    /**  The WhatsApp ID for the customer prior to the update. */
    custmer: Schema.NonEmptyTrimmedString
  })
})

export const WhatsAppMessage = Schema.Union(
  WhatsAppMessageTextType,
  WhatsAppMessageSystemType
)
