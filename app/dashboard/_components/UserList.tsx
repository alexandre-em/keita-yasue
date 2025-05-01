'use client';
import { Loader } from 'lucide-react';

import { TypographyMuted } from '@/components/typography';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';

type UserListProps = {
  data: UserType[];
  loading?: boolean;
};

export default function UserList({ data, loading }: UserListProps) {
  if (loading === true)
    return (
      <>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Credit</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Joined the</TableHead>
              <TableHead>Timezone</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="w-full flex justify-center items-center mt-5">
            <Loader className="mr-2 animate-spin text-muted-foreground" />
            <TypographyMuted>Loading users information...</TypographyMuted>
          </TableBody>
        </Table>
      </>
    );

  return (
    <div className="mt-2 rounded-sm border bg-white">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Name</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Credit</TableHead>
            <TableHead>Joined the</TableHead>
            <TableHead>Timezone</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className="**:data-[slot=table-cell]:first:w-8">
          {data?.map((userData) => {
            const createdAt = new Date(userData.createdAt);

            return (
              <TableRow key={`userData-n${userData.id}`} className="cursor-pointer">
                <TableCell className="font-medium flex flex-wrap items-center">
                  <Avatar className="mr-2 hidden sm:block">
                    <AvatarImage src={userData.image ?? undefined} />
                    <AvatarFallback>{userData.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  {userData.name}
                </TableCell>
                <TableCell>{userData.email}</TableCell>
                <TableCell>
                  <Badge variant="outline">{userData.credit}</Badge>
                </TableCell>
                <TableCell>
                  {createdAt.toLocaleString('en-us', {
                    weekday: 'short',
                    year: 'numeric',
                    month: 'short',
                    day: 'numeric',
                  })}
                </TableCell>
                <TableCell>{userData.timezone}</TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {(!data || (data && data.length === 0)) && (
        <div className="w-full h-full flex flex-col justify-center items-center my-2">
          <img src="/error.png" alt="error" className="h-[150px]" />
          <TypographyMuted>No user found</TypographyMuted>
        </div>
      )}
    </div>
  );
}
