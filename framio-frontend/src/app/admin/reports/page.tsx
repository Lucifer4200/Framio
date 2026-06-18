'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Card, Table, Tabs, Stack, Group, DateInput } from '@mantine/core';
import { IconChartBar, IconBox, IconUsers } from '@tabler/icons-react';
import { API_URL } from '../../../services/api';

export default function AdminReportsPage() {
  const [salesData, setSalesData] = useState<any[]>([]);
  const [productData, setProductData] = useState<any[]>([]);
  const [customerData, setCustomerData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      const [salesRes, productRes, customerRes] = await Promise.all([
        fetch(`${API_URL}/admin/reports/sales`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}/admin/reports/products`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
        fetch(`${API_URL}/admin/reports/customers`, {
          headers: { 'Authorization': `Bearer ${token}` },
        }),
      ]);

      const sales = await salesRes.json();
      const products = await productRes.json();
      const customers = await customerRes.json();

      setSalesData(sales.sales || []);
      setProductData(products.products || []);
      setCustomerData(customers.customers || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Container size="xl"><Text>Loading...</Text></Container>;
  }

  return (
    <Container size="xl">
      <Title order={1} mb="xl">Reports</Title>

      <Tabs defaultValue="sales">
        <Tabs.List>
          <Tabs.Tab value="sales" leftSection={<IconChartBar size={16} />}>Sales Report</Tabs.Tab>
          <Tabs.Tab value="products" leftSection={<IconBox size={16} />}>Product Report</Tabs.Tab>
          <Tabs.Tab value="customers" leftSection={<IconUsers size={16} />}>Customer Report</Tabs.Tab>
        </Tabs.List>

        <Tabs.Panel value="sales" pt="xl">
          <Card withBorder p="xl">
            <Title order={3} mb="md">Sales Report</Title>
            {salesData.length > 0 ? (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Date</Table.Th>
                    <Table.Th>Total Sales</Table.Th>
                    <Table.Th>Orders</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {salesData.map((sale) => (
                    <Table.Tr key={sale.date}>
                      <Table.Td>{sale.date}</Table.Td>
                      <Table.Td>${sale.total?.toFixed(2) || '0.00'}</Table.Td>
                      <Table.Td>{sale.orders || 0}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed">No sales data available</Text>
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="products" pt="xl">
          <Card withBorder p="xl">
            <Title order={3} mb="md">Product Report</Title>
            {productData.length > 0 ? (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Product</Table.Th>
                    <Table.Th>Category</Table.Th>
                    <Table.Th>Stock</Table.Th>
                    <Table.Th>Orders</Table.Th>
                    <Table.Th>Total Sold</Table.Th>
                    <Table.Th>Revenue</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {productData.map((product) => (
                    <Table.Tr key={product.id}>
                      <Table.Td>{product.name}</Table.Td>
                      <Table.Td>{product.category_name || '-'}</Table.Td>
                      <Table.Td>{product.stock}</Table.Td>
                      <Table.Td>{product.order_count || 0}</Table.Td>
                      <Table.Td>{product.total_sold || 0}</Table.Td>
                      <Table.Td>${product.revenue ? product.revenue.toFixed(2) : '0.00'}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed">No product data available</Text>
            )}
          </Card>
        </Tabs.Panel>

        <Tabs.Panel value="customers" pt="xl">
          <Card withBorder p="xl">
            <Title order={3} mb="md">Customer Report</Title>
            {customerData.length > 0 ? (
              <Table>
                <Table.Thead>
                  <Table.Tr>
                    <Table.Th>Customer</Table.Th>
                    <Table.Th>Email</Table.Th>
                    <Table.Th>Orders</Table.Th>
                    <Table.Th>Total Spent</Table.Th>
                  </Table.Tr>
                </Table.Thead>
                <Table.Tbody>
                  {customerData.map((customer) => (
                    <Table.Tr key={customer.id}>
                      <Table.Td>{customer.name}</Table.Td>
                      <Table.Td>{customer.email}</Table.Td>
                      <Table.Td>{customer.order_count || 0}</Table.Td>
                      <Table.Td>${customer.total_spent ? customer.total_spent.toFixed(2) : '0.00'}</Table.Td>
                    </Table.Tr>
                  ))}
                </Table.Tbody>
              </Table>
            ) : (
              <Text c="dimmed">No customer data available</Text>
            )}
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
