"use server";

import { revalidatePath } from "next/cache";

export async function revalidatePathOnEdge(
  path: string,
  type: "layout" | "page" | undefined,
) {
  revalidatePath(path, type);
}
