import { Schema as S } from "effect"

export const WhatsAppId = S.String.pipe(S.brand("WhatsAppId"))
export const WhatsAppUserId = S.String.pipe(S.brand("WhatsAppUserId"))
export const WhatsAppMessageId = S.String.pipe(S.brand("WhatsAppMessageId"))
export const WhatsAppPhoneNumber = S.String.pipe(S.brand("WhatsAppPhoneNumber"))

export const MessagingProduct = S.Literal("whatsapp")
