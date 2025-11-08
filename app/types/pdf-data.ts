// Some of the types here are assumed based on the response from the pdf data endpoint since there is no docs on the actual type
export type BoundingBox = {
  height: number;
  width: number;
  left: number;
  top: number;
  page: number;
};

export type Block = {
  type: string;
  bbox: BoundingBox;
  content: string;
};

type PdfData = {
  usage: {
    num_pages: number;
  };
  result: {
    type: string;
    chunks: {
      content: string | null;
      embed: string | null;
      enriched: string | null;
      enrichment_success: boolean;
      blocks: Block[];
    }[];
  };
};

export default PdfData;
