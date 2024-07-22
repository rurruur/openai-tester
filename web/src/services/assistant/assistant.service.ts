import { z } from "zod";
import qs from "qs";
import useSWR, { SWRResponse } from "swr";
import {
  fetch,
  ListResult,
  SWRError,
  SwrOptions,
  handleConditional,
  swrPostFetcher,
} from "../sonamu.shared";
import {
  AssistantSubsetKey,
  AssistantSubsetMapping,
} from "../sonamu.generated";
import {
  AssistantListParams,
  AssistantSaveParams,
  AssistantCreateParams,
} from "./assistant.types";

export namespace AssistantService {
  export function useAssistant<T extends AssistantSubsetKey>(
    subset: T,
    id: number,
    swrOptions?: SwrOptions
  ): SWRResponse<AssistantSubsetMapping[T], SWRError> {
    return useSWR(
      handleConditional(
        [`/api/assistant/findById`, { subset, id }],
        swrOptions?.conditional
      )
    );
  }
  export async function getAssistant<T extends AssistantSubsetKey>(
    subset: T,
    id: number
  ): Promise<AssistantSubsetMapping[T]> {
    return fetch({
      method: "GET",
      url: `/api/assistant/findById?${qs.stringify({ subset, id })}`,
    });
  }

  export function useAssistants<T extends AssistantSubsetKey>(
    subset: T,
    params: AssistantListParams = {},
    swrOptions?: SwrOptions
  ): SWRResponse<ListResult<AssistantSubsetMapping[T]>, SWRError> {
    return useSWR(
      handleConditional(
        [`/api/assistant/findMany`, { subset, params }],
        swrOptions?.conditional
      )
    );
  }
  export async function getAssistants<T extends AssistantSubsetKey>(
    subset: T,
    params: AssistantListParams = {}
  ): Promise<ListResult<AssistantSubsetMapping[T]>> {
    return fetch({
      method: "GET",
      url: `/api/assistant/findMany?${qs.stringify({ subset, params })}`,
    });
  }

  export async function save(spa: AssistantSaveParams[]): Promise<number[]> {
    return fetch({
      method: "POST",
      url: `/api/assistant/save`,
      data: { spa },
    });
  }

  export async function del(ids: number[]): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/assistant/del`,
      data: { ids },
    });
  }

  export async function create(params: AssistantCreateParams): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/assistant/create`,
      data: { params },
    });
  }
}
