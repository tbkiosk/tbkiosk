import Head from "next/head";

import Layout from "@/layouts";
import { SessionGuard, Loading } from "@/components";

import useUserWallet from "@/hooks/swr/useUserWallet";

const Home = () => {
  const { data, isLoading, error } = useUserWallet();

  return (
    <>
      <Head>
        <title>Morphis Trans</title>
        <meta name="description" content="morphis trans" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <SessionGuard>
        <Layout>
          <Loading isLoading={isLoading}>
            {error ? (
              <h1>Failed to load linked wallet information</h1>
            ) : (
              <h1>logged in</h1>
            )}
          </Loading>
        </Layout>
      </SessionGuard>
    </>
  );
};

export default Home;
