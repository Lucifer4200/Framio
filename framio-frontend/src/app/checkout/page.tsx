'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Group, Stack, Card, TextInput, Textarea, Radio, Select } from '@mantine/core';
import Link from 'next/link';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('');
  const [billingAddress, setBillingAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash_on_delivery');
  const [sameAsShipping, setSameAsShipping] = useState(true);

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

      if (!data.items || data.items.length === 0) {
        router.push('/cart');
      }
    } catch (error) {
      console.error('Error fetching cart:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);

    try {
      const token = localStorage.getItem('token');
      const orderData = {
        items: cart.items.map((item: any) => ({
          product_id: item.product_id,
          quantity: item.quantity,
          price: item.price,
        })),
        shipping_address: shippingAddress,
        billing_address: sameAsShipping ? shippingAddress : billingAddress,
        phone,
        notes,
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      });

      const data = await response.json();

      if (response.ok) {
        router.push(`/orders/${data.order.id}`);
      } else {
        alert(data.error || 'Order failed');
      }
    } catch (error) {
      console.error('Error creating order:', error);
      alert('An error occurred. Please try again.');
    } finally {
      setProcessing(false);
    }
  };

  if (loading) {
    return <Container size="xl" py="xl"><Text>Loading...</Text></Container>;
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return <Container size="xl" py="xl"><Text>Your cart is empty</Text></Container>;
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">Checkout</Title>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Checkout Form */}
          <div className="lg:col-span-2">
            <Stack>
              {/* Shipping Address */}
              <Card withBorder p="xl">
                <Title order={3} mb="md">Shipping Address</Title>
                <Textarea
                  label="Address"
                  placeholder="Enter your full shipping address"
                  required
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  minRows={3}
                />
                <TextInput
                  label="Phone"
                  placeholder="Enter your phone number"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  mt="md"
                />
              </Card>

              {/* Billing Address */}
              <Card withBorder p="xl">
                <Title order={3} mb="md">Billing Address</Title>
                <Radio
                  label="Same as shipping address"
                  checked={sameAsShipping}
                  onChange={(e) => setSameAsShipping(e.target.checked)}
                  mb="md"
                />
                {!sameAsShipping && (
                  <Textarea
                    label="Address"
                    placeholder="Enter your billing address"
                    required
                    value={billingAddress}
                    onChange={(e) => setBillingAddress(e.target.value)}
                    minRows={3}
                  />
                )}
              </Card>

              {/* Payment Method */}
              <Card withBorder p="xl">
                <Title order={3} mb="md">Payment Method</Title>
                <Radio.Group
                  value={paymentMethod}
                  onChange={setPaymentMethod}
                >
                  <Stack>
                    <Radio value="cash_on_delivery" label="Cash on Delivery" />
                    <Radio value="credit_card" label="Credit Card" />
                    <Radio value="paypal" label="PayPal" />
                  </Stack>
                </Radio.Group>
              </Card>

              {/* Order Notes */}
              <Card withBorder p="xl">
                <Title order={3} mb="md">Order Notes (Optional)</Title>
                <Textarea
                  placeholder="Add any special instructions for your order"
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  minRows={2}
                />
              </Card>
            </Stack>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <Card withBorder p="xl">
              <Stack>
                <Title order={3}>Order Summary</Title>

                {cart.items.map((item: any) => (
                  <Group key={item.id} justify="space-between">
                    <Group>
                      <Text size="sm">{item.name}</Text>
                      <Text size="sm" c="dimmed">x{item.quantity}</Text>
                    </Group>
                    <Text size="sm">${(item.price * item.quantity).toFixed(2)}</Text>
                  </Group>
                ))}

                <Group justify="space-between" fw={500}>
                  <Text>Subtotal</Text>
                  <Text>${cart.total.toFixed(2)}</Text>
                </Group>

                <Group justify="space-between">
                  <Text>Shipping</Text>
                  <Text>Free</Text>
                </Group>

                <Group justify="space-between" fw={500}>
                  <Text size="lg">Total</Text>
                  <Text size="xl">${cart.total.toFixed(2)}</Text>
                </Group>

                <Button type="submit" size="lg" fullWidth loading={processing}>
                  Place Order
                </Button>

                <Button variant="subtle" fullWidth component={Link} href="/cart">
                  Back to Cart
                </Button>
              </Stack>
            </Card>
          </div>
        </div>
      </form>
    </Container>
  );
}
