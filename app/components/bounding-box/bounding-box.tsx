import { Block } from "@/app/types";
import { useState } from "react";
import ContentDrawer from "../content-drawer";

type BoundingBoxProps = {
  block: Block;
  pageWidth: number;
  pageHeight: number;
};

const BoundingBox = ({ block, pageWidth, pageHeight }: BoundingBoxProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const left = block.bbox.left * pageWidth;
  const top = block.bbox.top * pageHeight;
  const width = block.bbox.width * pageWidth;
  const height = block.bbox.height * pageHeight;

  return (
    <>
      {isHovered && (
        <div
          className="absolute text-xs bg-blue-500 text-white px-1 rounded-tl rounded-tr z-20 -translate-y-full"
          style={{
            left: `${left}px`,
            top: `${top}px`,
          }}
        >
          {block.type}
        </div>
      )}
      <button
        className={`absolute border-blue-500 z-10 transition-border cursor-pointer ${
          isHovered ? "border-2" : "border-1"
        }`}
        style={{
          left: `${left}px`,
          top: `${top}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => setIsDrawerOpen(true)}
      />
      <ContentDrawer
        contentType={block.type}
        content={block.content}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </>
  );
};

export default BoundingBox;
