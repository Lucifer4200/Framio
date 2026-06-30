"use client";

import { useState, useEffect, useMemo } from "react";
import { Container, Title, Text, Button, Group } from "@mantine/core";
import { useDisclosure } from "@mantine/hooks";
import DynamicTable from "@/components/table/DynamicTable";
import { IconPlus, IconEdit, IconTrash } from "@tabler/icons-react";
import ProductModal from "../common/components/Product";
import { type ProductFormData } from "../common/schemas/product";
import { API_URL } from "../../../services/api";
import { formatCurrency } from "../../../utils/format";
import dmlToast from "../../../common/config/toaster.config";

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, handlers] = useDisclosure(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [formData, setFormData] = useState<ProductFormData>({
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
    handlers.open();
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
    handlers.open();
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this product?")) return;

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!response.ok) {
        throw new Error("Failed to delete product");
      }
      dmlToast.success({ title: "Product deleted successfully" });
      fetchProducts();
    } catch (error) {
      console.error("Error deleting product:", error);
      dmlToast.error({ title: "Failed to delete product" });
    }
  };

  const handleSubmit = async (values: ProductFormData) => {
    try {
      const token = localStorage.getItem("token");
      const url = editingProduct
        ? `${API_URL}/products/${editingProduct.id}`
        : `${API_URL}/products`;
      const method = editingProduct ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...values,
          price: parseFloat(values.price),
          discount_price: values.discount_price
            ? parseFloat(values.discount_price)
            : null,
          stock: parseInt(values.stock),
          category_id: parseInt(values.category_id),
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to save product");
      }

      dmlToast.success({
        title: editingProduct
          ? "Product updated successfully"
          : "Product added successfully",
      });
      handlers.close();
      fetchProducts();
    } catch (error) {
      console.error("Error saving product:", error);
      dmlToast.error({
        title: editingProduct
          ? "Failed to update product"
          : "Failed to add product",
      });
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

      <ProductModal
        opened={opened}
        editingProduct={editingProduct}
        formData={formData}
        onClose={handlers.close}
        onSubmit={handleSubmit}
      />
    </Container>
  );
}
