// import twilio from "twilio";
// import mail from "@sendgrid/mail"
import { NextApiRequest, NextApiResponse } from "next";
import client from "@libs/server/client";
import withHandler, { ResponseType } from "@libs/server/withHanler";

// mail.setApiKey(process.env.SENDGRID_API!);

// const twilioClient = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResponseType>
) {
  const { phone, email } = req.body;
  const user = phone ? { phone } : email ? { email } : null;
  if (!user) return res.status(400).json({ ok: false });
  const payload = Math.floor(100000 + Math.random() * 900000) + "";

  const token = await client.token.create({
    data: {
      payload,
      user: {
        connectOrCreate: {
          where: {
            ...user,
          },
          create: {
            name: "Anonymous",
            ...user,
          },
        },
      },
    },
  });
  if (phone) {
    // const message = await twilioClient.messages.create({
    //   messagingServiceSid: process.env.TWILIO_MSID,
    //   to: process.env.MY_PHONE!,
    //   body: `Your login token is ${payload}.`
    // })
    // console.log(phone);
  } else if (email) {
    // const email = await mail.send({
    //   from: "auddnjs2008@naver.com",
    //   to: "auddnjs2008@naver.com",
    //   subject: "Your Carrot Market Verification Email",
    //   text: `Your token is ${payload}`,
    //   html: `<strong> Your token is ${payload}</strong>`
    // })
    // console.log(email);
  }
  return res.json({
    ok: true,
  });
}

export default withHandler({ methods: ["POST"], handler, isPrivate: false });
