import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router } from "./trpc";
import { db } from "@/lib/db";

export const appRouter = router({
  hello: publicProcedure.query((opts) => {
    return {
      greeting: `hello world`,
    };
  }),
  authCallback: publicProcedure.query(async () => {
    const { getUser } = getKindeServerSession();
    const user = await getUser();

    if (!user?.id || !user?.email) {
      {
        throw new TRPCError({ code: "UNAUTHORIZED" });
      }
    }

    // check if the user is in the database
    const existingUser = await db.user.findFirst({
      where: {
        id: user.id,
      },
    });

    if (!existingUser) {
      // create user in db
      await db.user.create({
        data: {
          id: user.id,
          email: user.email,
          fullName: user.given_name + " " + user.family_name,
        },
      });
    }

    return { success: true };
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
