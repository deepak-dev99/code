import { DataTableDemo } from '@/components/DataTable';
import { Button } from '@/components/ui/button';
import { enms, getUsers, uploadPdf, Urlfiles } from '@/lib/api';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Edit, Trash2, Upload, FileText, FolderSearch, X, File, CheckCircle } from 'lucide-react';
import React, { useState, useRef, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Outlet } from 'react-router-dom';

function Enm() {
    const queryClient = useQueryClient();
    const [globalFilter, setGlobalFilter] = useState("");
    const [selectedFilter, setSelectedFilter] = useState("precheck");
    const [uploadedFiles1, setUploadedFiles1] = useState([]);
    const [uploadedFiles2, setUploadedFiles2] = useState([]);
    const fileInputRef1 = useRef(null);
    const fileInputRef2 = useRef(null);
    const [error, setError] = useState(null);

    const { data } = useQuery({
        queryKey: ["files"],
        queryFn: Urlfiles
    });


      const { data:enmData } = useQuery({
             queryKey: ["enms"],
             queryFn: enms
         });


    const { mutate: uploadFileMutation, isLoading: isUploading } = useMutation({
        mutationFn: (formData) => uploadPdf(formData),
        onSuccess: (res) => {
            console.log("File uploaded successfully:", res);
            queryClient.invalidateQueries(['datatable']);
            setUploadedFiles1([]);
            setUploadedFiles2([]);
            setError(null);
        },
        onError: (error) => {
            console.error("File upload failed:", error);
            setError(error.message || "Something went wrong during file upload");
        },
    });

    const handleFileUpload = (event, fileNumber) => {
        const files = Array.from(event.target.files);
        if (files.length > 0) {
            console.log("Files selected:", files.map(f => f.name));
            if (fileNumber === 1) {
                setUploadedFiles1(prev => [...prev, ...files]);
            } else if (fileNumber === 2) {
                setUploadedFiles2(prev => [...prev, ...files]);
            }
        }
        event.target.value = '';
    };

    const handleRemoveFile = (fileIndex, fileNumber) => {
        if (fileNumber === 1) {
            setUploadedFiles1(prev => prev.filter((_, index) => index !== fileIndex));
        } else if (fileNumber === 2) {
            setUploadedFiles2(prev => prev.filter((_, index) => index !== fileIndex));
        }
    };

    const handleBrowseClick = (ref) => {
        ref.current?.click();
    };

    const handleUpload = () => {
        console.log("Upload button clicked for:", selectedFilter);
        setError(null);

        if (selectedFilter === "precheck" && uploadedFiles1.length > 0) {
            uploadedFiles1.forEach((file) => {
                const formData = new FormData();
                formData.append('file', file);
                uploadFileMutation(formData);
            });
        } else if (selectedFilter === "postcheck" && uploadedFiles1.length > 0 && uploadedFiles2.length > 0) {
            uploadedFiles1.forEach((file) => {
                const formData = new FormData();
                formData.append('file', file);
                uploadFileMutation(formData);
            });

            uploadedFiles2.forEach((file) => {
                const formData = new FormData();
                formData.append('file', file);
                uploadFileMutation(formData);
            });
        } else {
            const errorMessage = "Please select the required file(s) before uploading.";
            console.log(errorMessage);
            setError(errorMessage);
        }
    };

    const handleGenerate = () => {
        console.log("Generate Report button clicked.");
    };


    const columns = [
        {
            accessorKey: "circle",
            header: "CIRCLE",
            cell: ({ row }) => row.getValue("circle"),
        },
        {
            accessorKey: "enm",
            header: "ENM",
            cell: ({ row }) => row.getValue("enm"),
        },
        {
            accessorKey: "activity_type",
            header: "ACTIVITY TYPE",
            cell: ({ row }) => row.getValue("activity_type"),
        },
        {
            accessorKey: "username",
            header: "USERNAME",
            cell: ({ row }) => row.getValue("username"),
        },
        {
            accessorKey: "timestamp",
            header: "TIMESTAMP",
            cell: ({ row }) => row.getValue("timestamp"),
        },
        {
            accessorKey: "download_url",
            header: "DOWNLOAD",
            cell: ({ row }) => {
                const file = row.original;
                const token = useSelector((state) => state.auth.access_token);

                return (
                    <Button
                        onClick={() =>
                            downloadFile(file.download_url, token, file.circle + ".zip")
                        }
                    >
                        Download
                    </Button>
                );
            },
        },
    ];

    const downloadFile = async (url, token, filename) => {
        const response = await fetch(url, {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${token}`,
            },
        });

        if (!response.ok) {
            console.error("Download failed", await response.json());
            return;
        }

        const blob = await response.blob();
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
    };

    const FileUploadCard = ({ title, files, fileNumber, onBrowse, onRemove, className = "" }) => {
        const isEmpty = files.length === 0;

        return (
            <div className={`bg-white dark:bg-neutral-800 border-2 border-dashed border-gray-300 dark:border-neutral-600 rounded-xl p-6 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500 ${className}`}>
                <div className="text-center">
                    <div className="mb-4">
                        <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-3">
                            <FolderSearch className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{title}</h3>
                     
                    </div>

                    <Button
                        onClick={onBrowse}
                        className="bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white px-6 py-2.5 rounded-lg shadow-sm transition-all duration-200"
                    >
                        <FolderSearch className="h-4 w-4 mr-2" />
                        Browse Files
                    </Button>
                </div>

                {!isEmpty && (
                    <div className="mt-6 pt-6 border-t border-gray-200 dark:border-neutral-700">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                Selected Files ({files.length})
                            </span>
                            <CheckCircle className="h-4 w-4 text-green-500" />
                        </div>
                        <div className="space-y-2 max-h-40 overflow-y-auto">
                            {files.map((file, index) => (
                                <div key={index} className="flex items-center justify-between bg-gray-50 dark:bg-neutral-700 rounded-lg p-3 transition-colors hover:bg-gray-100 dark:hover:bg-gray-600">
                                    <div className="flex items-center space-x-3 flex-1 min-w-0">
                                        <File className="h-4 w-4 text-blue-500 flex-shrink-0" />
                                        <span className="text-sm text-gray-700 dark:text-gray-300 truncate">
                                            {file.name}
                                        </span>
                                        <span className="text-xs text-gray-400 flex-shrink-0">
                                            {(file.size / 1024).toFixed(1)} KB
                                        </span>
                                    </div>
                                    <Button
                                        onClick={() => onRemove(index, fileNumber)}
                                        size="sm"
                                        variant="ghost"
                                        className="h-7 w-7 p-0 hover:bg-red-100 dark:hover:bg-red-900/20 ml-2"
                                    >
                                        <X className="h-3 w-3 text-red-500" />
                                    </Button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        );
    };

    const isUploadDisabled = (selectedFilter === "precheck" && uploadedFiles1.length === 0) ||
        (selectedFilter === "postcheck" && (uploadedFiles1.length === 0 || uploadedFiles2.length === 0));

    const totalFiles = uploadedFiles1.length + uploadedFiles2.length;
    
    const uniqueCircles = useMemo(() => {
        if (!enmData) return [];
        const circles = enmData.map(item => item.circle);
        return [...new Set(circles)];
    }, [enmData]);

    return (
        <div className="flex flex-1">
            <div className="p-4 md:p-8 bg-gray-50 dark:bg-neutral-900 flex flex-col gap-6 flex-1 w-full h-full">
                <Outlet />

                <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-gray-200 dark:border-neutral-700 p-6">
                 
                    <div className="flex justify-center mb-6">
                        <div className="bg-gray-100 dark:bg-neutral-700 p-1.5 rounded-lg inline-flex">
                            <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="userFilter"
                                    value="precheck"
                                    checked={selectedFilter === "precheck"}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="sr-only"
                                />
                                <div className={`px-6 py-2.5 rounded-md cursor-pointer transition-all duration-200 ${selectedFilter === "precheck"
                                        ? 'bg-white dark:bg-neutral-600 shadow-sm text-blue-600 dark:text-blue-400 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}>
                                    ENM Command
                                </div>
                            </label>
                            {/* <label className="flex items-center">
                                <input
                                    type="radio"
                                    name="userFilter"
                                    value="postcheck"
                                    checked={selectedFilter === "postcheck"}
                                    onChange={(e) => setSelectedFilter(e.target.value)}
                                    className="sr-only"
                                />
                                <div className={`px-6 py-2.5 rounded-md cursor-pointer transition-all duration-200 ${selectedFilter === "postcheck"
                                        ? 'bg-white dark:bg-neutral-600 shadow-sm text-blue-600 dark:text-blue-400 font-medium'
                                        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200'
                                    }`}>
                                    Post Check
                                </div>
                            </label> */}
                        </div>
                    </div>

                    <input ref={fileInputRef1} type="file" accept=".csv,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 1)} multiple className="hidden" />
                    <input ref={fileInputRef2} type="file" accept=".csv,.xlsx,.xls" onChange={(e) => handleFileUpload(e, 2)} multiple className="hidden" />

                    <div className="grid gap-6 mb-8">
                        {selectedFilter === "precheck" && (
                            <FileUploadCard
                                title="Import Site List"
                                files={uploadedFiles1}
                                fileNumber={1}
                                onBrowse={() => handleBrowseClick(fileInputRef1)}
                                onRemove={handleRemoveFile}
                                className="max-w-2xl mx-auto"
                            />
                        )}

                        {selectedFilter === "postcheck" && (
                            <div className="grid md:grid-cols-2 gap-6">
                                <FileUploadCard
                                    title="PostCheck Log Files"
                                    files={uploadedFiles1}
                                    fileNumber={1}
                                    onBrowse={() => handleBrowseClick(fileInputRef1)}
                                    onRemove={handleRemoveFile}
                                />
                                <FileUploadCard
                                    title="PostCheck Log Files"
                                    files={uploadedFiles2}
                                    fileNumber={2}
                                    onBrowse={() => handleBrowseClick(fileInputRef2)}
                                    onRemove={handleRemoveFile}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <div className="flex items-center gap-3">
                            <Button
                                onClick={handleUpload}
                                disabled={isUploadDisabled || isUploading}
                                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white px-8 py-3 rounded-lg shadow-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isUploading ? (
                                    <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2"></div>
                                        Uploading...
                                    </>
                                ) : (
                                    <>
                                        <Upload className="h-4 w-4 mr-2" />
                                        Upload Files {totalFiles > 0 && `(${totalFiles})`}
                                    </>
                                )}
                            </Button>

                            <Button
                                onClick={handleGenerate}
                                className="bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 text-white px-8 py-3 rounded-lg shadow-sm transition-all duration-200"
                            >
                                <FileText className="h-4 w-4 mr-2" />
                                Generate Command
                            </Button>
                        </div>

                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-400 px-4 py-3 rounded-lg text-sm">
                                {error}
                            </div>
                        )}
                    </div>
                </div>

<div className="flex w-full flex-col md:flex-row justify-end gap-4">
  {/* First Select Box */}
  <div className="w-fit flex items-center gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Select Circle:
    </label>
    <select
      className="p-2 border rounded-md text-sm bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300"
    >
      <option value="">Choose Circle</option>
      {uniqueCircles.map((circle) => (
        <option key={circle} value={circle}>{circle}</option>
      ))}
    </select>
  </div>

  {/* Second Select Box */}
  <div className="w-fit flex items-center gap-2">
    <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
      Select ENM:
    </label>
    <select
      className="p-2 border rounded-md text-sm bg-white dark:bg-neutral-800 text-gray-700 dark:text-gray-300"
    >
      <option value="">Choose ENM</option>
      {enmData?.map((item) => (
        <option key={item.id} value={item.enm}>{item.enm}</option>
      ))}
    </select>
  </div>
</div>



                <DataTableDemo
                    data={data || []}
                    columns={columns}
                    globalFilter={globalFilter}
                    setGlobalFilter={setGlobalFilter}
                />
            </div>
        </div>
    );
}

export default Enm;