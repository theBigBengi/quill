import { httpBatchLink } from "@trpc/client";
import { appRouter } from "@/app/server";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url:
        process.env.NODE_ENV === "production"
          ? "https://quill-lake.vercel.app/api/trpc"
          : "http://localhost:3000/api/trpc",
    }),
  ],
});
