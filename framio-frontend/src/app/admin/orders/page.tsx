'use client';

import { useState, useEffect, useMemo } from 'react';
import { Container, Title, Button, Badge } from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import DynamicTable from '@/components/table/DynamicTable';
import { IconEye } from '@tabler/icons-react';
import OrderModal from '../common/components/Order';
import { API_URL } from '../../../services/api';
import { formatCurrency } from '../../../utils/format';
import dmlToast from '../../../common/config/toaster.config';

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [opened, handlers] = useDisclosure(false);
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
    handlers.open();
  };

  const handleStatusUpdate = async (nextStatus = status) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/orders/${selectedOrder.id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      });
      if (!response.ok) {
        throw new Error('Failed to update order status');
      }
      dmlToast.success({ title: 'Order status updated successfully' });
      handlers.close();
      fetchOrders();
    } catch (error) {
      console.error('Error updating order status:', error);
      dmlToast.error({ title: 'Failed to update order status' });
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

  const columns = useMemo(() => [
    { id: 'order_number', label: 'Order #', accessor: 'order_number', align: 'left' as const },
    { id: 'customer_name', label: 'Customer', accessor: 'customer_name', align: 'left' as const },
    { id: 'total', label: 'Total', accessor: (o: any) => `$${formatCurrency(o.total_amount)}`, align: 'right' as const },
    { id: 'payment_status', label: 'Payment Status', accessor: (o: any) => <Badge color={o.payment_status === 'paid' ? 'green' : 'yellow'}>{o.payment_status}</Badge>, align: 'left' as const },
    { id: 'order_status', label: 'Order Status', accessor: (o: any) => <Badge color={getStatusColor(o.order_status)}>{o.order_status}</Badge>, align: 'left' as const },
    { id: 'date', label: 'Date', accessor: (o: any) => new Date(o.created_at).toLocaleDateString(), align: 'left' as const },
    { id: 'actions', label: 'Actions', accessor: (o: any) => <Button size="xs" variant="light" onClick={() => handleView(o)}><IconEye size={14} /></Button>, align: 'center' as const },
  // eslint-disable-next-line react-hooks/exhaustive-deps
  ], []);

  return (
    <Container size="xl">
      <Title order={1} mb="xl">Orders</Title>

      <div className="card">
        <DynamicTable
          columns={columns}
          data={orders}
          isLoading={loading}
          emptyMessage="No orders found"
          tableProps={{ miw: 1000 }}
        />
      </div>

      <OrderModal
        opened={opened}
        selectedOrder={selectedOrder}
        status={status}
        onClose={handlers.close}
        onStatusChange={setStatus}
        onStatusUpdate={handleStatusUpdate}
      />
    </Container>
  );
}
