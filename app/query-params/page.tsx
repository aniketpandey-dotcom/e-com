import ProductGrid from "@/components/ProductGrid";
import SearchBar from "@/components/SearchBar";
import Pagination from "@/components/Pagination";

type Props = {
  searchParams: Promise<{
    query?: string;
    page?: string;
  }>;
};

export default async function ProductsPage({ searchParams }: Props) {
  const params = await searchParams;

  const query = params.query || "";
  const page = params.page || "1";

  const res = await fetch(
    `http://localhost:3000/api/products?query=${query}&page=${page}`,
    {
      cache: "no-store",
    },
  );

  const data = await res.json();

  return (
    <div className="mx-auto max-w-7xl p-8">
      <h1 className="mb-8 text-4xl font-bold">Product Search</h1>

      <SearchBar query={query} />

      <div className="mb-6 mt-6 text-gray-600">
        {query && <>Results for &quot;{query}&quot;</>}
      </div>

      <ProductGrid products={data.products} />

      <Pagination
        currentPage={Number(page)}
        totalPages={data.totalPages}
        query={query}
      />
    </div>
  );
}
