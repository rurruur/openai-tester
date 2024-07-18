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
import { ChatSubsetKey, ChatSubsetMapping } from "../sonamu.generated";
import {
  ChatListParams,
  ChatSaveParams,
  Message,
  ChatParams,
} from "./chat.types";

export namespace ChatService {
  export function useChat<T extends ChatSubsetKey>(
    subset: T,
    id: number,
    swrOptions?: SwrOptions
  ): SWRResponse<ChatSubsetMapping[T], SWRError> {
    return useSWR(
      handleConditional(
        [`/api/chat/findById`, { subset, id }],
        swrOptions?.conditional
      )
    );
  }
  export async function getChat<T extends ChatSubsetKey>(
    subset: T,
    id: number
  ): Promise<ChatSubsetMapping[T]> {
    return fetch({
      method: "GET",
      url: `/api/chat/findById?${qs.stringify({ subset, id })}`,
    });
  }

  export function useChats<T extends ChatSubsetKey>(
    subset: T,
    params: ChatListParams = {},
    swrOptions?: SwrOptions
  ): SWRResponse<ListResult<ChatSubsetMapping[T]>, SWRError> {
    return useSWR(
      handleConditional(
        [`/api/chat/findMany`, { subset, params }],
        swrOptions?.conditional
      )
    );
  }
  export async function getChats<T extends ChatSubsetKey>(
    subset: T,
    params: ChatListParams = {}
  ): Promise<ListResult<ChatSubsetMapping[T]>> {
    return fetch({
      method: "GET",
      url: `/api/chat/findMany?${qs.stringify({ subset, params })}`,
    });
  }

  export async function save(spa: ChatSaveParams[]): Promise<number[]> {
    return fetch({
      method: "POST",
      url: `/api/chat/save`,
      data: { spa },
    });
  }

  export async function del(ids: number[]): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/chat/del`,
      data: { ids },
    });
  }

  export function useChatList(
    swrOptions?: SwrOptions
  ): SWRResponse<Message[], SWRError> {
    return useSWR(
      handleConditional([`/api/chat/getChatList`, {}], swrOptions?.conditional)
    );
  }
  export async function getChatList(): Promise<Message[]> {
    return fetch({
      method: "GET",
      url: `/api/chat/getChatList?${qs.stringify({})}`,
    });
  }

  export async function chat(params: ChatParams): Promise<Message[]> {
    return fetch({
      method: "POST",
      url: `/api/chat/chat`,
      data: { params },
    });
  }
}
