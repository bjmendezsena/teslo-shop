import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const MenPage = () => {
  const { isLoading, products } = useProducts("/products?gender=men");
  return (
    <ShopLayout
      title={"Teslo-Shop - Mujeres"}
      pageDescription={"Encuentra los mejores productos de hombres aquí"}
      subTitle='Hombres'
      description='Productos para ellos'
    >
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default MenPage;
