'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Card, Table } from '@mantine/core';
import { API_URL } from '../../../services/api';

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

  if (loading) {
    return <Container size="xl"><Text>Loading...</Text></Container>;
  }

  return (
    <Container size="xl">
      <Title order={1} mb="xl">Customers</Title>

      <Card withBorder p="xl">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Name</Table.Th>
              <Table.Th>Email</Table.Th>
              <Table.Th>Phone</Table.Th>
              <Table.Th>Orders</Table.Th>
              <Table.Th>Total Spent</Table.Th>
              <Table.Th>Status</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {customers.map((customer) => (
              <Table.Tr key={customer.id}>
                <Table.Td>{customer.name}</Table.Td>
                <Table.Td>{customer.email}</Table.Td>
                <Table.Td>{customer.phone || '-'}</Table.Td>
                <Table.Td>{customer.order_count || 0}</Table.Td>
                <Table.Td>${customer.total_spent ? customer.total_spent.toFixed(2) : '0.00'}</Table.Td>
                <Table.Td>
                  <Text size="xs" c={customer.status === 'active' ? 'green' : 'red'}>
                    {customer.status}
                  </Text>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>
    </Container>
  );
}
