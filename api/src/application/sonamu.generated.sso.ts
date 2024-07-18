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
  P: {
    select: [
      "chats.id",
      "chats.created_at",
      "chats.content",
      "from.id as from__id",
      "from.name as from__name",
      "to.id as to__id",
      "to.name as to__name",
    ],
    virtual: [],
    joins: [
      {
        as: "from",
        join: "inner",
        table: "users",
        from: "chats.from_id",
        to: "from.id",
      },
      {
        as: "to",
        join: "inner",
        table: "users",
        from: "chats.to_id",
        to: "to.id",
      },
    ],
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
