import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHanler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "GET") {
    const {
      session: { user },
    } = req;

    const myCreaterooms = await client.chatRoom.findMany({
      where: {
        createdById: user?.id,
      },
    });

    const otherCreaterooms = await client.chatRoom.findMany({
      where: {
        createdForId: user?.id,
      },
      include: {
        createdBy: true,
        createdFor: true,
      },
    });

    const chatrooms = [...myCreaterooms, ...otherCreaterooms];

    res.json({ ok: true, chatrooms });
  }
  if (req.method === "POST") {
    const {
      session: { user },
      body: { createdForUser },
    } = req;

    if (user?.id === createdForUser.id)
      res.json({ ok: false, error: "자기 자신입니다." });
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
