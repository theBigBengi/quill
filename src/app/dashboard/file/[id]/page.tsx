import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import {
  ActionsBar,
  PDFRenderer,
  PDFDocument,
} from "./_components/pdf-renderer/pdf-renderer";
import { ChatWrapper } from "./_components/chat-wrapper";

export interface PageProps {
  params: {
    id: string;
  };
}

export default async function Page({ params: { id } }: PageProps) {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id)
    redirect("/api/auth/login?post_login_redirect_url=/dashboard");

  const file = await db.file.findFirst({
    where: {
      id,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <div className='flex-1 justify-between flex flex-col h-[calc(100vh-3.5rem)]'>
      <div className='mx-auto w-full max-w-8xl grow lg:flex xl:px-2'>
        <div className='flex-1 xl:flex'>
          <div className='px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6'>
            <PDFRenderer url={file.url}>
              <ActionsBar />
              <PDFDocument />
            </PDFRenderer>
          </div>
        </div>

        <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
          <ChatWrapper fileId={file.id} />
        </div>
      </div>
    </div>
  );
}
