import { db, insertUserSchema, usersTable } from "./src";
import "dotenv/config";

async function seed() {
  console.log("🌱 Starting database seed...");

  try {
    // Seed users
    // const users = await db.insert(usersTable).values([
    //   {
    //     email: 'admin@gmail.com',
    //     name: 'admin',
    //     isActive: true,
    //   },
    //   {
    //     email: 'john@gmail.com',
    //     name: 'john doe',
    //     isActive: true,
    //   },
    //   {
    //     email: 'jane@gmail.com',
    //     name: 'jane smith',
    //     isActive: true,
    //   },
    // ]).returning();
    // console.log(`✅ Created ${users.length} users`);

    // Seed posts

    console.log("🎉 Database seeded successfully!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  } finally {
  }
}

if (require.main === module) {
  seed();
}
