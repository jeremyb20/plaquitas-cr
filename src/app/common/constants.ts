import { Filters } from "@models/models";
import { Spinkit } from "ng-http-loader";
import { FilterMatchMode } from "primeng/api";

export const BootstrapBreakpoints = [
    { Id: 0, Name: 'xs', MediaQuery: "(max-width: 575.98px)" },
    { Id: 1, Name: 'sm', MediaQuery: "(min-width: 576px) and (max-width: 767.98px)" },
    { Id: 2, Name: 'md', MediaQuery: "(min-width: 768px) and (max-width: 991.98px)" },
    { Id: 3, Name: 'lg', MediaQuery: "(min-width: 992px) and (max-width: 1199.98px)" },
    { Id: 4, Name: 'xl', MediaQuery: "(min-width: 1200px)" },
    { Id: 5, Name: 'landscape', MediaQuery: "(orientation: landscape)" }
];

export const logoBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAKMAAAAeCAYAAABAOK4rAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAyFpVFh0WE1MOmNvbS5hZG9iZS54bXAAAAAAADw/eHBhY2tldCBiZWdpbj0i77u/IiBpZD0iVzVNME1wQ2VoaUh6cmVTek5UY3prYzlkIj8+IDx4OnhtcG1ldGEgeG1sbnM6eD0iYWRvYmU6bnM6bWV0YS8iIHg6eG1wdGs9IkFkb2JlIFhNUCBDb3JlIDUuNi1jMTQyIDc5LjE2MDkyNCwgMjAxNy8wNy8xMy0wMTowNjozOSAgICAgICAgIj4gPHJkZjpSREYgeG1sbnM6cmRmPSJodHRwOi8vd3d3LnczLm9yZy8xOTk5LzAyLzIyLXJkZi1zeW50YXgtbnMjIj4gPHJkZjpEZXNjcmlwdGlvbiByZGY6YWJvdXQ9IiIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bWxuczp4bXBNTT0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL21tLyIgeG1sbnM6c3RSZWY9Imh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC9zVHlwZS9SZXNvdXJjZVJlZiMiIHhtcDpDcmVhdG9yVG9vbD0iQWRvYmUgUGhvdG9zaG9wIENDIChXaW5kb3dzKSIgeG1wTU06SW5zdGFuY2VJRD0ieG1wLmlpZDowM0YxNkZFM0JENzMxMUVBQTFEOUE2QzlDNTk0MThBMyIgeG1wTU06RG9jdW1lbnRJRD0ieG1wLmRpZDowM0YxNkZFNEJENzMxMUVBQTFEOUE2QzlDNTk0MThBMyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSJ4bXAuaWlkOjAzRjE2RkUxQkQ3MzExRUFBMUQ5QTZDOUM1OTQxOEEzIiBzdFJlZjpkb2N1bWVudElEPSJ4bXAuZGlkOjAzRjE2RkUyQkQ3MzExRUFBMUQ5QTZDOUM1OTQxOEEzIi8+IDwvcmRmOkRlc2NyaXB0aW9uPiA8L3JkZjpSREY+IDwveDp4bXBtZXRhPiA8P3hwYWNrZXQgZW5kPSJyIj8+nzrjgQAAGNFJREFUeNrsXAd4lFXW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";

export const Options = {
    rowClickEvent: true,
    rowPerPageMenu: [5, 15, 20, 30],
    rowPerPage: 15,
    emptyDataMessage: 'No hay datos disponibles'
}

export class Notification {

    constructor(
        public id: number,
        public type: NotificationType,
        public message: string,
        public classProp: string,
        public classPropAnimation: string,
        public timeout: number,
    ) { }
}

export enum NotificationType {
    success = 0,
    warning = 1,
    error = 2,
    info = 3
}

export interface Column {
    field: string;
    header: string;
    title?: string;
    customExportHeader?: string;
    showFilter?: boolean;
}

export interface Navigation {
    Id: number;
    url: string;
    icon: string;
    title: string;
    hasPermission: boolean;
    showInToolbar: boolean;
    showInNavBar: boolean;
    isNew: boolean;
    SubMenu: any;
}

export interface ColumHeader {
    field?: string;
    header?: string;
    title?: string;
    showInPrimaryHeader?: boolean;
    showInSecondaryHeader?: boolean;
}

export interface Product {
    id?: string;
    code?: string;
    productName : string;
    description: string;
    metaDescription: string;
    price?: number;
    quantity?: number;
    inventoryStatus?: any;
    category: string;
    images: Images[];
    rating: number;
    updatedAt : string;
    createdAt : string;
    phone : string;
    country :string;
}

interface Images {
    image_id: string;
    imageURL: string;
}

export const CategoryList: Filters[] = [
    { label: 'Pet accessories', value: 'Pet accessories' },
    { label: 'Promotion', value: 'PROMOTIONS' },
    { label: 'Medicines', value: 'Medicines' },
    { label: 'Food', value: 'Food' },
    { label: 'Grooming', value: 'Grooming' },
    { label: 'Adopt pets', value: 'Adopt pets' },
    { label: 'Wanted', value: 'Wanted' },
    { label: 'Pet stores & services', value: 'Pet stores & services' },
    { label: 'Horses & Livestock', value: 'Horses & Livestock' },
    { label: 'Fish & Reptiles', value: 'Fish & Reptiles' },
    { label: 'General', value: 'General' },
    { label: 'Others', value: 'Others' }
]

export const CatalogStatusList: Filters[] = [
    { label: 'INSTOCK', value: 'INSTOCK' },
    { label: 'LOWSTOCK', value: 'LOWSTOCK' },
    { label: 'OUTOFSTOCK', value: 'OUTOFSTOCK' },
    { label: 'PROMOTION', value: 'PROMOTION' },
]

export const StatusFilter: Filters[] = [
    { label: 'Ordenando', value: 'Ordenando' },
    { label: 'Pendiente', value: 'Pendiente' },
    { label: 'Preparando', value: 'Preparando' },
    { label: 'Terminado', value: 'Terminado' }
]

export const TicketCenter: Filters[] = [
    { label: 'Help Ticket Center', value: '1' },
    { label: 'Partners Ticket Center', value: '2' },
    { label: 'Internal Ticket Center', value: '3' }
]

export const RelevanceFilter: Filters[] = [
    { label: 'Low', value: 'low' },
    { label: 'Medium', value: 'medium' },
    { label: 'High', value: 'high' }
]

export const MatchModeOptions: Filters[] = [
    { 
      label: 'Date is', 
      value: FilterMatchMode.DATE_IS 
    },
    { 
      label: 'Date is before', 
      value: FilterMatchMode.DATE_BEFORE 
    },
    { 
      label: 'Date is after', 
      value: FilterMatchMode.DATE_AFTER 
    }
];

export const ClientTypeList: Filters[]  = [
    { label: "Player", value: "1" },
    { label: "Agent", value: "2" }
];

export const UserState: Filters[] = [
    { label: "Admin", value: "/admin"},
    { label: "Admin", value: "/dashboard"}
]

export const InternalList: Filters[]  = [
    { label: "Internal", boleanValue: true, value: '' },
    { label: "Partner", boleanValue: false, value: '' }
];

export const AllSiteList: Filters[]  = [
    { label: 'WebsiteSetup.Set All Websites', value: "1" },
    { label: 'Agent', value: "2" }
];

export const UserTypeList: Filters[]  = [ 
    { label: 'Administrator', value: 0 },
    { label: 'Customer', value: 3 }
];

export const UserActivationTypeList: Filters[]  = [ 
    { label: 'Active', value: true },
    { label: 'Inactive', value: false }
];

export const FilterLogs: Filters[] = [
    { label: 'Tickets', value: 'TicketLog' },
    { label: 'Users', value: 'userLog' },
    { label: 'Subjects', value: 'SubjectLog' },
    { label: 'Fields', value: 'SubjectFieldsLog' },
    { label: 'Relevance', value: 'RelevanceLog' },
    { label: 'Status', value: 'StatusLog' },
    { label: 'Department', value: 'DepartmentLog' }
];

export const LanguageFilter: Filters[] = [
    { label: 'English', value: 'en' },
    { label: 'Español', value: 'es' }
];

export const ThemesOptions: Filters[] = [
    { 
        label: 'Theme Default Light',
        value: 'theme-default-light',
        metaThemeColor: '#29859ef0',
        spinerLoaderColor: '#29859ef0',
        spinerBgColor: '#fff',
        spiner: Spinkit.skThreeBounce,
        primengTheme: 'lara-light-blue.css'
    },
    { 
        label: 'Theme Default Dark',
        value: 'theme-default-dark',
        metaThemeColor: '#303944',
        spinerLoaderColor: '#ff0000',
        spinerBgColor: '#000000bf',
        spiner: Spinkit.skThreeBounce,
        primengTheme: 'lara-light-blue.css'
    },
    { 
        label: 'Theme Atlantis Dark',
        value: 'theme-atlantis-dark',
        metaThemeColor: '#303944',
        spinerLoaderColor: '#ff0000',
        spinerBgColor: '#000000bf',
        spiner: Spinkit.skThreeBounce,
        primengTheme: 'lara-light-blue.css'
    }
]

export const NAVIGATION: Navigation[] = [
    {
        Id: 11,
        url: '/dashboard',
        icon: 'feather icon-home',
        title: 'Dashboard',
        hasPermission: true,
        showInToolbar: false,
        showInNavBar: true,
        isNew: false,
        SubMenu: []
    },
    // {
    //     Id: 13,
    //     url: '/profile',
    //     icon: 'feather icon-user',
    //     title: 'Profile',
    //     hasPermission: true,
    //     showInToolbar: false,
    //     showInNavBar: true,
    //     isNew: false,
    //     SubMenu: []
    // },
    {
        Id: 12,
        url: '/configuration',
        icon: 'feather icon-settings',
        title: 'Configuration',
        hasPermission: true,
        showInToolbar: false,
        showInNavBar: true,
        isNew: false,
        SubMenu: []
    }
];

export const NAVIGATIONADMIN: Navigation[] = [
    {
        Id: 11,
        url: '/admin-panel',
        icon: 'feather icon-home',
        title: 'Dashboard Admin',
        hasPermission: true,
        showInToolbar: false,
        showInNavBar: true,
        isNew: false,
        SubMenu: []
    },
    {
        Id: 12,
        url: '/dashboard',
        icon: 'feather icon-home',
        title: 'Dashboard',
        hasPermission: true,
        showInToolbar: false,
        showInNavBar: true,
        isNew: false,
        SubMenu: []
    },
    {
        Id: 133,
        url: '/catalog-panel',
        icon: 'feather icon-box',
        title: 'Catalog Panel',
        hasPermission: true,
        showInToolbar: false,
        showInNavBar: true,
        isNew: false,
        SubMenu: []
    },
    {
        Id: 13,
        url: '/profile',
        icon: 'feather icon-user',
        title: 'Profile',
        hasPermission: true,
        showInToolbar: false,
        showInNavBar: true,
        isNew: false,
        SubMenu: []
    },
    {
        Id: 14,
        url: '/user-registered',
        icon: 'feather icon-users',
        title: 'Users Registered',
        hasPermission: true,
        showInToolbar: false,
        showInNavBar: true,
        isNew: false,
        SubMenu: []
    },
    {
        Id: 15,
        url: '/code-generator',
        icon: 'fas fa-qrcode',
        title: 'QR Code Generator',
        hasPermission: true,
        showInToolbar: false,
        showInNavBar: true,
        isNew: false,
        SubMenu: []
    },
    {
        Id: 17,
        url: '/marketplace-admin',
        icon: 'fas fa-shopping-bag',
        title: 'Marketplace',
        hasPermission: true,
        showInToolbar: false,
        showInNavBar: true,
        isNew: false,
        SubMenu: []
    },
    {
        Id: 16,
        url: '/configuration-admin',
        icon: 'feather icon-settings',
        title: 'Configuration',
        hasPermission: true,
        showInToolbar: false,
        showInNavBar: true,
        isNew: false,
        SubMenu: []
    }
]

//export const NAVIGATION: Navigation[] = [
    // {
    //     Id: 33,
    //     url: '/sports',
    //     icon: 'fas fa-futbol',
    //     translate: 'USER.SIDENAV.SPORTS',
    //     hasPermission: true,
    //     showInToolbar: false,
    //     showInNavBar: true,
    //     isNew: true,
    //     SubMenu: [
    //         {
    //             Id: 34,
    //             url: '/e-sports',
    //             icon: 'feather icon-settings',
    //             translate: 'USER.SIDENAV.E_SPORTS',
    //             hasPermission: true,
    //             showInToolbar: false,
    //             showInNavBar: true,
    //             isNew: false,
    //             SubMenu: []
    //         }
    // },
//]    