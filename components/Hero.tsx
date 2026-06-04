import HeroImage from "public/amazed-young-woman-shopaholic-holding-colorful-shopping-bags-look-amused-shop-buying-thi.jpg";
import Image from "next/image";
const Hero = () => {
  return (
    <div className="fixed flex items-center w-full inset-0 h-screen">
      <div className="absolute inset-0 -z-10">
        <Image
          style={{ objectFit: "cover" }}
          src={HeroImage}
          fill
          alt="hero image"
        ></Image>
      </div>
      <div className="text-6xl px-4 text-gray-700">My Ecom Site</div>
    </div>
  );
};

export default Hero;
