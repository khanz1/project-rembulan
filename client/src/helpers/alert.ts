import Swal from 'sweetalert2';

export const errorAlert = (message: string) => {
  void Swal.fire({
    icon: 'error',
    title: 'Oops...',
    text: message,
  });
};
