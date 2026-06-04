"use client";
const Button = ({ children }: any) => {
  return (
    <button className="rounded-lg cursor-pointer bg-blue-600 px-4 py-2 text-white transition-colors hover:bg-blue-700">
      {children}
    </button>
  );
};

export default Button;
