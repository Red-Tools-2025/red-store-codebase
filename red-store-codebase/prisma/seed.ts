import { RoleType, PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const roles = [
    { roleType: RoleType.SALES },
    { roleType: RoleType.MANAGER },
    { roleType: RoleType.INVENTORY_STAFF },
    { roleType: RoleType.STORE_MANAGER },
  ];

  await prisma.role.createMany({
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
    await prisma.$disconnect();
  });
