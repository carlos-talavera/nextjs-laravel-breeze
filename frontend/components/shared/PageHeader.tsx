import SetCookies from "./SetCookies";

interface PageHeaderProps {
  title: string;
}

const PageHeader = ({
  title
}: PageHeaderProps) => {
  return (
    <>
      <SetCookies />
      <div className="flex w-full items-center justify-between py-4">
        <h1 className="h1-bold text-black_light900">{title}</h1>
      </div>
    </>
  );
};

export default PageHeader;
