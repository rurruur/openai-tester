import { z } from "zod";
import { ChatBaseSchema, ChatBaseListParams } from "../sonamu.generated";

// Chat - ListParams
export const ChatListParams = ChatBaseListParams;
export type ChatListParams = z.infer<typeof ChatListParams>;

// Chat - SaveParams
export const ChatSaveParams = ChatBaseSchema.partial({
  id: true,
  created_at: true,
});
export type ChatSaveParams = z.infer<typeof ChatSaveParams>;
