export class ResponesContainerDto<T> {
  statusCode: number;
  message: string;
  data: T;
}

export class ErrorResponesDto {
  statusCode: number;
  message: string;
  error: string;
}
