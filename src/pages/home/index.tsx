import { useState } from "react";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useWallet, ConnectModal } from "@suiet/wallet-kit";
import { isValidSuiAddress } from "@mysten/sui.js";

import Layout from "@/layouts";
import { SessionGuard, Loading } from "@/components";
import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";

import request from "@/utils/request";

import useUserWallet from "@/hooks/swr/useUserWallet";

import type { Wallet } from "@/schemas/wallet";

import st from "./styles.module.css";

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
              <WalletStatus wallet={data} />
            )}
          </Loading>
        </Layout>
      </SessionGuard>
    </>
  );
};

export default Home;

type WalletStatusProps = {
  wallet: Wallet | undefined;
};

const WalletStatus = ({ wallet }: WalletStatusProps) => {
  const { data: session } = useSession();
  const { connected, address } = useWallet();

  const [newAddress, setNewAddress] = useState(wallet?.address || "");
  const [addressError, setAddressError] = useState<null | string>(null);
  const [showModal, setShowModal] = useState(false);

  const onMigrateAddress = () => {
    if (connected && address) {
      setNewAddress(address);
      return;
    }

    setShowModal(true);
  };

  const onLink = async () => {
    const res = isValidSuiAddress(newAddress);
    if (!res) {
      setAddressError("Not a valid SUI address");
      return;
    }

    if (!session?.user?.email) {
      return;
    }

    const data = await request("/api/wallet", {
      method: "POST",
      body: JSON.stringify({ email: session.user.email, address: newAddress }),
    });
  };

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAddressError(null);
    setNewAddress(e.target.value);
  };

  return (
    <div>
      <ConnectModal
        open={showModal}
        onOpenChange={(open: boolean) => setShowModal(open)}
      />
      {!wallet && <h1>You have not linked your wallet to Morphis</h1>}
      <Box sx={{ marginBottom: "16px", marginTop: "16px" }}>
        <TextField
          error={!!addressError}
          fullWidth
          helperText={addressError}
          id="address-field"
          label="Address"
          onChange={onChange}
          placeholder="Your wallet address"
          value={newAddress}
          variant="standard"
        />
      </Box>
      <Box>
        <Button
          disabled={
            !newAddress ||
            !session?.user?.email ||
            newAddress === wallet?.address
          }
          onClick={onLink}
          sx={{ marginRight: "16px" }}
          variant="contained"
        >
          Link to Morphis
        </Button>
        <Button onClick={onMigrateAddress} variant="contained">
          Use connected wallet address
        </Button>
      </Box>
    </div>
  );
};
