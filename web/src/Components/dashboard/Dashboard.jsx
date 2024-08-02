import React, {useState} from "react";
import {
    Table,
    TableHeader,
    TableColumn,
    TableBody,
    TableRow,
    TableCell,
    Input,
    Button,
    DropdownTrigger,
    Dropdown,
    DropdownMenu,
    DropdownItem,
    Chip,
    Pagination, CircularProgress, Avatar, cn, Image,
} from "@nextui-org/react";
import {VerticalDotsIcon} from "../../assets/icons/VerticalDotsIcon.jsx";
import {SearchIcon} from "../../assets/icons/SearchIcon.jsx";
import {ChevronDownIcon} from "../../assets/icons/ChevronDownIcon.jsx";
import {columns, selectAllowState, siteOptions, statusOptions} from "./data.js";
import {capitalize, convertServiceToString, exportTextFile} from "./utils.js";
import axios from "axios";
import {useNavigate} from "react-router-dom";
import {Card} from "@nextui-org/card";
import {HeartIcon} from "../../assets/icons/HeartIcon.jsx";
import {EditDocumentIcon} from "../../assets/icons/EditDocumentIcon.jsx";
import {DeleteDocumentIcon} from "../../assets/icons/DeleteDocumentIcon.jsx";
import {EyeIcon} from "../../assets/icons/EyeIcon.jsx";
import ModalEditService from "./ModalEditService.jsx";
import {useDisclosure} from "@nextui-org/modal";
import {DownloadIcon} from "../../assets/icons/DownloadIcon.jsx";
import Cookies from "js-cookie";
import ModalConfirmDelete from "./ModalConfirmDelete.jsx";
import {ServiceIcon} from "../../assets/AcmeLogo.jsx";
import {Logo} from "../../assets/icons/service.jsx";
import {CustomIcon} from "../../assets/icons/CustomIcon.jsx";
import ModalViewService from "./ModalViewService.jsx";
import {PlusIcon} from "../../assets/icons/PlusIcon.jsx";
import ModalUpload from "./ModalUpload.jsx";
import NavbarComponent from "../navbar/NavbarComponent.jsx";
import ImgServerError from "../../assets/500.svg";

const statusColorMap = {
    active: "success",
    inactive: "danger",
    pending: "warning",
};
const siteColorMap = {
    vas: "primary",
    it: "danger",

};
const avatarColorMap = {
    vas: "bg-primary-400",
    it: "bg-danger-400",

};
const INITIAL_VISIBLE_COLUMNS = ["ID","serviceId","serviceName", "projectSite", "status","updatedAt", "updatedBy","owner","actions"];


// eslint-disable-next-line react/prop-types
export default function Dashboard() {
    const [services, setServices] = React.useState(new Set([]));
    const [loading, setLoading] = React.useState(true);
    const [isAdmin, setIsAdmin] = React.useState(false);
    const [userName, setUserName] = useState("guest");
    const [isServerError, setServerError] = useState(true);

    const navigate = useNavigate();

    React.useEffect(() => {
        const API_BASE_URL = import.meta.env.DEV? import.meta.env.VITE_API_BASE_URL: '';
       axios.get(`${API_BASE_URL}/api/service`, {
            headers: {
                'Authorization': 'Bearer '+Cookies.get('jwt'),
                'Content-Type': 'application/json'
                // เพิ่ม header อื่นๆ ตามต้องการ
            }
        })
            .then(response => {
                setServices(response.data?.services? response.data.services : new Set([]))
                setUserName( response.data?.user?.username)
                //setServices(response.data.services);
                setServerError(false)
                setLoading(false);
                setIsAdmin(response.data?.isAdmin)
            })
            .catch(error => {
                setLoading(false);
                setServerError(true);
                console.error('เกิดข้อผิดพลาด:', error.message);

                if (404 === error.response?.status ){
                    setServerError(false);
                }else if (401 === error.response?.status){
                    setServerError(false);
                    navigate('/login');
                }

            });
    }, []);



    const [filterValue, setFilterValue] = React.useState("");
    const [selectedKeys, setSelectedKeys] = React.useState(new Set([]));
    const [visibleColumns, setVisibleColumns] = React.useState(new Set(INITIAL_VISIBLE_COLUMNS));
    const [statusFilter, setStatusFilter] = React.useState(["active","pending"]);
    const [siteFilter, setSiteFilter] = React.useState("all");
    const [rowsPerPage, setRowsPerPage] = React.useState(10);
    const [sortDescriptor, setSortDescriptor] = React.useState({ column: "id", direction: "ascending"});
    const [page, setPage] = React.useState(1);




    const hasSearchFilter = Boolean(filterValue);
    const headerColumns = React.useMemo(() => {
        if (visibleColumns === "all") return columns;

        return columns.filter((column) => Array.from(visibleColumns).includes(column.uid));
    }, [visibleColumns]);
    const filteredItems = React.useMemo(() => {
        let filteredServices = [...services];

        if (hasSearchFilter) {
            filteredServices = filteredServices.filter((service) =>
                service.serviceId?.toLowerCase().includes(filterValue.toLowerCase())
                    ||service.serviceName?.toLowerCase().includes(filterValue.toLowerCase())
                    ||service.owner?.toLowerCase().includes(filterValue.toLowerCase())
                ,
            );
        }
        if (statusFilter !== "all" && Array.from(statusFilter).length !== statusOptions.length) {
            filteredServices = filteredServices.filter((service) =>
                Array.from(statusFilter).includes(service.status),
            );
        }

        if (siteFilter !== "all" && Array.from(siteFilter).length !== siteOptions.length) {
            filteredServices = filteredServices.filter((service) =>
                Array.from(siteFilter).includes(service.projectSite),
            );
        }
        // เพิ่มการ sort ที่นี่
        return filteredServices.sort((a, b) => {
            const first = a[sortDescriptor.column];
            const second = b[sortDescriptor.column];
            const cmp = first < second ? -1 : first > second ? 1 : 0;

            return sortDescriptor.direction === "descending" ? -cmp : cmp;
        });
    }, [services, filterValue,siteFilter, statusFilter, sortDescriptor]);
    const pages = Math.ceil(filteredItems.length / rowsPerPage);
    const items = React.useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return filteredItems.slice(start, end);
    }, [page, filteredItems, rowsPerPage]);

    const renderCell = React.useCallback((service, columnKey) => {
        const cellValue = service[columnKey];
        const iconClasses = "text-xl text-default-500 pointer-events-none flex-shrink-0";

        switch (columnKey) {
            case "serviceId":
                return (
                    <div className="flex items-center gap-2">
                        <Avatar
                            icon={<CustomIcon/>}
                            classNames={{
                                base: avatarColorMap[service.projectSite],
                                icon: "text-white",
                                // icon: "text-black/80",
                            }}
                        />
                        <div className="flex flex-col">
                            <p className="text-bold text-small capitalize">{cellValue}</p>
                            <p className="text-bold text-tiny capitalize text-default-400">{service.projectSite}</p>
                        </div>

                    </div>

                );
            case "serviceName":
                return (
                    <div className="flex flex-col">
                        <p className="text-bold text-small capitalize">{cellValue}</p>
                        {/*<p className="text-bold text-tiny capitalize text-default-400">{service.team}</p>*/}
                    </div>
                );
            case "status":
                return (
                    <Chip className="capitalize" color={statusColorMap[service.status]} size="sm" variant="flat">
                        {cellValue}
                    </Chip>
                );
            case "projectSite":
                return (
                    <Chip className="" color={siteColorMap[service.projectSite]} size="sm" variant="flat">
                        {cellValue?.toUpperCase()}
                    </Chip>
                );
            case "actions":

                return (
                    <div className="relative flex justify-end items-center gap-2">
                        <Dropdown backdrop="transparent">
                            <DropdownTrigger>
                                <Button isIconOnly size="sm" variant="light">
                                    <VerticalDotsIcon className="text-default-300" />
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu  >
                                <DropdownItem
                                    key="View"
                                    startContent={<EyeIcon className={cn(iconClasses, "text-warning")} />}
                                    onPress={() =>  handleView(service)}
                                >
                                    View
                                </DropdownItem>
                                <DropdownItem
                                    key="Download"
                                    startContent={<DownloadIcon className={iconClasses} />}
                                    color="success"
                                    onPress={()=>  exportTextFile(service.serviceId,convertServiceToString(service))
                                    }
                                >
                                    Download
                                </DropdownItem>

                                <DropdownItem
                                    key="edit"
                                    startContent={<EditDocumentIcon className={iconClasses} />}
                                    onPress={() => handleEdit(service)}

                                >
                                    Edit
                                </DropdownItem>
                                <DropdownItem
                                    key="delete"
                                    className="text-danger"
                                    color="danger"
                                    startContent={<DeleteDocumentIcon className={cn(iconClasses, "text-danger")} />}
                                   onPress={() => handleDelete(service)}
                                >
                                    Delete
                                </DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </div>
                );
            default:
                return cellValue;
        }
    }, []);
    const onNextPage = React.useCallback(() => {
        if (page < pages) {
            setPage(page + 1);
        }
    }, [page, pages]);
    const onPreviousPage = React.useCallback(() => {
        if (page > 1) {
            setPage(page - 1);
        }
    }, [page]);
    const onRowsPerPageChange = React.useCallback((e) => {
        setRowsPerPage(Number(e.target.value));
        setPage(1);
    }, []);
    const onSearchChange = React.useCallback((value) => {
        if (value) {
            setFilterValue(value);
            setPage(1);
        } else {
            setFilterValue("");
        }
    }, []);
    const onClear = React.useCallback(()=>{
        setFilterValue("")
        setPage(1)
    },[])
    const topContent = React.useMemo(() => {
        return (
            <div className="flex flex-col gap-4">
                <div className="flex justify-between gap-3 items-end">
                    <Input
                        isClearable
                        className="w-full sm:max-w-[44%]"
                        placeholder="Search by service id or service name..."
                        startContent={<SearchIcon />}
                        value={filterValue}
                        onClear={() => onClear()}
                        onValueChange={onSearchChange}
                    />
                    <div className="flex gap-3">
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Project Site
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Site Columns"
                                closeOnSelect={false}
                                selectedKeys={siteFilter}
                                selectionMode="multiple"
                                onSelectionChange={setSiteFilter}
                            >
                                {siteOptions.map((site) => (
                                    <DropdownItem key={site.uid} className="capitalize">
                                        {capitalize(site.name)}
                                    </DropdownItem>
                                ))}

                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Status
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={statusFilter}
                                selectionMode="multiple"
                                onSelectionChange={setStatusFilter}
                            >
                                {statusOptions.map((status) => (
                                    <DropdownItem key={status.uid} className="capitalize">
                                        {capitalize(status.name)}
                                    </DropdownItem>
                                ))}

                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown>
                            <DropdownTrigger className="hidden sm:flex">
                                <Button endContent={<ChevronDownIcon className="text-small" />} variant="flat">
                                    Columns
                                </Button>
                            </DropdownTrigger>
                            <DropdownMenu
                                disallowEmptySelection
                                aria-label="Table Columns"
                                closeOnSelect={false}
                                selectedKeys={visibleColumns}
                                selectionMode="multiple"
                                onSelectionChange={setVisibleColumns}
                            >
                                {columns.map((column) => (
                                    <DropdownItem key={column.uid} className="capitalize">
                                        {capitalize(column.name)}
                                    </DropdownItem>
                                ))}
                            </DropdownMenu>
                        </Dropdown>
                        { isAdmin && <ModalUpload/>
                        }
                        <Button   color="success" className="text-white" variant="shadow" endContent={<DownloadIcon /> }>
                            Download T16
                        </Button>

                        {/*<ModalNewService setServices={setServices} />*/}
                    </div>
                </div>
                <div className="flex justify-between items-center">
                    {/*<span className="text-default-400 text-small">Total {services.length} service</span>*/}
                    <span className="text-default-400 text-small">Total {filteredItems.length} service</span>
                    <label className="flex items-center text-default-400 text-small">
                        Rows per page:
                        <select
                            className="bg-transparent outline-none text-default-400 text-small"
                            onChange={onRowsPerPageChange}
                        >
                            <option value="10">10</option>
                            <option value="20">20</option>
                            <option value="50">50</option>
                            <option value="100">100</option>
                        </select>
                    </label>
                </div>
            </div>
        );
    }, [filterValue,statusFilter,siteFilter,visibleColumns,onRowsPerPageChange,services.length,onSearchChange,hasSearchFilter,]);
    const bottomContent = React.useMemo(() => {
        return (
            <div className="py-2 px-2 flex justify-between items-center">
        <span className="w-[30%] text-small text-default-400">
          {/*{selectedKeys === "all"*/}
          {/*    ? "All items selected"*/}
          {/*    : `${selectedKeys.size} of ${filteredItems.length} selected`}*/}
        </span>
                <Pagination
                     isCompact
                     showControls
                    showShadow
                    color="primary"
                    page={page}
                    total={pages}
                    onChange={setPage}
                />
                <div className="hidden sm:flex w-[30%] justify-end gap-2">
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onPreviousPage}>
                        Previous
                    </Button>
                    <Button isDisabled={pages === 1} size="sm" variant="flat" onPress={onNextPage}>
                        Next
                    </Button>
                </div>
            </div>
        );
    }, [selectedKeys, items.length, page, pages, hasSearchFilter]);

    const [selectedService, setSelectedService] = React.useState(new Set([]));


    // for delete
    const modalView = useDisclosure();

    const handleView= (service) => {
        setSelectedService(service);
        modalView.onOpen()
        //
    };

    // for edit
    const {isOpen, onOpen,onClose} = useDisclosure();
    const handleEdit = (service) => {
        setSelectedService(service);
        onOpen();
    };

    // for delete
    const modalDel = useDisclosure();

    const handleDelete = (service) => {
        setSelectedService(service);
         modalDel.onOpen()
    //
    };



    if (loading) return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="text-center">
                <CircularProgress label="Loading..."/>
            </div>
        </div>
    );


    return (

        <>
            {isServerError && (
                <div className="flex items-center justify-center h-screen">
                    <div className="container mx-auto max-w-lg ">
                        <Image
                            width="100%"
                            height="100%"
                            alt="NextUI hero Image"
                            src={ImgServerError}
                        />
                    </div>
                </div>
            )}
            {!isServerError && (
                <div>
                    <NavbarComponent userName={userName} />
                    <main className="container mx-auto max-w-7xl py-16  px-6 flex-grow">
                        <Card className="p-6">
                            <Table
                                isCompact
                                removeWrapper
                                aria-label="Example table with custom cells, pagination and sorting"
                                isHeaderSticky
                                bottomContent={bottomContent}
                                bottomContentPlacement="outside"
                                classNames={{
                                    wrapper: "max-h-[382px]",
                                }}
                                selectedKeys={selectedKeys}
                                selectionMode="none"
                                sortDescriptor={sortDescriptor}
                                topContent={topContent}
                                topContentPlacement="outside"
                                onSelectionChange={setSelectedKeys}
                                onSortChange={setSortDescriptor}
                            >
                                <TableHeader columns={headerColumns}>
                                    {(column) => (
                                        <TableColumn
                                            key={column.uid}
                                            align={column.uid === "actions" ? "center" : "start"}
                                            allowsSorting={column.sortable}
                                        >
                                            {column.name}
                                        </TableColumn>
                                    )}
                                </TableHeader>
                                <TableBody emptyContent={"Service not found"} items={items}>
                                    {(item) => (
                                        <TableRow key={item.ID}>
                                            {(columnKey) => (
                                                <TableCell>{renderCell(item, columnKey)}</TableCell>
                                            )}
                                        </TableRow>
                                    )}
                                </TableBody>
                            </Table>

                            <ModalViewService
                                isOpen={modalView.isOpen}
                                onClose={modalView.onClose}
                                service={selectedService}
                            />
                            <ModalEditService
                                isOpen={isOpen}
                                onClose={onClose}
                                isAdmin={isAdmin}
                                service={selectedService}
                                setServices={setServices}
                            />
                            <ModalConfirmDelete
                                isOpen={modalDel.isOpen}
                                onClose={modalDel.onClose}
                                service={selectedService}
                                setServices={setServices}
                            />
                        </Card>
                    </main>
                </div>
            )}
        </>

    );
}


