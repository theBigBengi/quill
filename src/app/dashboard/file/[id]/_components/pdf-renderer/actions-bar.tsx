"use client";

import {
  ChevronDown,
  ChevronUp,
  Expand,
  Keyboard,
  Mail,
  MessageSquare,
  PlusCircle,
  RotateCw,
  Scale,
  Scaling,
  Search,
  Settings2,
  UserPlus,
} from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext, useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PDFRendererContext } from "./pdf-renderer";
import PdfFullscreen from "./full-screen";

type PageInputProps = {
  [props: string]: any;
};

function PageInput({ errors, onKeyDown, numPages, register }: PageInputProps) {
  return (
    <div className='flex items-center gap-1.5'>
      <Input
        {...register("page")}
        className={cn(
          "w-8 h-6 py-0 md:w-12 text-center",
          errors && "focus-visible:ring-red-500"
        )}
        onKeyDown={onKeyDown}
      />
      <p className='text-zinc-700 text-sm space-x-1'>
        <span>/</span>
        <span>{numPages ?? "X"}</span>
      </p>
    </div>
  );
}

export function ActionsBar() {
  const { setRotation, setCurrPage, scale, setScale, currPage, numPages, url } =
    useContext(PDFRendererContext);

  const [position, setPosition] = useState("bottom");

  const PDFSchema = z.object({
    page: z.string(),
    // .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
  });

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<z.infer<typeof PDFSchema>>({
    resolver: zodResolver(PDFSchema),
    defaultValues: {
      page: "1",
    },
  });

  const handlePageSubmit = ({ page }: z.infer<typeof PDFSchema>) => {
    setCurrPage(Number(page));
    setValue("page", String(page));
  };

  const handleNextPage = () => {
    setCurrPage((prev) => (prev + 1 > numPages! ? numPages! : prev + 1));
    setValue("page", String(currPage + 1));
  };

  const handlePreviousPage = () => {
    setCurrPage((prev) => (prev - 1 > 1 ? prev - 1 : 1));
    setValue("page", String(currPage - 1));
  };

  const handleRotation = () => {
    setRotation((prev) => prev + 90);
  };

  const handleScaling = (value: string) => {
    setScale(+value);
  };

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(handlePageSubmit)();
    }
  };

  return (
    <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
      <div className='flex items-center gap-1.5'>
        <Button
          onClick={handlePreviousPage}
          aria-label='previous page'
          disabled={currPage <= 1}
          variant='ghost'
        >
          <ChevronDown className='h-4 w-4' />
        </Button>

        <PageInput
          register={register}
          onKeyDown={handleInputKeyDown}
          errors={errors.page}
          numPages={numPages}
        />

        <Button
          disabled={numPages === undefined || currPage === numPages}
          onClick={handleNextPage}
          aria-label='next page'
          variant='ghost'
        >
          <ChevronUp className='h-4 w-4' />
        </Button>
      </div>

      <div className='space-x-2 hidden md:block'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='gap-1.5' aria-label='zoom' variant='ghost'>
              <Search className='h-4 w-4' />
              {scale * 100}%
              <ChevronDown className='h-3 w-3 opacity-50' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => handleScaling("1")}>
              100%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleScaling("1.5")}>
              150%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleScaling("2")}>
              200%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => handleScaling("2.5")}>
              250%
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          aria-label='rotate 90 degrees'
          onClick={handleRotation}
          variant='ghost'
        >
          <RotateCw className='h-4 w-4' />
        </Button>

        <PdfFullscreen fileUrl={url} />
      </div>

      {/*  
           Mobile 
      */}

      <div className='md:hidden'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='ghost'>
              <Settings2 className='h-4 w-4' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className='w-56'>
            <DropdownMenuLabel>Optamization</DropdownMenuLabel>
            <DropdownMenuSeparator />

            <DropdownMenuItem onSelect={handleRotation}>
              <RotateCw className='mr-2 h-4 w-4' />
              <span>Rotate</span>
            </DropdownMenuItem>

            <DropdownMenuSub>
              <DropdownMenuSubTrigger>
                <Scaling className='mr-2 h-4 w-4' />
                <span>Scale</span>
              </DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent>
                  <DropdownMenuRadioGroup
                    onValueChange={handleScaling}
                    value={String(scale)}
                  >
                    <DropdownMenuRadioItem value='1'>
                      100%
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='1.5'>
                      150%
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='2'>
                      200%
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value='2.5'>
                      250%
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>

            <DropdownMenuItem>
              <Expand className='mr-2 h-4 w-4' />
              <span>Expand</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
