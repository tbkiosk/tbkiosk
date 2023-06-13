export type ResponseError = {
  error?: string
}

export type ResponseSuccess<T> = {
  data?: T
}

export type ResponseBase<T> = ResponseSuccess<T> & ResponseError
