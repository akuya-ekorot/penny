import { Schema as S } from "effect"

export const NotificationError = S.Struct({
  code: S.Int,
  title: S.String,
  message: S.String,
  error_data: S.Struct({ details: S.String })
}).pipe(S.rename({ error_data: "errorData" }))
