import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CatalogStatusList, CategoryList, ColumHeader, Product } from '@methods/constants';
import { DeleteMethods, GetMethods, PostMethods, PutMethods, generateCodeRandom, getSeverity, responseError } from '@methods/methods';
import { User } from '@models/auth-model';
import { Filters, ResponseData } from '@models/models';
import { TranslateService } from '@ngx-translate/core';
import { ApiService } from '@services/api.service';
import { MediaResponse, MediaService } from '@services/media.service';
import { NotificationService } from '@services/notification.service';
import { Editor, Toolbar } from 'ngx-editor';
import { Subscription } from 'rxjs/internal/Subscription';
import { environment } from 'src/environments/environment';
import Swal from 'sweetalert2';
declare var bootstrap: any;

@Component({
  selector: 'app-catalog-panel',
  templateUrl: './catalog-panel.component.html',
})
export class CatalogPanelComponent implements OnInit {
    @ViewChild('fileUpload') fileUpload: any;
    sidebarVisible: boolean = false;
    user: User;
    products!: Product[];
    columsData: ColumHeader[];
    categoryList: Filters[];
    catalogStatusList: Filters[];
    mediaSubscription: Subscription;
    Media: MediaResponse;

    registerForm: FormGroup;
    maxSizeInBytes = 6 * 1024 * 1024; // 5MB
    file: File;
    photoSelected: any | ArrayBuffer;
    uploadedFiles: any[] = [];

    loading: boolean = false;
    submitted: boolean = false;

    clonedProduct: { [s: string]: any } = {};
    openDescription: any;
    editProfileModal: any;
    editor: Editor;
    toolbar: Toolbar = [
        ['bold', 'italic'],
        ['underline', 'strike'],
        ['blockquote'],
        ['ordered_list', 'bullet_list'],
        [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
        ['link'],
        ['text_color', 'background_color'],
        ['align_left', 'align_center', 'align_right', 'align_justify'],
    ];

    constructor(
        private _apiService: ApiService, 
        private _notificationService: NotificationService, 
        private _translateService: TranslateService,
        private _mediaService: MediaService, 
        private formBuilder: FormBuilder,
        private _sanitizer: DomSanitizer){
            this.mediaSubscription = this._mediaService.subscribeMedia().subscribe(media => {
                this.Media = media;
            });
        }

    ngOnInit(): void {
        this.columsData = [
            { title: 'Name'},
            { title: 'Code'},
            { title: 'Image'},
            { title: 'Description'},
            { title: 'Price'},
            { title: 'Category'},
            { title: 'Reviews'},
            { title: 'Status'},
            { title: 'Actions'},
        ]
        this.editor = new Editor();
        this.registerForm = this.formBuilder.group({
            productName: ['', Validators.required],
            description: ['', Validators.required],
            price: ['', Validators.required],
            quantity: ['', Validators.required],
            inventoryStatus: ['', Validators.required],
            category: ['', Validators.required],
        });
        this.categoryList = CategoryList;
        this.catalogStatusList = CatalogStatusList;
        this.user = JSON.parse(localStorage.getItem('user')!);
        this.getAllInventory();
    }

    get f() { return this.registerForm.controls; }


    processFile(event: any): void {
        for (let file of event.currentFiles) {
            this.uploadedFiles = file;
            if (this.uploadedFiles) {
                this.file = <File>event.files[0];
                if (this.file.type == String('image/png') || this.file.type == String('image/jpg') || this.file.type == String('image/jpeg')) {
                    const reader = new FileReader();
                    reader.onload = e => this.photoSelected = reader.result;
                    reader.readAsDataURL(this.file);
                } else {
                    Swal.fire({
                        position: 'center',
                        icon: 'error',
                        title: 'Oops...',
                        text: 'Solo se permite formatos JPG, PNG, JPEG',
                        confirmButtonText: 'OK',
                    })
                }
            }
        }
    }


    getAllInventory(){
        const URL = `${environment.WebApiUrl + GetMethods.ADMIN_GET_ALL_INVENTORY_LIST }`;
        this._apiService.apiGetMethod(URL).subscribe({
            next: (result: ResponseData) => {
                this.products = result.payload;
            },
            error: (err: any) => {
                console.log(err);
                const messageTypeErrorText = responseError(err.status);
                this._notificationService.error(messageTypeErrorText, 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

    onChange(html: string) {
        if (html == '<p></p>') {
            this.registerForm.get('description')?.setValue('');
        } else {
            const expresionRegular = /data:image\/png;base64/g;
            const coincidencias = expresionRegular.test(html);

            if (coincidencias) {
                console.log('se econtro imagen')
            }
        }
    }

    openModalDescription(pDescription: any){
        this.openDescription = pDescription;
        this.editProfileModal = new bootstrap.Modal(document.getElementById('editProfileModal'), {
            keyboard: false
        })
        this.editProfileModal.show()
    }

    cancel(){
        this.openDescription = null;
    }
    
    getSeverity(statusProduct: any){
        return getSeverity(statusProduct)
    }

    onRowEditInit(product: any) {
        this.clonedProduct[product._id as string] = { ...product };
    }
    
    onRowEditCancel(product: any, index: number) {
        this.products[index] = this.clonedProduct[product._id as string];
        delete this.clonedProduct[product._id as string];
    }

    transform(v:string):SafeHtml {
        return this._sanitizer.bypassSecurityTrustHtml(v);
      }

    onRowEditSave(product: any) {
        product.idOwner = this.user.id;
        const URL = `${environment.WebApiUrl + PutMethods.ADMIN_UPDATE_INVENTORY_LIST }`;
        this._apiService.apiPutMethod(URL, product).subscribe({
            next: (result: ResponseData) => {
                if(result.success){
                    delete this.clonedProduct[product._id as string];
                    this._notificationService.success(result.msg, 'bg-success', 'animate__backInUp', 6000);
                }else{
                    this._notificationService.warning(result.msg, 'bg-dark', 'animate__backInUp', 6000);
                }
            },
            error: (err: any) => {
                console.log(err);
                this._notificationService.warning('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
            }
        });
    }

    createProduct(){
        this.submitted = true;
        // stop here if form is invalid
        if (this.registerForm.invalid) {
            return;
        }

        if (this.file != undefined) {

            this.loading = true;
            const URL = `${environment.WebApiUrl + PostMethods.CATALOG_CREATE_NEW_ARTICLE }`;
            const data: any = {
                productName: this.f.productName.value,
                description: this.f.description.value,
                price: this.f.price.value,
                quantity: this.f.quantity.value,
                inventoryStatus: this.f.inventoryStatus.value,
                category: this.f.category.value,
                photo: this.file
            }

            const fd = new FormData();
            fd.append('productName', data.productName);
            fd.append('description', data.description);
            fd.append('price', data.price);
            fd.append('quantity', data.quantity);
            fd.append('inventoryStatus', data.inventoryStatus);
            fd.append('category', data.category);
            fd.append('image', data.photo);
            fd.append('idOwner', this.user.id);
            
            this._apiService.apiPostMethod(URL, fd).subscribe({
                next: (result: ResponseData) => {
                    if (result.success) {
                        this.loading = false;
                        this.photoSelected = null;
                        this.uploadedFiles = [];
                        this.registerForm.reset();
                        this.fileUpload.clear();
                        this.getAllInventory();
                        this._notificationService.success(result.msg, 'bg-success', 'animate__backInUp', 6000);
                    }else{
                        this._notificationService.warning(result.msg, 'bg-dark', 'animate__backInUp', 6000);
                    }
                },
                error: (err: any) => {
                    console.log(err);
                    this.loading = false;
                    this._notificationService.warning('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
                }
            });

        }else{
            Swal.fire({
                title: 'Campo requerido',
                html: "Favor de ingresar aal menos una foto para el articulo " + this.f.productName.value,
                showCancelButton: false,
                allowEscapeKey: false,
                confirmButtonText: 'OK',
                allowOutsideClick: false,
                buttonsStyling: false,
                reverseButtons: true,
                position: 'top',
                padding: 0,
                customClass: { confirmButton: 'col-auto btn btn-info m-3' }
            }).then((result) => { });
        }
    }

    deleteProduct(catalog: any){
        Swal.fire({
            text: this.TranslateText('Are you sure?'),
            icon: 'warning',
            showCancelButton: true,
            cancelButtonText: this.TranslateText('No'),
            confirmButtonText: this.TranslateText('Yes'),
            allowOutsideClick: false
        }).then((result) => {
            if (result.isConfirmed) {
                const URL = `${environment.WebApiUrl + DeleteMethods.CATALOG_DELETE_CATALOG_BY_ID + '?id=' + catalog._id}`;
                this._apiService.apiDeleteMethod(URL, []).subscribe({
                    next: (result: ResponseData) => {
                        if(result.success){
                            // DeleteUserById(this.payloadData, user.id);
                            this.getAllInventory();
                            this._notificationService.success(result.msg, 'bg-success', 'animate__backInUp', 6000);
                        }else{
                            this._notificationService.warning(result.msg, 'bg-dark', 'animate__backInUp', 6000);
                        }
                    },
                    error: (err: any) => {
                        console.log(err);
                        this._notificationService.warning('An error occurred in the process.', 'bg-dark', 'animate__backInUp', 6000);
                    }
                });
            }
        })
    }


    TranslateText(text: string) {
        return this._translateService.instant(text);
    } 

}
