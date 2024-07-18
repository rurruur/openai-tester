import { SubsetQuery } from "sonamu";
import { ChatSubsetKey, UserSubsetKey } from "./sonamu.generated";

// SubsetQuery: Chat
export const chatSubsetQueries: { [key in ChatSubsetKey]: SubsetQuery } = {
  A: {
    select: ["chats.id", "chats.created_at"],
    virtual: [],
    joins: [],
    loaders: [],
  },
};

// SubsetQuery: User
export const userSubsetQueries: { [key in UserSubsetKey]: SubsetQuery } = {
  A: {
    select: ["users.id", "users.created_at", "users.name"],
    virtual: [],
    joins: [],
    loaders: [],
  },
  SS: {
    select: ["users.id", "users.created_at", "users.name"],
    virtual: [],
    joins: [],
    loaders: [],
  },
};
