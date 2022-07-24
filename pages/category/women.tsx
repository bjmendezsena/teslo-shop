import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const WomenPage = () => {
  const { isLoading, products } = useProducts("/products?gender=women");
  return (
    <ShopLayout
      title={"Teslo-Shop - Hombres"}
      pageDescription={"Encuentra los mejores productos para mujeres"}
      subTitle='Mujeres'
      description="Productos para ellas"
    >
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default WomenPage;
