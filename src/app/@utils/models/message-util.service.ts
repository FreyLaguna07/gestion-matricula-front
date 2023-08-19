import { Injectable } from '@angular/core';
import Swal from 'sweetalert2';

@Injectable({
	providedIn: 'root'
})
export class MessageUtilService {

	message = '';
	constructor() { }

	getMessageWarning(mensaje: string) {
		const SwalMixin = Swal.mixin({
			focusCancel: true
		});
		return SwalMixin.fire({
			title: 'Eliminar',
			icon: 'warning',
			text: mensaje,
			showCancelButton: true,
			confirmButtonText: 'Si',
			cancelButtonText: 'No',
			confirmButtonColor: '#FD397A',
			cancelButtonColor: '#0ABB87'
		});
	}

	getMessageQuestion(titulo: string, mensaje?: string) {
		const SwalMixin = Swal.mixin({
			focusCancel: true
		});
		return SwalMixin.fire({
			title: titulo,
			icon: 'question',
			text: mensaje,
			showCancelButton: true,
			confirmButtonText: 'Si',
			cancelButtonText: 'No',
			confirmButtonColor: '#FD397A',
			cancelButtonColor: '#0ABB87'
		});
	}

	getMessageSuccess(titulo: string, mensaje: string) {
		return Swal.fire({
			icon: 'success',
			title: titulo,
			text: mensaje,
		});
	}

	getFailMessage(mensaje: string) {
		return Swal.fire({
			icon: 'error',
			title: 'Error',
			text: mensaje
		});
	}

	getMessageSuccessDelete(mensaje: string) {
		return Swal.fire({
			icon: 'success',
			title: 'Eliminación exitosa',
			text: mensaje
		});
	}

	getMessageInfo(mensaje: string) {
		return Swal.fire({
			icon: 'info',
			title: 'Información',
			text: mensaje
		});
	}

	getMessageSuccessTransmit(mensaje: string) {
		return Swal.fire({
			icon: 'success',
			title: 'Transmisión exitosa',
			text: mensaje
		});
	}

	getImgBasic(titulo: string, imgUrl: string) {
		return Swal.fire({
			title: titulo,
			imageUrl: imgUrl,
			imageAlt: 'Custom image',
		});
	}

}
