"use server";

import prisma from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { writeFile } from "fs/promises";
import path from "path";

export async function uploadFile(formData: FormData) {
  try {
    const file = formData.get("file") as File;
    if (!file) return { success: false, message: "لم يتم اختيار ملف" };
    
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = `${Date.now()}-${file.name.replace(/\s+/g, "-")}`;
    const publicPath = path.join(process.cwd(), "public", "uploads", filename);
    
    await writeFile(publicPath, buffer);
    return { success: true, url: `/uploads/${filename}` };
  } catch (error: any) {
    console.error("Upload error:", error);
    return { success: false, message: "فشل رفع الصورة: " + error.message };
  }
}

export async function submitOrder(data: { phone: string; location: string; items: any[]; total: number }) {
  try {
    const order = await prisma.order.create({
      data: {
        customerPhone: data.phone,
        location: data.location,
        total: data.total,
        items: data.items,
        status: "Pending"
      }
    });
    revalidatePath("/admin");
    return { success: true, orderId: order.id };
  } catch (error: any) {
    console.error("Failed to submit order", error);
    return { success: false, message: "حدث خطأ أثناء إرسال الطلب، يرجى المحاولة لاحقاً." };
  }
}

export async function createCategory(name: string) {
  try {
    await prisma.category.create({ data: { name } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export async function deleteCategory(id: string) {
  try {
    await prisma.category.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export async function createProduct(data: { name: string, price: number, description: string, categoryId: string, imageUrl?: string, isAvailable?: boolean }) {
  try {
    await prisma.product.create({ data });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export async function deleteProduct(id: string) {
  try {
    await prisma.product.delete({ where: { id } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export async function updateCategory(id: string, name: string) {
  try {
    await prisma.category.update({ where: { id }, data: { name } });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export async function updateProduct(id: string, data: { name: string, price: number, description: string, categoryId: string, imageUrl?: string, isAvailable?: boolean }) {
  try {
    await prisma.product.update({ where: { id }, data });
    revalidatePath("/");
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export async function updateOrderStatus(id: string, status: string) {
  try {
    await prisma.order.update({ where: { id }, data: { status } });
    revalidatePath("/admin");
    return { success: true };
  } catch (e: any) { return { success: false, message: e.message }; }
}

export async function updateStoreStatus(isOpen: boolean) {
  try {
    const data: any = { isOpen };
    if (isOpen) {
      data.lastOpenedAt = new Date();
    }
    
    await prisma.settings.upsert({
      where: { id: "global" },
      update: data,
      create: { id: "global", ...data }
    });
    revalidatePath("/", "page");
    revalidatePath("/", "layout");
    revalidatePath("/admin", "page");
    return { success: true };
  } catch (e: any) { 
    console.error("Toggle store error:", e);
    return { success: false }; 
  }
}

export async function updateStoreSettings(data: { openDays: string; openTime: string; closeTime: string }) {
  try {
    await prisma.settings.upsert({
      where: { id: "global" },
      update: data,
      create: { id: "global", ...data, isOpen: true }
    });
    revalidatePath("/", "page");
    revalidatePath("/", "layout");
    revalidatePath("/admin", "page");
    return { success: true };
  } catch (e: any) {
    console.error("Update settings error:", e);
    return { success: false };
  }
}

export async function getStoreStatus() {
  try {
    const settings = await prisma.settings.findUnique({ where: { id: "global" } });
    return settings?.isOpen ?? true;
  } catch (e: any) { return true; }
}
