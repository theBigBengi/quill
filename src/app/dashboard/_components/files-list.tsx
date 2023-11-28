import { Ghost } from "lucide-react";

import { serverClient } from "@/app/_trpc/serverClient";
import { Skeleton } from "@/components/ui/skeleton";
import { ListItem } from "./list-item";

export interface FilesListProps {}

export async function FilesList({}: FilesListProps) {
  const { data: files } = await serverClient.getUserFiles();

  if (!files.length)
    return (
      <div className='mt-16 flex flex-col items-center gap-2'>
        <Ghost className='h-8 w-8 text-zinc-800' />
        <h3 className='font-semibold text-xl'>Pretty empty around here</h3>
        <p>Let&apos;s upload your first PDF.</p>
      </div>
    );

  return (
    <ul className='mt-8 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3'>
      {files
        .sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )
        .map((file) => (
          <ListItem key={file.id} file={file} />
        ))}
    </ul>
  );
}

FilesList.Skeleton = function FilesListSkeleton() {
  return (
    <div className='grid gird-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4'>
      <Skeleton className='aspect-video h-full w-full p-2' />
      <Skeleton className='aspect-video h-full w-full p-2' />
      <Skeleton className='aspect-video h-full w-full p-2' />
      <Skeleton className='aspect-video h-full w-full p-2' />
      <Skeleton className='aspect-video h-full w-full p-2' />
      <Skeleton className='aspect-video h-full w-full p-2' />
      <Skeleton className='aspect-video h-full w-full p-2' />
      <Skeleton className='aspect-video h-full w-full p-2' />
    </div>
  );
};
