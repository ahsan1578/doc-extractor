import { Warning } from "@mui/icons-material";

type ErrorProps = {
  icon?: React.ReactNode;
  message?: string;
};

const Error = ({ icon, message }: ErrorProps) => {
  return (
    <div className="flex flex-col w-full h-full justify-center items-center gap-6">
      {icon || <Warning color="error" sx={{ scale: 2 }} />}
      {message && <p className="text-gray-500">{message}</p>}
    </div>
  );
};
export default Error;
