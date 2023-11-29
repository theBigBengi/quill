import { MessageSquare } from "lucide-react";
import * as React from "react";

export interface ChatMessagesProps {}

export default function ChatMessages(props: ChatMessagesProps) {
  return (
    <div className='flex max-h-[calc(100vh-3.5rem-7rem)] border-zinc-200 flex-1 flex-col-reverse gap-4 p-3 overflow-y-auto scrollbar-thumb-blue scrollbar-thumb-rounded scrollbar-track-blue-lighter scrollbar-w-2 scrolling-touch'>
      <div className='flex-1 flex flex-col items-center justify-center gap-2'>
        <MessageSquare className='h-8 w-8 text-blue-500' />
        <h3 className='font-semibold text-xl'>You&apos;re all set!</h3>
        <p className='text-zinc-500 text-sm'>
          Ask your first question to get started.
        </p>
      </div>
    </div>
  );
}
