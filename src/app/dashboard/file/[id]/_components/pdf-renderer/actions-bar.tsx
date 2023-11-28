"use client";

import { ChevronDown, ChevronUp, RotateCw, Search } from "lucide-react";

import { zodResolver } from "@hookform/resolvers/zod";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useContext } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PDFRendererContext } from "./pdf-renderer";
import PdfFullscreen from "./full-screen";

export function ActionsBar() {
  const { setRotation, setCurrPage, scale, setScale, currPage, numPages, url } =
    useContext(PDFRendererContext);

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

  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(handlePageSubmit)();
    }
  };

  return (
    <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
      <div className='flex items-center gap-1.5'>
        <Button
          disabled={currPage <= 1 || currPage === numPages}
          aria-label='previous page'
          onClick={handleNextPage}
          variant='ghost'
        >
          <ChevronDown className='h-4 w-4' />
        </Button>

        <div className='flex items-center gap-1.5'>
          <Input
            {...register("page")}
            className={cn(
              "w-12 h-8",
              errors.page && "focus-visible:ring-red-500"
            )}
            onKeyDown={handleInputKeyDown}
          />
          <p className='text-zinc-700 text-sm space-x-1'>
            <span>/</span>
            <span>{numPages ?? "X"}</span>
          </p>
        </div>

        <Button
          disabled={numPages === undefined || currPage === numPages}
          onClick={handlePreviousPage}
          aria-label='next page'
          variant='ghost'
        >
          <ChevronUp className='h-4 w-4' />
        </Button>
      </div>

      <div className='space-x-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className='gap-1.5' aria-label='zoom' variant='ghost'>
              <Search className='h-4 w-4' />
              {scale * 100}%
              <ChevronDown className='h-3 w-3 opacity-50' />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem onSelect={() => setScale(1)}>
              100%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setScale(1.5)}>
              150%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setScale(2)}>
              200%
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => setScale(2.5)}>
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
    </div>
  );
}
