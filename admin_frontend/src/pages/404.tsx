import { useRouteError } from "react-router-dom";
interface ErrorType {
  statusText?: string;
  message?: string;
}
const ErrorPage = () => {
  const error = useRouteError();
  const typedError = error as ErrorType;
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-3xl font-bold text-red-500">
        Địa chỉ truy cập không tồn tại
      </h1>
      <p>
        <i className="text-4xl text-red-500">
          {typedError.statusText || typedError.message}
        </i>
      </p>
    </div>
  );
};

export default ErrorPage;
