import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-black text-white">

      <Image
        src="/404.png"
        alt="crashed rocket"
        width={100}
        height={100}
        className="animate-ping"
      />
    </div>
  );
}