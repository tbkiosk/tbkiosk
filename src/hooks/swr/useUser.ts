import useSWR from "swr";

import fetcher from "./fetcher";

const useUser = () => {
  const { data, error, isLoading } = useSWR(`/api/user`, fetcher);

  return {
    user: data,
    isLoading,
    isError: error,
  };
};

export default useUser;
