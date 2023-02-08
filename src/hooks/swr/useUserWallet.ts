import useSWR from "swr";

const useUserWallet = () => {
  const { data, error, isLoading } = useSWR(`/api/wallet`, null, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
    refreshWhenOffline: false,
    refreshWhenHidden: false,
    refreshInterval: 0,
  });

  return {
    data,
    isLoading,
    error,
  };
};

export default useUserWallet;
