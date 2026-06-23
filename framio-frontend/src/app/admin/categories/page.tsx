'use client';

import { useState, useEffect, useMemo } from 'react';
import { Container, Title, Text, Button, Group, Stack, Card, Table, Modal, TextInput, Switch } from '@mantine/core';
import DynamicTable from '@/components/table/DynamicTable';
import { IconPlus, IconEdit, IconTrash } from '@tabler/icons-react';
import { API_URL } from '../../../services/api';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
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
    setModalOpened(true);
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      slug: category.slug,
      image: category.image || '',
      status: category.status,
    });
    setModalOpened(true);
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

      setModalOpened(false);
      fetchCategories();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

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
          columns={useMemo(() => [
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
          ], [])}
          data={categories}
          isLoading={loading}
          emptyMessage="No categories found"
          tableProps={{ miw: 800 }}
        />
      </div>

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title={editingCategory ? 'Edit Category' : 'Add Category'}>
        <form onSubmit={handleSubmit}>
          <Stack>
            <TextInput
              label="Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextInput
              label="Slug"
              required
              value={formData.slug}
              onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
            />
            <TextInput
              label="Image URL"
              value={formData.image}
              onChange={(e) => setFormData({ ...formData, image: e.target.value })}
            />
            <Switch
              label="Active"
              checked={formData.status === 'active'}
              onChange={(e) => setFormData({ ...formData, status: e.currentTarget.checked ? 'active' : 'inactive' })}
            />
            <Button type="submit" fullWidth>
              {editingCategory ? 'Update' : 'Create'} Category
            </Button>
          </Stack>
        </form>
      </Modal>
    </Container>
  );
}
