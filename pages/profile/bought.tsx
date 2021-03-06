import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import ProductList from '@components/product-list';
import useUser from "@libs/client/useUser";

const Bought: NextPage = () => {
  const { user } = useUser();

  return (
    <Layout seoTitle="Bought" title="구매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="purchases" />
      </div>
    </Layout>
  );
};

export default Bought;
