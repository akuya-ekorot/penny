import { Schema as S } from "effect"
import { BaseMessage, WhatsAppMessageType } from "./index.js"

export const WhatsAppTextMessage = BaseMessage.pipe(
  S.extend(S.TaggedStruct("WhatsAppTextMessage", {
    type: WhatsAppMessageType.pipe(S.pickLiteral("text")),
    text: S.Struct({
      preview_url: S.Boolean.pipe(S.optional),
      body: S.String.pipe(S.required)
    }).pipe(
      S.rename({
        preview_url: "previewUrl"
      }),
      S.required
    )
  }))
)
