import { HttpApi } from "@effect/platform"
import { WhatsAppApiGroup } from "./WhatsAppApi.js"

export class AppApi extends HttpApi.make("api")
  .add(WhatsAppApiGroup)
{}
