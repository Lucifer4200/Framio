"use client";

import { useEffect, useState } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  Group,
  Input,
  Modal,
  NumberInput,
  Select,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import {
  productSchema,
  type ProductFormData,
} from "../schemas/product";

type ProductModalProps = {
  opened: boolean;
  editingProduct: any;
  formData: ProductFormData;
  onClose: () => void;
  onSubmit: (formData: ProductFormData) => void;
};

export default function ProductModal({
  opened,
  editingProduct,
  formData,
  onClose,
  onSubmit,
}: ProductModalProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<ProductFormData>({
    resolver: yupResolver(productSchema),
    defaultValues: formData,
  });
  const [price, setPrice] = useState<number | string>("");
  const [discountPrice, setDiscountPrice] = useState<number | string>("");
  const [stock, setStock] = useState<number | string>("");

  useEffect(() => {
    reset(formData);
    setPrice(formData.price);
    setDiscountPrice(formData.discount_price);
    setStock(formData.stock);
  }, [formData, reset]);

  useEffect(() => {
    register("price");
    register("discount_price");
    register("stock");
  }, [register]);

  const handleValidSubmit: SubmitHandler<ProductFormData> = (values) => {
    onSubmit(values);
  };

  return (
    <Modal.Root opened={opened} onClose={onClose} fullScreen centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            {editingProduct ? "Edit Product" : "Add Product"}
          </Modal.Title>
          <span onClick={onClose} className="framio-Modal-header-close">
            <IconX stroke={2} />
          </span>
        </Modal.Header>
        <form onSubmit={handleSubmit(handleValidSubmit)} className="flex flex-col gap-4">
          <Modal.Body>
            <div className="!max-w-[526px] mx-auto">
              <Input.Wrapper label="Name" required error={errors.name?.message}>
                <Input {...register("name")} />
              </Input.Wrapper>
              <Controller
                name="category_id"
                control={control}
                render={({ field }) => (
                  <Select
                    label="Category"
                    placeholder="Select category"
                    data={[
                      { value: "1", label: "Photo Frames" },
                      { value: "2", label: "Art Frames" },
                      { value: "3", label: "Wall Decor" },
                      { value: "4", label: "Mirror Frames" },
                    ]}
                    value={field.value}
                    onChange={(val) => field.onChange(val || "")}
                    error={errors.category_id?.message}
                  />
                )}
              />
              <Input.Wrapper
                label="Description"
                error={errors.description?.message}
              >
                <Input component="textarea" {...register("description")} />
              </Input.Wrapper>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                <NumberInput
                  label="Price"
                  required
                  value={price}
                  onChange={(val) => {
                    const nextValue = val?.toString() || "";
                    setValue("price", nextValue);
                    setPrice(val ?? "");
                    clearErrors("price");
                  }}
                  error={errors.price?.message}
                  min={0}
                  hideControls
                  clampBehavior="strict"
                  allowNegative={false}
                />
                <NumberInput
                  label="Discount Price"
                  value={discountPrice}
                  onChange={(val) => {
                    const nextValue = val?.toString() || "";
                    setValue("discount_price", nextValue);
                    setDiscountPrice(val ?? "");
                    clearErrors("discount_price");
                  }}
                  error={errors.discount_price?.message}
                  min={0}
                  hideControls
                  clampBehavior="strict"
                  allowNegative={false}
                />
              <NumberInput
                label="Stock"
                required
                value={stock}
                onChange={(val) => {
                  const nextValue = val?.toString() || "";
                  setValue("stock", nextValue);
                  setStock(val ?? "");
                  clearErrors("stock");
                }}
                error={errors.stock?.message}
                min={0}
                hideControls
                clampBehavior="strict"
                allowNegative={false}
              />
                <Input.Wrapper
                  label="Frame Type"
                  error={errors.frame_type?.message}
                >
                  <Input {...register("frame_type")} />
                </Input.Wrapper>
                <Input.Wrapper label="Size" error={errors.size?.message}>
                  <Input {...register("size")} />
                </Input.Wrapper>
                <Input.Wrapper label="Color" error={errors.color?.message}>
                  <Input {...register("color")} />
                </Input.Wrapper>
              </div>
            </div>
          </Modal.Body>
          <div className="framio-Modal-footer">
            <div className="framio-Modal-footer-doubleButton max-w-520">
              <Button type="submit" fullWidth>
                {editingProduct ? "Update" : "Create"} Product
              </Button>
            </div>
          </div>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
