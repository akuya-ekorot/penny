import { relations } from "drizzle-orm"
import { date, jsonb, numeric, pgEnum, pgTable, text, timestamp, unique, uuid } from "drizzle-orm/pg-core"

// Reusable timestamp columns
const defaultTimestamps = {
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull()
}

// Enums
export const accountTypeEnum = pgEnum("account_type_enum", ["mobile_money", "checking", "savings", "cash", "other"])
export const entryTypeEnum = pgEnum("entry_type_enum", ["debit", "credit"])
export const systemMessageTypeEnum = pgEnum("system_message_type", [
  "customer_changed_number",
  "customer_identity_changed"
])
export const messageTypeEnum = pgEnum("message_type", ["text", "image", "document", "unknown"])
export const apiTypeEnum = pgEnum("api_type_enum", [
  "whatsapp_api",
  "ai_service_transaction_parsing",
  "ai_service_chat_completion"
])

// Tables
export const users = pgTable("users", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  whatsappUserId: text("whatsapp_user_id").notNull().unique(),
  phoneNumber: text("phone_number").notNull().unique(),
  name: text("name"),
  ...defaultTimestamps
})

export const usersRelations = relations(users, (h) => ({
  accounts: h.many(accounts),
  budgetCategories: h.many(budgetCategories),
  transactionEvents: h.many(transactionEvents),
  apiUsageLogs: h.many(apiUsageLogs)
}))

export const accounts = pgTable("accounts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  type: accountTypeEnum("type").default("checking").notNull(),
  ...defaultTimestamps
})

export const accountsRelations = relations(accounts, (h) => ({
  user: h.one(users, {
    fields: [accounts.userId],
    references: [users.id]
  }),
  transactionEntries: h.many(transactionEntries)
}))

export const budgetCategories = pgTable("budget_categories", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  ...defaultTimestamps
}, (table) => [unique("user_category_name_unique").on(table.userId, table.name)])

export const budgetCategoriesRelations = relations(budgetCategories, (h) => ({
  user: h.one(users, {
    fields: [budgetCategories.userId],
    references: [users.id]
  }),
  budgets: h.many(budgets),
  transactionEntries: h.many(transactionEntries)
}))

export const budgets = pgTable("budgets", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  budgetCategoryId: uuid("category_id").notNull().references(() => budgetCategories.id, { onDelete: "cascade" }),
  budgetPeriodStart: date("period_start").notNull(),
  budgetPeriodEnd: date("period_end").notNull(),
  plannedAmount: numeric("planned_amount").default("0").notNull(),
  ...defaultTimestamps
}, (table) => [unique("budget_category_period_unique").on(table.budgetCategoryId, table.budgetPeriodStart)])

export const budgetsRelations = relations(budgets, (h) => ({
  budgetCategory: h.one(budgetCategories, {
    fields: [budgets.budgetCategoryId],
    references: [budgetCategories.id]
  })
}))

export const transactionEvents = pgTable("transaction_events", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  userId: uuid("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  transactionDate: timestamp("transaction_date").defaultNow().notNull(),
  description: text("description"),
  notes: text("notes"),
  aiExtractedData: jsonb("ai_extracted_data"),
  ...defaultTimestamps
})

export const transactionEventsRelations = relations(transactionEvents, (h) => ({
  user: h.one(users, {
    fields: [transactionEvents.userId],
    references: [users.id]
  }),
  transactionEntries: h.many(transactionEntries)
}))

export const transactionEntries = pgTable("transaction_entries", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  transactionEventId: uuid("transaction_event_id").notNull().references(() => transactionEvents.id, {
    onDelete: "cascade"
  }),
  accountId: uuid("account_id").notNull().references(() => accounts.id, { onDelete: "cascade" }),
  budgetCategoryId: uuid("budget_category_id").references(() => budgetCategories.id, { onDelete: "set null" }),
  entryType: entryTypeEnum("entry_type").notNull(),
  amount: numeric("amount").notNull(),
  description: text("description"),
  ...defaultTimestamps
})

export const transactionEntriesRelations = relations(transactionEntries, (h) => ({
  transactionEvent: h.one(transactionEvents, {
    fields: [transactionEntries.transactionEventId],
    references: [transactionEvents.id]
  }),
  account: h.one(accounts, {
    fields: [transactionEntries.accountId],
    references: [accounts.id]
  }),
  budgetCategory: h.one(budgetCategories, {
    fields: [transactionEntries.budgetCategoryId],
    references: [budgetCategories.id]
  })
}))

export const notifications = pgTable("notifications", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  object: text("object").default("whatsapp_business_account")
})

export const notificationsRelations = relations(notifications, (h) => ({
  entries: h.many(entries)
}))

export const entries = pgTable("entries", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  notificationId: uuid("notification_id").notNull().references(() => notifications.id, { onDelete: "cascade" }),
  whatsappBusinessAccountId: text("whatsapp_business_account_id")
})

export const entriesRelations = relations(entries, (h) => ({
  notification: h.one(notifications, {
    fields: [entries.notificationId],
    references: [notifications.id]
  }),
  changes: h.many(changes)
}))

export const changes = pgTable("changes", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  entryId: uuid("entry_id").notNull().references(() => entries.id, { onDelete: "cascade" }),
  field: text("field").default("messages"),
  messagingProduct: text("messaging_product").default("whatsapp"),
  displayPhoneNumber: text("display_phone_number"),
  phoneNumberId: text("phone_number_id")
})

export const changesRelations = relations(changes, (h) => ({
  entry: h.one(entries, {
    fields: [changes.entryId],
    references: [entries.id]
  }),
  contacts: h.many(contacts),
  messages: h.many(messages)
}))

export const contacts = pgTable("contacts", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  changeId: uuid("change_id").notNull().references(() => changes.id, { onDelete: "cascade" }),
  waId: text("wa_id"),
  whatsappUserId: text("whatsapp_user_id"),
  name: text("name")
})

export const contactsRelations = relations(contacts, (h) => ({
  change: h.one(changes, {
    fields: [contacts.changeId],
    references: [changes.id]
  })
}))

export const systemMessages = pgTable("system_messages", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  messageId: uuid("message_id").references(() => messages.id, { onDelete: "cascade" }),
  body: text("body"),
  identity: text("identity"),
  waId: text("wa_id"),
  type: systemMessageTypeEnum("type"),
  customer: text("customer")
})

export const systemMessagesRelations = relations(systemMessages, (h) => ({
  message: h.one(messages, {
    fields: [systemMessages.messageId],
    references: [messages.id]
  })
}))

export const messages = pgTable("messages", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  changeId: uuid("change_id").notNull().references(() => changes.id, { onDelete: "cascade" }),
  messageId: text("message_id").notNull().unique(),
  type: messageTypeEnum("type").notNull(),
  fromWaId: text("from_wa_id"),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  ...defaultTimestamps
})

export const messagesRelations = relations(messages, (h) => ({
  change: h.one(changes, {
    fields: [messages.changeId],
    references: [changes.id]
  }),
  textMessages: h.one(textMessages),
  systemMessages: h.many(systemMessages)
}))

export const textMessages = pgTable("text_messages", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  messageId: uuid("message_id").notNull().unique().references(() => messages.id, { onDelete: "cascade" }),
  textBody: text("text_body").notNull()
})

export const textMessagesRelations = relations(textMessages, (h) => ({
  message: h.one(messages, {
    fields: [textMessages.messageId],
    references: [messages.id]
  })
}))

export const apiUsageLogs = pgTable("api_usage_logs", {
  id: uuid("id").primaryKey().defaultRandom().notNull(),
  timestamp: timestamp("timestamp").defaultNow().notNull(),
  apiType: apiTypeEnum("api_type").notNull(),
  requestDetails: jsonb("request_details"),
  responseDetails: jsonb("response_details"),
  usageCost: numeric("usage_cost"),
  userId: uuid("user_id").references(() => users.id, { onDelete: "set null" }),
  notes: text("notes"),
  ...defaultTimestamps
})

export const apiUsageLogsRelations = relations(apiUsageLogs, (h) => ({
  user: h.one(users, {
    fields: [apiUsageLogs.userId],
    references: [users.id]
  })
}))
