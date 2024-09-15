import ResendVerificationEmailForm from "@/components/forms/auth/ResendVerificationEmailForm";

const Page = () => {
  return (
    <>
      <p
        className="paragraph-regular text-slate900_light800"
      >
        Thanks for signing up! Before getting started, could you verify your
        email address by clicking on the link we just emailed to you? If you
        didn&apos;t receive the email, we will gladly send you another.
      </p>
      <ResendVerificationEmailForm />
    </>
  );
}

export default Page