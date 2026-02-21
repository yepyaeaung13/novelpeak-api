import { AppDataSource } from "../plugins/typeorm"
import { seedNovels } from "./seed.novel"

export async function runSeed() {
  try {
    await seedNovels(AppDataSource)

    console.log("🌱 Seeding finished")
  } catch (error) {
    console.error("❌ Seeding error:", error)
  }
}

