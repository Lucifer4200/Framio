'use client';

import { useState, useEffect, useMemo } from 'react';
import { Container, Title, Text, Button, Group, Stack, Card, Table, Modal, Select, Badge } from '@mantine/core';
import DynamicTable from '@/components/table/DynamicTable';
import { IconEye } from '@tabler/icons-react';
import { API_URL } from '../../../services/api';
import { formatCurrency } from '../../../utils/format';

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
      const response = await fetch(`${API_URL}/admin/orders`, {
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
      await fetch(`${API_URL}/orders/${selectedOrder.id}/status`, {
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

      <div className="card">
        <DynamicTable
          columns={useMemo(() => [
            { id: 'order_number', label: 'Order #', accessor: 'order_number', align: 'left' as const },
            { id: 'customer_name', label: 'Customer', accessor: 'customer_name', align: 'left' as const },
            { id: 'total', label: 'Total', accessor: (o: any) => `$${formatCurrency(o.total_amount)}`, align: 'right' as const },
            { id: 'payment_status', label: 'Payment Status', accessor: (o: any) => <Badge color={o.payment_status === 'paid' ? 'green' : 'yellow'}>{o.payment_status}</Badge>, align: 'left' as const },
            { id: 'order_status', label: 'Order Status', accessor: (o: any) => <Badge color={getStatusColor(o.order_status)}>{o.order_status}</Badge>, align: 'left' as const },
            { id: 'date', label: 'Date', accessor: (o: any) => new Date(o.created_at).toLocaleDateString(), align: 'left' as const },
            { id: 'actions', label: 'Actions', accessor: (o: any) => <Button size="xs" variant="light" onClick={() => handleView(o)}><IconEye size={14} /></Button>, align: 'center' as const },
          ], [])}
          data={orders}
          isLoading={loading}
          emptyMessage="No orders found"
          tableProps={{ miw: 1000 }}
        />
      </div>

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
              <Text>${formatCurrency(selectedOrder.total_amount)}</Text>
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
