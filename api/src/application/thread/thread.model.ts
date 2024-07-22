import {
  BaseModelClass,
  ListResult,
  asArray,
  NotFoundException,
  BadRequestException,
  api,
  Context,
} from "sonamu";
import { ThreadSubsetKey, ThreadSubsetMapping } from "../sonamu.generated";
import { threadSubsetQueries } from "../sonamu.generated.sso";
import { Thread, ThreadListParams, ThreadSaveParams } from "./thread.types";
import openai from "../openai";

/*
  Thread Model
*/
class ThreadModelClass extends BaseModelClass {
  modelName = "Thread";

  @api({ httpMethod: "GET", clients: ["axios", "swr"], resourceName: "Thread" })
  async findById<T extends ThreadSubsetKey>(
    subset: T,
    id: number
  ): Promise<ThreadSubsetMapping[T]> {
    const { rows } = await this.findMany(subset, {
      id,
      num: 1,
      page: 1,
    });
    if (rows.length == 0) {
      throw new NotFoundException(`존재하지 않는 Thread ID ${id}`);
    }

    return rows[0];
  }

  async findOne<T extends ThreadSubsetKey>(
    subset: T,
    listParams: ThreadListParams
  ): Promise<ThreadSubsetMapping[T] | null> {
    const { rows } = await this.findMany(subset, {
      ...listParams,
      num: 1,
      page: 1,
    });

    return rows[0] ?? null;
  }

  @api({
    httpMethod: "GET",
    clients: ["axios", "swr"],
    resourceName: "Threads",
  })
  async findMany<T extends ThreadSubsetKey>(
    subset: T,
    params: ThreadListParams = {}
  ): Promise<ListResult<ThreadSubsetMapping[T]>> {
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
      subsetQuery: threadSubsetQueries[subset],
      build: ({ qb }) => {
        // id
        if (params.id) {
          qb.whereIn("threads.id", asArray(params.id));
        }

        // search-keyword
        if (params.search && params.keyword && params.keyword.length > 0) {
          if (params.search === "id") {
            qb.where("threads.id", params.keyword);
            // } else if (params.search === "field") {
            //   qb.where("threads.field", "like", `%${params.keyword}%`);
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
          qb.orderBy("threads." + orderByField, orderByDirec);
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
  async save(spa: ThreadSaveParams[]): Promise<number[]> {
    const wdb = this.getDB("w");
    const ub = this.getUpsertBuilder();

    // register
    spa.map((sp) => {
      ub.register("threads", sp);
    });

    // transaction
    return wdb.transaction(async (trx) => {
      const ids = await ub.upsert(trx, "threads");

      return ids;
    });
  }

  @api({ httpMethod: "POST", guards: ["admin"] })
  async del(ids: number[]): Promise<number> {
    const wdb = this.getDB("w");

    // transaction
    await wdb.transaction(async (trx) => {
      return trx("threads").whereIn("threads.id", ids).delete();
    });

    return ids.length;
  }

  @api({ httpMethod: "POST" })
  async create({ user }: Context): Promise<number> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    const thread = await openai.beta.threads.create();
    const [id] = await this.save([
      {
        user_id: user.id,
        uid: thread.id,
      },
    ]);

    return id;
  }

  @api({ httpMethod: "GET", clients: ["swr"] })
  async list({ user }: Context): Promise<Thread[]> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    const { rows: threadIds } = await this.findMany("A", {
      user_id: user.id,
      num: 0,
      queryMode: "list",
      orderBy: "id-desc",
    });
    const threads = await Promise.all(
      threadIds.map(({ uid }) => openai.beta.threads.retrieve(uid))
    );

    return threads;
  }
}

export const ThreadModel = new ThreadModelClass();
