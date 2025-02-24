import * as S from "effect/Schema"

// Reusable timestamp columns
const DefaultTimestamps = S.Struct({
  createdAt: S.propertySignature(S.DateTimeUtc).pipe(S.fromKey("created_at")),
  updatedAt: S.propertySignature(S.DateTimeUtc).pipe(S.fromKey("updated_at"))
})

// Enums
export const AccountTypes = S.Literal("mobile_money", "checking", "savings", "cash", "other")
export const EntryTypes = S.Literal("debit", "credit")
export const SystemMessageTypes = S.Literal("customer_changed_number", "customer_identity_changed")
export const MessageTypes = S.Literal("text", "image", "document", "unknown")
export const ApiTypes = S.Literal("whatsapp_api", "ai_service_transaction_parsing", "ai_service_chat_completion")

// Tables
export class User extends S.Class<User>("User")(
  S.Struct({
    id: S.UUID.pipe(S.brand("UserId")),
    name: S.String.pipe(S.optional),
    WhatsAppUserId: S.propertySignature(S.NonEmptyTrimmedString).pipe(S.fromKey("whatsapp_user_id")),
    phoneNumber: S.propertySignature(S.NonEmptyTrimmedString).pipe(S.fromKey("phone_number")),

    ...DefaultTimestamps.fields
  })
) {}

export class Account extends S.Class<Account>("Account")(
  S.Struct({
    id: S.UUID.pipe(S.brand("AccountId")),
    name: S.String,
    type: AccountTypes,
    userId: S.propertySignature(S.UUID.pipe(S.brand("UserId"))).pipe(S.fromKey("user_id")),

    ...DefaultTimestamps.fields
  })
) {}

export class BudgetCategory extends S.Class<BudgetCategory>("BudgetCategory")(
  S.Struct({
    id: S.UUID.pipe(S.brand("BudgetCategoryId")),
    name: S.String,
    description: S.String.pipe(S.optional),
    userId: S.propertySignature(S.UUID.pipe(S.brand("UserId"))).pipe(S.fromKey("user_id")),

    ...DefaultTimestamps.fields
  })
) {}

export class Budget extends S.Class<Budget>("Budget")(
  S.Struct({
    id: S.UUID.pipe(S.brand("BudgetId")),
    categoryId: S.propertySignature(S.UUID.pipe(S.brand("BudgetCategoryId"))).pipe(
      S.fromKey("category_id")
    ),
    periodStart: S.propertySignature(S.DateTimeUtc).pipe(S.fromKey("period_start")),
    periodEnd: S.propertySignature(S.DateTimeUtc).pipe(S.fromKey("period_end")),
    plannedAmount: S.propertySignature(S.Number).pipe(S.fromKey("planned_amount")),

    ...DefaultTimestamps.fields
  })
) {}

export class TransactionEvent extends S.Class<TransactionEvent>("TransactionEvent")(
  S.Struct({
    id: S.UUID.pipe(S.brand("TransactionEventId")),
    notes: S.String.pipe(S.optional),
    description: S.String.pipe(S.optional),
    userId: S.propertySignature(S.UUID.pipe(S.brand("UserId"))).pipe(S.fromKey("user_id")),
    transactionDate: S.propertySignature(S.DateTimeUtc).pipe(S.fromKey("transaction_date")),
    aiExtractedData: S.optional(S.Record({ key: S.String, value: S.Any })).pipe(S.fromKey("ai_extracted_data")),

    ...DefaultTimestamps.fields
  })
) {}

export class TransactionEntry extends S.Class<TransactionEntry>("TransactionEntry")(
  S.Struct({
    id: S.UUID.pipe(S.brand("TransactionEntryId")),
    transactionEventId: S.propertySignature(S.UUID.pipe(S.brand("TransactionEventId"))).pipe(
      S.fromKey("transaction_event_id")
    ),
    accountId: S.propertySignature(S.UUID.pipe(S.brand("AccountId"))).pipe(S.fromKey("account_id")),
    budgetCategoryId: S.optional(S.UUID.pipe(S.brand("BudgetCategoryId"))).pipe(S.fromKey("budget_category_id")),
    entryType: S.propertySignature(EntryTypes).pipe(S.fromKey("entry_type")),
    amount: S.propertySignature(S.Number).pipe(S.fromKey("amount")),
    description: S.String.pipe(S.optional),

    ...DefaultTimestamps.fields
  })
) {}

export class Notification extends S.Class<Notification>("Notification")(
  S.Struct({
    id: S.UUID.pipe(S.brand("NotificationId")),
    object: S.String
  })
) {}

export class Entry extends S.Class<Entry>("Entry")(
  S.Struct({
    id: S.UUID.pipe(S.brand("EntryId")),
    notificationId: S.propertySignature(S.UUID.pipe(S.brand("NotificationId"))).pipe(S.fromKey("notification_id")),
    whatsappBusinessAccountId: S.propertySignature(S.String).pipe(S.fromKey("whatsapp_business_account_id"))
  })
) {}

export class Change extends S.Class<Change>("Change")(
  S.Struct({
    id: S.UUID.pipe(S.brand("ChangeId")),
    entryId: S.propertySignature(S.UUID.pipe(S.brand("EntryId"))).pipe(S.fromKey("entry_id")),
    field: S.propertySignature(S.String).pipe(S.fromKey("field")),
    messagingProduct: S.propertySignature(S.String).pipe(S.fromKey("messaging_product")),
    displayPhoneNumber: S.optional(S.String).pipe(S.fromKey("display_phone_number")),
    phoneNumberId: S.optional(S.String).pipe(S.fromKey("phone_number_id"))
  })
) {}

export class Contact extends S.Class<Contact>("Contact")(
  S.Struct({
    id: S.UUID.pipe(S.brand("ContactId")),
    changeId: S.propertySignature(S.UUID.pipe(S.brand("ChangeId"))).pipe(S.fromKey("change_id")),
    waId: S.optional(S.String).pipe(S.fromKey("wa_id")),
    whatsAppUserId: S.optional(S.String).pipe(S.fromKey("whatsapp_user_id")),
    name: S.optional(S.String)
  })
) {}

export class SystemMessage extends S.Class<SystemMessage>("SystemMessage")(
  S.Struct({
    id: S.UUID.pipe(S.brand("SystemMessageId")),
    messageId: S.optional(S.UUID.pipe(S.brand("MessageId"))).pipe(S.fromKey("message_id")),
    body: S.String.pipe(S.optional),
    identity: S.String.pipe(S.optional),
    waId: S.optional(S.String).pipe(S.fromKey("wa_id")),
    type: S.optional(SystemMessageTypes).pipe(S.fromKey("type")),
    customer: S.optional(S.String)
  })
) {}

export class Message extends S.Class<Message>("Message")(
  S.Struct({
    id: S.UUID.pipe(S.brand("MessageId")),
    changeId: S.propertySignature(S.UUID.pipe(S.brand("ChangeId"))).pipe(S.fromKey("change_id")),
    messageId: S.propertySignature(S.String).pipe(S.fromKey("message_id")),
    type: MessageTypes,
    fromWaId: S.optional(S.String).pipe(S.fromKey("from_wa_id")),
    timestamp: S.DateTimeUtc
  })
) {}

export class TextMessage extends S.Class<TextMessage>("TextMessage")(
  S.Struct({
    id: S.UUID.pipe(S.brand("TextMessageId")),
    messageId: S.propertySignature(S.UUID.pipe(S.brand("MessageId"))).pipe(S.fromKey("message_id")),
    body: S.String
  })
) {}

export class ApiUsageLog extends S.Class<ApiUsageLog>("ApiUsageLog")(
  S.Struct({
    id: S.UUID.pipe(S.brand("ApiUsageLogId")),
    timestamp: S.DateTimeUtc,
    apiType: S.propertySignature(ApiTypes).pipe(S.fromKey("api_type")),
    requestDetails: S.optional(S.Record({ key: S.String, value: S.Any })).pipe(S.fromKey("request_details")),
    responseDetails: S.optional(S.Record({ key: S.String, value: S.Any })).pipe(S.fromKey("response_details")),
    usageCost: S.optional(S.Number).pipe(S.fromKey("usage_cost")),
    userId: S.optional(S.UUID.pipe(S.brand("UserId"))).pipe(S.fromKey("user_id")),
    notes: S.String.pipe(S.optional)
  })
) {}
