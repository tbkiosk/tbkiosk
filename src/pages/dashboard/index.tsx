import Head from "next/head";

import Layout from "@/layouts";
import { SessionGuard, Loading } from "@/components";

import useUserWallet from "@/hooks/swr/useUserWallet";
import useSessionGuard from "@/hooks/useSessionGuard";

const Dashboard = () => {
  useSessionGuard();

  const { data, isLoading, error } = useUserWallet();

  return (
    <>
      <Head>
        <title>Morphis Social - Dashboard</title>
        <meta name="description" content="morphis social dashboard" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout></Layout>
    </>
  );
};

export default Dashboard;
