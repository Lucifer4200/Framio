"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Container,
  Title,
  Text,
  Button,
  Group,
  Stack,
  Card,
  Table,
  Modal,
  TextInput,
  NumberInput,
  Select,
  Textarea,
} from "@mantine/core";
import DynamicTable from "@/components/table/DynamicTable";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import { API_URL } from "../../../services/api";
import { formatCurrency } from "../../../utils/format";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: "",
    category_id: "",
    description: "",
    price: "",
    discount_price: "",
    stock: "",
    frame_type: "",
    size: "",
    color: "",
  });

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingProduct(null);
    setFormData({
      name: "",
      category_id: "",
      description: "",
      price: "",
      discount_price: "",
      stock: "",
      frame_type: "",
      size: "",
      color: "",
    });
    setModalOpened(true);
  };

  const handleEdit = (product: any) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      category_id: product.category_id.toString(),
      description: product.description,
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || "",
      stock: product.stock.toString(),
      frame_type: product.frame_type || "",
      size: product.size || "",
      color: product.color || "",
    });
    setModalOpened(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem("token");
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;
      const method = editingProduct ? "PUT" : "POST";

      await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...formData,
          price: parseFloat(formData.price),
          discount_price: formData.discount_price
            ? parseFloat(formData.discount_price)
            : null,
          stock: parseInt(formData.stock),
          category_id: parseInt(formData.category_id),
        }),
      });

      setModalOpened(false);
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
    }
  };

  const columns = useMemo(
    () => [
      { id: "name", label: "Name", accessor: "name", align: "left" as const },
      {
        id: "category_name",
        label: "Category",
        accessor: (p: any) => p.category_name || "-",
        align: "left" as const,
      },
      {
        id: "price",
        label: "Price",
        accessor: (p: any) => `$${formatCurrency(p.price)}`,
        align: "right" as const,
      },
      {
        id: "stock",
        label: "Stock",
        accessor: "stock",
        align: "right" as const,
      },
      {
        id: "status",
        label: "Status",
        accessor: (p: any) => (
          <Text size="xs" c={p.status === "active" ? "green" : "red"}>
            {p.status}
          </Text>
        ),
        align: "left" as const,
      },
      {
        id: "actions",
        label: "Actions",
        accessor: (p: any) => (
          <Group gap={4}>
            <Button size="xs" variant="light" onClick={() => handleEdit(p)}>
              <IconEdit size={14} />
            </Button>
            <Button
              size="xs"
              variant="light"
              color="red"
              onClick={() => handleDelete(p.id)}
            >
              <IconTrash size={14} />
            </Button>
          </Group>
        ),
        align: "center" as const,
      },
    ],
    [],
  );

  if (loading) {
    return (
      <Container size="xl">
        <Text>Loading...</Text>
      </Container>
    );
  }

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Products</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Add Product
        </Button>
      </Group>

      <div className="card">
        <DynamicTable
          columns={columns}
          data={products}
          isLoading={loading}
          emptyMessage="No products found"
          tableProps={{
            miw: 1000,
            verticalSpacing: "sm",
            withRowBorders: false,
            striped: true,
            stripedColor: "background",
            highlightOnHover: true,
            highlightOnHoverColor: "primary",
            className: "framio-list-table",
          }}
        />
      </div>

      <Modal
        opened={modalOpened}
        onClose={() => setModalOpened(false)}
        title={editingProduct ? "Edit Product" : "Add Product"}
        size="xl"
      >
        <form onSubmit={handleSubmit}>
          <Stack>
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
                { value: "3", label: "Wall Décor" },
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
            <Button type="submit" fullWidth>
              {editingProduct ? "Update" : "Create"} Product
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
