import useSWR from "swr";

const useUserWallet = () => {
  const { data, error, isLoading } = useSWR(`/api/wallet`);

  return {
    data,
    isLoading,
    isError: error,
  };
};

export default useUserWallet;
