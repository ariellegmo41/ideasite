import { createStartHandler, defaultRenderHandler } from "@tanstack/react-start/server";
import { getRouter } from "./router";

const handler = createStartHandler({
  createRouter: getRouter,
  renderHandler: defaultRenderHandler,
});

export default {
  async fetch(request: Request, ...args: any[]) {
    console.log(`[Server] Handling request: ${request.url}`);
    try {
      const response = await handler(request, ...args);
      console.log(`[Server] Response status: ${response.status}`);
      return response;
    } catch (error) {
      console.error("[Server] Critical Error:", error);
      return new Response("Internal Server Error", { status: 500 });
    }
  },
};
