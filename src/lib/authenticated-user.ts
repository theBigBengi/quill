import { db } from "@/lib/db";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { redirect } from "next/navigation";

export const authenticatedUser = async () => {
  const { getUser } = getKindeServerSession();
  const user = await getUser();

  if (!user || !user.id)
    redirect("/api/auth/login?post_login_redirect_url=/dashboard");

  // const dbUser = await db.user.findUnique({
  //   where: {
  //     id: user.id,
  //   },
  // });

  return user;
};
