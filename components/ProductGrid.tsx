type Product = {
  id: number;
  name: string;
  price: number;
  category: string;
};

type Props = {
  products: Product[];
};

export default function ProductGrid({ products }: Props) {
  if (!products.length) {
    return (
      <div className="py-16 text-center text-gray-500">No products found.</div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {products.map((product) => (
        <div
          key={product.id}
          className="rounded-xl border bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
        >
          <div className="mb-3 inline-block rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-700">
            {product.category}
          </div>

          <h2 className="text-xl font-semibold">{product.name}</h2>

          <p className="mt-4 text-2xl font-bold text-green-600">
            ₹{product.price.toLocaleString()}
          </p>

          <button className="mt-6 w-full rounded-lg bg-blue-600 py-2 text-white transition hover:bg-blue-700">
            View Product
          </button>
        </div>
      ))}
    </div>
  );
}
