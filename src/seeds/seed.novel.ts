import { DataSource } from "typeorm"
import { Book } from "../modules/book/entity/book.entity"
import { Chapter } from "../modules/book/entity/chapter.entity"

export const seedNovels = async (dataSource: DataSource) => {
  const bookRepo = dataSource.getRepository(Book)
  const chapterRepo = dataSource.getRepository(Chapter)

  const novels = [
    {
      title: "Whispers of the Forgotten Realm",
      author: "Aerin Nightfall",
      description: "A young mage discovers an ancient power buried beneath a dying kingdom.",
      chapters: [
        {
          title: "The Awakening",
          content: "The wind howled across the ruins as Elric opened his eyes..."
        },
        {
          title: "The Hidden Sigil",
          content: "Deep beneath the castle, a glowing symbol pulsed with dark energy..."
        }
      ]
    },
    {
      title: "Cyber Tokyo: Neon Shadows",
      author: "Kai Nakamura",
      description: "In a futuristic Tokyo, a hacker uncovers a corporate conspiracy.",
      chapters: [
        {
          title: "Neon Dreams",
          content: "Rain poured over the neon-lit skyline of Tokyo..."
        },
        {
          title: "Ghost in the Machine",
          content: "The firewall cracked as Yuto breached the final layer..."
        }
      ]
    },
    {
      title: "The Last Star Voyager",
      author: "Luna Harrow",
      description: "Humanity's final hope lies beyond the dying sun.",
      chapters: [
        {
          title: "Departure",
          content: "The engines roared as Earth faded into the void..."
        },
        {
          title: "Unknown Signals",
          content: "A mysterious transmission echoed through the ship..."
        }
      ]
    },
    {
      title: "Crimson Oath",
      author: "Darius Vale",
      description: "A warrior bound by blood must choose between honor and revenge.",
      chapters: [
        {
          title: "Blood Pact",
          content: "The blade shimmered red under the moonlight..."
        },
        {
          title: "Shattered Alliance",
          content: "Trust was broken the moment the gates fell..."
        }
      ]
    },
    {
      title: "Echoes of Eternity",
      author: "Selene Frost",
      description: "A time traveler trapped between centuries seeks redemption.",
      chapters: [
        {
          title: "Fractured Time",
          content: "The clock tower struck thirteen..."
        },
        {
          title: "Paradox",
          content: "Two versions of herself stood face to face..."
        }
      ]
    }
  ]

  for (const novelData of novels) {
    const { chapters, ...bookData } = novelData

    const book = bookRepo.create(bookData)
    await bookRepo.save(book)

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapterRepo.create({
        ...chapters[i],
        chapterNumber: i + 1,
        book: book
      })
      await chapterRepo.save(chapter)
    }
  }

  console.log("✅ Seed completed successfully")
}
