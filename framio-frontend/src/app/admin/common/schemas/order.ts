import * as yup from "yup";

export const orderStatusSchema = yup.object({
  status: yup.string().trim().required("Status is required"),
});

export type OrderStatusFormData = yup.InferType<typeof orderStatusSchema>;
