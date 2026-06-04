type ProductCardProps = {
  id: number;
  image: string;
  title: string;
  description: string;
  price: number;
  rating: number;
};
import Image from "next/image";
import Link from "next/link";
import Button from "./Button";
const ProductCard = ({
  id,
  image,
  title,
  description,
  price,
  rating,
}: ProductCardProps) => {
  return (
    <div className="max-w-sm overflow-hidden rounded-xl border bg-white shadow-md transition-shadow hover:shadow-lg">
      <Link href={`products/${id}`}>
        <Image
          src={image}
          alt={title}
          className="fill w-full object-contain"
          width={300}
          height={300}
        />
      </Link>

      <div className="p-4">
        <h2 className="mb-2 text-xl font-semibold">{title}</h2>

        <p className="mb-3 line-clamp-2 text-sm text-gray-600">{description}</p>

        <div className="mb-3 flex items-center gap-1">
          <span className="text-yellow-500">⭐</span>
          <span className="font-medium">{rating}</span>
          <span className="text-sm text-gray-500">/ 5</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-2xl font-bold text-green-600">${price}</span>

          <Button>Add to Cart</Button>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
