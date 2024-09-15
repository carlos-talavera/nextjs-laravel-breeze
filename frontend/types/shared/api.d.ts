import { SearchParams } from "./search";

export interface ApiResponseGet<T> {
  data: T;
}

export interface ApiResponseModify {
  message: string;
  data: {
    id: number;
  };
}

export interface SerializableError {
  success: boolean;
  result: any;
  error: {
    message: string;
    code?: string;
    response?: {
      status: number;
      data: any;
    };
  };
}

export interface ApiResponse<T> {
  success: boolean;
  result: T;
  error?: SerializableError["error"];
}

export interface ApiPaginationMeta {
  currentPage: number;
  from: number | null;
  lastPage: number;
  links: [
    {
      url: string | null;
      label: string;
      active: boolean;
    },
    {
      url: string | null;
      label: string;
      active: boolean;
    },
    {
      url: null;
      label: string;
      active: boolean;
    },
  ];
  path: string;
  perPage: number;
  to: number | null;
  total: number;
}

export interface ApiResponsePaginated<T> {
  data: T;
  links: {
    first: string;
    last: string;
    prev: string | null;
    next: string | null;
  };
  meta: ApiPaginationMeta;
}

export interface Query {
  page: string;
}

export interface GetAllDataProps {
  searchParams: SearchParams;
}