"use client";

import { useEffect, useState } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Input, Modal, Switch } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import {
  categorySchema,
  type CategoryFormData,
} from "../schemas/category";

type CategoryModalProps = {
  opened: boolean;
  editingCategory: any;
  formData: CategoryFormData;
  onClose: () => void;
  onSubmit: (formData: CategoryFormData) => void;
};

export default function CategoryModal({
  opened,
  editingCategory,
  formData,
  onClose,
  onSubmit,
}: CategoryModalProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    clearErrors,
    formState: { errors },
  } = useForm<CategoryFormData>({
    resolver: yupResolver(categorySchema),
    defaultValues: formData,
  });
  const [isActive, setIsActive] = useState(formData.status === "active");

  useEffect(() => {
    reset(formData);
    setIsActive(formData.status === "active");
  }, [formData, reset]);

  useEffect(() => {
    register("status");
  }, [register]);

  const handleValidSubmit: SubmitHandler<CategoryFormData> = (values) => {
    onSubmit(values);
  };

  return (
    <Modal.Root opened={opened} onClose={onClose} fullScreen centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>
            {editingCategory ? "Edit Category" : "Add Category"}
          </Modal.Title>
          <span onClick={onClose} className="framio-Modal-header-close">
            <IconX stroke={2} />
          </span>
        </Modal.Header>
        <form onSubmit={handleSubmit(handleValidSubmit)} className="flex flex-col gap-4">
          <Modal.Body>
            <div className="!max-w-[526px] mx-auto flex flex-col gap-4">
              <Input.Wrapper label="Name" required error={errors.name?.message}>
                <Input {...register("name")} />
              </Input.Wrapper>
              <Input.Wrapper label="Slug" required error={errors.slug?.message}>
                <Input {...register("slug")} />
              </Input.Wrapper>
              <Input.Wrapper label="Image URL" error={errors.image?.message}>
                <Input {...register("image")} />
              </Input.Wrapper>
              <Switch
                label="Active"
                checked={isActive}
                onChange={(e) => {
                  const checked = e.currentTarget.checked;
                  setIsActive(checked);
                  setValue("status", checked ? "active" : "inactive");
                  clearErrors("status");
                }}
                error={errors.status?.message}
              />
            </div>
          </Modal.Body>
          <div className="framio-Modal-footer">
            <div className="framio-Modal-footer-doubleButton max-w-520">
              <Button type="submit" fullWidth>
                {editingCategory ? "Update" : "Create"} Category
              </Button>
            </div>
          </div>
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
