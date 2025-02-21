import { Schema as S } from "effect"
import { MessagingProduct } from "../common.js"
import { NotificationContact } from "./contact.js"
import { NotificationError } from "./error.js"
import { NotificationMessage } from "./messages.js"
import { NotificationMetadata } from "./metadata.js"
import { NotificationStatus } from "./statuses.js"

export const NotificationChangeValue = S.Struct({
  contacts: S.Array(NotificationContact),
  errors: S.Array(NotificationError).pipe(S.optional),
  messaging_product: MessagingProduct,
  messages: S.Array(NotificationMessage),
  metadata: NotificationMetadata,
  statuses: S.Array(NotificationStatus).pipe(S.optional)
}).pipe(S.rename({ messaging_product: "messagingProduct" }))
