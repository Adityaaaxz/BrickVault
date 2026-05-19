import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Clear existing data
  await prisma.product.deleteMany();
  await prisma.subscriber.deleteMany();

  // Seed 8 iconic LEGO sets
  const products = [
    {
      name: "Technic Lamborghini Sián",
      price: 449.99,
      category: "Technic",
      image: "technic",
      stock: 12,
      pieces: 3696,
      ageRange: "18+",
      rating: 4.9,
    },
    {
      name: "Star Wars Millennium Falcon",
      price: 849.99,
      category: "Star Wars",
      image: "starwars",
      stock: 5,
      pieces: 7541,
      ageRange: "16+",
      rating: 5.0,
    },
    {
      name: "City Police Station",
      price: 99.99,
      category: "City",
      image: "city",
      stock: 30,
      pieces: 668,
      ageRange: "6+",
      rating: 4.5,
    },
    {
      name: "Creator Expert Roller Coaster",
      price: 379.99,
      category: "Creator",
      image: "creator",
      stock: 8,
      pieces: 4124,
      ageRange: "16+",
      rating: 4.8,
    },
    {
      name: "Harry Potter Hogwarts Castle",
      price: 469.99,
      category: "Harry Potter",
      image: "harrypotter",
      stock: 10,
      pieces: 6020,
      ageRange: "16+",
      rating: 4.9,
    },
    {
      name: "Architecture Taj Mahal",
      price: 119.99,
      category: "Architecture",
      image: "architecture",
      stock: 20,
      pieces: 2022,
      ageRange: "16+",
      rating: 4.7,
    },
    {
      name: "Ninjago Dragon Temple",
      price: 89.99,
      category: "Ninjago",
      image: "ninjago",
      stock: 25,
      pieces: 1253,
      ageRange: "8+",
      rating: 4.6,
    },
    {
      name: "Friends Heartlake City",
      price: 159.99,
      category: "Friends",
      image: "friends",
      stock: 18,
      pieces: 1513,
      ageRange: "8+",
      rating: 4.4,
    },
  ];

  for (const product of products) {
    await prisma.product.create({ data: product });
  }

  console.log("✅ Seeded 8 LEGO products successfully!");
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
