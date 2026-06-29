"use client";

import type { FormEvent } from "react";
import {
  Button,
  Group,
  Modal,
  NumberInput,
  Select,
  Stack,
  Textarea,
  TextInput,
} from "@mantine/core";
import { IconX } from "@tabler/icons-react";

export type ProductFormData = {
  name: string;
  category_id: string;
  description: string;
  price: string;
  discount_price: string;
  stock: string;
  frame_type: string;
  size: string;
  color: string;
};

type ProductModalProps = {
  opened: boolean;
  editingProduct: any;
  formData: ProductFormData;
  onClose: () => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
  setFormData: (formData: ProductFormData) => void;
};

export default function ProductModal({
  opened,
  editingProduct,
  formData,
  onClose,
  onSubmit,
  setFormData,
}: ProductModalProps) {
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
        <form onSubmit={onSubmit} className="flex flex-col gap-4">
          <Modal.Body>
            <div className="!max-w-[526px] mx-auto">
              <TextInput
                label="Name"
                required
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
              />
              <Select
                label="Category"
                placeholder="Select category"
                data={[
                  { value: "1", label: "Photo Frames" },
                  { value: "2", label: "Art Frames" },
                  { value: "3", label: "Wall Decor" },
                  { value: "4", label: "Mirror Frames" },
                ]}
                value={formData.category_id}
                onChange={(val) =>
                  setFormData({ ...formData, category_id: val || "" })
                }
              />
              <Textarea
                label="Description"
                value={formData.description}
                onChange={(e) =>
                  setFormData({ ...formData, description: e.target.value })
                }
              />
              <Group>
                <NumberInput
                  label="Price"
                  required
                  value={parseFloat(formData.price)}
                  onChange={(val) =>
                    setFormData({ ...formData, price: (val || 0).toString() })
                  }
                />
                <NumberInput
                  label="Discount Price"
                  value={
                    formData.discount_price
                      ? parseFloat(formData.discount_price)
                      : undefined
                  }
                  onChange={(val) =>
                    setFormData({
                      ...formData,
                      discount_price: val ? val.toString() : "",
                    })
                  }
                />
              </Group>
              <NumberInput
                label="Stock"
                required
                value={parseInt(formData.stock)}
                onChange={(val) =>
                  setFormData({ ...formData, stock: (val || 0).toString() })
                }
              />
              <Group>
                <TextInput
                  label="Frame Type"
                  value={formData.frame_type}
                  onChange={(e) =>
                    setFormData({ ...formData, frame_type: e.target.value })
                  }
                />
                <TextInput
                  label="Size"
                  value={formData.size}
                  onChange={(e) =>
                    setFormData({ ...formData, size: e.target.value })
                  }
                />
                <TextInput
                  label="Color"
                  value={formData.color}
                  onChange={(e) =>
                    setFormData({ ...formData, color: e.target.value })
                  }
                />
              </Group>
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
