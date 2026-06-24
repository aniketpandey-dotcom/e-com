"use client";

import Image from "next/image";

type Props = {
  images: string[];
  selectedImage: string;
  onSelect: (image: string) => void;
};

export default function ProductGallery({
  images,
  selectedImage,
  onSelect,
}: Props) {
  return (
    <div className="flex gap-4">
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onSelect(image)}
          className={`
            relative
            h-48
            w-48
            overflow-hidden
            rounded-xl
            border-2
            transition-all
            duration-300
            hover:scale-105
            hover:shadow-lg
            ${
              selectedImage === image
                ? "border-blue-500 ring-4 ring-blue-100"
                : "border-gray-200"
            }
          `}
        >
          <Image
            src={image}
            alt={`Product ${index}`}
            fill
            sizes="
          (max-width:768px) 50vw,
          (max-width:1024px) 33vw,
          25vw
        "
            className="object-cover"
          />
        </button>
      ))}
    </div>
  );
}
