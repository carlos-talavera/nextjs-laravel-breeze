import ForgotPasswordForm from "@/components/forms/auth/ForgotPasswordForm";

const Page = () => {
  return (
    <>
      <p className="paragraph-regular text-slate900_light800">
        Forgot your password? No problem. Just let us know your email address
        and we will email you a password reset link that will allow you to
        choose a new one.
      </p>
      <ForgotPasswordForm />
    </>
  );
}

export default Page