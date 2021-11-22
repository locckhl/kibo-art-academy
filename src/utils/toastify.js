import { toast } from "react-toastify"

export const SuccessMessage = (message) => {
  toast.success(message, {
    position: "top-right",
    theme: "colored",
  })
}
export const ErrorMessage = (message) => {
  toast.error(message, { position: "top-right" })
}
