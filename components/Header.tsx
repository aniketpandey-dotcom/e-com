import Image from "next/image";
import Link from "next/link";
import CartIndicator from "./CartIndicator";
import ProductSearch from "./ProductSearch";

const Header = () => {
  return (
    <nav className="flex items-center fixed h-[60] inset-0 w-full px-4 justify-between p-2 py-3 bg-gray-100">
      <h2 className="font-bold text-xl">
        <Link href="/">Ecom-APP</Link>
      </h2>
      <div className="flex gap-3 items-center">
        <Link href="/about">About</Link>
        <Link href="/products">Products</Link>
        <Link href="/cart" className="flex items-center gap-2">
          <Image
            src="https://img.icons8.com/sf-black-filled/1200/shopping-cart.jpg"
            alt="shopping cart"
            width={24}
            height={24}
          />
          <CartIndicator />
        </Link>
        <div>
          {" "}
          <ProductSearch></ProductSearch>
        </div>

        <Link href="/tip-calculator">Tip Calculator</Link>

        <Link href="/language-switcher">Language Switcher</Link>
        <Link href="/status">Status</Link>
        <Link href="/todos">Todos</Link>
      </div>
    </nav>
  );
};

export default Header;
