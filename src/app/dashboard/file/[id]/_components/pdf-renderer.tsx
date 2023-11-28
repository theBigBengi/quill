"use client";

import { useToast } from "@/components/ui/use-toast";
import {
  ChevronDown,
  ChevronUp,
  Loader2,
  RotateCw,
  Search,
} from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";
import { zodResolver } from "@hookform/resolvers/zod";
import "react-pdf/dist/Page/AnnotationLayer.css";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { z } from "zod";
import { cn } from "@/lib/utils";
import SimpleBar from "simplebar-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export interface PDFRendererProps {
  url: string;
}

export function PDFRenderer({ url }: PDFRendererProps) {
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  const PDFSchema = z.object({
    page: z.string(),
    // .refine((num) => Number(num) > 0 && Number(num) <= numPages!),
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

  const handleInputKeuDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSubmit(handlePageSubmit)();
    }
  };

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
  {
    console.log(width);
    console.log(ref);
  }
  return (
    <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
      <div className='h-14 w-full border-b border-zinc-200 flex items-center justify-between px-2'>
        <div className='flex items-center gap-1.5'>
          {width}
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
                "w-12 h-8"
                // errors.page && "focus-visible:ring-red-500"
              )}
              onKeyDown={handleInputKeuDown}
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
            onClick={() => setRotation((prev) => prev + 90)}
            aria-label='rotate 90 degrees'
            variant='ghost'
          >
            <RotateCw className='h-4 w-4' />
          </Button>

          {/* <PdfFullscreen fileUrl={url} /> */}
        </div>
      </div>

      <div className='flex-1 w-full max-h-screen'>
        <SimpleBar autoHide={false} className='max-h-[calc(100vh-10rem)]'>
          <div ref={ref}>
            <Document
              loading={
                <div className='flex justify-center'>
                  <Loader2 className='my-24 h-6 w-6 animate-spin' />
                </div>
              }
              onLoadError={() => {
                toast({
                  title: "Error loading PDF",
                  description: "Please try again later",
                  variant: "destructive",
                });
              }}
              onLoadSuccess={({ numPages }) => {
                setNumPages(numPages);
              }}
              className='max-h-full'
              file={url}
            >
              {/* {isLoading && renderedScale ? (
                <Page
                  width={width ? width : 1}
                  pageNumber={currPage}
                  scale={scale}
                  rotate={rotation}
                  key={'@' + renderedScale}
                />
              ) : null} */}
              <Page
                // className={cn(isLoading ? 'hidden' : '')}
                // width={width ? width : 1}
                pageNumber={1}
                scale={scale}
                rotate={rotation}
                key={"@" + scale}
                loading={
                  <div className='flex justify-center'>
                    <Loader2 className='my-24 h-6 w-6 animate-spin' />
                  </div>
                }
                // onRenderSuccess={() =>
                //   setRenderedScale(scale)
                // }
              />
            </Document>
          </div>
        </SimpleBar>
      </div>
    </div>
  );
}
