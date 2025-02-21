import { Schema as S } from "effect"
import { WhatsAppId } from "../common.js"
import { BaseMessage, WhatsAppMessageType } from "./index.js"

export const WhatsAppContactAddress = S.Struct({
  street: S.String.pipe(S.optional),
  city: S.String.pipe(S.optional),
  state: S.String.pipe(S.optional),
  zip: S.String.pipe(S.optional),
  country: S.String.pipe(S.optional),
  country_code: S.String.pipe(S.optional),
  type: S.Union(S.Literal("HOME"), S.Literal("WORK")).pipe(S.optional)
}).pipe(S.rename({
  country_code: "countryCode"
}))

export const WhatsAppContactName = S.Struct({
  formatted_name: S.String.pipe(S.required),
  first_name: S.String.pipe(S.optional),
  last_name: S.String.pipe(S.optional),
  middle_name: S.String.pipe(S.optional),
  suffix: S.String.pipe(S.optional),
  prefix: S.String.pipe(S.optional)
}).pipe(
  S.rename({
    formatted_name: "formattedName",
    first_name: "firstName",
    middle_name: "middleName",
    last_name: "lastName"
  }),
  S.filter((a) => Boolean(a.firstName || a.lastName || a.middleName || a.suffix || a.prefix)),
  S.required
)

export const WhatsAppContactPhone = S.Struct({
  phone: S.String.pipe(S.optional),
  type: S.String.pipe(S.optional),
  wa_id: WhatsAppId
}).pipe(S.rename({
  wa_id: "waId"
}))

export const WhatsAppContact = S.Struct({
  addresses: S.Array(WhatsAppContactAddress).pipe(S.optional),
  birthday: S.DateFromString.pipe(S.optional),
  emails: S.Array(
    S.Struct({
      email: S.String,
      type: S.Union(S.Literal("HOME"), S.Literal("WORK"))
    })
  ).pipe(S.optional),
  name: WhatsAppContactName,
  org: S.Struct({
    company: S.String.pipe(S.optional),
    department: S.String.pipe(S.optional),
    title: S.String.pipe(S.optional)
  }).pipe(S.optional),
  phones: S.Array(WhatsAppContactPhone).pipe(S.optional),
  urls: S.Array(S.Struct({
    url: S.URL.pipe(S.optional),
    type: S.String.pipe(S.optional)
  })).pipe(S.optional)
})

export const WhatsAppContactsMessage = BaseMessage.pipe(
  S.extend(S.TaggedStruct("WhatsAppContactsMessage", {
    type: WhatsAppMessageType.pipe(S.pickLiteral("contacts")),
    contacts: S.Array(WhatsAppContact).pipe(S.required)
  }))
)
