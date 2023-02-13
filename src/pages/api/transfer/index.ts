import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";
import { generateMnemonicAndKeypair } from "@/utils/bip39";

import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { generateMnemonic, getKeypairFromMnemonics } from "@/utils/bip39";
import { generateRandomString, plainTextToHash } from "@/utils/password";

import transferSchema from "@/schemas/transfer";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseBase } from "@/pages/api/types";
import type { Wallet } from "@/schemas/wallet";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseBase<Wallet | null>>
) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    return res.status(401);
  }

  if (!session.user?.email) {
    return res.status(500).json({
      message: "Missing user email in session, try to sign out and login",
    });
  }

  const client = await clientPromise;
  const db = client.db(`${process.env.NODE_ENV}`);
  const collection = db.collection<Wallet>("wallets");

  /**
   * @method POST
   * @param email string
   * @returns wallet referred to the email in db, or created wallet
   */
  if (req.method === "POST") {
    const { email } = req.body;

    if (!transferSchema.validate({ email })) {
      return res.status(400).json({
        message: "Invalid email",
      });
    }

    if (email === session.user.email) {
      return res.status(400).json({
        message: "You cannot transfer objects to yourself",
      });
    }

    const wallets = await collection.find({ email }).toArray();
    if (wallets.length > 1) {
      return res.status(500).json({
        message:
          "More than one wallets were found. Please contact Morphis admin",
      });
    }

    // if target wallet is found, directly response target wallet address
    if (wallets.length === 1) {
      return res.status(200).json({ data: wallets[0] });
    }

    // if target wallet is not found, create a new wallet
    const mnemonics = generateMnemonic();
    const address = getKeypairFromMnemonics(mnemonics)
      .getPublicKey()
      .toSuiAddress();
    const plainTextPassword = generateRandomString();

    const walletModel: Wallet = {
      email,
      address,
      external_wallet_flag: true,
      mnemonics: mnemonics,
      password: null,
      isActivated: false,
    };

    try {
      collection.insertOne(walletModel);
    } catch (e) {
      return res.status(500).json({
        message: (e as Error).message,
      });
    }

    return res.status(200).json({ data: walletModel });
  }
};

export default handler;
