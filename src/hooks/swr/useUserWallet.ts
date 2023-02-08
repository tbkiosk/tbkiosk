import useSWRImmutable from "swr/immutable";

import type { Wallet } from "@/schemas/wallet";

const useUserWallet = () => {
  const { data, error, isLoading, mutate } =
    useSWRImmutable<Wallet>("/api/wallet");

  return {
    data,
    isLoading,
    error,
    mutate,
  };
};

export default useUserWallet;
