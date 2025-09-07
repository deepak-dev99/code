import { DataTableDemo } from '@/components/DataTable';
import Modal from '@/components/Modal';
import TabsHeader from '@/components/TabHeader';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {  createMembership, fanclubList, getCampaign } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2 } from 'lucide-react';
import React, { useState } from 'react'
import { useForm , useFieldArray  } from 'react-hook-form';
import { Outlet } from 'react-router-dom';

export default function Campaign() {
    const [globalFilter, setGlobalFilter] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [deleteModalOpen, setDeleteModalOpen] = useState(false);
    const [editingUserId, setEditingUserId] = useState(null);
    const [activeTab, setActiveTab] = useState("votinglist")
    const queryClient = useQueryClient();

    const handleTabChange = (value) => {
        setActiveTab(value)
        setGlobalFilter("")
    }


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

    const {data:campaign} = useQuery({
      queryKey:['campaign'],
      queryFn:getCampaign
    })

    const { data: fanclub } = useQuery({
        queryKey: ['fanclub'],
        queryFn: fanclubList,
    });

    

   const { register, handleSubmit, control, watch, setError } = useForm({
    defaultValues: {
      campaignTitle: "",
      banner: "",
      section: "",
      periodFrom: "",
      periodTo: "",
      country: "",
      city: "",
      reward: 50000,
      introduce: "",
      votingItems: Array(8).fill({ checked: false, text: "" }),
      openState: "Stay",
      openPayment: "None",
    },
  });

  const { fields } = useFieldArray({
    control,
    name: "votingItems",
  });

  const onSubmit = (data) => {
    const { openState, openPayment } = data;

    if (openState === "Stay" && openPayment === "Payment") {
      // Allow
      console.log("Form submitted:", data);
    } else if (openState === "Approval" || openPayment === "None") {
      alert("Error: Cannot open with current settings.");
      setError("openState", { message: "Invalid combination" });
    }
  };

    const handleEdit = (user) => {
        reset(user)
        setEditingUserId(user._id);
        setIsModalOpen(true)
    }


    const handleFilterClick = () => {
        console.log("Filter clicked");
    };

    
     const tabs = [
    { value: "votinglist", label: "Voting List" },
    { value: "fanclublist", label: "Fanclub List" },
    { value: "snsfeed", label: "SNS Feed" },
    { value: "freeboard", label: "Free Board" },
  ];

  
const handleApprovalToggle = (id, newValue) => {
    // Update approval status
    console.log("Toggled approval for:", id, "New Value:", newValue);
    // Add API call or mutation logic here
};



    const columns = [
    {
        accessorKey: "title",
        header: "Title",
        cell: ({ row }) => row.getValue("title") || "—",
    },
    {
        accessorKey: "code",
        header: "Code",
        cell: ({ row }) => row.getValue("code") || "—",
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }) => (
            <span className="capitalize">{row.getValue("status")}</span>
        ),
    },
    {
        accessorKey: "type",
        header: "Type",
        cell: ({ row }) => row.getValue("type"),
    },
    {
        accessorKey: "section",
        header: "Section",
        cell: ({ row }) => row.getValue("section"),
    },
    // {
    //     accessorKey: "reward",
    //     header: "Reward",
    //     cell: ({ row }) => row.getValue("reward"),
    // },
    {
        accessorKey: "introduction",
        header: "Introduction",
        cell: ({ row }) => (
            <div className="truncate max-w-[250px]">
                {row.getValue("introduction")}
            </div>
        ),
    },
    // {
    //     accessorKey: "is_approved",
    //     header: "Approved",
    //     cell: ({ row }) => {
    //         const val = row.getValue("is_approved");
    //         return typeof val === "boolean" ? (val ? "✅" : "❌") : "—";
    //     },
    // },
    {
    accessorKey: "is_approved",
    header: "Approved",
    cell: ({ row }) => {
        const val = row.getValue("is_approved");
        const id = row.getValue("_id");

        return (
            <Switch
                checked={val}
                onCheckedChange={(checked) => handleApprovalToggle(id, checked)}
            />
        );
    },
},

    {
        accessorKey: "startDate",
        header: "Start Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("startDate"));
            return <div>{date.toLocaleDateString()}</div>;
        },
    },
    {
        accessorKey: "endDate",
        header: "End Date",
        cell: ({ row }) => {
            const date = new Date(row.getValue("endDate"));
            return <div>{date.toLocaleDateString()}</div>;
        },
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
        accessorKey: "banner",
        header: "Banner",
        cell: ({ row }) => (
            <img
                src={row.getValue("banner")}
                alt="Banner"
                className="w-20 h-12 object-cover rounded"
            />
        ),
    },
    {
        accessorKey: "city",
        header: "City",
        cell: ({ row }) => row.getValue("city"),
    },
    {
        accessorKey: "country",
        header: "Country",
        cell: ({ row }) => row.getValue("country"),
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


    // if (isLoading) {
    //     return (
    //         <div className="flex flex-1">
    //             <div className="p-2 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
    //                 <div className="flex items-center justify-center h-32">
    //                     <div>Loading users...</div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    // if (error) {
    //     return (
    //         <div className="flex flex-1">
    //             <div className="p-2 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
    //                 <div className="flex items-center justify-center h-32">
    //                     <div className="text-red-500">Error loading users: {error.message}</div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    return (
        <>
            <div className="flex flex-1">
                <div className="p-2 md:p-10 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
                    <Outlet />
                        <TabsHeader
        tabs={tabs}
        value={activeTab}
        onChange={setActiveTab}
      />
                    <div className="flex items-center justify-between py-4">
                    
                    
<div className='flex gap-2'>

      <Button onClick={()=> setIsModalOpen(true)}>Voting Detail</Button>
      <Button>Relation Detail</Button>
      <Button>Send Message</Button>
      <Button>Participation</Button>
      <Button>Favorite</Button>
      <Button>Update History</Button>
</div>
      {/* <Button>Favorite</Button> */}

      
      



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
                        data={campaign?.data || []}
                        globalFilter={globalFilter}
                        setGlobalFilter={setGlobalFilter}
                    />
                </div>
            </div>

<Modal
  isOpen={isModalOpen}
  onClose={() => setIsModalOpen(false)}
  title="Create Voting Campaign"
  size="xl"
  showCloseButton={true}
  closeOnBackdrop={true}
  closeOnEscape={true}
>
    <div className="max-h-[70vh] overflow-y-auto"> 

  <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-4">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="flex-1 space-y-4">
        <input
          type="text"
          {...register("campaignTitle")}
          placeholder="Campaign Title"
          className="w-full border p-2 rounded"
        />

        <input
          type="text"
          {...register("banner")}
          placeholder="Image link upload"
          className="w-full border p-2 rounded"
        />

        <select {...register("section")} className="w-full border p-2 rounded">
          <option value="">-- Select Section (MUSIC) --</option>
          <option value="rock">Rock</option>
          <option value="pop">Pop</option>
        </select>

        <div className="flex gap-2">
          <input
            type="date"
            {...register("periodFrom")}
            className="w-1/2 border p-2 rounded"
          />
          <input
            type="date"
            {...register("periodTo")}
            className="w-1/2 border p-2 rounded"
          />
        </div>

        <select {...register("country")} className="w-full border p-2 rounded">
          <option value="">-- Select Country --</option>
          <option value="korea">South Korea</option>
          <option value="usa">USA</option>
        </select>

        <select {...register("city")} className="w-full border p-2 rounded">
          <option value="">-- Select City --</option>
          <option value="seoul">Seoul</option>
          <option value="newyork">New York</option>
        </select>

        <div className="flex items-center gap-2">
          <input
            type="number"
            {...register("reward")}
            className="border p-2 w-full rounded"
          />
          <span>FDP</span>
        </div>

        <textarea
          {...register("introduce")}
          maxLength={144}
          placeholder="Introduce Campaign (144 Char)"
          className="w-full border p-2 rounded"
        />
      </div>

      {/* Right Side - Voting Options and Settings */}
      <div className="flex-1 space-y-4">
        <div className="space-y-2">
          <label className="block font-medium">Voting Select Item List</label>
          {fields.map((field, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="checkbox"
                {...register(`votingItems.${index}.checked`)}
              />
              <input
                type="text"
                {...register(`votingItems.${index}.text`)}
                placeholder={
                  index % 2 === 0
                    ? "Yes, I can make Concert !!"
                    : "No, I hate Concert !!"
                }
                className="flex-1 border p-2 rounded"
              />
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Open State</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                value="Stay"
                {...register("openState")}
                defaultChecked
              />{" "}
              Stay
            </label>
            <label>
              <input
                type="radio"
                value="Approval"
                {...register("openState")}
              />{" "}
              Approval
            </label>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block font-medium">Open Payment</label>
          <div className="flex gap-4">
            <label>
              <input
                type="radio"
                value="None"
                {...register("openPayment")}
                defaultChecked
              />{" "}
              None
            </label>
            <label>
              <input
                type="radio"
                value="Payment"
                {...register("openPayment")}
              />{" "}
              Payment
            </label>
          </div>
        </div>
      </div>
    </div>

    {/* Submit Button */}
    <div className="pt-4">
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Open Approval
      </button>
    </div>
  </form>
  </div>
</Modal>


        </>
    )
}
