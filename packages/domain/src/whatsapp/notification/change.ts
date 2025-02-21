import { Schema as S } from "effect"
import { NotificationChangeValue } from "./value.js"

export const NotificationChange = S.Struct({
  field: S.Literal("messages"),
  value: NotificationChangeValue
})
