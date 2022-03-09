import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHanler";
import { withApiSession } from "@libs/server/withSession";

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  if (req.method === "POST") {
    const {
      body: message,
      query: { id },
      session: { user },
    } = req;

    const newChat = await client.chat.create({
      data: {
        chatRoomId: parseInt(id.toString()),
        message,
        userId: user!.id,
      },
    });
    res.json({ ok: true });
  }
  if (req.method === "GET") {
    const {
      session: user,
      query: { id },
    } = req;

    const chats = await client.chatRoom.findUnique({
      where: {
        id: parseInt(id.toString()),
      },
      select: {
        createdBy: true,
        createdFor: true,
        chats: {
          include: {
            user: true,
          },
        },
      },
    });
    console.log(chats);
    res.json({ ok: true, chatRoomInfo: chats });
  }
}

export default withApiSession(
  withHandler({ methods: ["GET", "POST"], handler })
);
