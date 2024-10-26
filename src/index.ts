import { serve } from "bun";
import { exists, stat } from "node:fs/promises";
import { parseArgs } from "util";
import { getHarFileList } from "./har";
import type { Har } from "./interface";
import { Router } from "./router";
import { mergeTwoObjects, objToId } from "./utils";

const createRouteId = ({
  method,
  url,
  body,
}: {
  method: string;
  url: string;
  body?: any;
}) => {
  const { pathname, search, username, password, hash } = new URL(url);
  const res: Record<string, any> = {
    method,
    pathname,
    search,
    username,
    password,
    hash,
  };
  if (body) {
    res.body = body;
  }
  return objToId(res);
};

const createRoutesFromHar = (router: Router, har: Har) => {
  har.log.entries.forEach(
    ({
      request,
      response: {
        content: { mimeType, text },
      },
    }) => {
      const { method, url, postData } = request;
      let body: any = void 0;
      if (postData && postData.mimeType.includes("application/json")) {
        try {
          body = JSON.parse(postData.text);
        } catch (e) {
          body = postData.text;
        }
      }
      const key = createRouteId({ method, url, body });
      router.add(
        method,
        url,
        () => {
          return new Response(
            new Blob(text ? [text] : void 0, { type: mimeType })
          );
        },
        { key }
      );
    }
  );
};

interface ServerOptions {
  port?: number;
  docsRoute?: string;
}

const createServer = (harDataList: Har[], options: ServerOptions = {}) => {
  const router = new Router();
  harDataList.forEach((harData) => createRoutesFromHar(router, harData));
  const { port, docsRoute } = mergeTwoObjects(
    {
      port: 3000,
      docsRoute: "/docs",
    },
    options
  );
  const server = serve({
    port,
    async fetch(request) {
      const { pathname } = new URL(request.url);
      switch (pathname) {
        case docsRoute:
          return new Response(
            new Blob([JSON.stringify(router.getRouteList())], {
              type: "application/json",
            })
          );
        case "/":
          return new Response(
            new Blob(
              [
                `<html><body>服务已启动。请查看接口文档 <a href="${docsRoute}">${docsRoute}</a></body></html>`,
              ],
              { type: "text/html" }
            )
          );
        default:
          break;
      }
      let body: string | undefined = void 0;
      if (request.method === "POST") {
        body = await request.json();
      }
      const key = createRouteId({
        method: request.method,
        url: request.url,
        body,
      });

      let route = router.getRouteByKey(key);
      if (!route) {
        route = router.getRouteByRequest(request);
      }
      if (route) {
        return route.handler(request);
      }

      return new Response("404 Not Found", { status: 404 });
    },
  });
  const urlObj = new URL("http://127.0.0.1");
  urlObj.port = server.port.toString();
  const serverUrl = urlObj.toString();
  urlObj.pathname = docsRoute;
  const docsUrl = urlObj.toString();
  console.log(`
Your server is running:
    server: ${serverUrl}
    docs: ${docsUrl}
    `);
};

const start = async () => {
  const { values, positionals } = parseArgs({
    args: Bun.argv,
    options: {
      port: {
        type: "string",
      },
      docs: {
        type: "string",
      },
    },
    strict: true,
    allowPositionals: true,
  });

  const harPath = positionals.at(-1);

  if (harPath) {
    const harPathExists = await exists(harPath);
    if (harPathExists) {
      const statRes = await stat(harPath);
      if (statRes.isDirectory()) {
        const harDataList = await getHarFileList(harPath);
        createServer(harDataList, {
          port: values.port ? +values.port : void 0,
          docsRoute: values.docs,
        });
        return;
      }
    }
  }
  console.error("Please provide a directory path of har files");
};

start();
