"use server";
import { serverClient } from "@/app/_trpc/serverClient";
import { revalidatePath } from "next/cache";

export async function deleteFile(id: string) {
  try {
    await serverClient.deleteFile(id);

    revalidatePath("/dashboard");
  } catch (error) {
  } finally {
  }
}
