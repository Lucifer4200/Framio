'use client';

import { useState, useEffect } from 'react';
import { Container, Title, Text, Button, Group, Stack, Card, Table, Modal, Select, Badge } from '@mantine/core';
import { IconEye } from '@tabler/icons-react';
import Link from 'next/link';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpened, setModalOpened] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [status, setStatus] = useState('');

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/admin/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setOrders(data.orders || []);
    } catch (error) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleView = (order: any) => {
    setSelectedOrder(order);
    setStatus(order.order_status);
    setModalOpened(true);
  };

  const handleStatusUpdate = async () => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });
      setModalOpened(false);
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'yellow';
      case 'confirmed': return 'blue';
      case 'processing': return 'cyan';
      case 'shipped': return 'purple';
      case 'delivered': return 'green';
      case 'cancelled': return 'red';
      default: return 'gray';
    }
  };

  if (loading) {
    return <Container size="xl"><Text>Loading...</Text></Container>;
  }

  return (
    <Container size="xl">
      <Title order={1} mb="xl">Orders</Title>

      <Card withBorder p="xl">
        <Table>
          <Table.Thead>
            <Table.Tr>
              <Table.Th>Order #</Table.Th>
              <Table.Th>Customer</Table.Th>
              <Table.Th>Total</Table.Th>
              <Table.Th>Payment Status</Table.Th>
              <Table.Th>Order Status</Table.Th>
              <Table.Th>Date</Table.Th>
              <Table.Th>Actions</Table.Th>
            </Table.Tr>
          </Table.Thead>
          <Table.Tbody>
            {orders.map((order) => (
              <Table.Tr key={order.id}>
                <Table.Td>{order.order_number}</Table.Td>
                <Table.Td>{order.customer_name}</Table.Td>
                <Table.Td>${order.total_amount.toFixed(2)}</Table.Td>
                <Table.Td>
                  <Badge color={order.payment_status === 'paid' ? 'green' : 'yellow'}>
                    {order.payment_status}
                  </Badge>
                </Table.Td>
                <Table.Td>
                  <Badge color={getStatusColor(order.order_status)}>
                    {order.order_status}
                  </Badge>
                </Table.Td>
                <Table.Td>{new Date(order.created_at).toLocaleDateString()}</Table.Td>
                <Table.Td>
                  <Button size="xs" variant="light" onClick={() => handleView(order)}>
                    <IconEye size={14} />
                  </Button>
                </Table.Td>
              </Table.Tr>
            ))}
          </Table.Tbody>
        </Table>
      </Card>

      <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title={`Order ${selectedOrder?.order_number}`} size="xl">
        {selectedOrder && (
          <Stack>
            <Group>
              <Text fw={500}>Customer:</Text>
              <Text>{selectedOrder.customer_name}</Text>
              <Text c="dimmed">{selectedOrder.customer_email}</Text>
            </Group>

            <Group>
              <Text fw={500}>Total:</Text>
              <Text>${selectedOrder.total_amount.toFixed(2)}</Text>
            </Group>

            <Group>
              <Text fw={500}>Shipping Address:</Text>
              <Text>{selectedOrder.shipping_address}</Text>
            </Group>

            <Group>
              <Text fw={500}>Phone:</Text>
              <Text>{selectedOrder.phone || 'N/A'}</Text>
            </Group>

            <Select
              label="Update Status"
              data={[
                { value: 'pending', label: 'Pending' },
                { value: 'confirmed', label: 'Confirmed' },
                { value: 'processing', label: 'Processing' },
                { value: 'shipped', label: 'Shipped' },
                { value: 'delivered', label: 'Delivered' },
                { value: 'cancelled', label: 'Cancelled' },
              ]}
              value={status}
              onChange={(val) => setStatus(val || '')}
            />

            <Button onClick={handleStatusUpdate}>Update Status</Button>
          </Stack>
        )}
      </Modal>
    </Container>
  );
}
