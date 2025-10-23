import Navbar from "@/components/Navbar";

export default function DashboardLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="flex flex-col h-full w-full">
      <Navbar />
      <div className="p-[10px] h-full w-full">{children}</div>
    </div>
  );
}
