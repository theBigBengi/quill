import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { TRPCError } from "@trpc/server";
import { publicProcedure, router, protectedProcedure } from "./trpc";
import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { redirect } from "next/navigation";
import { trpc } from "../_trpc/client";
import { INFINITE_QUERY_LIMIT } from "@/config/infinte-query";

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
  files: router({
    getFile: protectedProcedure
      .input(z.string())
      .mutation(async ({ ctx, input }) => {
        const file = await db.file.findFirst({
          where: {
            userId: ctx.userId,
            key: input,
          },
        });

        if (!file) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return file;
      }),
    getFileUploadStatus: protectedProcedure
      .input(z.string())
      .query(async ({ ctx, input }) => {
        const file = await db.file.findFirst({
          where: {
            userId: ctx.userId,
            id: input,
          },
          select: {
            uploadStatus: true,
          },
        });

        if (!file) {
          throw new TRPCError({ code: "NOT_FOUND" });
        }

        return file;
      }),
    getFileMessages: protectedProcedure
      .input(
        z.object({
          limit: z.number().min(1).max(100).nullish(),
          cursor: z.string().nullish(),
          fileId: z.string(),
        })
      )
      .query(async ({ ctx, input }) => {
        const limit = input.limit ?? INFINITE_QUERY_LIMIT;

        const file = await db.file.findFirst({
          where: {
            id: input.fileId,
            userId: ctx.userId,
          },
        });

        if (!file) throw new TRPCError({ code: "NOT_FOUND" });

        const messages = await db.message.findMany({
          where: {
            userId: ctx.userId,
            fileId: input.fileId,
          },
          orderBy: {
            createdAt: "desc",
          },
          take: limit + 1,
          cursor: input.cursor ? { id: input.cursor } : undefined,
          select: {
            id: true,
            isUserMessage: true,
            createdAt: true,
            text: true,
          },
        });

        let nextCursor: typeof input.cursor | undefined = undefined;
        if (messages.length > limit) {
          const nextItem = messages.pop();
          nextCursor = nextItem?.id;
        }

        return {
          messages,
          nextCursor,
        };
      }),
  }),
});

// export type definition of API
export type AppRouter = typeof appRouter;
