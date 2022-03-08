import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHanler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    res.json({ ok: true });
  }
  if (req.method === "GET") {
    const { session: user, query } = req;
    console.log(user, query);
    res.json({ ok: true });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
