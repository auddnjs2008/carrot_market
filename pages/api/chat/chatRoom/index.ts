import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHanler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    // const {
    //   session: { user },
    // } = req;
    // console.log(user);
  }
  if (req.method === "POST") {
    const {
      session: { user },
      body: { createdForUser },
    } = req;

    const newRoom = await client.chatRoom.create({
      data: {
        createdBy: {
          connect: {
            id: user?.id,
          },
        },
        createdFor: {
          connect: {
            id: createdForUser.id,
          },
        },
      },
    });
    res.json({ ok: true, newRoom });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
