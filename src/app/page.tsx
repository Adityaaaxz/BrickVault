import { prisma } from "@/lib/db";
import Header from "./components/Header";
import HeroSection from "./components/HeroSection";
import FeaturedProducts from "./components/FeaturedProducts";
import InteractivePlayground from "./components/InteractivePlayground";
import Benefits from "./components/Benefits";
import MarqueeSection from "./components/MarqueeSection";
import Newsletter from "./components/Newsletter";
import Footer from "./components/Footer";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  let products: any[] = [];
  try {
    products = await prisma.product.findMany({
      orderBy: { rating: "desc" },
    });

    if (products.length === 0) {
      const DUMMY_PRODUCTS = [
        { name: "Millennium Falcon", price: 159.99, category: "starwars", image: "starwars", stock: 12, pieces: 1351, ageRange: "9+", rating: 4.9 },
        { name: "Hogwarts Castle", price: 169.99, category: "harrypotter", image: "harrypotter", stock: 8, pieces: 2660, ageRange: "16+", rating: 4.8 },
        { name: "Porsche 911 GT3 RS", price: 299.99, category: "technic", image: "technic", stock: 5, pieces: 2704, ageRange: "16+", rating: 5.0 },
        { name: "Statue of Liberty", price: 119.99, category: "architecture", image: "architecture", stock: 15, pieces: 1685, ageRange: "16+", rating: 4.7 },
        { name: "Ninjago City Gardens", price: 299.99, category: "ninjago", image: "ninjago", stock: 3, pieces: 5685, ageRange: "14+", rating: 4.9 },
        { name: "Police Station", price: 199.99, category: "city", image: "city", stock: 20, pieces: 2923, ageRange: "18+", rating: 4.8 },
        { name: "Central Perk", price: 59.99, category: "friends", image: "friends", stock: 25, pieces: 1070, ageRange: "16+", rating: 4.9 },
        { name: "Roller Coaster", price: 379.99, category: "creator", image: "creator", stock: 2, pieces: 4124, ageRange: "16+", rating: 4.8 },
      ];
      await prisma.product.createMany({ data: DUMMY_PRODUCTS });
      products = await prisma.product.findMany({ orderBy: { rating: "desc" } });
    } else if (products.length === 6) {
      // If they have the old 6 dummy products, add the missing 2 so the grid looks full
      const MORE_DUMMY = [
        { name: "Central Perk", price: 59.99, category: "friends", image: "friends", stock: 25, pieces: 1070, ageRange: "16+", rating: 4.9 },
        { name: "Roller Coaster", price: 379.99, category: "creator", image: "creator", stock: 2, pieces: 4124, ageRange: "16+", rating: 4.8 },
      ];
      for (const p of MORE_DUMMY) {
        const exists = await prisma.product.findFirst({ where: { name: p.name } });
        if (!exists) {
          await prisma.product.create({ data: p });
        }
      }
      products = await prisma.product.findMany({ orderBy: { rating: "desc" } });
    }
  } catch (error) {
    console.error("Database failed to open in cloud, using fallback dummy data:", error);
    products = [
      { id: 1, name: "Millennium Falcon", price: 159.99, category: "starwars", image: "starwars", imageUrl: null, stock: 12, pieces: 1351, ageRange: "9+", rating: 4.9 },
      { id: 2, name: "Hogwarts Castle", price: 169.99, category: "harrypotter", image: "harrypotter", imageUrl: null, stock: 8, pieces: 2660, ageRange: "16+", rating: 4.8 },
      { id: 3, name: "Porsche 911 GT3 RS", price: 299.99, category: "technic", image: "technic", imageUrl: null, stock: 5, pieces: 2704, ageRange: "16+", rating: 5.0 },
      { id: 4, name: "Statue of Liberty", price: 119.99, category: "architecture", image: "architecture", imageUrl: null, stock: 15, pieces: 1685, ageRange: "16+", rating: 4.7 },
      { id: 5, name: "Ninjago City Gardens", price: 299.99, category: "ninjago", image: "ninjago", imageUrl: null, stock: 3, pieces: 5685, ageRange: "14+", rating: 4.9 },
      { id: 6, name: "Police Station", price: 199.99, category: "city", image: "city", imageUrl: null, stock: 20, pieces: 2923, ageRange: "18+", rating: 4.8 },
      { id: 7, name: "Central Perk", price: 59.99, category: "friends", image: "friends", imageUrl: null, stock: 25, pieces: 1070, ageRange: "16+", rating: 4.9 },
      { id: 8, name: "Roller Coaster", price: 379.99, category: "creator", image: "creator", imageUrl: null, stock: 2, pieces: 4124, ageRange: "16+", rating: 4.8 },
    ];
  }

  return (
    <main className="flex-1">
      <Header />
      <HeroSection />
      <div className="lego-divider" />
      <FeaturedProducts products={products} />
      <MarqueeSection />
      <div className="lego-divider" />
      <InteractivePlayground />
      <div className="lego-divider" />
      <Benefits />
      <div className="lego-divider" />
      <Newsletter />
      <Footer />
    </main>
  );
}
