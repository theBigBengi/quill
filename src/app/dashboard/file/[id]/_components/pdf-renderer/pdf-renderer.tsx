"use client";

import { pdfjs } from "react-pdf";

import "react-pdf/dist/Page/AnnotationLayer.css";

import { Dispatch, SetStateAction, useState } from "react";

import "react-pdf/dist/Page/AnnotationLayer.css";
import "react-pdf/dist/Page/TextLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;

export interface PDFRendererProps {
  url: string;
  children: any;
}

import { createContext } from "react";
import { ActionsBar } from "./actions-bar";
import { PDFDocument } from "./pdf-document";

type PDFRendererContextProps = {
  url: string;
  numPages: number | undefined;
  setNumPages: Dispatch<SetStateAction<number | undefined>>;
  currPage: number;
  setCurrPage: Dispatch<SetStateAction<number>>;
  scale: number;
  setScale: Dispatch<SetStateAction<number>>;
  rotation: number;
  setRotation: Dispatch<SetStateAction<number>>;
  renderedScale: number | null;
  setRenderedScale: Dispatch<SetStateAction<number | null>>;
  isLoading: boolean;
};

export const PDFRendererContext = createContext<PDFRendererContextProps>(
  {} as PDFRendererContextProps
);

function PDFRenderer({ url, children }: PDFRendererProps) {
  const [numPages, setNumPages] = useState<number>();
  const [currPage, setCurrPage] = useState(1);
  const [scale, setScale] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [renderedScale, setRenderedScale] = useState<number | null>(null);

  const isLoading = renderedScale !== scale;

  return (
    <PDFRendererContext.Provider
      value={{
        rotation,
        setRotation,
        scale,
        setScale,
        numPages,
        setNumPages,
        currPage,
        setCurrPage,
        url,
        setRenderedScale,
        isLoading,
        renderedScale,
      }}
    >
      <div className='w-full bg-white rounded-md shadow flex flex-col items-center'>
        {children}
      </div>
    </PDFRendererContext.Provider>
  );
}

export { PDFRenderer, PDFDocument, ActionsBar };
