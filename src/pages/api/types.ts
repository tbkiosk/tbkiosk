export type ResponseError = {
  message?: string;
};

export type ResponseBase<T = never> = T | ResponseError;
