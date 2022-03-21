import { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import { Chat, ChatRoom, User } from '@prisma/client';
import useSWR from 'swr';
import useUser from '@libs/client/useUser';
import Image from 'next/image';


interface ChatRoomWithUsers extends ChatRoom {
  createdFor: User;
  createdBy: User;
  chats: Chat[];
}


interface ChatRoomsResponse {
  ok: boolean;
  chatrooms: ChatRoomWithUsers[];
}


const Chats: NextPage = () => {
  const { user } = useUser();

  const { data } = useSWR<ChatRoomsResponse>("/api/chat/chatRoom");


  return (
    <Layout seoTitle="ChatRooms" title="채팅" hasTabBar>
      <div className="py-10 divide-y-[1px] ">
        {data?.chatrooms?.map((chatroom) => (
          <Link href={`/chats/${chatroom.id}`} key={chatroom.id}>
            <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-slate-300 relative" >
                {chatroom.createdById !== user?.id && chatroom.createdBy.avatar &&
                  <Image layout="fill" className="rounded-full object-fill" src={`https://imagedelivery.net/gVd53M-5CbHwtF6A9rt30w/${chatroom.createdBy.avatar}/avatar`} />
                }
                {chatroom.createdForId !== user?.id && chatroom.createdFor.avatar &&
                  <Image layout="fill" className="rounded-full object-fill" src={`https://imagedelivery.net/gVd53M-5CbHwtF6A9rt30w/${chatroom.createdFor.avatar}/avatar`} />
                }

              </div>
              <div>
                <p className="text-gray-700">{user?.id !== chatroom.createdById ? chatroom.createdBy.name : chatroom.createdFor.name}</p>
                <p className="text-sm  text-gray-500">
                  {chatroom.chats[chatroom.chats.length - 1].message}
                </p>
              </div>
            </a>
          </Link>
        ))}
      </div>
    </Layout>
  );
};

export default Chats;
