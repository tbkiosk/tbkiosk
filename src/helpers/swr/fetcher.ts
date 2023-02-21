const fetcher = async <T>(
  resource: RequestInfo,
  options?: RequestInit
): Promise<T> => await fetch(resource, options).then((res) => res.json())

export default fetcher
