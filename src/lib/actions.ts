"use server";
import { serverClient } from "@/app/_trpc/serverClient";
import { revalidatePath } from "next/cache";

export async function deleteFile(id: string) {
  try {
    const { success } = await serverClient.deleteFile(id);
    console.log(success);
    revalidatePath("/dashboard");
  } catch (error) {
  } finally {
  }
}
