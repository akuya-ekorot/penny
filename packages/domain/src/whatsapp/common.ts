import { Schema as S } from "effect"

export const WhatsAppId = S.String.pipe(S.brand("WhatsAppId"))
export const WhatsAppUserId = S.String.pipe(S.brand("WhatsAppUserId"))
export const WhatsAppMessageId = S.String.pipe(S.brand("WhatsAppMessageId"))
export const WhatsAppPhoneNumber = S.String.pipe(S.brand("WhatsAppPhoneNumber"))

export const MessagingProduct = S.Literal("whatsapp")

const UnixTime = S.NumberFromString.pipe(S.brand("UnixTime"))
const isUnixTime = S.is(UnixTime)

export const DateFromUnixTime = S.transform(
  UnixTime,
  S.DateFromSelf.pipe(
    S.filter((d) => isUnixTime(d.getTime() / 1000))
  ),
  {
    strict: true,
    decode: (time) => new Date(time * 1000),
    encode: (date) => UnixTime.make(Math.floor(date.getTime() / 1000))
  }
)
export const VerifyWebhookParamsSchema = S.transform(
  S.Struct({
    "hub.mode": S.Literal("subscribe"),
    "hub.challenge": S.NumberFromString,
    "hub.verify_token": S.String
  }),
  S.Struct({
    mode: S.Literal("subscribe"),
    challenge: S.Number,
    verifyToken: S.String
  }),
  {
    strict: true,
    decode: (from) => ({
      mode: from["hub.mode"],
      challenge: from["hub.challenge"],
      verifyToken: from["hub.verify_token"]
    }),
    encode: (to) => ({
      "hub.mode": to.mode,
      "hub.verify_token": to.verifyToken,
      "hub.challenge": to.challenge
    })
  }
)
