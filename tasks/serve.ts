/** EXTERNALS **/

import {
  Application,
  Middleware,
  Router,
  send,
} from "https://deno.land/x/oak@v10.2.0/mod.ts";
import { getText, out } from "https://deno.land/x/jog@v0.0.8/mod.ts";

/** HELPERS **/

function logRequest(): Middleware {
  return async (ctx, next) => {
    console.log(`[serve] ${ctx.request.method} ${ctx.request.url}`);
    await next();
    console.log(`[serve] ${ctx.response.status} ${ctx.request.url}`);
  };
}

function serveBundle(path: string): Middleware {
  return async (ctx) => {
    ctx.response.headers.set("Content-Type", "application/javascript");
    ctx.response.body = await out({
      cmd: ["deno", "bundle", "--no-check", path],
      map: getText,
    });
  };
}

/** MAIN **/

if (import.meta.main) {
  const router = new Router()
    .get("/", (ctx) => send(ctx, "examples/index.html"))
    .get("/minimal/", (ctx) => send(ctx, "examples/minimal/index.html"))
    .get("/minimal/index.js", serveBundle("examples/minimal/index.tsx"))
    .get("/extensible/", (ctx) => send(ctx, "examples/extensible/index.html"))
    .get("/extensible/index.js", serveBundle("examples/extensible/index.tsx"));

  const app = new Application();

  app.use(
    logRequest(),
    router.allowedMethods(),
    router.routes(),
  );

  app.addEventListener("listen", ({ hostname, secure, port }) => {
    const url = `${secure ? "https" : "http"}://${hostname}:${port}`;
    console.log(
      `[serve] started: ${url}`,
    );
  });

  app.listen({
    port: 8081,
    hostname: "localhost",
  });
}
