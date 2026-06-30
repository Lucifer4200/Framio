import * as yup from "yup";

export const categorySchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  slug: yup.string().trim().required("Slug is required"),
  image: yup.string().trim().default(""),
  status: yup.string().oneOf(["active", "inactive"]).required(),
});

export type CategoryFormData = yup.InferType<typeof categorySchema>;
