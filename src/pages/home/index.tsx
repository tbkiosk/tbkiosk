import { useEffect, useState } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import Layout from "@/layouts";

import st from "./styles.module.css";

const Home = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const [anchorElUser, setAnchorElUser] = useState<null | HTMLElement>(null);

  const handleOpenUserMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
    signOut();
  };

  useEffect(() => {
    if (!session) {
      router.push("/");
    }
  }, [session, router]);

  return (
    <>
      <Head>
        <title>Morphis Trans</title>
        <meta name="description" content="morphis trans" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Layout>
        <h1>You have not linked your wallet to Morphis</h1>
      </Layout>
    </>
  );
};

export default Home;
