type IdParamsType = {
  params: Promise<{
    id: string;
  }>;
  searchParams?: Record<string | string[] | undefined>;
};
type SearchParamsType = {
  searchParams?: Record<string | string[] | undefined>;
};

type WithClassNameComponentType = {
  className: string;
};

type FirebaseDateType = {
  seconds: number;
  nanoseconds: number;
};

type PrismaPaginationOptionsType = {
  limit?: number;
  page?: number;
  cursor?: string;
  orderByQuery?: 'asc' | 'desc';
  status?: StatusType;
  role?: 'ADMIN' | 'USER';
};
type FirebasePaginationOptionsType = {
  lim?: number;
  cursor?: {
    after?: string;
    before?: string;
  };
  orderByQuery?: { value: string; order: 'asc' | 'desc' };
  status?: StatusType;
};

type SvgProps = {
  color?: string;
  width?: number;
  height?: number;
};
