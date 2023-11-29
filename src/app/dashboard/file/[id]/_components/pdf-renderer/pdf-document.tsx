"use client";

import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";
import { Document, Page, pdfjs } from "react-pdf";
import { useResizeDetector } from "react-resize-detector";

import "react-pdf/dist/Page/AnnotationLayer.css";

import { ReactElement, ReactNode, cloneElement, useState } from "react";

import SimpleBar from "simplebar-react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

import { useContext } from "react";

import { PDFRendererContext } from "./pdf-renderer";
import { cn } from "@/lib/utils";

function Loading() {
  return (
    <div className='h-[calc(100vh-10rem)] flex justify-center items-center'>
      <Loader2 className='my-24 h-6 w-6 animate-spin' />
    </div>
  );
}

export function PDFDocumentContainer({
  children,
}: {
  children: ReactElement | ReactElement[];
}) {
  const { setNumPages, url } = useContext(PDFRendererContext);

  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  const handleLoadingError = () => {
    toast({
      title: "Error loading PDF",
      description: "Please try again later",
      variant: "destructive",
    });
  };

  return (
    <div className='flex-1 w-full max-h-screen'>
      <SimpleBar autoHide={false} className='h-[calc(100vh-10rem)]'>
        <div ref={ref}>
          <Document
            onLoadError={handleLoadingError}
            onLoadSuccess={({ numPages }) => {
              setNumPages(numPages);
            }}
            className='max-h-full'
            loading={<Loading />}
            file={url}
          >
            {children}
          </Document>
        </div>
      </SimpleBar>
    </div>
  );
}

export function PDFPage({ width }: { width?: number }) {
  const {
    setRenderedScale,
    renderedScale,
    currPage,
    scale,
    rotation,
    isLoading,
  } = useContext(PDFRendererContext);

  if (isLoading && renderedScale) {
    return (
      <Page
        // width={width ? width : 1}
        key={"@" + renderedScale}
        pageNumber={currPage}
        rotate={rotation}
        scale={scale}
      />
    );
  }

  return (
    <Page
      onRenderSuccess={() => setRenderedScale(scale)}
      className={cn(isLoading ? "hidden" : "")}
      // width={width ? width : 1}
      pageNumber={currPage}
      loading={<Loading />}
      rotate={rotation}
      key={"@" + scale}
      scale={scale}
    />
  );
}

export function PDFDocument() {
  const {
    setRenderedScale,
    renderedScale,
    currPage,
    setNumPages,
    url,
    scale,
    rotation,
    isLoading,
  } = useContext(PDFRendererContext);

  const { toast } = useToast();
  const { width, ref } = useResizeDetector();

  return (
    <div className='flex-1 w-full max-h-screen'>
      <SimpleBar autoHide={false} className='h-[calc(100vh-10rem)]'>
        <div ref={ref}>
          <Document
            loading={
              <div className='h-[calc(100vh-10rem)] flex justify-center items-center'>
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
            {isLoading && renderedScale ? (
              <Page
                // width={width ? width : 1}
                key={"@" + renderedScale}
                pageNumber={currPage}
                rotate={rotation}
                scale={scale}
              />
            ) : null}
            <Page
              onRenderSuccess={() => setRenderedScale(scale)}
              className={cn(isLoading ? "hidden" : "")}
              // width={width ? width : 1}
              pageNumber={currPage}
              loading={<Loading />}
              rotate={rotation}
              key={"@" + scale}
              scale={scale}
            />
          </Document>
        </div>
      </SimpleBar>
    </div>
  );
}
