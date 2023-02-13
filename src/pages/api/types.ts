export type ResponseError = {
  message?: string;
  status?: number;
};

export type ResponseSuccess<T> = {
  data?: T;
};

export type ResponseBase<T> = ResponseSuccess<T> & ResponseError;
