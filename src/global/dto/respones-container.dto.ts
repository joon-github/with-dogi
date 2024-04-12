export class ResponesContainerDto<T> {
  statusCode: number;
  message: string;
  data: T;
  total?: number;
  limit?: number;
  offset?: number;
}

export class ErrorResponesDto {
  statusCode: number;
  message: string;
  error: string;
}
