'use client';

import { useState, useEffect, useMemo } from 'react';
import { Container, Title, Text } from '@mantine/core';
import DynamicTable from '@/components/table/DynamicTable';
import { API_URL } from '../../../services/api';
import { formatCurrency } from '../../../utils/format';

export default function AdminCustomersPage() {
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/customers`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setCustomers(data.customers || []);
    } catch (error) {
      console.error('Error fetching customers:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = useMemo(() => [
    { id: 'name', label: 'Name', accessor: 'name', align: 'left' as const },
    { id: 'email', label: 'Email', accessor: 'email', align: 'left' as const },
    { id: 'phone', label: 'Phone', accessor: (c: any) => c.phone || '-', align: 'left' as const },
    { id: 'orders', label: 'Orders', accessor: (c: any) => c.order_count || 0, align: 'right' as const },
    { id: 'total_spent', label: 'Total Spent', accessor: (c: any) => `$${formatCurrency(c.total_spent)}`, align: 'right' as const },
    { id: 'status', label: 'Status', accessor: (c: any) => <Text size="xs" c={c.status === 'active' ? 'green' : 'red'}>{c.status}</Text>, align: 'left' as const },
  ], []);

  return (
    <Container size="xl">
      <Title order={1} mb="xl">Customers</Title>

      <div className="card">
        <DynamicTable
          columns={columns}
          data={customers}
          isLoading={loading}
          emptyMessage="No customers found"
          tableProps={{ miw: 900 }}
        />
      </div>
    </Container>
  );
}
