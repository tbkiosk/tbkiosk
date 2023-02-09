import { useState } from "react";
import { useSession } from "next-auth/react";
import { useWallet, ConnectModal } from "@suiet/wallet-kit";
import { isValidSuiAddress } from "@mysten/sui.js";

import TextField from "@mui/material/TextField";
import Box from "@mui/material/Box";
import Button from "@mui/lab/LoadingButton";
import IconButton from "@mui/material/IconButton";
import EditIcon from "@mui/icons-material/Edit";

import request from "@/utils/request";

import st from "./styles.module.css";

import type { Wallet } from "@/schemas/wallet";

type WalletStatusProps = {
  wallet: Wallet | undefined;
};

const WalletStatus = ({ wallet }: WalletStatusProps) => {
  const { data: session } = useSession();
  const { connected, address } = useWallet();

  const [newAddress, setNewAddress] = useState(wallet?.address || "");
  const [addressError, setAddressError] = useState<null | string>(null);
  const [isEditing, setIsEditing] = useState(false);
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

  const renderAddress = () => {
    if (isEditing) {
      return (
        <>
          <Box sx={{ marginBottom: "16px", width: "420px" }}>
            <TextField
              error={!!addressError}
              fullWidth
              helperText={addressError}
              id="address-field"
              label={false}
              onChange={onChange}
              placeholder="Your wallet address"
              value={newAddress}
              variant="standard"
            />
          </Box>
          <Box sx={{ marginBottom: "16px" }}>
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
            <Button onClick={() => setIsEditing(false)} variant="outlined">
              Cancel
            </Button>
          </Box>
          <Box>
            <Button onClick={onMigrateAddress} variant="contained">
              Use connected wallet address
            </Button>
          </Box>
        </>
      );
    }

    return (
      <Box>
        <span>{wallet?.address || "Not linked"}</span>
        <IconButton color="primary" onClick={() => setIsEditing(true)}>
          <EditIcon />
        </IconButton>
      </Box>
    );
  };

  return (
    <div className={st.container}>
      <ConnectModal
        open={showModal}
        onOpenChange={(open: boolean) => setShowModal(open)}
      />
      {renderAddress()}
    </div>
  );
};

export default WalletStatus;
