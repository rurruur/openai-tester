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
