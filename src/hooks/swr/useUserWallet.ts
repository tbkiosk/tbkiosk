import useSWRImmutable from "swr/immutable";

import type { ResponseBase, ResponseSuccess } from "@/pages/api/types";
import type { Wallet } from "@/schemas/wallet";

const useUserWallet = () => {
  const { data, error, isLoading, mutate } =
    useSWRImmutable<ResponseBase<Wallet>>("/api/wallet");

  return {
    data: data?.data,
    isLoading,
    error: error || data?.message,
    mutate,
  };
};

export default useUserWallet;
