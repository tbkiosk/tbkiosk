import useSWRImmutable from "swr/immutable";

const useUserWallet = () => {
  const { data, error, isLoading, mutate } = useSWRImmutable(`/api/wallet`);

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};

export default useUserWallet;
