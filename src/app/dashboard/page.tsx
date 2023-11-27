import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { serverClient } from "../_trpc/serverClient";
import { FilesList } from "./_components/files-list";
import { Suspense } from "react";
import UploadButton from "@/components/upload-button";

function Loading() {
  return <h2>🌀 Loading...</h2>;
}

export interface PageProps {}

export default async function Page(props: PageProps) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id)
    redirect("/api/auth/login?post_login_redirect_url=/dashboard");

  const dbUser = await db.user.findFirst({
    where: {
      id: user.id,
    },
  });

  if (!dbUser) redirect("/auth-callback?origin=dashboard");

  return (
    <main className='mx-auto max-w-7xl md:p-10'>
      <div className='mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 sm:flex-row sm:items-center sm:gap-0'>
        <h1 className='mb-3 font-bold text-5xl text-gray-900'>My Files</h1>

        <UploadButton />
      </div>

      <Suspense fallback={<FilesList.Skeleton />}>
        <FilesList />
      </Suspense>
    </main>
  );
}
