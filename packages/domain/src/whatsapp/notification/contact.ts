import { pgTable, text, uuid } from "drizzle-orm/pg-core"
import { Schema as S } from "effect"
import { WhatsAppId, WhatsAppUserId } from "../common.js"

export const NotificationContact = S.Struct({
  wa_id: WhatsAppId,
  user_id: WhatsAppUserId.pipe(S.optional),
  profile: S.Struct({ name: S.String })
}).pipe(
  S.rename({
    wa_id: "whatsAppId",
    user_id: "whatsAppUserId"
  })
)

export const contacts = pgTable("contacts", {
  id: uuid().primaryKey().defaultRandom(),
  whatsAppId: text("whatsapp_id").unique().notNull(),
  whatsAppUserId: text("whatsapp_user_id"),
  profileName: text("profile_name")
})
