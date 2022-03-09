import { NextPage } from "next";
import Layout from "@components/layout";
import Message from "@components/message";
import { useRouter } from 'next/router';
import { Chat, User } from '@prisma/client';
import useSWR from 'swr';
import { useForm } from 'react-hook-form';
import useMutation from '@libs/client/useMutation';
import useUser from '@libs/client/useUser';
import { useEffect } from 'react';


interface ChatWithUser extends Chat {
  user: User
}

interface ChatDetailResponse {
  ok: boolean;
  chatRoomInfo: {
    chats: ChatWithUser[];
    createdBy: User;
    createdFor: User;
  }
}

interface ChatForm {
  message: string;
}

const ChatDetail: NextPage = () => {
  const router = useRouter();
  const { user } = useUser();

  const { register, handleSubmit, reset } = useForm<ChatForm>();


  const { data, mutate } = useSWR<ChatDetailResponse>(router.query.id ? `/api/chat/${router.query.id}` : null);

  const [createChat] = useMutation(`/api/chat/${router.query.id}`);

  const onValid = ({ message }: ChatForm) => {
    mutate((prev) => ({
      ...prev,
      ok: true, chatRoomInfo: {
        ...prev!.chatRoomInfo, chats: [
          ...prev!.chatRoomInfo.chats,
          {
            user: user!, id: 12, createdAt: new Date, updatedAt: new Date, message,
            chatRoomId: parseInt(router.query.id as string), userId: (user?.id)!
          }
        ]
      }
    }), false);
    reset();
    createChat(message);
  }

  useEffect(() => {
    document.body.scrollIntoView(false);
  }, [data]);


  return (
    <Layout canGoBack title={user?.id !== data?.chatRoomInfo.createdBy.id ?
      data?.chatRoomInfo.createdBy.name : data?.chatRoomInfo.createdFor.name}>
      <div className="py-10 pb-16 px-4 space-y-4">
        {data?.chatRoomInfo.chats.map(
          chat =>
            <Message avatarUrl={chat.user.avatar ? `https://imagedelivery.net/gVd53M-5CbHwtF6A9rt30w/${chat.user.avatar}/avatar` : ""} message={chat.message} reversed={user?.id === chat.userId} />)}
        <form onSubmit={handleSubmit(onValid)} className="fixed py-2 bg-white  bottom-0 inset-x-0">
          <div className="flex relative max-w-md items-center  w-full mx-auto">
            <input
              {...register("message", { required: true })}
              type="text"
              className="shadow-sm rounded-full w-full border-gray-300 focus:ring-orange-500 focus:outline-none pr-12 focus:border-orange-500"
            />
            <div className="absolute inset-y-0 flex py-1.5 pr-1.5 right-0">
              <button className="flex focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 items-center bg-orange-500 rounded-full px-3 hover:bg-orange-600 text-sm text-white">
                &rarr;
              </button>
            </div>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default ChatDetail;
