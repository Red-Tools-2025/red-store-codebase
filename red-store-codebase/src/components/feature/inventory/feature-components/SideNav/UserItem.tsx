"use client";

interface UserItemProps {
  name: string | undefined| null; // Optional because session might not be available
  email: string | undefined|null; // Optional for the same reason
}

export default function UserItem({ name, email }: UserItemProps) {
  // You can extract initials from the name for the avatar display
  const initials = name
    ? name
        .split(" ")
        .map((part) => part.charAt(0))
        .join("")
    : "";

  return (
    <div className="flex items-center justify-start gap-2 border rounded-[8px] p-4">
      <div className="avatar rounded-full min-h-10 min-w-10 bg-black text-white font-[700] flex items-center justify-center">
        <p>{initials || "N/A"}</p> {/* Display initials or "N/A" if no name */}
      </div>
      <div>
        <p className="text-[16px] font-bold">{name || "Guest"}</p>{" "}
        {/* Default to "Guest" if no name */}
        <p className="text-[12px] text-neutral-500">
          {email || "Not provided"}
        </p>{" "}
        {/* Default message if no email */}
      </div>
    </div>
  );
}
