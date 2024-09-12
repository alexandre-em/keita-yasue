type IdParamsType = {
  params: {
    id: string;
  };
  searchParams?: Record<string | string[] | undefined>;
};

type WithClassNameComponentType = {
  className: string;
};

type FirebaseDateType = {
  seconds: number;
  nanoseconds: number;
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
