import * as React from "react";
import { MaxWidthWrapper } from "./max-width-wrapper";
import Link from "next/link";
import { buttonVariants } from "./ui/button";
import {
  RegisterLink,
  LoginLink,
} from "@kinde-oss/kinde-auth-nextjs/components";

import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

export interface NavbarProps {}

export function Navbar(props: NavbarProps) {
  return (
    <nav className='sticky  inset-x-0 top-0 z-30 w-full border-b border-gray-200 bg-white/75 backdrop-blur-lg transition-all'>
      <MaxWidthWrapper>
        <div className='flex h-14 items-center justify-between border-b border-zinc-200'>
          <Link href='/' className='flex z-40 font-bold text-zinc-900 text-lg'>
            <span>quill.</span>
          </Link>

          <div className='hidden items-center sm:space-x-3 sm:flex md:space-x-4'>
            <>
              <Link
                href='/pricing'
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  }),
                  "font-normal"
                )}
              >
                Pricing
              </Link>
              <LoginLink
                className={cn(
                  buttonVariants({
                    variant: "ghost",
                    size: "sm",
                  }),
                  "font-normal"
                )}
              >
                Sign in
              </LoginLink>
              <RegisterLink
                className={buttonVariants({
                  size: "sm",
                })}
              >
                Get started <ArrowRight className='ml-1.5 h-5 w-5' />
              </RegisterLink>
            </>
          </div>
        </div>
      </MaxWidthWrapper>
    </nav>
  );
}
