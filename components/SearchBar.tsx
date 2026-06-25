"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ query }: { query: string }) {
  const router = useRouter();

  const [search, setSearch] = useState(query);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const params = new URLSearchParams();

    if (search) {
      params.set("query", search);
    }

    // reset page
    params.set("page", "1");

    router.push(`/query-params?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="mb-8 flex gap-4">
      <input
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search..."
        className="flex-1 rounded border p-3"
      />

      <button className="rounded bg-blue-600 px-6 text-white">Search</button>
    </form>
  );
}
