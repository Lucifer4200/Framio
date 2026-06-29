"use client";

import type { FormEvent } from "react";
import { Button, Modal, Stack, Switch, TextInput } from "@mantine/core";
import { IconX } from "@tabler/icons-react";

export type CategoryFormData = {
  name: string;
  slug: string;
  image: string;
  status: string;
};

type CategoryModalProps = {
  opened: boolean;
  editingCategory: any;
  formData: CategoryFormData;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setFormData: (formData: CategoryFormData) => void;
};

export default function CategoryModal({
  opened,
  editingCategory,
  formData,
  onClose,
  onSubmit,
  setFormData,
}: CategoryModalProps) {
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
        <Modal.Body>
          <form onSubmit={onSubmit} className="!max-w-[526px] mx-auto">
            <Stack>
              <TextInput
                label="Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <TextInput
                label="Slug"
                required
                value={formData.slug}
                onChange={(e) =>
                  setFormData({ ...formData, slug: e.target.value })
                }
              />
              <TextInput
                label="Image URL"
                value={formData.image}
                onChange={(e) =>
                  setFormData({ ...formData, image: e.target.value })
                }
              />
              <Switch
                label="Active"
                checked={formData.status === "active"}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    status: e.currentTarget.checked ? "active" : "inactive",
                  })
                }
              />
              <Button type="submit" fullWidth>
                {editingCategory ? "Update" : "Create"} Category
              </Button>
            </Stack>
          </form>
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
