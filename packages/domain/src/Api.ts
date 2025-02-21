import { HttpApi } from "@effect/platform"
import { TodosApiGroup } from "./TodosApi.js"
import { WhatsAppApiGroup } from "./WhatsAppApi.js"

export class AppApi extends HttpApi.make("api")
  .add(TodosApiGroup)
  .add(WhatsAppApiGroup)
{}
