import { auth } from "@/lib/auth/server";
import { User } from "@/types";

const Page = async () => {
  const { user } = await auth() as { user: User }

  return (
    <>
      <p className="paragraph-regular text-slate900_light800">
        Hi {user.name}!
      </p>
    </>
  );
}

export default Page