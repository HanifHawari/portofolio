import { translations } from "./translations.1";

export type Language = "en" | "id";

type DeepStringify<T> = T extends string
  ? string
  : T extends readonly (infer U)[]
  ? DeepStringify<U>[]
  : T extends object
  ? { [K in keyof T]: DeepStringify<T[K]> }
  : T;

export type TranslationKey = DeepStringify<typeof translations.en>;
