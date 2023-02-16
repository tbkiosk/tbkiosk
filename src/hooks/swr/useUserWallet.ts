import { useEffect } from "react";
import useSWRImmutable from "swr/immutable";
import { toast } from "react-toastify";

import type { ResponseBase, ResponseSuccess } from "@/pages/api/types";
import type { Wallet } from "@/schemas/wallet";

const useUserWallet = () => {
  const { data, error, isLoading, mutate } =
    useSWRImmutable<ResponseBase<Wallet>>("/api/wallet");

  useEffect(() => {
    if (error) {
      toast((error as Error)?.message || "Failed to load /api/wallet");
    }
  }, [error]);

  return {
    data: data?.data,
    isLoading,
    error: error || data?.message,
    mutate,
  };
};

export default useUserWallet;
