import { relations } from "drizzle-orm"
import { boolean, foreignKey, pgEnum, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core"

export const pricingCategories = pgEnum("pricing_categories", [
  "authentication",
  "authentication_international",
  "marketing",
  "utility",
  "service",
  "referral_conversion"
])

export const messageStatuses = pgEnum("message_status", [
  "delivered",
  "read",
  "sent"
])

export const messageTypes = pgEnum("message_types", [
  "audio",
  "contacts",
  "document",
  "image",
  "interactive",
  "location",
  "reaction",
  "sticker",
  "template",
  "text",
  "video"
])

export const notifications = pgTable("notifications", {
  id: uuid().primaryKey().defaultRandom(),
  object: text("object").default("whatsapp_business_account")
})

export const notificationsRelations = relations(notifications, (h) => ({
  entries: h.many(entries)
}))

export const entries = pgTable("entries", {
  id: uuid().primaryKey().defaultRandom(),
  whatsAppId: text("whatsapp_id").notNull(),
  notificationId: uuid("notification_id").references(() => notifications.id, { onDelete: "cascade" })
})

export const entriesRelations = relations(entries, (h) => ({
  notification: h.one(notifications, {
    fields: [entries.id],
    references: [notifications.id]
  })
}))

export const changes = pgTable("changes", {
  id: uuid().primaryKey().defaultRandom(),
  field: text().notNull().default("messages")
})

export const changesRelations = relations(changes, (h) => ({
  values: h.many(values)
}))

export const values = pgTable("values", {
  id: uuid().primaryKey().defaultRandom(),
  messagingProduct: text("messaging_product").notNull().default("whatsapp"),
  changeId: uuid("change_id").references(() => changes.id),
  displayPhoneNumber: text("display_phone_number"),
  phoneNumberId: text("phone_number_id")
})

export const valuesRelations = relations(values, (h) => ({
  change: h.one(changes, {
    fields: [values.changeId],
    references: [changes.id]
  }),
  messages: h.many(messages),
  contacts: h.many(contacts)
}))

export const contacts = pgTable("contacts", {
  id: uuid().primaryKey().defaultRandom(),
  whatsAppId: text("whatsapp_id").unique().notNull(),
  whatsAppUserId: text("whatsapp_user_id"),
  profileName: text("profile_name"),
  valueId: uuid("value_id").references(() => values.id)
})

export const contactsRelations = relations(contacts, (h) => ({
  value: h.one(values, {
    fields: [contacts.valueId],
    references: [values.id]
  })
}))

export const messages = pgTable("messages", {
  id: uuid().primaryKey().defaultRandom(),
  messageId: text("message_id"),
  type: messageTypes(),
  from: text(),
  timestamp: timestamp(),
  forwarded: boolean(),
  frequentlyForwarded: boolean("frequently_forwarded"),
  parentId: uuid("parent_id"),
  valueId: uuid("value_id").references(() => values.id)
}, (t) => [
  foreignKey({ columns: [t.parentId], foreignColumns: [t.id], name: "messages_parent_id_fkey" })
])

export const messagesRealtions = relations(messages, (h) => ({
  replies: h.many(messages, { relationName: "messages_replies" }),
  parent: h.one(messages, {
    fields: [messages.parentId],
    references: [messages.id],
    relationName: "messages_replies"
  }),
  value: h.one(values, {
    fields: [messages.valueId],
    references: [values.id]
  })
}))

export const statuses = pgTable("statuses", {
  id: uuid().primaryKey().defaultRandom(),
  messageId: uuid("message_id").references(() => messages.id),
  bizOpaqueCallbackData: text("biz_opaque_callback_data"),
  conversationId: uuid("conversation_id").references(() => conversations.id),
  pricingCategory: pricingCategories("pricing_category"),
  pricingModel: text("pricing_model").default("CPB"),
  recipientId: text("recepient_id"),
  status: messageStatuses("status"),
  timestamp: timestamp()
})

export const conversations = pgTable("conversations", {
  id: uuid().primaryKey().defaultRandom()
})
