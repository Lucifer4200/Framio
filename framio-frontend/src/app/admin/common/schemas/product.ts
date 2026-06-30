import * as yup from "yup";

export const productSchema = yup.object({
  name: yup.string().trim().required("Name is required"),
  category_id: yup.string().trim().required("Category is required"),
  description: yup.string().trim().default(""),
  price: yup
    .string()
    .trim()
    .required("Price is required")
    .test("positive-price", "Price must be greater than 0", (value) => {
      const price = Number(value);
      return Number.isFinite(price) && price > 0;
    }),
  discount_price: yup
    .string()
    .trim()
    .default("")
    .test("discount-price", "Discount price must be 0 or greater", (value) => {
      if (!value) return true;
      const price = Number(value);
      return Number.isFinite(price) && price >= 0;
    }),
  stock: yup
    .string()
    .trim()
    .required("Stock is required")
    .test("stock", "Stock must be 0 or greater", (value) => {
      const stock = Number(value);
      return Number.isInteger(stock) && stock >= 0;
    }),
  frame_type: yup.string().trim().default(""),
  size: yup.string().trim().default(""),
  color: yup.string().trim().default(""),
});

export type ProductFormData = yup.InferType<typeof productSchema>;
