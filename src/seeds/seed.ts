import { AppDataSource } from "../plugins/typeorm"
import { seedNovels } from "./seed.novel"

async function runSeed() {
  try {
    await AppDataSource.initialize()
    console.log("📦 Database connected")

    await seedNovels(AppDataSource)

    await AppDataSource.destroy()
    console.log("🌱 Seeding finished")
    process.exit(0)
  } catch (error) {
    console.error("❌ Seeding error:", error)
    process.exit(1)
  }
}

runSeed()

