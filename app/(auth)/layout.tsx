export default function AuthLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-1 items-center justify-center bg-zinc-100 dark:bg-zinc-950">
      <div className="w-full max-w-md px-6">{children}</div>
    </div>
  );
}
