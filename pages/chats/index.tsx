import { NextPage } from "next";
import Link from "next/link";
import Layout from "@components/layout";
import { ChatRoom, User } from '@prisma/client';
import useSWR from 'swr';
import useUser from '@libs/client/useUser';


interface ChatRoomWithUsers extends ChatRoom {
  createdFor: User;
  createdBy: User;
}


interface ChatRoomsResponse {
  ok: boolean;
  chatrooms: ChatRoomWithUsers[];
}


const Chats: NextPage = () => {
  const { user } = useUser();

  const { data } = useSWR<ChatRoomsResponse>("/api/chat/chatRoom");
  return (
    <Layout title="채팅" hasTabBar>
      <div className="py-10 divide-y-[1px] ">
        {data?.chatrooms?.map((chatroom) => (
          <Link href={`/chats/${chatroom.id}`} key={chatroom.id}>
            <a className="flex px-4 cursor-pointer py-3 items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-slate-300" />
              <div>
                <p className="text-gray-700">{user?.id !== chatroom.createdById ? chatroom.createdBy.name : chatroom.createdFor.name}</p>
                <p className="text-sm  text-gray-500">
                  See you tomorrow in the corner at 2pm!
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
