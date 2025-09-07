import { DataTableDemo } from '@/components/DataTable';
import TabsHeader from '@/components/TabHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUsers } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { Outlet } from 'react-router-dom';

function Users() {
    const queryClient = useQueryClient();
    const [globalFilter, setGlobalFilter] = useState("");

    const {data} = useQuery({
        queryKey:["users"],
        queryFn: getUsers
    })

    let handleDelete
    let handleEdit
const columns = [
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => row.getValue("name"),
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => row.getValue("email"),
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => row.getValue("role"),
  },
     {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const user = row.original;

                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(user)}
                        >

                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(user._id)}
                        >
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        }

];


    return (
        <>
            <div className="flex flex-1">
                <div className="p-2 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                    <Outlet />

                    <div className="flex  flex-col md:flex-row md:items-center md:justify-end gap-4 py-4">


                        <div className="flex flex-col sm:flex-row flex-end gap-2 w-full md:w-auto">
                            <Input
                                placeholder="Search users..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="w-full sm:max-w-sm"
                            />
                          
                        </div>
                    </div>

                    <DataTableDemo
                        data = {[]}
                        columns={columns}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                </div>
            </div>
        </>
    )
}

export default Users