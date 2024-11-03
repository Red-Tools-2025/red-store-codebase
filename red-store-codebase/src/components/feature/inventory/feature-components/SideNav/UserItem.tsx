"use client";

export default function UserItem() {
  return (
    <div className="flex items-center justify-start gap-2 border rounded-[8px] p-4">
      <div className="avatar rounded-full min-h-10 min-w-10 bg-black text-white font-[700] flex items-center justify-center">
        <p>GD</p>
      </div>
      <div>
       
        <p className="text-[16px] font-bold"> Akshat Sabavat </p>
        <p className="text-[12px] text-neutral-500">akshat@gmail.com</p>
      </div>
    </div>
  );
}
