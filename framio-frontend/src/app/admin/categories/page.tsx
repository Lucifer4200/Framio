'use client';

import { useState, useEffect, useMemo } from 'react';
import { Container, Title, Text, Button, Group } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import DynamicTable from '@/components/table/DynamicTable';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import CategoryModal, { type CategoryFormData } from '../components/Category';
import { API_URL } from '../../../services/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, handlers] = useDisclosure(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState<CategoryFormData>({
    name: '',
    slug: '',
    image: '',
    status: 'active',
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/categories`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setCategories(data.categories || []);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingCategory(null);
    setFormData({
      name: '',
      slug: '',
      image: '',
      status: 'active',
    });
    handlers.open();
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image || '',
      status: category.status,
    });
    handlers.open();
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this category?')) return;

    try {
      const token = localStorage.getItem('token');
      await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` },
      });
      fetchCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const token = localStorage.getItem('token');
      const url = editingCategory
        ? `${API_URL}/categories/${editingCategory.id}`
        : `${API_URL}/categories`;
      const method = editingCategory ? 'PUT' : 'POST';

      await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(formData),
      });

      handlers.close();
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const columns = useMemo(() => [
    { id: 'name', label: 'Name', accessor: 'name', align: 'left' as const },
    { id: 'slug', label: 'Slug', accessor: 'slug', align: 'left' as const },
    {
      id: 'status',
      label: 'Status',
      accessor: (cat: any) => (
        <Text size="xs" c={cat.status === 'active' ? 'green' : 'red'}>
          {cat.status}
        </Text>
      ),
      align: 'left' as const,
    },
    {
      id: 'actions',
      label: 'Actions',
      accessor: (cat: any) => (
        <Group gap={4}>
          <Button size="xs" variant="light" onClick={() => handleEdit(cat)}>
            <IconEdit size={14} />
          </Button>
          <Button size="xs" variant="light" color="red" onClick={() => handleDelete(cat.id)}>
            <IconTrash size={14} />
          </Button>
        </Group>
      ),
      align: 'center' as const,
    },
  ], []);
  if (loading) {
    return <Container size="xl"><Text>Loading...</Text></Container>;
  }

  return (
    <Container size="xl">
      <Group justify="space-between" mb="xl">
        <Title order={1}>Categories</Title>
        <Button leftSection={<IconPlus size={16} />} onClick={handleCreate}>
          Add Category
        </Button>
      </Group>

      <div className="card">
        <DynamicTable
          columns={columns}
          data={categories}
          isLoading={loading}
          emptyMessage="No categories found"
          tableProps={{ miw: 800 }}
        />
      </div>

      <CategoryModal
        opened={opened}
        editingCategory={editingCategory}
        formData={formData}
        onClose={handlers.close}
        onSubmit={handleSubmit}
        setFormData={setFormData}
      />
    </Container>
  );
}
