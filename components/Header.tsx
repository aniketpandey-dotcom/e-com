import Link from "next/link";
import React from "react";

const Header = () => {
  return (
    <nav className="flex items-center fixed h-[60] inset-0 w-full px-4 justify-between p-2 py-3 bg-gray-100">
      <h2 className="font-bold text-xl">
        <Link href="/">Ecom-APP</Link>
      </h2>
      <div className="flex gap-3">
        <Link href="/about">About</Link>
        <Link href="/products">Products</Link>
        <a>Cart</a>
        <a>Payment</a>
      </div>
    </nav>
  );
};

export default Header;
