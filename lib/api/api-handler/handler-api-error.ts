import { errorTranslations } from "@/constants/error-translate";
import { StatusCodeType, toStatusCodeTypeEnum } from "@/lib/enums/status-code";
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
  errors?: string[];
}

export async function handleAPIError(error: AxiosError): Promise<string> {
  const statusCode = error.response?.status as number;
  const errorData = error.response?.data as ErrorResponse;

  const errorMessage = errorData?.message || "Có lỗi xảy ra.";

  switch (toStatusCodeTypeEnum(statusCode)) {
    case StatusCodeType.Conflict:
    case StatusCodeType.NotFound:
    case StatusCodeType.BadRequest:
    case StatusCodeType.Forbidden:
      return `Lỗi: ${errorMessage}`;
    case StatusCodeType.Unauthorized:
      return "Bạn không có quyền truy cập. Vui lòng đăng nhập lại.";
    case StatusCodeType.Exception:
      return "Máy chủ không phản hồi. Vui lòng thử lại.";
    default:
      return errorMessage;
  }
}

export function translateError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const errorData = error.response?.data;
    const errorMessage =
      errorData?.errors?.[0] || errorData?.message || "Đã xảy ra lỗi";
    return errorTranslations[errorMessage] || errorMessage;
  }
  return "Đã xảy ra lỗi không mong muốn";
}
