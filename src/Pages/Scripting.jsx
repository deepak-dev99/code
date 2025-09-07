import { DataTableDemo } from '@/components/DataTable';
import Modal from '@/components/Modal';
import TabsHeader from '@/components/TabHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { getUsers } from '@/lib/api';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { useForm } from 'react-hook-form';
import { Outlet } from 'react-router-dom';

function Scripting() {
    const queryClient = useQueryClient();
    const [globalFilter, setGlobalFilter] = useState("");

   const { register, handleSubmit } = useForm({
    defaultValues: {

    },
  });
    const [isModalOpen, setIsModalOpen] = useState(false);


    const {data} = useQuery({
        queryKey:["users"],
        queryFn: getUsers
    })

    let onSubmit
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
                            <div className='flex gap-2'>
                            
                                  <Button
                                  
                                            className="bg-orange-500 text-white font-bold px-8 py-2.5 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 w-full"

                                  onClick={()=> setIsModalOpen(true)}>Upload</Button>
                                 
                            </div>
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
            
<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Create New Script" // Updated title to match the image
  size="lg" // Use "lg" for a large, but not extra-large, modal size
  showCloseButton={true}
  closeOnBackdrop={true}
  closeOnEscape={true}
>
  {/* This wrapper div makes the content scrollable */}
  <div className="max-h-[70vh] overflow-y-auto p-6">
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Customer Name */}
        <div className="flex flex-col">
          <label htmlFor="customerName" className="mb-2 font-medium text-gray-700 dark:text-gray-300">
            Customer Name
          </label>
          <select
            id="customerName"
            {...register('customerName')}
            className="p-2 border rounded-md bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700"
          >
            <option value="">Select</option>
            {/* Add other options here */}
          </select>
        </div>

        {/* Market Name */}
        <div className="flex flex-col">
          <label htmlFor="marketName" className="mb-2 font-medium text-gray-700 dark:text-gray-300">
            Market Name
          </label>
          <select
            id="marketName"
            {...register('marketName')}
            className="p-2 border rounded-md bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700"
          >
            <option value="">Select</option>
            {/* Add other options here */}
          </select>
        </div>

        {/* Software Release */}
        <div className="flex flex-col">
          <label htmlFor="softwareRelease" className="mb-2 font-medium text-gray-700 dark:text-gray-300">
            Software Release
          </label>
          <select
            id="softwareRelease"
            {...register('softwareRelease')}
            className="p-2 border rounded-md bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700"
          >
            <option value="">Select</option>
            {/* Add other options here */}
          </select>
        </div>

        {/* ENM/OSS */}
        <div className="flex flex-col">
          <label htmlFor="enmOss" className="mb-2 font-medium text-gray-700 dark:text-gray-300">
            ENM/OSS
          </label>
          <select
            id="enmOss"
            {...register('enmOss')}
            className="p-2 border rounded-md bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700"
          >
            <option value="">Select</option>
            {/* Add other options here */}
          </select>
        </div>

        {/* Site ID */}
        <div className="flex flex-col">
          <label htmlFor="siteId" className="mb-2 font-medium text-gray-700 dark:text-gray-300">
            Site ID
          </label>
          <input
            id="siteId"
            type="text"
            {...register('siteId')}
            className="p-2 border rounded-md bg-white dark:bg-neutral-800 border-gray-300 dark:border-neutral-700"
          />
        </div>

        {/* CIQ File */}
        <div className="flex flex-col">
          <label htmlFor="ciqFile" className="mb-2 font-medium text-gray-700 dark:text-gray-300">
            CIQ File
          </label>
          <input
            id="ciqFile"
            type="file"
            {...register('ciqFile')}
            className="p-1.5 border rounded-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 dark:file:bg-neutral-700 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-neutral-600"
          />
        </div>
        
        {/* DCGK Files */}
        <div className="flex flex-col">
          <label htmlFor="dcgkFiles" className="mb-2 font-medium text-gray-700 dark:text-gray-300">
            DCGK Files
          </label>
          <input
            id="dcgkFiles"
            type="file"
            {...register('dcgkFiles')}
            className="p-1.5 border rounded-md text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-gray-100 dark:file:bg-neutral-700 file:text-gray-700 dark:file:text-gray-300 hover:file:bg-gray-200 dark:hover:file:bg-neutral-600"
          />
        </div>
      </div>

      {/* Submit Button */}
      <div className="pt-6 flex justify-end">
        <button
          type="submit"
          className="bg-orange-500 text-white font-bold px-8 py-2.5 rounded-md hover:bg-orange-600 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-opacity-50 w-full"
        >
          Submit
        </button>
      </div>
    </form>
  </div>
</Modal>

        </>
    )
}

export default Scripting