import { z } from "zod";
import { zArrayable, SQLDateTimeString, SonamuQueryMode } from "sonamu";

// Enums: Chat
export const ChatOrderBy = z
  .enum(["id-desc", "id-asc"])
  .describe("ChatOrderBy");
export type ChatOrderBy = z.infer<typeof ChatOrderBy>;
export const ChatOrderByLabel = {
  "id-desc": "ID최신순",
  "id-asc": "ID오래된순",
};
export const ChatSearchField = z.enum(["id"]).describe("ChatSearchField");
export type ChatSearchField = z.infer<typeof ChatSearchField>;
export const ChatSearchFieldLabel = { id: "ID" };

// Enums: Thread
export const ThreadOrderBy = z.enum(["id-desc"]).describe("ThreadOrderBy");
export type ThreadOrderBy = z.infer<typeof ThreadOrderBy>;
export const ThreadOrderByLabel = { "id-desc": "ID최신순" };
export const ThreadSearchField = z.enum(["id"]).describe("ThreadSearchField");
export type ThreadSearchField = z.infer<typeof ThreadSearchField>;
export const ThreadSearchFieldLabel = { id: "ID" };

// Enums: User
export const UserOrderBy = z.enum(["id-desc"]).describe("UserOrderBy");
export type UserOrderBy = z.infer<typeof UserOrderBy>;
export const UserOrderByLabel = { "id-desc": "ID최신순" };
export const UserSearchField = z.enum(["id"]).describe("UserSearchField");
export type UserSearchField = z.infer<typeof UserSearchField>;
export const UserSearchFieldLabel = { id: "ID" };

// BaseSchema: Chat
export const ChatBaseSchema = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  from_id: z.number().int(),
  content: z.string().max(65535),
  to_id: z.number().int(),
});
export type ChatBaseSchema = z.infer<typeof ChatBaseSchema>;

// BaseSchema: Thread
export const ThreadBaseSchema = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  uid: z.string().max(128),
  user_id: z.number().int(),
});
export type ThreadBaseSchema = z.infer<typeof ThreadBaseSchema>;

// BaseSchema: User
export const UserBaseSchema = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  name: z.string().max(50),
});
export type UserBaseSchema = z.infer<typeof UserBaseSchema>;

// BaseListParams: Chat
export const ChatBaseListParams = z
  .object({
    num: z.number().int().nonnegative(),
    page: z.number().int().min(1),
    search: ChatSearchField,
    keyword: z.string(),
    orderBy: ChatOrderBy,
    queryMode: SonamuQueryMode,
    id: zArrayable(z.number().int().positive()),
    from_id: z.number().int(),
    to_id: z.number().int(),
  })
  .partial();
export type ChatBaseListParams = z.infer<typeof ChatBaseListParams>;

// BaseListParams: Thread
export const ThreadBaseListParams = z
  .object({
    num: z.number().int().nonnegative(),
    page: z.number().int().min(1),
    search: ThreadSearchField,
    keyword: z.string(),
    orderBy: ThreadOrderBy,
    queryMode: SonamuQueryMode,
    id: zArrayable(z.number().int().positive()),
    user_id: z.number().int(),
  })
  .partial();
export type ThreadBaseListParams = z.infer<typeof ThreadBaseListParams>;

// BaseListParams: User
export const UserBaseListParams = z
  .object({
    num: z.number().int().nonnegative(),
    page: z.number().int().min(1),
    search: UserSearchField,
    keyword: z.string(),
    orderBy: UserOrderBy,
    queryMode: SonamuQueryMode,
    id: zArrayable(z.number().int().positive()),
    name: z.string().max(50),
  })
  .partial();
export type UserBaseListParams = z.infer<typeof UserBaseListParams>;

// Subsets: Chat
export const ChatSubsetA = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
});
export type ChatSubsetA = z.infer<typeof ChatSubsetA>;
export const ChatSubsetP = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  content: z.string().max(65535),
  from: z.object({
    id: z.number().int().nonnegative(),
    name: z.string().max(50),
  }),
  to: z.object({
    id: z.number().int().nonnegative(),
    name: z.string().max(50),
  }),
});
export type ChatSubsetP = z.infer<typeof ChatSubsetP>;
export type ChatSubsetMapping = {
  A: ChatSubsetA;
  P: ChatSubsetP;
};
export const ChatSubsetKey = z.enum(["A", "P"]);
export type ChatSubsetKey = z.infer<typeof ChatSubsetKey>;

// Subsets: Thread
export const ThreadSubsetA = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  uid: z.string().max(128),
});
export type ThreadSubsetA = z.infer<typeof ThreadSubsetA>;
export type ThreadSubsetMapping = {
  A: ThreadSubsetA;
};
export const ThreadSubsetKey = z.enum(["A"]);
export type ThreadSubsetKey = z.infer<typeof ThreadSubsetKey>;

// Subsets: User
export const UserSubsetA = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  name: z.string().max(50),
});
export type UserSubsetA = z.infer<typeof UserSubsetA>;
export const UserSubsetSS = z.object({
  id: z.number().int().nonnegative(),
  created_at: SQLDateTimeString,
  name: z.string().max(50),
});
export type UserSubsetSS = z.infer<typeof UserSubsetSS>;
export type UserSubsetMapping = {
  A: UserSubsetA;
  SS: UserSubsetSS;
};
export const UserSubsetKey = z.enum(["A", "SS"]);
export type UserSubsetKey = z.infer<typeof UserSubsetKey>;
