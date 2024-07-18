// fastify.d.ts
import { UserSubsetSS } from "../application/sonamu.generated";

declare module "fastify" {
  export interface PassportUser extends UserSubsetSS {}
}
