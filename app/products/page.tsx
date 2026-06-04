import ProductCard from "@/components/ProductCard";

const ProductPage = async () => {
  const response = await fetch("https://dummyjson.com/products");

  const data = await response.json();
  console.log(data);

  return (
    <div className="grid grid-cols-1 gap-6 p-6 md:grid-cols-2 lg:grid-cols-4">
      {data.products.map((product: any) => (
        <ProductCard
          id={product.id}
          key={product.id}
          image={product.thumbnail}
          title={product.title}
          description={product.description}
          price={product.price}
          rating={product.rating}
        />
      ))}
    </div>
  );
};

export default ProductPage;
