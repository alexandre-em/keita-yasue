'use client';
import { usePathname } from 'next/navigation';
import React from 'react';

import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

type CursorPaginationProps = {
  cursor?: { after?: string; before?: string };
  limit?: string;
};

export default function CursorPagination({ cursor, limit = '1' }: CursorPaginationProps) {
  const path = usePathname();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious href={`${path}?limit=${limit}&before=${cursor?.before}`} />
        </PaginationItem>
        <PaginationItem>
          <PaginationEllipsis />
        </PaginationItem>
        <PaginationItem>
          <PaginationNext href={`${path}?limit=${limit}&after=${cursor?.after}`} />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
