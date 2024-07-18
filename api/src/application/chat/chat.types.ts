import { z } from "zod";
import { ChatBaseSchema, ChatBaseListParams } from "../sonamu.generated";

// Chat - ListParams
export const ChatListParams = ChatBaseListParams.extend({
  user_id: z.number().optional(),
});
export type ChatListParams = z.infer<typeof ChatListParams>;

// Chat - SaveParams
export const ChatSaveParams = ChatBaseSchema.partial({
  id: true,
  created_at: true,
});
export type ChatSaveParams = z.infer<typeof ChatSaveParams>;

// Chat - Params
export const ChatParams = z.object({
  content: z.string(),
  messages: z
    .array(
      z.object({
        role: z.string(),
        content: z.string(),
      })
    )
    .optional(),
});
export type ChatParams = z.infer<typeof ChatParams>;
