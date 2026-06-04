import ProductDetailPage from "@/components/ProductDetailPage";

type Props = {
  params: Promise<{ id: string }>;
};
const ProductDetail = async ({ params }: Props) => {
  const { id } = await params;
  const response = await fetch(`https://dummyjson.com/products/${id}`);
  const product = await response.json();
  console.log(product);
  return <ProductDetailPage product={product} />;
};

export default ProductDetail;
