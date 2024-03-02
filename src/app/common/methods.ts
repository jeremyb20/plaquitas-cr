import { inject } from '@angular/core';
import { DatePipe } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { FileUploader, FileItem, ParsedResponseHeaders } from 'ng2-file-upload';
import { environment } from 'src/environments/environment';
import { FormGroup } from '@angular/forms';
import { CountryFlag } from './countrycode';

export function getSmartLoginTimeOut() {
    return 1
}

// custom validator to check that two fields match
export function MustMatch(key: string, confirmationKey: string) {
    return (group: FormGroup) => {
        const input = group.controls[key];
        const confirmationInput = group.controls[confirmationKey];
        return confirmationInput.setErrors(
            input.value !== confirmationInput.value ? {notEquivalent: true} : null
        );
    };
}

export function TranslateText(text: string) {
    const translateService = inject(TranslateService);
    return translateService.instant(text);
}

export function transformDate(value: any) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy hh:mm a');
    return value;
}

export function transformMediumDate(value: any) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, 'dd/MM/yyyy');
    return value;
}

export function getStatusType(status: string) {
    switch (status) {
        case "In-Progress": return 'text-in-progress';

        case "Open": return 'text-open';

        case "Resolved": return 'text-resolved';

        case "Terminado" : return 'bg-success-custom';

        case "Pendiente": return 'bg-warning';

        case "Preparando": return 'bg-info';


        default: return '';
    }
}

// Función para verificar si un string es una imagen base64
export function esImagenBase64(base64String) {
    return /^data:image\/(png|jpg);base64,/.test(base64String);
}

// Función para convertir la imagen base64 a Blob
export function base64ToBlob(base64Data: string, contentType: string): Blob {
    const byteCharacters = atob(base64Data);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: contentType });
}


// Función para reemplazar la imagen base64 con el Blob
export function reemplazarImagenBase64ConBlob(texto, uploader: FileUploader) {

    const regexImg = /<img[^>]+src="([^">]+)"/g;
    let resultado;
    while ((resultado = regexImg.exec(texto)) !== null) {
        const src = resultado[1];
        if (esImagenBase64(src)) {
            const currentDate = new Date();
            const year = currentDate.getFullYear();
            const month = String(currentDate.getMonth() + 1).padStart(2, '0');
            const day = String(currentDate.getDate()).padStart(2, '0');
            const hours = String(currentDate.getHours()).padStart(2, '0');
            const minutes = String(currentDate.getMinutes()).padStart(2, '0');
            const seconds = String(currentDate.getSeconds()).padStart(2, '0');

            const formattedDate = `${year}-${month}-${day}-${hours}-${minutes}-${seconds}`;

            const blob = base64ToBlob(src.split(',')[1], 'image/png');

            const fileName = 'screenshot-' + formattedDate + '.png'

            const file: File = new File([blob], fileName, { type: 'image/png', lastModified: Date.now() });

            uploader.addToQueue([file]);

            const newURL = environment.previousDisplay + fileName;
            texto = texto.replace(src, newURL);
        }
    }
    return texto;
}



export function PreviousImage(item: FileItem, uploader: FileUploader) {

    try {
        uploader.options.url = environment.uploadFilesApi;
        item.url = environment.uploadFilesApi;
        item.upload();
        uploader.onErrorItem = (item: FileItem, response: string, status: number, headers: ParsedResponseHeaders) =>
            onErrorItem(item, response, status, headers)
        uploader.onSuccessItem = (item: any, response: any, status: any, headers: any) => {
            if (status == 200) {
                var responseBanner = JSON.parse(response);
                const model: any = [];
                model.Previous = true;
                model.fileUrl = `${environment.previousDisplay}${responseBanner.name}`;
                model.imageInfo = responseBanner;
                return model;
            } else {
                console.log("error");
            }
        };
    } catch (error) {
        console.log(error);
    }
}

// funcion que convierte imagen base 64 a file
export function base64toFile(base64: string, fileName: string): File { 
    const blob = base64ToBlob(base64.split(',')[1], 'image/png');
    return new File([blob], fileName, { type: 'image/png', lastModified: Date.now() }); 
}

export function onErrorItem(
    item: FileItem,
    response: string,
    status: number,
    headers: ParsedResponseHeaders
): any {
    console.log(item);
    console.log(response);
    console.log(status);
    console.log(headers);
}


export function validateFormControlType(type: number) {
    /**
    Form Component functions
        // 1 HEPL TICKET CENTER
        // 2 PARTNERS TICKET CENTER
        // 3 INTERNAL TICKET CENTER
        // 4 DIRECT TICKET CENTER
        // 5 6 7 TICKET MESSAGE INFO // MODAL FORMS New Message
        // 8 SERVICE DESK NEW ENTRY
        // 9 SERVICE DESK NEW COMMENT
        // 10 SERVICE DESK EDIT ENTRY
        // 12 SHORCUT CENTER ADD NEW ENTRY 
    */
    switch (type) {
        case 1: return [
            { control: 'userSelected', show: false },
            { control: 'account', show: true },
            { control: 'agentPlayer', show: true },
            { control: 'subject', show: true },
            { control: 'subjectField', show: true },
            { control: 'website', show: true },
            { control: 'relevance', show: true },
            { control: 'department', show: true },
            { control: 'status', show: true },
            { control: 'replyToEmail', show: false },
            { control: 'shortcuts', show: true },
            { control: 'message', show: true },
            { control: 'emailSubject', show: false },
            { control: 'ticketLink', show: false },
            { control: 'inputTextName', show: false },
            { control: 'description', show: false }
        ]
        default: return null;
    }
}

export function getFormType(type: number) {
    /**
    Form Component functions
        // 1 HEPL TICKET CENTER
    */
    switch (type) {
        case 1: return {
            showUsers: false,
            showAccount: true,
            showAgentPlayer: true,
            showSubject: true,
            showSubjetField: true,
            showWebsite: true,
            showRelevance: true,
            showDepartment: true,
            showStatus: true,
            showReplyToEmail: true,
            showShortCuts: true,
            showMessage: true,
            showAttachment: true,
            showInputTextName: false,
            showDescription: false
        };

        default: return null;
    }
}

export function getThemeFilter(type: any) {
    switch (type) {
        case null:
        case undefined:
        case '': return 'theme-default-light';

        case 'theme-default-light': return 'theme-default-light';
        case 'theme-default-dark': return 'theme-default-dark';
        case 'theme-atlantis-dark': return 'theme-atlantis-dark';

        default: return 'theme-default-light';
    }
}

export function responseError(type: any) {
    switch (type) {
        case 0:
        case '': return 'An error occurred in the process.';

        default: return 'An error occurred in the process.';
    }
}

export function getSeverity(status: string) {
    switch (status) {
        case 'INSTOCK':
            return 'success';
        case 'LOWSTOCK':
            return 'warning';
        case 'OUTOFSTOCK':
            return 'danger';
        case 'PROMO':
            return 'info';

        default: return;
    }
}

export function DeleteUserById(arr: any, IdUser: number) {
    const objWithIdIndex = arr.findIndex((obj: any) => obj.id === IdUser);
    if (objWithIdIndex > -1) {
        arr.splice(objWithIdIndex, 1);
    }

    return arr;
}

export function generateCodeRandom(length: number) {
    var result:any = [];
    var characters = 'ABCDEFGHJKLMNOPQRSTUVWXYZabcdefghjkmnopqrstuvwxyz0123456789';
    var charactersLength = characters.length;
    for (var i = 0; i < length; i++) {
      result.push(characters.charAt(Math.floor(Math.random() *
        charactersLength)));
    }
    return result.join('');
}

export function calculateAge(birthdate) {
    const actualDate: Date = new Date();
    const dateBorn: Date = new Date(birthdate);
    
    let age: number = actualDate.getFullYear() - dateBorn.getFullYear();
    const mesActual: number = actualDate.getMonth();
    const mesNacimiento: number = dateBorn.getMonth();
    
    if (mesNacimiento > mesActual || (mesNacimiento === mesActual && dateBorn.getDate() > actualDate.getDate())) {
      age--;
    }
    
    return age;
}

export function calcularEdadPerro(fechaNacimiento: string): number {
    const fechaActual: Date = new Date();
    const fechaNac: Date = new Date(fechaNacimiento);
    
    const milisegundosPorAnioPerro: number = 1000 * 60 * 60 * 24 * 365; // Año de perro en milisegundos
    const milisegundosDeDiferencia: number = fechaActual.getTime() - fechaNac.getTime();
    
    const edadPerro: number = Math.floor(milisegundosDeDiferencia / milisegundosPorAnioPerro);
    
    return edadPerro;
}

export function calcularEdadPerroDesdeHumano(edadHumana: number): number {
    let edadPerro: number;
  
    if (edadHumana <= 2) {
      // Los dos primeros años de un perro equivalen a 10.5 años humanos por año de perro
      edadPerro = edadHumana * 10.5;
    } else {
      // Después de los dos primeros años, cada año de perro equivale a 4 años humanos adicionales
      edadPerro = 21 + (edadHumana - 2) * 4;
    }
  
    return edadPerro;
}

export function removeObjectWithId(arr: any, _id: string) {
    const objWithIdIndex = arr.findIndex((obj: any) => obj._id === _id);
    if (objWithIdIndex > -1) {
        arr.splice(objWithIdIndex, 1);
    }

    return arr;
}
  

export function getFlag(country: string){
    return CountryFlag.find(element => country == element.name)?.flag;
}

export function getCountryCode(country: string){
    return CountryFlag.find(element => country == element.name)?.dial_code;
}

export enum PostMethods {
    POST_LOGIN_USER = 'api/user/authenticate',
    POST_FORGOT_PASSWORD = 'api/user/forgot',
    POST_RESET_PASSWORD = 'api/user/reset-password',
    POST_UPDATE_LANGUAGE_BY_USER = '',

    ADMIN_POST_CREATE_NEW_QR_CODE = 'api/admin/createNewCode',
    USER_REGISTER_NEW_PET = 'api/user/registerNewPet',
    USER_REGISTER_NEW_PET_FROM_USER_PROFILE = 'api/user/registerNewPetfromUserProfile',
    USER_REGISTER_NEW_PET_FOR_QR_CODE = 'api/user/registerNewPetByQRcode',
    USER_DELETE_PET_BY_ID = 'api/user/deletePetById',

    ADMIN_DELETE_PET_BY_ID = 'api/admin/deletePetByIdForAdmin',
    CATALOG_CREATE_NEW_ARTICLE = 'api/catalog/createCatalog',
    CATALOG_ADD_NEW_IMAGE = 'api/catalog/addCatalogImages',
    CATALOG_DELETE_IMAGE_BY_ID = 'api/catalog/deleteImageCatalog'
}

export enum DeleteMethods {
    ADMIN_DELETE_USER_BY_ID = 'api/admin/deleteUserById',

    CATALOG_DELETE_CATALOG_BY_ID = 'api/catalog/deleteCatalog'

}

export enum PutMethods {
    ADMIN_UPDATE_USER_PROFILE = 'api/admin/editUser',
    ADMIN_UPDATE_USER_PROFILE_SECOND_LEVEL = 'api/admin/editUserSecondLevel',
    ADMIN_UPDATE_QR_STATUS = 'api/admin/updateStateActivationCode',
    ADMIN_UPDATE_INVENTORY_LIST = 'api/catalog/editCatalog',

    USER_UPDATE_PROFILE = 'api/user/editProfileInfo',
    USER_UPDATE_SECONDARY_PROFILE = 'api/user/editProfileSecondaryInfo',
    USER_UPDATE_USER_THEME = 'api/user/editThemeProfile',
    USER_UPDATE_PHOTO_PROFILE = 'api/user/editPhotoProfile'
}

export enum GetMethods {
    GET_USER_PROFILE = 'api/pet/getAllProfileList/',
    GET_USER_PROFILE_BY_ID = 'api/user/getUserProfileById',
    GET_USR_PROFILE_BY_SCANNER = 'api/user/getUserProfileByIdScanner/',
    GET_MY_PET_CODE_BY_ID = 'api/user/getMyPetCode',

    ADMIN_GET_ALL_LOCATION_PETS = 'api/admin/getLocationAllPets',
    ADMIN_GET_ALL_REGISTERED_USERS = 'api/admin/getAllUsers',
    ADMIN_GET_ALL_INVENTORY_LIST = 'api/catalog/getAllInventoryList',
    ADMIN_GET_CATALOG_BY_ID = 'api/catalog/getCatalogById?id=',
    GET_ALL_CATALOG_LIST = 'api/catalog/getCatalogList',
    GET_ALL_PROMO_LIST = 'api/catalog/getPromoList',
    ADMIN_GET_CODES = 'api/admin/getNewCodes',
}
