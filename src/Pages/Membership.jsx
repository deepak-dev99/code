import { ArrowUpDown, Edit, Trash2, MoreHorizontal } from "lucide-react";
import { Outlet } from "react-router-dom";
import { DataTableDemo } from "../components/DataTable";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import Modal from "@/components/Modal";
import { useForm } from 'react-hook-form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { createMembership, getMembership, updateMemberHistory, updateMembership } from "@/lib/api";
import { IconEye } from "@tabler/icons-react";
import TabsHeader from "@/components/TabHeader";

const Users = () => {
    const [globalFilter, setGlobalFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isDataModalOpen, setIsDataModalOpen] = useState(false); // New state for data display modal
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [selectedId, setSelectedId] = useState(null);
    const [activeTab, setActiveTab] = useState("membership")
    const queryClient = useQueryClient();

     const tabs = [
    { value: "membership", label: "Membership" },
   
  ];


    // const handleTabChange = (value) => {
    //     setActiveTab(value)
    //     setGlobalFilter("")
    // }

    const updateMutation = useMutation({
        mutationFn: ({ id, data }) => updateMembership(id, data),
        onSuccess: () => {
            queryClient.invalidateQueries(["membership"]);
            setIsModalOpen(false);
            setEditingUserId(null);
        },
        onError: (error) => {
            console.error('Error updating user:', error);
        },
    });

    const onSubmit = async (data) => {
        try {
            if (editingUserId) {
                const { _id, __v, createdAt, updatedAt, ...updateData } = data;
                await updateMutation.mutateAsync({ id: editingUserId, data: updateData });
            } else {
                const { _id, __v, createdAt, updatedAt, ...createData } = data;
                await createMutation.mutateAsync(createData);
                reset();
            }
        } catch (error) {
            console.error('Error saving user:', error);
            alert('Error saving user. Please try again.');
        }
    };

    const {
        data: memberHistoryData,
        refetch,
        isLoading: isHistoryLoading,
        error: historyError
    } = useQuery({
        queryKey: ['membership', selectedId],
        queryFn: updateMemberHistory,
        enabled: false,
    });

    const handleUpdate = async (user) => {
        setSelectedId(user._id);
        setIsDataModalOpen(true); 
    };

    useEffect(() => {
        if (selectedId?.length > 0) {
            refetch();
        }
    }, [selectedId])

    const handleEdit = (user) => {
        const { _id, __v, createdAt, updatedAt, ...userData } = user;
        reset(userData);
        setEditingUserId(user?._id);
        setIsModalOpen(true);
    };

    const createMutation = useMutation({
        mutationFn: (data) => createMembership(data),
        onSuccess: () => {
            queryClient.invalidateQueries(["membership"]);
            setIsModalOpen(false);
            reset();
        },
        onError: (error) => {
            console.error(error);
        },
    })

    const { data: membership } = useQuery({
        queryKey: ['membership'],
        queryFn: getMembership,
    });

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
    } = useForm({
        defaultValues: {
            name: '',
            content: '',
            state: 'active',
            write: false,
        }
    });

    const handleFilterClick = () => {
        console.log("Filter clicked");
    };


    const columns = [
        {
            accessorKey: "name",
            header: "Name",
            cell: ({ row }) => row.getValue("name"),
        },
        {
            accessorKey: "code",
            header: "Code",
            cell: ({ row }) => row.getValue("code") || "—",
        },
        {
            accessorKey: "content",
            header: "Content",
            cell: ({ row }) => row.getValue("content"),
        },
        {
            accessorKey: "state",
            header: "State",
            cell: ({ row }) => <div className="capitalize">{row.getValue("state")}</div>,
        },
        {
            accessorKey: "write",
            header: "Write",
            cell: ({ row }) => (
                <div>
                    {typeof row.getValue("write") === "boolean"
                        ? row.getValue("write") ? "✅" : "❌"
                        : row.getValue("write")}
                </div>
            ),
        },
        {
            accessorKey: "createdAt",
            header: "Created At",
            cell: ({ row }) => {
                const timestamp = parseInt(row.getValue("createdAt"));
                const date = new Date(timestamp);
                return <div>{date.toLocaleString()}</div>;
            },
        },
        {
            accessorKey: "_id",
            header: "ID",
            cell: ({ row }) => (
                <div className="truncate max-w-[200px]">{row.getValue("_id")}</div>
            ),
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => {
                const item = row.original;

                return (
                    <div className="flex gap-2">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleUpdate(item)}
                        >
                            <IconEye className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleEdit(item)}
                        >
                            <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(item._id)}
                        >
                            <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                    </div>
                );
            },
            enableSorting: false,
            enableHiding: false,
        },
    ];

    return (
        <>
            <div className="flex flex-1">
                <div className="p-2 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                    <Outlet />
                    <div className="flex items-center justify-between py-4">
                     
                        <TabsHeader
        tabs={tabs}
        value={activeTab}
        onChange={setActiveTab}
      />

                        <div className="flex gap-2">
                            <Input
                                placeholder="Search users..."
                                value={globalFilter ?? ""}
                                onChange={(event) => setGlobalFilter(event.target.value)}
                                className="max-w-sm"
                            />
                            <Button onClick={() => {
                                reset()
                                setIsModalOpen(true)
                            }
                            }>Create</Button>
                            <Button onClick={handleFilterClick}>Filter</Button>
                        </div>
                    </div>
                    <DataTableDemo
                        columns={columns || []}
                        data={membership?.data || []}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                </div>
            </div>

            {/* Create/Edit Modal */}
            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title={editingUserId ? "Edit User" : "Create User"}
                size="sm"
                showCloseButton={true}
                closeOnBackdrop={true}
                closeOnEscape={true}
            >
                <form
                    onSubmit={handleSubmit(onSubmit)}
                    className="space-y-4 p-4"
                >
                    <div>
                        <label className="block text-sm font-medium">Name</label>
                        <Input
                            {...register("name", { required: "Name is required" })}
                            placeholder="Premium Membership"
                        />
                        {errors.name && <p className="text-red-500 text-xs">{errors.name.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">Content</label>
                        <Input
                            {...register("content", { required: "Content is required" })}
                            placeholder="Access to all premium content"
                        />
                        {errors.content && <p className="text-red-500 text-xs">{errors.content.message}</p>}
                    </div>

                    <div>
                        <label className="block text-sm font-medium">State</label>
                        <select
                            {...register("state", { required: true })}
                            className="w-full border rounded p-2"
                        >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="text"
                            {...register("write")}
                            id="write"
                        />
                        <label htmlFor="write">Write Access</label>
                    </div>

                    <div className="flex justify-end">
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? "Submitting..." : "Create"}
                        </Button>
                    </div>
                </form>
            </Modal>

            {/* Data Display Modal */}
            <Modal
                isOpen={isDataModalOpen}
                onClose={() => {
                    setIsDataModalOpen(false);
                    setSelectedId(null);
                }}
                title="Member History Details"
                size="xl"
                showCloseButton={true}
                closeOnBackdrop={true}
                closeOnEscape={true}
            >
                <div className="p-4 max-h-96 overflow-y-auto no-scrollbar">
                    {isHistoryLoading ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-gray-500">Loading data...</div>
                        </div>
                    ) : historyError ? (
                        <div className="flex items-center justify-center py-8">
                            <div className="text-red-500">Error loading data: {historyError.message}</div>
                        </div>
                    ) 
                    : memberHistoryData ? (
                        <div className="space-y-1 no-scrollbar">

                            {memberHistoryData?.data.length > 0 && Array.isArray(memberHistoryData?.data) && (
                                    <div className="space-y-2  overflow-y-auto bg-gray-50 p-3 rounded">
                                        {memberHistoryData?.data.map((item, index) => (
                                            <div key={index} className="bg-white  p-3 rounded shadow-sm border">
                                                <div className="text-sm font-medium text-gray-600  mb-1">Record #{index + 1}</div>
                                                {Object.entries(item).map(([itemKey, itemValue]) => (
                                                    <div key={itemKey} className="flex justify-between text-sm py-1">
                                                        <span className="text-gray-600">{itemKey}:</span>
                                                        <span className="text-gray-900">
                                                            {typeof itemValue === 'object' 
                                                                ? JSON.stringify(itemValue) 
                                                                : String(itemValue)
                                                            }
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        ))}
                                    </div>
                            )}
                        </div>
                    ) : 
                    (
                        <div className="flex items-center  justify-center py-8">
                            <div className="text-gray-500">No data available</div>
                        </div>
                    )}
                </div>
            </Modal>
        </>
    );
};

export default Users;