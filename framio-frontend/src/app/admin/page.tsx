'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, SimpleGrid, Card, Stack, Group, Badge, Table } from '@mantine/core';
import { IconTrendingUp, IconUsers, IconBox, IconShoppingCart } from '@tabler/icons-react';
import { API_URL } from '../../services/api';
import { formatCurrency } from '../../utils/format';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container size="xl"><Text>Loading...</Text></Container>;
  }

  return (
    <Container size="xl">
      <Title order={1} mb="xl">Admin Dashboard</Title>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mb="xl">
        <Card withBorder p="xl">
          <Group>
            <div className="p-3 bg-blue-100 rounded-full">
              <IconTrendingUp size={24} className="text-blue-600" />
            </div>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">Total Sales</Text>
              <Text size="xl" fw={700}>${formatCurrency(stats?.total_sales)}</Text>
            </Stack>
          </Group>
        </Card>

        <Card withBorder p="xl">
          <Group>
            <div className="p-3 bg-green-100 rounded-full">
              <IconShoppingCart size={24} className="text-green-600" />
            </div>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">Total Orders</Text>
              <Text size="xl" fw={700}>{stats?.total_orders || 0}</Text>
            </Stack>
          </Group>
        </Card>

        <Card withBorder p="xl">
          <Group>
            <div className="p-3 bg-purple-100 rounded-full">
              <IconUsers size={24} className="text-purple-600" />
            </div>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">Total Customers</Text>
              <Text size="xl" fw={700}>{stats?.total_customers || 0}</Text>
            </Stack>
          </Group>
        </Card>

        <Card withBorder p="xl">
          <Group>
            <div className="p-3 bg-orange-100 rounded-full">
              <IconBox size={24} className="text-orange-600" />
            </div>
            <Stack gap={0}>
              <Text size="sm" c="dimmed">Total Products</Text>
              <Text size="xl" fw={700}>{stats?.total_products || 0}</Text>
            </Stack>
          </Group>
        </Card>
      </SimpleGrid>

      {/* Recent Orders */}
      <Card withBorder p="xl" mb="xl">
        <Title order={3} mb="md">Recent Orders</Title>
        {stats?.recent_orders && stats.recent_orders.length > 0 ? (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Order #</Table.Th>
                <Table.Th>Customer</Table.Th>
                <Table.Th>Total</Table.Th>
                <Table.Th>Status</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {stats.recent_orders.map((order: any) => (
                <Table.Tr key={order.id}>
                  <Table.Td>{order.order_number}</Table.Td>
                  <Table.Td>{order.customer_name}</Table.Td>
                  <Table.Td>${formatCurrency(order.total_amount)}</Table.Td>
                  <Table.Td>
                    <Badge color={order.order_status === 'delivered' ? 'green' : 'blue'}>
                      {order.order_status}
                    </Badge>
                  </Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Text c="dimmed">No recent orders</Text>
        )}
      </Card>

      {/* Best Selling Products */}
      <Card withBorder p="xl">
        <Title order={3} mb="md">Best Selling Products</Title>
        {stats?.best_selling_products && stats.best_selling_products.length > 0 ? (
          <Table>
            <Table.Thead>
              <Table.Tr>
                <Table.Th>Product</Table.Th>
                <Table.Th>Units Sold</Table.Th>
                <Table.Th>Revenue</Table.Th>
              </Table.Tr>
            </Table.Thead>
            <Table.Tbody>
              {stats.best_selling_products.map((product: any) => (
                <Table.Tr key={product.name}>
                  <Table.Td>{product.name}</Table.Td>
                  <Table.Td>{product.total_sold}</Table.Td>
                  <Table.Td>${formatCurrency(product.revenue)}</Table.Td>
                </Table.Tr>
              ))}
            </Table.Tbody>
          </Table>
        ) : (
          <Text c="dimmed">No sales data yet</Text>
        )}
      </Card>
    </Container>
  );
}
