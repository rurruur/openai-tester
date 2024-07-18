import {
  BaseModelClass,
  ListResult,
  asArray,
  NotFoundException,
  BadRequestException,
  api,
  Context,
} from "sonamu";
import { ChatSubsetKey, ChatSubsetMapping } from "../sonamu.generated";
import { chatSubsetQueries } from "../sonamu.generated.sso";
import { ChatListParams, ChatParams, ChatSaveParams } from "./chat.types";
import openai from "../openai";
import { ChatCompletionMessageParam } from "openai/resources";

/*
  Chat Model
*/
class ChatModelClass extends BaseModelClass {
  modelName = "Chat";

  @api({ httpMethod: "GET", clients: ["axios", "swr"], resourceName: "Chat" })
  async findById<T extends ChatSubsetKey>(
    subset: T,
    id: number
  ): Promise<ChatSubsetMapping[T]> {
    const { rows } = await this.findMany(subset, {
      id,
      num: 1,
      page: 1,
    });
    if (rows.length == 0) {
      throw new NotFoundException(`존재하지 않는 Chat ID ${id}`);
    }

    return rows[0];
  }

  async findOne<T extends ChatSubsetKey>(
    subset: T,
    listParams: ChatListParams
  ): Promise<ChatSubsetMapping[T] | null> {
    const { rows } = await this.findMany(subset, {
      ...listParams,
      num: 1,
      page: 1,
    });

    return rows[0] ?? null;
  }

  @api({ httpMethod: "GET", clients: ["axios", "swr"], resourceName: "Chats" })
  async findMany<T extends ChatSubsetKey>(
    subset: T,
    params: ChatListParams = {}
  ): Promise<ListResult<ChatSubsetMapping[T]>> {
    // params with defaults
    params = {
      num: 24,
      page: 1,
      search: "id",
      orderBy: "id-desc",
      ...params,
    };

    // build queries
    let { rows, total } = await this.runSubsetQuery({
      subset,
      params,
      subsetQuery: chatSubsetQueries[subset],
      build: ({ qb }) => {
        // id
        if (params.id) {
          qb.whereIn("chats.id", asArray(params.id));
        }
        // user_id
        if (params.user_id) {
          qb.where("chats.from_id", params.user_id) //
            .orWhere("chats.to_id", params.user_id);
        }

        // search-keyword
        if (params.search && params.keyword && params.keyword.length > 0) {
          if (params.search === "id") {
            qb.where("chats.id", params.keyword);
            // } else if (params.search === "field") {
            //   qb.where("chats.field", "like", `%${params.keyword}%`);
          } else {
            throw new BadRequestException(
              `구현되지 않은 검색 필드 ${params.search}`
            );
          }
        }

        // orderBy
        if (params.orderBy) {
          // default orderBy
          const [orderByField, orderByDirec] = params.orderBy.split("-");
          qb.orderBy("chats." + orderByField, orderByDirec);
        }

        return qb;
      },
      debug: false,
    });

    return {
      rows,
      total,
    };
  }

  @api({ httpMethod: "POST" })
  async save(spa: ChatSaveParams[]): Promise<number[]> {
    const wdb = this.getDB("w");
    const ub = this.getUpsertBuilder();

    // register
    spa.map((sp) => {
      ub.register("chats", sp);
    });

    // transaction
    return wdb.transaction(async (trx) => {
      const ids = await ub.upsert(trx, "chats");

      return ids;
    });
  }

  @api({ httpMethod: "POST", guards: ["admin"] })
  async del(ids: number[]): Promise<number> {
    const wdb = this.getDB("w");

    // transaction
    await wdb.transaction(async (trx) => {
      return trx("chats").whereIn("chats.id", ids).delete();
    });

    return ids.length;
  }

  @api({
    httpMethod: "GET",
    clients: ["axios", "swr"],
    resourceName: "ChatList",
  })
  async getChatList({
    user,
  }: Context): Promise<ListResult<ChatSubsetMapping["P"]>> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    const res = await this.findMany("P", {
      num: 0,
      orderBy: "id-asc",
      user_id: user.id,
    });

    return res;
  }

  @api({ httpMethod: "POST" })
  async chat({ content }: ChatParams, { user }: Context): Promise<string> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    const { rows: messages } = await this.findMany("P", {
      num: 0,
      orderBy: "id-asc",
      user_id: user.id,
    });

    await this.save([
      {
        content,
        to_id: 2, // ai
        from_id: user.id,
      },
    ]);

    const res = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        ...(messages.map((e) => ({
          role: e.from.id === user.id ? "user" : "system",
          content: e.content,
        })) as ChatCompletionMessageParam[]),
        {
          role: "user",
          content,
        },
      ],
    });
    await this.save([
      {
        content: res.choices[0].message.content ?? "",
        to_id: user.id,
        from_id: 2, // ai
      },
    ]);

    return res.choices[0].message.content ?? "";
  }
}

export const ChatModel = new ChatModelClass();
