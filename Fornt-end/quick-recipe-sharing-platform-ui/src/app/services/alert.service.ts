import { Injectable } from "@angular/core";
import Swal, { SweetAlertIcon } from "sweetalert2";

@Injectable({
    providedIn: "root",
})

export class AlertService {
    async confirmExit(): Promise<boolean> {
        const result = await Swal.fire({
            title: 'Are you sure?',
            text: 'You have unsaved changes!',
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes, leave!',
        });
        return result.isConfirmed;
    }

    showSuccess(message: string, title: string = 'Success'): void {
        Swal.fire({
            title: title,
            text: message,
            icon: 'success',
            confirmButtonText: 'OK',
        });
    }

    showError(message: string, title: string = 'Error'): void {
        Swal.fire({
            title: title,
            text: message,
            icon: 'error',
            confirmButtonText: 'OK',
        });
    }

    showWarning(message: string, title: string = 'Warning'): void {
        Swal.fire({
            title: title,
            text: message,
            icon: 'warning',
            confirmButtonText: 'OK',
        });
    }

    showInfo(message: string, title: string = 'Info'): void {
        Swal.fire({
            title: title,
            text: message,
            icon: 'info',
            confirmButtonText: 'OK',
        });
    }

    async confirm(title: string, text: string, icon: SweetAlertIcon = 'question'): Promise<boolean> {
        const result = await Swal.fire({
            title: title,
            text: text,
            icon: icon,
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        });
        return result.isConfirmed;
    }

    async confirmDelete(title: string, text: string, icon: SweetAlertIcon = 'question'): Promise<boolean> {
        const result = await Swal.fire({
            title: title,
            text: text,
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Yes',
            cancelButtonText: 'No',
        });
        return result.isConfirmed;
    }
}