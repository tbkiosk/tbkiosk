import { useEffect } from "react";
import Head from "next/head";
import { useRouter } from "next/router";
import { useSession, signIn } from "next-auth/react";
import Button from "@mui/lab/LoadingButton";

import st from "./styles.module.css";

const Index = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (session) {
      router.push("/home");
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
      <main className={st.container}>
        <h1 className={st.title}>Morphis Trans</h1>
        <Button
          loading={status === "loading"}
          onClick={() => signIn()}
          variant="contained"
        >
          Login to connect wallet
        </Button>
      </main>
    </>
  );
};

export default Index;
