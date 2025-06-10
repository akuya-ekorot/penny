import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

export const IncomingImageMessage = Schema.TaggedStruct("IncomingImage", {});
export const IncomingTextMessage = Schema.TaggedStruct("IncomingText", {});
export const IncomingDocumentMessage = Schema.TaggedStruct("IncomingDocument", {});
export const IncomingWhatsAppMessage = Schema.Union(
    IncomingImageMessage,
    IncomingTextMessage,
    IncomingDocumentMessage
);
export type IncomingWhatsAppMessage = typeof IncomingWhatsAppMessage.Type;

export const OutgoingImageMessage = Schema.TaggedStruct("OutgoingImage", {});
export const OutgoingTextMessage = Schema.TaggedStruct("OutgoingText", {});
export const OutgoingDocumentMessage = Schema.TaggedStruct("OutgoingDocument", {});
export const OutgoingWhatsAppMessage = Schema.Union(
    OutgoingImageMessage,
    OutgoingTextMessage,
    OutgoingDocumentMessage
);
export type OutgoingWhatsAppMessage = typeof OutgoingWhatsAppMessage.Type;

export const WhatsAppNotificationPayload = Schema.Struct({});
export type WhatsAppNotificationPayload = typeof WhatsAppNotificationPayload.Type;

export const WhatsAppNotificationResult = Schema.Union(
    Schema.TaggedStruct("MessageNotification", {})
)
export type WhatsAppNotificationResult = typeof WhatsAppNotificationResult.Type;

export const WhatsAppAuthPayload = Schema.Struct({
    mode: Schema.Literal("subscribe"),
    verify_token: Schema.String,
    challenge: Schema.String,
});
export type WhatsAppAuthPayload = typeof WhatsAppAuthPayload.Type;

export interface WhatsAppInterface {
    send: (message: OutgoingWhatsAppMessage) => Effect.Effect<never, never, void>;
    processNotification: (payload: WhatsAppNotificationPayload) => Effect.Effect<WhatsAppNotificationResult, never, void>;
    authenticate: (payload: WhatsAppAuthPayload) => Effect.Effect<never, never, void>;
}

export class WhatsApp extends Context.Tag("app/WhatsApp")<WhatsApp, WhatsAppInterface>(){}
