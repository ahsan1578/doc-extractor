import { PdfData } from "@/app/types";
import { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import Loading from "../loading";
import { IconButton } from "@mui/material";
import { Add, ArrowBack, ArrowForward, Remove } from "@mui/icons-material";

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

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center bg-gray-100 gap-3">
      <Document
        file={pdf}
        onLoadSuccess={onDocumentLoadSuccess}
        loading={<Loading description="Loading your document..." />}
        scale={zoomScale}
        className="w-full h-[90%] overflow-auto flex justify-center"
      >
        <Page pageNumber={pageNumber} />
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
