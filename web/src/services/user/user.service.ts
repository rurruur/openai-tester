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
  UserSubsetKey,
  UserSubsetMapping,
  UserSubsetSS,
} from "../sonamu.generated";
import {
  UserListParams,
  UserSaveParams,
  UserJoinParams,
  UserLoginParams,
} from "./user.types";

export namespace UserService {
  export function useUser<T extends UserSubsetKey>(
    subset: T,
    id: number,
    swrOptions?: SwrOptions
  ): SWRResponse<UserSubsetMapping[T], SWRError> {
    return useSWR(
      handleConditional(
        [`/api/user/findById`, { subset, id }],
        swrOptions?.conditional
      )
    );
  }
  export async function getUser<T extends UserSubsetKey>(
    subset: T,
    id: number
  ): Promise<UserSubsetMapping[T]> {
    return fetch({
      method: "GET",
      url: `/api/user/findById?${qs.stringify({ subset, id })}`,
    });
  }

  export function useUsers<T extends UserSubsetKey>(
    subset: T,
    params: UserListParams = {},
    swrOptions?: SwrOptions
  ): SWRResponse<ListResult<UserSubsetMapping[T]>, SWRError> {
    return useSWR(
      handleConditional(
        [`/api/user/findMany`, { subset, params }],
        swrOptions?.conditional
      )
    );
  }
  export async function getUsers<T extends UserSubsetKey>(
    subset: T,
    params: UserListParams = {}
  ): Promise<ListResult<UserSubsetMapping[T]>> {
    return fetch({
      method: "GET",
      url: `/api/user/findMany?${qs.stringify({ subset, params })}`,
    });
  }

  export async function save(spa: UserSaveParams[]): Promise<number[]> {
    return fetch({
      method: "POST",
      url: `/api/user/save`,
      data: { spa },
    });
  }

  export async function del(ids: number[]): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/user/del`,
      data: { ids },
    });
  }

  export async function join(params: UserJoinParams): Promise<number> {
    return fetch({
      method: "POST",
      url: `/api/user/join`,
      data: { params },
    });
  }

  export function useMe(
    swrOptions?: SwrOptions
  ): SWRResponse<UserSubsetSS | null, SWRError> {
    return useSWR(
      handleConditional([`/api/user/me`, {}], swrOptions?.conditional)
    );
  }

  export async function login(params: UserLoginParams): Promise<UserSubsetSS> {
    return fetch({
      method: "POST",
      url: `/api/user/login`,
      data: { params },
    });
  }
}
