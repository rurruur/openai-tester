import { z } from "zod";
import { zArrayable, SQLDateTimeString, SonamuQueryMode } from "src/services/sonamu.shared";

// Enums: Chat
export const ChatOrderBy = z.enum(["id-desc"]).describe("ChatOrderBy");
export type ChatOrderBy = z.infer<typeof ChatOrderBy>;
export const ChatOrderByLabel = { "id-desc": "ID최신순" };
export const ChatSearchField = z.enum(["id"]).describe("ChatSearchField");
export type ChatSearchField = z.infer<typeof ChatSearchField>;
export const ChatSearchFieldLabel = { id: "ID" };

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
  user_id: z.number().int(),
  content: z.string().max(65535),
});
export type ChatBaseSchema = z.infer<typeof ChatBaseSchema>;

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
  })
  .partial();
export type ChatBaseListParams = z.infer<typeof ChatBaseListParams>;

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
export type ChatSubsetMapping = {
  A: ChatSubsetA;
};
export const ChatSubsetKey = z.enum(["A"]);
export type ChatSubsetKey = z.infer<typeof ChatSubsetKey>;

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
