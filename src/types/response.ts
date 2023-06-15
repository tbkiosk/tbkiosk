export type ResponseError<T = unknown> = {
  error?: T
}

export type ResponseSuccess<T> = {
  data?: T
}

export type ResponseBase<T, R = unknown> = ResponseSuccess<T> & ResponseError<R>
