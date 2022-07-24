import { ShopLayout } from "../../components/layouts";
import { ProductList } from "../../components/products";
import { FullScreenLoading } from "../../components/ui";
import { useProducts } from "../../hooks";

const KidPage = () => {
  const {  isLoading, products } = useProducts(
    "/products?gender=kid"
  );
  return (
    <ShopLayout
      title={"Teslo-Shop - Niños"}
      pageDescription={"Encuentra los mejores productos para niños aquí"}
      subTitle='Niños'
      description="Productos para niños"
    >
      {isLoading ? <FullScreenLoading /> : <ProductList products={products} />}
    </ShopLayout>
  );
};

export default KidPage;
