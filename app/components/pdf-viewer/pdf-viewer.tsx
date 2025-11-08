import { PdfData, Block } from "@/app/types";
import { useMemo, useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import Loading from "../loading";
import { IconButton } from "@mui/material";
import { Add, ArrowBack, ArrowForward, Remove } from "@mui/icons-material";
import { PageCallback } from "react-pdf/dist/shared/types.js";
import BoundingBox from "../bounding-box";

type PdfViewerProps = {
  pdf: Blob;
  pdfData: PdfData;
};

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

const PdfViewer = ({ pdf, pdfData }: PdfViewerProps) => {
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [zoomScale, setZoomScale] = useState<number>(0.9);
  const [pageWidth, setPageWidth] = useState<number>(0);
  const [pageHeight, setPageHeight] = useState<number>(0);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  function onPageLoadSuccess(page: PageCallback): void {
    const viewport = page.getViewport({ scale: zoomScale });
    setPageWidth(viewport.width);
    setPageHeight(viewport.height);
  }

  const currentPageBlocks = useMemo(() => {
    const blocks: Block[] = [];
    pdfData.result.chunks.forEach((chunk) => {
      chunk.blocks.forEach((block) => {
        if (block.bbox.page === pageNumber) {
          blocks.push(block);
        }
      });
    });
    return blocks;
  }, [pageNumber, pdfData]);

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100 gap-3">
      <Document
        file={pdf}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<Loading description="Loading your document..." />}
        className="w-full h-[90%] overflow-auto flex justify-center"
      >
        <div className="relative">
          <Page
            pageNumber={pageNumber}
            scale={zoomScale}
            onLoadSuccess={onPageLoadSuccess}
          />
          {currentPageBlocks.map((block) => (
            <BoundingBox
              key={`bounding-box-${block.bbox.left}-${block.bbox.top}-${block.bbox.width}-${block.bbox.height}`}
              block={block}
              pageWidth={pageWidth}
              pageHeight={pageHeight}
            />
          ))}
        </div>
      </Document>
      {numPages && (
        <div className="flex gap-8">
          <div className="flex gap-2">
            <IconButton
              disabled={pageNumber <= 1}
              onClick={() => setPageNumber(pageNumber - 1)}
            >
              <ArrowBack />
            </IconButton>
            <IconButton
              disabled={pageNumber >= numPages}
              onClick={() => setPageNumber(pageNumber + 1)}
            >
              <ArrowForward />
            </IconButton>
          </div>
          <div className="flex gap-2">
            <IconButton
              disabled={zoomScale >= 1.5}
              onClick={() => setZoomScale(zoomScale + 0.1)}
            >
              <Add />
            </IconButton>
            <IconButton
              disabled={zoomScale <= 0.7}
              onClick={() => setZoomScale(zoomScale - 0.1)}
            >
              <Remove />
            </IconButton>
          </div>
        </div>
      )}
    </div>
  );
};
export default PdfViewer;
