const fetcher = async (...args: Parameters<typeof fetch>): Promise<JSON> =>
  fetch(...args).then((res) => res.json());

export default fetcher;
