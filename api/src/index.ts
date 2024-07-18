console.time("total");
require("dotenv").config();
import fastifyPassport from "@fastify/passport";
import fastifySecureSession from "@fastify/secure-session";
import fastify from "fastify";
import { Context, Sonamu } from "sonamu";
import { UserSubsetSS } from "./application/sonamu.generated";

const host = "localhost";
const port = 16000;

const server = fastify();
server.register(require("fastify-qs"));

server.register(fastifySecureSession, {
  secret: "aasdfqwer".repeat(5),
  salt: "salt".repeat(4),
  cookie: {
    domain: "localhost",
    path: "/",
    maxAge: 60000,
  },
});

server.register(fastifyPassport.initialize());
server.register(fastifyPassport.secureSession());

fastifyPassport.registerUserSerializer<UserSubsetSS, UserSubsetSS>(
  async (user, _request) => Promise.resolve(user)
);
fastifyPassport.registerUserDeserializer<UserSubsetSS, UserSubsetSS>(
  async (serialized, _request) => serialized
);

async function bootstrap() {
  await Sonamu.withFastify(server, {
    contextProvider: (defaultContext, request) => {
      return {
        user: request.user ?? null,
        passport: {
          login: request.login.bind(request) as Context["passport"]["login"],
          logout: request.logout.bind(request) as Context["passport"]["logout"],
        },
        ...defaultContext,
        //
      };
    },
    guardHandler: (_guard, _request, _api) => {
      console.log("NOTHING YET");
    },
  });

  server
    .listen({ port, host })
    .then(() => {
      console.log(`🌲 Server listening on http://${host}:${port}`);
      console.timeEnd("total");
    })
    .catch((err) => {
      console.error(err);
      process.exit(1);
    });
}
bootstrap();
