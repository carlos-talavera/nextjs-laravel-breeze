import NoResults from "@/components/shared/NoResults";
import { handleErrors } from "@/components/shared/PageError";
import PageHeader from "@/components/shared/PageHeader";
import PaginationContainer from "@/components/shared/PaginationContainer";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getPaginatedData } from "@/lib/data-fetching";
import {
  GetAllDataProps,
  Query,
  SearchParams,
  SearchParamsProps,
  User
} from "@/types";
import { Metadata } from "next";
import qs from "qs";

export const metadata: Metadata = {
  title: "Users",
}

const formUsersApiQuery = (searchParams: SearchParams) => {
  const query: Query = {
    page: searchParams.page || "1",
  };

  return qs.stringify(query, {
    encodeValuesOnly: true,
  });
};

const getAllUsers = async ({ searchParams }: GetAllDataProps) => {
  const query = formUsersApiQuery(searchParams);

  return await getPaginatedData<User[]>(`/api/users?${query}`);
};

const Page = async ({ searchParams }: SearchParamsProps) => {
  const fetchResponse = await Promise.all([
    getAllUsers({
      searchParams,
    })
  ]);

  const errorElement = handleErrors(fetchResponse);
  if (errorElement) return errorElement;

  const [usersResponse] = fetchResponse;

  const { result: usersResult } = usersResponse;

  const { data: users, meta } = usersResult;

  const title = "Users";

  return (
    <>
      <PageHeader
        title={title}
      />
      {users.length > 0 ? (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <PaginationContainer meta={meta} />
        </>
      ) : (
        <NoResults />
      )}
    </>
  );
};

export default Page;
