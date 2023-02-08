import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect } from "react";

import Loading from "../loading";

type SesstionGuardProps = {
  children: React.ReactNode | React.ReactNode[];
};

const SessionGuard = ({ children }: SesstionGuardProps) => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return <Loading isLoading={status === "loading"}>{children}</Loading>;
};

export default SessionGuard;