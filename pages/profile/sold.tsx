import type { NextPage } from "next";
import Item from "@components/item";
import Layout from "@components/layout";
import ProductList from '@components/product-list';
import useUser from '@libs/client/useUser';





const Sold: NextPage = () => {

  const { user } = useUser();
  return (
    <Layout seoTitle="Sold" title="판매내역" canGoBack>
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="sales" />
      </div>
    </Layout>
  );
};

export default Sold;
