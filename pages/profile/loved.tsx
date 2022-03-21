import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import ProductList from '@components/product-list';
import useUser from '@libs/client/useUser';

const Loved: NextPage = () => {
  const { user } = useUser();

  return (
    <Layout seoTitle="Loved" title="관심목록" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="favs" />
      </div>
    </Layout>
  );
};

export default Loved;
