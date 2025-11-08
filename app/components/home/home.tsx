"use client";

import { PdfData } from "@/app/types";
import { useEffect, useState } from "react";
import { CloudOff } from "@mui/icons-material";
import dynamic from "next/dynamic";
import { default as ErrorComponent } from "../error";
import Loading from "../loading";

const PdfViewer = dynamic(() => import("../pdf-viewer"), {
  ssr: false,
});

const Home = () => {
  const [pdf, setPdf] = useState<Blob>();
  const [pdfData, setPdfData] = useState<PdfData>();
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchPdf = async () => {
      const response = await fetch(
        "https://utfs.io/f/7c8afb03-8a18-49cd-89a7-029331070e11-5pgip1.pdf"
      );
      const pdf = await response.blob();
      setPdf(pdf);
    };

    const fetchPdfData = async () => {
      const response = await fetch(
        "https://gist.githubusercontent.com/raunakdoesdev/ac6f2ee2fa4800c37ae73fbfa7d602e4/raw/06b873650604fb7db776dc41a805e99e6b6807ab/reducto-sample-doc.json"
      );
      const data = await response.json();
      setPdfData(data);
    };

    const fetchRequiredData = async () => {
      try {
        await fetchPdf();
        await fetchPdfData();
      } catch (error) {
        const errMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(`Failed to fetch PDF data: ${errMessage}`);
        setIsError(true);
      }
    };

    fetchRequiredData();
  }, []);

  if (isError) {
    return (
      <ErrorComponent
        icon={<CloudOff color="error" sx={{ scale: 2 }} />}
        message="Unfortunately we could not load your document. Please try again later."
      />
    );
  }

  if (!pdf || !pdfData) {
    return <Loading />;
  }

  return <PdfViewer pdf={pdf} pdfData={pdfData!} />;
};

export default Home;
