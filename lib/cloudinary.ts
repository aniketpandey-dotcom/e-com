type CloudinaryLoaderProps = {
  src: string;
  width: number;
  quality?: number;
};

export default function cloudinaryLoader({
  src,
  width,
  quality,
}: CloudinaryLoaderProps): string {
  return `https://res.cloudinary.com/ds462ympm/image/fetch/f_auto,q_${
    quality || "auto"
  },w_${width}/${encodeURIComponent(src)}`;
}
