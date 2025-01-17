import { z } from "zod";
import {
  AssistantBaseSchema,
  AssistantBaseListParams,
} from "../sonamu.generated";

// Assistant - ListParams
export const AssistantListParams = AssistantBaseListParams;
export type AssistantListParams = z.infer<typeof AssistantListParams>;

// Assistant - SaveParams
export const AssistantSaveParams = AssistantBaseSchema.partial({
  id: true,
  created_at: true,
});
export type AssistantSaveParams = z.infer<typeof AssistantSaveParams>;

// Assistant - CreateParams
export const AssistantCreateParams = z.object({
  name: z.string(),
  description: z.string().optional(),
  instructions: z.string(),
});
export type AssistantCreateParams = z.infer<typeof AssistantCreateParams>;

// Assistant
export const Assistant = z.object({
  id: z.string(),
  name: z.string().nullable(),
  description: z.string().nullable(),
  instructions: z.string().nullable(),
  model: z.string(),
});
export type Assistant = z.infer<typeof Assistant>;
