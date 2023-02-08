import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";

import walletSchema from "@/schemas/wallet";

import type { NextApiRequest, NextApiResponse } from "next";
import type { ResponseBase } from "@/pages/api/types";
import type { Wallet } from "@/schemas/wallet";

const handler = async (
  req: NextApiRequest,
  res: NextApiResponse<ResponseBase<Wallet>>
) => {
  const session = await getServerSession(req, res, authOptions);
  if (!session) {
    res.status(401);
    return;
  }

  if (!session.user?.email) {
    res.status(500).json({
      message: "Missing user email in session, try to sign out and login",
    });
    return;
  }

  const client = await clientPromise;
  const db = client.db(`${process.env.NODE_ENV}`);
  const collection = db.collection<Wallet>("wallets");

  if (req.method === "GET") {
    const wallet = await collection
      .find({ email: session.user.email as string })
      .toArray();
    if (wallet.length > 1) {
      res.status(500).json({
        message:
          "More than one wallets were found. Please contact Morphis admin.",
      });
      return;
    }

    res.status(200).json(wallet[0]);
    return;
  }

  if (req.method === "POST") {
    const { email, address } = req.body;

    if (
      !walletSchema.validate({
        email,
        address,
        external_wallet_flag: true,
      })
    ) {
      res.status(400).json({
        message: "Invalid email or address.",
      });
      return;
    }

    if (email !== session.user.email) {
      res.status(400).json({
        message: `${email} is not the email signed in.`,
      });
      return;
    }

    const wallet = await collection
      .find({ email: session.user.email as string })
      .toArray();
    if (wallet.length > 0) {
      res.status(400).json({
        message: `You have already linked wallet of which the address is ${wallet[0].address}`,
      });
      return;
    }

    const model = {
      email,
      address,
      external_wallet_flag: true,
    };

    try {
      collection.insertOne(model);
    } catch (e) {
      res.status(500).json({
        message: (e as Error).message,
      });
    }

    res.status(200).json(model);
    return;
  }
};

export default handler;
