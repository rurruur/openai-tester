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
import {
  ChatListParams,
  ChatParams,
  ChatSaveParams,
  Message,
} from "./chat.types";
import openai from "../openai";
import { ThreadModel } from "../thread/thread.model";

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
  async getChatList(threadId: string, { user }: Context): Promise<Message[]> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    const thread = await ThreadModel.findOne("A", {
      user_id: user.id,
      uid: threadId,
    });
    if (!thread) {
      throw new NotFoundException("Thread가 존재하지 않습니다.");
    }

    const list = await openai.beta.threads.messages.list(threadId, {
      order: "asc",
    });

    return list.data.map(
      (d) =>
        ({
          user: d.role === "user",
          content: d.content[0].type === "text" ? d.content[0].text.value : "",
          createdAt: d.created_at,
        } as Message)
    );
  }

  @api({ httpMethod: "POST" })
  async chat(params: ChatParams, { user }: Context): Promise<Message[]> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    const { content } = params;

    const thread = await ThreadModel.findOne("A", {
      user_id: user.id,
    });
    if (!thread) {
      throw new NotFoundException("Thread가 존재하지 않습니다.");
    }

    // 메시지 생성
    await openai.beta.threads.messages.create(thread.uid, {
      role: "user",
      content,
    });

    // 스레드 실행
    let run = await openai.beta.threads.runs.create(thread.uid, {
      assistant_id: "asst_MY92V7VcjSZTUeRkyAhy3FeX",
    });
    await new Promise((resolve) => {
      const interval = setInterval(async () => {
        run = await openai.beta.threads.runs.retrieve(thread.uid, run.id);
        if (run.status !== "queued" && run.status !== "in_progress") {
          clearInterval(interval);
          resolve(run);
        }
      }, 500);
    });

    // 메시지 리스트 조회
    const list = await openai.beta.threads.messages.list(thread.uid, {
      order: "asc",
    });

    return list.data.map(
      (d) =>
        ({
          user: d.role === "user",
          content: d.content[0].type === "text" ? d.content[0].text.value : "",
          createdAt: d.created_at,
        } as Message)
    );
  }
}

export const ChatModel = new ChatModelClass();
