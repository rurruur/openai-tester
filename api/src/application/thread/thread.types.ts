import { z } from "zod";
import { ThreadBaseSchema, ThreadBaseListParams } from "../sonamu.generated";

// Thread - ListParams
export const ThreadListParams = ThreadBaseListParams;
export type ThreadListParams = z.infer<typeof ThreadListParams>;

// Thread - SaveParams
export const ThreadSaveParams = ThreadBaseSchema.partial({
  id: true,
  created_at: true,
});
export type ThreadSaveParams = z.infer<typeof ThreadSaveParams>;
