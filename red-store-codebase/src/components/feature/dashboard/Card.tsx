import React from "react";

interface CardProps {
  title: string;
  description: string;
  children: React.ReactNode;
}

const CardFirst: React.FC<CardProps> = ({ title, description, children }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      {/* Header */}
      <div className="flex justify-between items-center border-b pb-4 mb-4">
        <div>
          <h2 className="text-xl font-semibold">{title}</h2>
          <p className="text-sm text-gray-500">{description}</p>
        </div>
        <a href="#" className="text-orange-500 hover:underline text-sm">
          See Details &rarr;
        </a>
      </div>
      {/* Content */}
      <div>{children}</div>
    </div>
  );
};

export default CardFirst;
