"use client";

import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import "react-pdf/dist/Page/AnnotationLayer.css";

import { useState } from "react";

import SimpleBar from "simplebar-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { useContext } from "react";

import { PDFRendererContext } from "./pdf-renderer";

export function PDFDocument() {
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const { currPage, setNumPages, url, scale, rotation } =
    useContext(PDFRendererContext);

  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  return (
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
              pageNumber={currPage}
              scale={scale}
              rotate={rotation}
              key={"@" + scale}
              loading={
                <div className='flex justify-center'>
                  <Loader2 className='my-24 h-6 w-6 animate-spin' />
                </div>
              }
              onRenderSuccess={() => setRenderedScale(scale)}
            />
          </Document>
        </div>
      </SimpleBar>
    </div>
  );
}
