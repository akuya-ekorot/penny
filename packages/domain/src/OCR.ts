import * as Context from "effect/Context";
import type * as Effect from "effect/Effect";
import * as Schema from "effect/Schema";

export const OCRProcessResult = Schema.TaggedStruct("OCRProcessResult", {});
export type OCRProcessResult = typeof OCRProcessResult.Type;

export interface OCRInterface {
    process: (payload: Buffer) => Effect.Effect<OCRProcessResult, never, never>;
}

export class OCR extends Context.Tag("app/OCR")<OCR, OCRInterface>(){}
