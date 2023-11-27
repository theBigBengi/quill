"use client";

import { Loader2, Trash } from "lucide-react";

import { trpc } from "@/app/_trpc/client";
import { Button } from "@/components/ui/button";

export default function DeleteFileButton({ id }: { id: string }) {
  const utils = trpc.useUtils();

  const { mutate, isLoading } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
  });

  function handleSubmit() {
    mutate(id);
  }

  return (
    <form action={handleSubmit}>
      <Button size='sm' className='w-full' variant='destructive'>
        {isLoading ? (
          <Loader2 className='h-4 w-4 animate-spin' />
        ) : (
          <Trash className='h-4 w-4' />
        )}
      </Button>
    </form>
  );
}
