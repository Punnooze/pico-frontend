export default function Page() {
  return (
    <div className="bg-primary-bg h-screen w-screen p-[20px]">
      <div className="grid grid-cols-3 gap-[20px] bg-secondary-bg rounded-[20px] p-[20px] h-full w-full">
        <div className="h-full w-full bg-primary-accent flex items-center justify-center text-white font-bold">
          Primary Accent
        </div>
        <div className="h-full w-full bg-secondary-accent flex items-center justify-center text-white font-bold">
          Secondary Accent
        </div>
        <div className="h-full w-full bg-tertiary-accent flex items-center justify-center text-black font-bold">
          Tertiary Accent
        </div>
        <div className="h-full w-full bg-primary-text flex items-center justify-center text-black font-bold">
          Primary Text
        </div>
        <div className="h-full w-full bg-secondary-text flex items-center justify-center text-white font-bold">
          Secondary Text
        </div>
        <div className="h-full w-full bg-secondary-bg  flex items-center justify-center text-primary-text font-bold">
          Secondary BG
        </div>
      </div>
    </div>
  );
}
