import { CircularProgress } from "@mui/material";

type LoadingProps = {
  description?: string;
};

const Loading = ({ description }: LoadingProps) => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-4">
      <CircularProgress />
      {description && <p className="text-gray-500">{description}</p>}
    </div>
  );
};
export default Loading;
