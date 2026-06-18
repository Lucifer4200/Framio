'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Group, Stack, Card, Table, NumberInput, Badge, TextInput } from '@mantine/core';
import Link from 'next/link';

export default function CartPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [coupon, setCoupon] = useState('');

  useEffect(() => {
    fetchCart();
  }, []);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      const data = await response.json();
      setCart(data);
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateQuantity = async (productId: number, quantity: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/update`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId, quantity }),
      });
      fetchCart();
    } catch (error) {
      console.error('Error updating cart:', error);
    }
  };

  const removeItem = async (productId: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/cart/remove`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });
      fetchCart();
    } catch (error) {
      console.error('Error removing item:', error);
    }
  };

  if (loading) {
    return <Container size="xl" py="xl"><Text>Loading cart...</Text></Container>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <Container size="xl" py="xl">
        <Title order={1} mb="xl">Shopping Cart</Title>
        <Card withBorder p="xl" ta="center">
          <Text size="lg" mb="md">Your cart is empty</Text>
          <Button component={Link} href="/products">Continue Shopping</Button>
        </Card>
      </Container>
    );
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Shopping Cart</Title>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2">
          <Card withBorder p="xl">
            <Stack>
              {cart.items.map((item: any) => (
                <Group key={item.id} justify="space-between" align="flex-start">
                  <Group>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded" />
                    ) : (
                      <div className="w-20 h-20 bg-gray-200 rounded flex items-center justify-center">
                        <Text size="xs" c="dimmed">No Image</Text>
                      </div>
                    )}
                    <Stack gap={0}>
                      <Text fw={500}>{item.name}</Text>
                      <Text size="sm" c="dimmed">${item.price}</Text>
                      <NumberInput
                        min={1}
                        max={item.stock}
                        value={item.quantity}
                        onChange={(val) => updateQuantity(item.product_id, Number(val))}
                        w={80}
                        size="xs"
                      />
                    </Stack>
                  </Group>
                  <Stack align="flex-end" gap={0}>
                    <Text fw={500}>${(item.price * item.quantity).toFixed(2)}</Text>
                    <Button variant="subtle" color="red" size="xs" onClick={() => removeItem(item.product_id)}>
                      Remove
                    </Button>
                  </Stack>
                </Group>
              ))}
            </Stack>
          </Card>
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <Card withBorder p="xl">
            <Stack>
              <Title order={3}>Order Summary</Title>

              <Group justify="space-between">
                <Text>Subtotal</Text>
                <Text>${cart.total.toFixed(2)}</Text>
              </Group>

              <Group justify="space-between">
                <Text>Shipping</Text>
                <Text>Free</Text>
              </Group>

              <TextInput
                placeholder="Enter coupon code"
                value={coupon}
                onChange={(e) => setCoupon(e.target.value)}
                rightSection={<Button variant="light" size="xs">Apply</Button>}
              />

              <Group justify="space-between" fw={500}>
                <Text>Total</Text>
                <Text size="xl">${cart.total.toFixed(2)}</Text>
              </Group>

              <Button size="lg" fullWidth component={Link} href="/checkout">
                Proceed to Checkout
              </Button>

              <Button variant="subtle" fullWidth component={Link} href="/products">
                Continue Shopping
              </Button>
            </Stack>
          </Card>
        </div>
      </div>
    </Container>
  );
}
