export interface UrlProps {
  params: {
    [key: string]: string;
  };
  searchParams: {
    [key: string]: string | undefined;
  };
}