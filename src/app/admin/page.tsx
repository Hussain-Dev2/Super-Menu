import prisma from "@/lib/prisma";
import { unstable_noStore as noStore } from 'next/cache';
import dynamicImport from "next/dynamic";

const AdminDashboard = dynamicImport(() => import("../../components/admin/AdminDashboard"), {
  ssr: false,
  loading: () => (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center">
       <div className="w-16 h-16 border-4 border-brand-green/20 border-t-brand-green rounded-full animate-spin"></div>
    </div>
  )
});

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  noStore();
  const [categories, orders, settings] = await Promise.all([
    prisma.category.findMany({
      include: { products: true },
      orderBy: { createdAt: "asc" }
    }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" }
    }),
    prisma.settings.findUnique({ where: { id: "global" } })
  ]);
  
  const isOpen = settings?.isOpen ?? true;
  const lastOpenedAt = settings?.lastOpenedAt?.toISOString() || new Date(0).toISOString();
  const settingsData = {
    openDays: settings?.openDays || "1,2,3,4,5,6,0",
    openTime: settings?.openTime || "14:30",
    closeTime: settings?.closeTime || "01:30"
  };

  return <AdminDashboard 
    initialCategories={categories} 
    initialOrders={orders} 
    isOpenInitial={isOpen} 
    lastOpenedAt={lastOpenedAt}
    settings={settingsData}
  />;
}
