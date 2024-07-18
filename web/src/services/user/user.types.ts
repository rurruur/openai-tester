import { z } from "zod";
import { UserBaseSchema, UserBaseListParams } from "../sonamu.generated";

// User - ListParams
export const UserListParams = UserBaseListParams;
export type UserListParams = z.infer<typeof UserListParams>;

// User - SaveParams
export const UserSaveParams = UserBaseSchema.partial({
  id: true,
  created_at: true,
});
export type UserSaveParams = z.infer<typeof UserSaveParams>;

// User - UserJoinParams
export const UserJoinParams = UserBaseSchema.pick({
  name: true,
});
export type UserJoinParams = z.infer<typeof UserJoinParams>;

// User - LoginParams
export const UserLoginParams = UserBaseSchema.pick({
  name: true,
});
export type UserLoginParams = z.infer<typeof UserLoginParams>;
