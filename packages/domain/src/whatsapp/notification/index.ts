import { Schema as S } from "effect"
import { DateFromUnixTime, WhatsAppId, WhatsAppMessageId, WhatsAppUserId } from "../common.js"

export class Error extends S.Class<Error>("Error")({
  code: S.Int,
  title: S.String,
  message: S.String,
  errorData: S.propertySignature(S.Struct({ details: S.String })).pipe(S.fromKey("error_data"))
}) {}

const ConversationId = S.String.pipe(S.brand("ConversationId"))

const Conversation = S.Struct({
  id: ConversationId,
  origin: S.Struct({
    type: S.Literal("authentication", "marketing", "utility", "service", "referral_conversation")
  }),
  expiration_timestamp: S.Date.pipe(S.optional)
}).pipe(
  S.rename({
    expiration_timestamp: "expirationTimestamp"
  })
)

export const MessageType = S.Literal("text", "image", "document", "unknown")

export class Message extends S.Class<Message>("Message")({
  id: S.UUID.pipe(S.brand("MessageId")),
  changeId: S.propertySignature(S.UUID.pipe(S.brand("ChangeId"))).pipe(S.fromKey("change_id")),
  messageId: S.propertySignature(S.String).pipe(S.fromKey("message_id")),
  type: MessageType,
  fromWaId: S.optional(S.String).pipe(S.fromKey("from_wa_id")),
  timestamp: S.DateTimeUtc
}) {}

export class BaseMessagePayload extends S.Class<BaseMessagePayload>("BaseMessagePayload")({
  context: S.Struct({
    forwarded: S.Boolean,
    frequentlyForwarded: S.propertySignature(S.Boolean).pipe(S.fromKey("frequently_forwarded")),
    from: WhatsAppId,
    replyTo: S.propertySignature(WhatsAppMessageId).pipe(S.fromKey("id"))
  }).pipe(S.optional),
  errors: S.Array(Error).pipe(S.optional),
  from: WhatsAppId,
  id: WhatsAppMessageId,
  timestamp: DateFromUnixTime
}) {}

export class TextMessagePayload extends BaseMessagePayload.extend<TextMessagePayload>("TextMessagePayload")({
  type: S.Literal("text"),
  text: S.Struct({ body: S.String })
}) {}

export class TextMessage extends S.Class<TextMessage>("TextMessage")({
  id: S.UUID.pipe(S.brand("TextMessageId")),
  messageId: S.propertySignature(S.UUID.pipe(S.brand("MessageId"))).pipe(S.fromKey("message_id")),
  body: S.String
}) {}

// Statuses
export class Status extends S.Class<Status>("Status")(
  S.Struct({
    bizOpaqueCallbackData: S.propertySignature(S.String).pipe(S.fromKey("biz_opaque_callback_data")),
    conversation: Conversation,
    errors: S.Array(Error),
    id: WhatsAppMessageId,
    pricing: S.Struct({
      pricingModel: S.propertySignature(S.Literal("CPB")).pipe(S.fromKey("pricing_model")),
      category: S.Literal(
        "authentication",
        "authentication_international",
        "marketing",
        "utility",
        "service",
        "referral_conversion"
      )
    }),
    recipientId: S.propertySignature(WhatsAppId).pipe(S.fromKey("recipient_id")),
    status: S.Literal("delivered", "read", "sent"),
    timestamp: S.Date
  }).pipe(
    S.filter(({ conversation: { expirationTimestamp }, status }) =>
      Boolean(expirationTimestamp) && status === "sent" ||
      "expiration_timestamp field should only be present when  status is sent"
    )
  )
) {}

// Contacts
export class BaseContact extends S.Class<BaseContact>("BaseContact")({
  waId: S.optional(S.String).pipe(S.fromKey("wa_id"))
}) {}

export class ContactPayload extends BaseContact.extend<ContactPayload>("ContactPayload")({
  whatsAppUserId: S.optional(WhatsAppUserId).pipe(S.fromKey("user_id")),
  profile: S.Struct({ name: S.String })
}) {}

export class Contact extends BaseContact.extend<Contact>("Contact")({
  id: S.UUID.pipe(S.brand("ContactId")),
  changeId: S.propertySignature(S.UUID.pipe(S.brand("ChangeId"))).pipe(S.fromKey("change_id")),
  whatsAppUserId: S.propertySignature(WhatsAppUserId).pipe(S.fromKey("whatsapp_user_id")),
  name: S.String.pipe(S.optional)
}) {}

// Metadata
export class MetadataPayload extends S.Class<MetadataPayload>("MetadataPayload")({
  displayPhoneNumber: S.optional(S.String).pipe(S.fromKey("display_phone_number")),
  phoneNumberId: S.optional(S.String).pipe(S.fromKey("phone_number_id"))
}) {}

// Values
export class ValuePayload extends S.Class<ValuePayload>("ValuePayload")({
  messagingProduct: S.propertySignature(S.Literal("whatsapp")).pipe(S.fromKey("messaging_product")),
  metadata: MetadataPayload,
  contacts: S.Array(ContactPayload),
  errors: S.Array(Error).pipe(S.optional),
  messages: S.Array(TextMessagePayload),
  statuses: S.Array(Status).pipe(S.optional)
}) {}

// Changes
export class BaseChange extends S.Class<BaseChange>("BaseChange")({
  field: S.Literal("messages")
}) {}

export class Change extends BaseChange.extend<Change>("Change")({
  entryId: S.propertySignature(S.UUID.pipe(S.brand("EntryId"))).pipe(S.fromKey("entry_id")),
  messagingProduct: S.propertySignature(S.Literal("whatsapp")).pipe(S.fromKey("messaging_product")),
  displayPhoneNumber: S.optional(S.String).pipe(S.fromKey("display_phone_number")),
  phoneNumberId: S.optional(S.String).pipe(S.fromKey("phone_number_id"))
}) {}

export class ChangePayload extends BaseChange.extend<ChangePayload>("ChangePayload")({
  value: ValuePayload
}) {}

// Entries
export class BaseEntry extends S.Class<BaseEntry>("BaseEntry")({}) {}

export class Entry extends BaseEntry.extend<Entry>("Entry")({
  id: S.UUID.pipe(S.brand("EntryId")),
  notificationId: S.propertySignature(S.UUID.pipe(S.brand("NotificationId"))).pipe(S.fromKey("notification_id")),
  whatsappBusinessAccountId: S.propertySignature(S.String).pipe(S.fromKey("whatsapp_business_account_id"))
}) {}

export class EntryPayload extends S.Class<EntryPayload>("EntryPayload")({
  whatsappBusinessAccountId: S.propertySignature(S.String).pipe(S.fromKey("id")),
  changes: S.Array(ChangePayload)
}) {}

// Notifications
export class BaseNotification extends S.Class<BaseNotification>("BaseNotification")({
  object: S.Literal("whatsapp_business_account")
}) {}

export class Notification extends BaseNotification.extend<Notification>("Notification")({
  id: S.UUID.pipe(S.brand("NotificationId"))
}) {}

export class NotificationPayload extends BaseNotification.extend<NotificationPayload>("NotificationPayload")({
  entry: S.Array(EntryPayload)
}) {}
