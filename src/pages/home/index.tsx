import Head from "next/head";

import Layout from "@/layouts";
import { SessionGuard } from "@/components";

import st from "./styles.module.css";

const Home = () => (
  <>
    <Head>
      <title>Morphis Trans</title>
      <meta name="description" content="morphis trans" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <link rel="icon" href="/favicon.ico" />
    </Head>
    <SessionGuard>
      <Layout>
        <h1>You have not linked your wallet to Morphis</h1>
      </Layout>
    </SessionGuard>
  </>
);

export default Home;
