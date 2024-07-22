import {
  BaseModelClass,
  ListResult,
  asArray,
  NotFoundException,
  BadRequestException,
  api,
  Context,
} from "sonamu";
import {
  AssistantSubsetKey,
  AssistantSubsetMapping,
} from "../sonamu.generated";
import { assistantSubsetQueries } from "../sonamu.generated.sso";
import {
  Assistant,
  AssistantCreateParams,
  AssistantListParams,
  AssistantSaveParams,
} from "./assistant.types";
import openai from "../openai";

/*
  Assistant Model
*/
class AssistantModelClass extends BaseModelClass {
  modelName = "Assistant";

  @api({
    httpMethod: "GET",
    clients: ["axios", "swr"],
    resourceName: "Assistant",
  })
  async findById<T extends AssistantSubsetKey>(
    subset: T,
    id: number
  ): Promise<AssistantSubsetMapping[T]> {
    const { rows } = await this.findMany(subset, {
      id,
      num: 1,
      page: 1,
    });
    if (rows.length == 0) {
      throw new NotFoundException(`존재하지 않는 Assistant ID ${id}`);
    }

    return rows[0];
  }

  async findOne<T extends AssistantSubsetKey>(
    subset: T,
    listParams: AssistantListParams
  ): Promise<AssistantSubsetMapping[T] | null> {
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
    resourceName: "Assistants",
  })
  async findMany<T extends AssistantSubsetKey>(
    subset: T,
    params: AssistantListParams = {}
  ): Promise<ListResult<AssistantSubsetMapping[T]>> {
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
      subsetQuery: assistantSubsetQueries[subset],
      build: ({ qb }) => {
        // id
        if (params.id) {
          qb.whereIn("assistants.id", asArray(params.id));
        }

        // search-keyword
        if (params.search && params.keyword && params.keyword.length > 0) {
          if (params.search === "id") {
            qb.where("assistants.id", params.keyword);
            // } else if (params.search === "field") {
            //   qb.where("assistants.field", "like", `%${params.keyword}%`);
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
          qb.orderBy("assistants." + orderByField, orderByDirec);
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
  async save(spa: AssistantSaveParams[]): Promise<number[]> {
    const wdb = this.getDB("w");
    const ub = this.getUpsertBuilder();

    // register
    spa.map((sp) => {
      ub.register("assistants", sp);
    });

    // transaction
    return wdb.transaction(async (trx) => {
      const ids = await ub.upsert(trx, "assistants");

      return ids;
    });
  }

  @api({ httpMethod: "POST", guards: ["admin"] })
  async del(ids: number[]): Promise<number> {
    const wdb = this.getDB("w");

    // transaction
    await wdb.transaction(async (trx) => {
      return trx("assistants").whereIn("assistants.id", ids).delete();
    });

    return ids.length;
  }

  @api({ httpMethod: "POST" })
  async create(
    params: AssistantCreateParams,
    { user }: Context
  ): Promise<number> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    const assistant = await openai.beta.assistants.create({
      model: "gpt-3.5-turbo",
      ...params,
    });

    const [id] = await this.save([
      {
        user_id: user.id,
        uid: assistant.id,
      },
    ]);

    return id;
  }

  @api({ httpMethod: "GET", clients: ["swr"] })
  async list({ user }: Context): Promise<Assistant[]> {
    if (!user) {
      throw new BadRequestException("로그인이 필요합니다.");
    }

    const assistants = await openai.beta.assistants.list();

    return assistants.data;
  }
}

export const AssistantModel = new AssistantModelClass();
