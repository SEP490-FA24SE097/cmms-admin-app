export enum StatusCodeType {
    Exception = 500,
    Conflict = 409,
    BadRequest = 400,
    NotFound = 404,
    Unauthorized = 401,
    Forbidden = 403,
  }
  
  export function toStatusCodeTypeEnum(status: number): StatusCodeType {
    switch (status) {
      case 500:
        return StatusCodeType.Exception;
      case 409:
        return StatusCodeType.Conflict;
      case 400:
        return StatusCodeType.BadRequest;
      case 404:
        return StatusCodeType.NotFound;
      case 401:
        return StatusCodeType.Unauthorized;
      case 403:
        return StatusCodeType.Forbidden;
      default:
        return StatusCodeType.Exception;
    }
  }
  