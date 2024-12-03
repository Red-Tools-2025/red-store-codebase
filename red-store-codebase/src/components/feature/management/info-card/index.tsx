import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import {
  IndianRupee,
  UserRoundCheck,
  UserRoundX,
  Store as StoreIcon,
} from "lucide-react";
import { Employee, Store } from "@prisma/client";

interface InfoCardProps {
  icon: React.FC<React.SVGProps<SVGSVGElement>>;
  heading: string;
  description: string;
}

export const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  heading,
  description,
}) => {
  return (
    <Card className="flex flex-col p-1 sm:p-1 border border-gray-200 shadow-md rounded-md hover:shadow-lg transition-shadow duration-200 my-5">
      <CardHeader className="flex flex-col">
        <div className="flex items-center justify-center w-10 h-10 sm:w-10 sm:h-10 bg-slate-900 rounded-full mb-1">
          <Icon className="text-lg sm:text-lg text-white" />
        </div>
        <h3 className="text-sm sm:text-base md:text-lg text-gray-700  ">
          {heading}
        </h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm sm:text-3xl">{description}</p>
      </CardContent>
    </Card>
  );
};

interface InfoCardsProps {
  employeeData: Employee[] | null; // Adjust this type if needed
  storeData: Store[] | null; // Adjust this type if needed
}

const InfoCards: React.FC<InfoCardsProps> = ({ employeeData, storeData }) => {
  // Calculate total users, active users, inactive users, and total stores
  const totalUsers = employeeData ? employeeData.length : 0;
  const activeUsers = employeeData
    ? employeeData.filter((emp) => emp.empStatus).length
    : 0;
  const inactiveUsers = totalUsers - activeUsers;
  const totalStores = storeData ? storeData.length : 0;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      <InfoCard
        icon={IndianRupee}
        heading="Total Users"
        description={totalUsers.toString()}
      />
      <InfoCard
        icon={UserRoundCheck}
        heading="Active Users"
        description={activeUsers.toString()}
      />
      <InfoCard
        icon={UserRoundX}
        heading="Inactive Users"
        description={inactiveUsers.toString()}
      />
      <InfoCard
        icon={StoreIcon}
        heading="Stores Covered"
        description={totalStores.toString()}
      />
    </div>
  );
};

export default InfoCards;
