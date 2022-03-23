import type { GetStaticPaths, GetStaticProps, NextPage } from "next";
import Button from "@components/button";
import Layout from "@components/layout";
import { useRouter } from 'next/router';
import useSWR, { useSWRConfig } from 'swr';
import Link from 'next/link';
import { Product, User } from '@prisma/client';
import useMutation from '@libs/client/useMutation';
import { cls } from '@libs/client/utils';
import useUser from '@libs/client/useUser';
import Image from 'next/image';
import { useEffect } from 'react';
import client from "@libs/server/client";

interface ProductWithUser extends Product {
  user: User,
}

interface ItemDetailResponse {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: boolean;
}


const ItemDetail: NextPage<ItemDetailResponse> = ({ product, relatedProducts, isLiked }) => {
  const { user, isLoading } = useUser();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { data, mutate: boundMutate } = useSWR<ItemDetailResponse>(router.query.id ? `/api/products/${router.query.id}` : null)
  const [roomCreate, { data: chatRoomData }] = useMutation(`/api/chat/chatRoom`);
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);

  const onFavClick = () => {
    if (!data) return;
    boundMutate((prev: any) => prev && ({ ...prev, isLiked: !prev.isLiked }), false);
    //mutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false)
    toggleFav({});
  }

  const onTalkToClick = () => {
    const { product: { user } } = data!;
    roomCreate({ createdForUser: user });
  }

  useEffect(() => {
    if (chatRoomData) {
      const { newRoom: { id: roomId } } = chatRoomData;
      router.push(`/chats/${roomId}`);
    }
  }, [chatRoomData]);

  if (router.isFallback) {
    return (
      <Layout title="Loading for you" seoTitle="loading for you">
        <span>I Love YOug</span>
      </Layout>
    )
  }
  return (
    <Layout canGoBack seoTitle="Product Detail">
      <div className="px-4  py-4">
        <div className="mb-8">
          <div className="relative pb-80">
            <Image layout="fill" src={`https://imagedelivery.net/gVd53M-5CbHwtF6A9rt30w/${product.image}/public`} className="h-96 bg-slate-300 object-cover" />
          </div>
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            <Image width={48} height={48} src={`https://imagedelivery.net/gVd53M-5CbHwtF6A9rt30w/${product.user?.avatar}/avatar`} className="w-12 h-12 rounded-full bg-slate-300" />
            <div>
              <p className="text-sm font-medium text-gray-700">{product?.user?.name}</p>
              <Link href={`/users/profiles/${product?.user?.id}`}>
                <a className="text-xs font-medium text-gray-500">
                  View profile &rarr;
                </a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">{product?.name}</h1>
            <span className="text-2xl block mt-3 text-gray-900">${product?.price}</span>
            <p className=" my-6 text-gray-700">
              {product?.description}
            </p>
            <div className=" flex items-center justify-between space-x-2">
              <Button onClick={onTalkToClick} large text="Talk to seller" />
              <button onClick={onFavClick} className={cls("p-3 rounded-md flex items-center justify-center hover:bg-gray-100", isLiked ? "text-red-500  hover:text-red-600" : "text-gray-400  hover:text-gray-500")}>
                {isLiked ? <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                </svg> : <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {relatedProducts?.map((product) => (
              <div key={product.id}>
                <div className="h-56 w-full mb-4 bg-slate-300" />
                <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                <span className="text-sm font-medium text-gray-900">${product.price}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {

  return {
    paths: [],
    fallback: true,
  }
}
//fallback이 blocking 일 경우
// => 어떤 사람이 최초로  페이지에 들어갔는데 
// 그 페이지가 getStaticProps 와  getStaticPaths 에 fallback 이 block일 경우
// 유저는 그 페이지가 만들어질 동안 어떤 화면도 보지못한다.
// 그 후에 페이지가 html 파일로 만들어지면 그 이후부턴  바로 볼수 있음

// fallback이 true 일 경우
// blocking 과 같이 최초의 사람이 처음 페이지에 들어가게 되면
// 서버에서 html 파일을 만드는데 이 때 다른 화면을 볼 수 있게
// 해준다. 




export const getStaticProps: GetStaticProps = async (ctx) => {
  if (!ctx?.params?.id) {
    return {
      props: {}
    }
  }

  const product = await client.product.findUnique({
    where: {
      id: +ctx.params.id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });
  const terms = product?.name.split(" ").map((word) => ({
    name: {
      contains: word,
    },
  }));

  const relatedProducts = await client.product.findMany({
    where: {
      OR: terms,
      AND: {
        id: {
          not: product?.id,
        },
      },
    },
  });
  const isLiked = false;
  // Boolean(
  //   await client.fav.findFirst({
  //     where: {
  //       productId: product?.id,
  //       userId: user?.id,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   })
  // );

  await new Promise((resolve) => setTimeout(resolve, 5000));

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked,
    }
  }
}
export default ItemDetail;
