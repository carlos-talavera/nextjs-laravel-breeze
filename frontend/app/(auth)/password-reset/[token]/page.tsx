import ResetPasswordForm from "@/components/forms/auth/ResetPasswordForm";
import { UrlProps } from "@/types";

const Page = ({
  params
}: UrlProps) => {
  return (
    <>
      <p className="paragraph-regular text-slate900_light800">
        You can reset your password here.
      </p>
      <ResetPasswordForm
        token={params.token}
      />
    </>
  );
}

export default Page