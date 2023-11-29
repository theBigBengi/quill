import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { z } from "zod";

import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "langchain/embeddings/openai";
import { PineconeStore } from "langchain/vectorstores/pinecone";
import { getPineconeClient } from "@/lib/pinecone";

const f = createUploadthing();

const middleware = async ({ req, input }: { req: Request; input: any }) => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id) throw new Error("Unauthorized");

  return { userId: user.id, name: input };
};

const onUploadComplete = async ({
  metadata,
  file,
}: {
  metadata: Awaited<ReturnType<typeof middleware>>;
  file: {
    key: string;
    name: string;
    url: string;
  };
}) => {
  // Search for the file in the database
  const isFileExist = await db.file.findFirst({
    where: {
      key: file.key,
    },
  });

  if (isFileExist) return;

  // Save the file on db
  const createdFile = await db.file.create({
    data: {
      key: file.key,
      name: metadata.name || file.name,
      userId: metadata.userId,
      url: `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`,
      uploadStatus: "PROCESSING",
    },
  });

  try {
    const response = await fetch(
      `https://uploadthing-prod.s3.us-west-2.amazonaws.com/${file.key}`
    );

    const blob = await response.blob();

    const loader = new PDFLoader(blob);

    const pageLevelDocs = await loader.load();

    const pagesAmt = pageLevelDocs.length;

    // const { subscriptionPlan } = metadata
    // const { isSubscribed } = subscriptionPlan

    // const isProExceeded =
    //   pagesAmt >
    //   PLANS.find((plan) => plan.name === 'Pro')!.pagesPerPdf

    // const isFreeExceeded =
    //   pagesAmt >
    //   PLANS.find((plan) => plan.name === 'Free')!
    //     .pagesPerPdf

    // if (
    //   (isSubscribed && isProExceeded) ||
    //   (!isSubscribed && isFreeExceeded)
    // ) {
    //   await db.file.update({
    //     data: {
    //       uploadStatus: 'FAILED',
    //     },
    //     where: {
    //       id: createdFile.id,
    //     },
    //   })
    // }

    // vectorize and index entire document
    const pinecone = await getPineconeClient();
    const pineconeIndex = pinecone.Index("quill");

    const embeddings = new OpenAIEmbeddings({
      openAIApiKey: process.env.OPENAI_API_KEY,
    });

    await PineconeStore.fromDocuments(pageLevelDocs, embeddings, {
      pineconeIndex,
      // namespace: createdFile.id,
    });

    await db.file.update({
      data: {
        uploadStatus: "SUCCESS",
      },
      where: {
        id: createdFile.id,
      },
    });
  } catch (err) {
    console.log({ err });
    await db.file.update({
      data: {
        uploadStatus: "FAILED",
      },
      where: {
        id: createdFile.id,
      },
    });
  }
};

export const fileRouter = {
  freePlanUploader: f({ pdf: { maxFileSize: "4MB" } })
    .input(z.string())
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
  proPlanUploader: f({ pdf: { maxFileSize: "16MB" } })
    .input(z.optional(z.string()))
    .middleware(middleware)
    .onUploadComplete(onUploadComplete),
} satisfies FileRouter;

export type fileRouter = typeof fileRouter;
