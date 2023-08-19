import Swal from 'sweetalert2';

/**
 * @deprecated
 */
export class Loading {
	constructor() {}
  showSmall(title?: string) {
    Swal.fire({
      title: `${title}`,
      width: '22%',
      backdrop: true,
      timerProgressBar: true,
      allowOutsideClick: false,
      didOpen: () => {
        Swal.showLoading();
      },
    });
  }
	hide() {
		Swal.close();
	}
}

export function hideLoading(): void {
	Swal.close();
}
