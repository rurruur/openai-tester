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
});
export type ChatParams = z.infer<typeof ChatParams>;

// Chat - Message
export const Message = z.object({
  user: z.boolean(),
  content: z.string(),
  createdAt: z.number(),
});
export type Message = z.infer<typeof Message>;
