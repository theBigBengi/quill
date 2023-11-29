import { createTRPCReact } from "@trpc/react-query";
import { AppRouter } from "@/app/server";

export const trpc = createTRPCReact<AppRouter>({
  abortOnUnmount: true,
});
