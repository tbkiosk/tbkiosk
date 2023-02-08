import useSWR from "swr";

import fetcher from "./fetcher";

const useUserWallet = () => {
  const { data, error, isLoading } = useSWR(`/api/wallet`, fetcher);

  return {
    data,
    isLoading,
    isError: error,
  };
};

export default useUserWallet;
