// import Swal from "sweetalert2";


// export function showPurchaseDialog(): void {
//     Swal.fire({
//         title: "🎨 Become a Super Artist!",
//         text: "Unlock the full paint set and play with ZERO ads!",
//         customClass: {
//             confirmButton: 'swal-button-confirm',
//         },
//         confirmButtonText: 'Upgrade Me! 🚀'
//     }).then((result) => {
//         if (result.isConfirmed) {
//             console.log("User wants to purchase adsFree");
//             window.location.href = 'unity://purchase?productId=adsFree';
//         }
//     }); 
// }


// export function showClearConfirmationDialog(onConfirm: () => void): void {
//     Swal.fire({
//         text: "Do you want to delete your drawing?",
//         showCancelButton: true,
//         confirmButtonColor: "#3085d6",
//         cancelButtonColor: "#d33",
//         confirmButtonText: "Yes, delete it!"
//         }).then((result) => {
//         if (result.isConfirmed) {
//             onConfirm();
//             // App.render.clearBaseCanvas();
//         }
//     });
// }