import clientPromise from "@/lib/mongodb";
import { getServerSession } from "next-auth/next";

import { authOptions } from "../auth/[...nextauth]";

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

  const wallet = await collection
    .find({ email: session.user.email! })
    .toArray();
  if (wallet.length > 1) {
    res.status(500).json({
      message:
        "More than one wallets were found. Please contact Morphis admin.",
    });
    return;
  }

  res.status(200).json(wallet[0]);
};

export default handler;
