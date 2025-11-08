import { Close, ContentCopy, Download } from "@mui/icons-material";
import { Drawer, IconButton } from "@mui/material";
import { useState } from "react";
import DOMPurify from "dompurify";
import Papa from "papaparse";

type ContentDrawerProps = {
  contentType: string;
  content: string;
  isOpen: boolean;
  onClose: () => void;
};

const TextDataContent = ({ content }: { content: string }) => {
  const [isCopied, setIsCopied] = useState(false);

  return (
    <div className="flex flex-col gap-4">
      <p className="text-sm text-gray-600">{content}</p>
      <button
        className="px-2 py-1 gap-1 border-1 border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-100 transition cursor-pointer flex items-center w-[180px] justify-center"
        onClick={() => {
          navigator.clipboard.writeText(content).then(() => {
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 1000);
          });
        }}
      >
        <ContentCopy sx={{ scale: 0.8 }} />
        {isCopied ? "Copied!" : "Copy to Clipboard"}
      </button>
    </div>
  );
};

const TableDataContent = ({ content }: { content: string }) => {
  const sanitizedTableHtml = DOMPurify.sanitize(content);

  const convertTableDataToCsv = () => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(sanitizedTableHtml, "text/html");
    const tables = doc.querySelectorAll("table");
    if (!tables || tables.length === 0) return;

    tables.forEach((table, index) => {
      const rows = Array.from(table.querySelectorAll("tr"));
      const data = rows.map((row) => {
        const cells = Array.from(row.querySelectorAll("th, td"));
        return cells.map((cell) => cell.textContent || "");
      });

      const csvData = Papa.unparse(data);

      // This part looks super ugly, but it's fine
      // The goal is to trigger a download of the CSV file
      // Ideally in React, we don't directly manipulate the DOM using document.createElement
      // however, here we are just creating a link tag temporarily to trigger the download
      // the tag is removed immediately after the download is triggered
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      const linkTag = document.createElement("a");
      const url = URL.createObjectURL(blob);
      linkTag.setAttribute("href", url);
      linkTag.setAttribute("download", `table-data-for-table-${index + 1}.csv`);
      linkTag.style.visibility = "hidden";
      document.body.appendChild(linkTag);
      linkTag.click();
      document.body.removeChild(linkTag);
      URL.revokeObjectURL(url);
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-2 justify-between items-center">
        <h2 className="text-lg font-bold text-gray-600">
          Parsed data from the table
        </h2>
        <button
          className="px-2 py-1 gap-1 border-1 border-gray-300 text-sm text-gray-700 rounded hover:bg-gray-100 transition cursor-pointer flex items-center w-fit justify-center"
          onClick={convertTableDataToCsv}
        >
          <Download sx={{ scale: 0.8 }} />
          Download Table Data as CSV
        </button>
      </div>
      <style>
        {`
        .parsed-table-data table { border-collapse: collapse; width: 100%; }
        .parsed-table-data td, .parsed-table-data th { border: 1px solid #ddd; padding: 8px; }
        .parsed-table-data th { background-color: #f3f4f6; }
        `}
      </style>
      <div
        className="parsed-table-data flex flex-col gap-4 overflow-auto"
        dangerouslySetInnerHTML={{ __html: sanitizedTableHtml }}
      />
    </div>
  );
};

const ContentDrawer = ({
  contentType,
  content,
  isOpen,
  onClose,
}: ContentDrawerProps) => {
  const isTableData =
    content.includes("<table") && content.includes("</table>");
  return (
    <Drawer anchor="right" open={isOpen} onClose={onClose}>
      <div className={`${isTableData ? "min-w-[480px]" : "w-[480px]"}`}>
        <div className="flex relative border-b border-gray-200 items-center">
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", borderRadius: 0 }}
          >
            <Close />
          </IconButton>
          <div className="flex flex-1 p-2 items-center justify-center">
            <p className="text-lg font-bold text-gray-700 capitalize">
              {contentType.toUpperCase()}
            </p>
          </div>
        </div>
        <div className="p-4">
          {isTableData ? (
            <TableDataContent content={content} />
          ) : (
            <TextDataContent content={content} />
          )}
        </div>
      </div>
    </Drawer>
  );
};

export default ContentDrawer;
