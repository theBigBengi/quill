import { procedure, router } from "./trpc";

export const appRouter = router({
  hello: procedure.query((opts) => {
    return {
      greeting: `hello world`,
    };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
