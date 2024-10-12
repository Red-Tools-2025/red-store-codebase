import dbClient from "@/lib/prisma";
import { RoleType } from "@prisma/client";

async function main() {
  const roles = [
    { roleType: RoleType.SALES },
    { roleType: RoleType.MANAGER },
    { roleType: RoleType.INVENTORY_STAFF },
    { roleType: RoleType.STORE_MANAGER },
  ];

  await dbClient.role.createMany({
    data: roles,
    skipDuplicates: true,
  });

  console.log("Seeding completed.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await dbClient.$disconnect();
  });
