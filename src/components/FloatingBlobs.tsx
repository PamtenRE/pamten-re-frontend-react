'use client';

export default function FloatingBlobs() {
  return (
    <div className="fixed inset-0 -z-20 overflow-hidden">
      <div className="absolute top-[-5rem] left-[-5rem] w-[30rem] h-[30rem] bg-purple-500 opacity-20 blur-[100px] animate-blob1 rounded-full" />
      <div className="absolute bottom-[-4rem] right-[-4rem] w-[25rem] h-[25rem] bg-pink-500 opacity-20 blur-[100px] animate-blob2 rounded-full" />
    </div>
  );
}
