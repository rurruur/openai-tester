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
import { ThreadSubsetKey, ThreadSubsetMapping } from "../sonamu.generated";
import { ThreadListParams, ThreadSaveParams, Thread } from "./thread.types";

export namespace ThreadService {
  export function useThread<T extends ThreadSubsetKey>(
    subset: T,
    id: number,
    swrOptions?: SwrOptions
  ): SWRResponse<ThreadSubsetMapping[T], SWRError> {
    return useSWR(
      handleConditional(
        [`/api/thread/findById`, { subset, id }],
        swrOptions?.conditional
      )
    );
  }
  export async function getThread<T extends ThreadSubsetKey>(
    subset: T,
    id: number
  ): Promise<ThreadSubsetMapping[T]> {
    return fetch({
      method: "GET",
      url: `/api/thread/findById?${qs.stringify({ subset, id })}`,
    });
  }

  export function useThreads<T extends ThreadSubsetKey>(
    subset: T,
    params: ThreadListParams = {},
    swrOptions?: SwrOptions
  ): SWRResponse<ListResult<ThreadSubsetMapping[T]>, SWRError> {
    return useSWR(
      handleConditional(
        [`/api/thread/findMany`, { subset, params }],
        swrOptions?.conditional
      )
    );
  }
  export async function getThreads<T extends ThreadSubsetKey>(
    subset: T,
    params: ThreadListParams = {}
  ): Promise<ListResult<ThreadSubsetMapping[T]>> {
    return fetch({
      method: "GET",
      url: `/api/thread/findMany?${qs.stringify({ subset, params })}`,
    });
  }

  export async function save(spa: ThreadSaveParams[]): Promise<number[]> {
    return fetch({
      method: "POST",
      url: `/api/thread/save`,
      data: { spa },
    });
  }

  export async function del(ids: number[]): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/thread/del`,
      data: { ids },
    });
  }

  export async function create(): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/thread/create`,
      data: {},
    });
  }

  export function useList(
    swrOptions?: SwrOptions
  ): SWRResponse<Thread[], SWRError> {
    return useSWR(
      handleConditional([`/api/thread/list`, {}], swrOptions?.conditional)
    );
  }
}
