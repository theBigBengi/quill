import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router, protectedProcedure } from "./trpc";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";

const delay = (delayInms: number) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms));
};

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
  //
  getUserFiles: protectedProcedure.query(async ({ ctx }) => {
    const files = await db.file.findMany({
      where: {
        userId: ctx.userId,
      },
    });

    return { data: files };
  }),
  //
  deleteFile: protectedProcedure
    .input(z.string())
    .mutation(async ({ ctx, input }) => {
      const file = await db.file.findFirst({
        where: {
          userId: ctx.userId,
          id: input,
        },
      });

      if (!file) {
        throw new TRPCError({ code: "NOT_FOUND" });
      }

      await db.file.delete({
        where: {
          userId: ctx.userId,
          id: input,
        },
      });

      revalidatePath("/dashboard");
    }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
