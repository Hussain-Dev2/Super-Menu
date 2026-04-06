import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from 'next/cache';
import dynamicImport from "next/dynamic";
import { Metadata } from 'next';

const MenuClient = dynamicImport(() => import("@/components/MenuClient"), {
  ssr: true,
  loading: () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
      <div className="w-16 h-16 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
    </div>
  )
});

export const metadata: Metadata = {
  title: 'Shawarma Nazo Land | شاورما نازو لاند - أفضل طعم في الموصل',
  description: 'اطلب أفخر أنواع الشاورما والوجبات السريعة من شاورما نازو لاند في الموصل، حي المزارع. نكهة أصيلة وتوصيل سريع.',
  keywords: 'شاورما, نازو لاند, الموصل, أكل, مطعم, شاورما دجاج, شاورما لحم, حي المزارع',
};

export const dynamic = "force-dynamic";

export default async function Home() {
  noStore();
  const [categories, settings] = await Promise.all([
    prisma.category.findMany({
      include: {
        products: true,
      },
      orderBy: {
        createdAt: "asc"
      }
    }),
    prisma.settings.findUnique({ where: { id: "global" } })
  ]);

  const settingsData = {
    isOpen: settings?.isOpen ?? true,
    openDays: settings?.openDays || "1,2,3,4,5,6,0",
    openTime: settings?.openTime || "14:30",
    closeTime: settings?.closeTime || "01:30"
  };

  return (
    <main className="min-h-screen pb-32 selection:bg-brand-green selection:text-white bg-[#050505] overflow-x-hidden">
      <MenuClient categories={categories} settings={settingsData} />
    </main>
  );
}
