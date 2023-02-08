import type { ResponseBase } from "@/pages/api/types";

const request = async <T>(
  url: string,
  options?: RequestInit
): Promise<ResponseBase<T>> => {
  try {
    const res = await fetch(url, {
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      ...options,
    });
    if (!res.ok) {
      return {
        message: res.statusText,
      };
    }

    const data: T = await res.json();
    return data;
  } catch (e) {
    return {
      message: (e as Error).message,
    };
  }
};

export default request;
