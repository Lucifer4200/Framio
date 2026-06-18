'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Title, Text, Button, Group, Stack, Card, Tabs, SimpleGrid, Badge, Avatar } from '@mantine/core';
import Link from 'next/link';
import { IconUser, IconShoppingBag, IconHeart, IconSettings } from '@tabler/icons-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [wishlist, setWishlist] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      // Fetch user data
      const userResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const userData = await userResponse.json();
      setUser(userData.user);

      // Fetch orders
      const ordersResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/orders`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const ordersData = await ordersResponse.json();
      setOrders(ordersData.orders || []);

      // Fetch wishlist
      const wishlistResponse = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/wishlist`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const wishlistData = await wishlistResponse.json();
      setWishlist(wishlistData.items || []);
    } catch (error) {
      console.error('Error fetching user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return <Container size="xl" py="xl"><Text>Loading...</Text></Container>;
  }

  return (
    <Container size="xl" py="xl">
      <Title order={1} mb="xl">My Dashboard</Title>

      <Tabs defaultValue="profile">
        <Tabs.List>
          <Tabs.Tab value="profile" leftSection={<IconUser size={16} />}>Profile</Tabs.Tab>
          <Tabs.Tab value="orders" leftSection={<IconShoppingBag size={16} />}>Orders</Tabs.Tab>
          <Tabs.Tab value="wishlist" leftSection={<IconHeart size={16} />}>Wishlist</Tabs.Tab>
          <Tabs.Tab value="settings" leftSection={<IconSettings size={16} />}>Settings</Tabs.Tab>
        </Tabs.List>

        {/* Profile Tab */}
        <Tabs.Panel value="profile" pt="xl">
          <Card withBorder p="xl">
            <Group>
              <Avatar size={80} radius="xl" color="blue">
                {user?.name?.charAt(0).toUpperCase()}
              </Avatar>
              <Stack gap={0}>
                <Title order={3}>{user?.name}</Title>
                <Text c="dimmed">{user?.email}</Text>
                <Badge color="blue">{user?.role}</Badge>
              </Stack>
            </Group>

            <Stack mt="xl">
              <Group>
                <Text fw={500}>Phone:</Text>
                <Text>{user?.phone || 'Not provided'}</Text>
              </Group>
              <Button variant="outline" w="fit">Edit Profile</Button>
            </Stack>
          </Card>
        </Tabs.Panel>

        {/* Orders Tab */}
        <Tabs.Panel value="orders" pt="xl">
          {orders.length === 0 ? (
            <Card withBorder p="xl" ta="center">
              <Text c="dimmed">No orders yet</Text>
              <Button component={Link} href="/products" mt="md">Start Shopping</Button>
            </Card>
          ) : (
            <Stack>
              {orders.map((order) => (
                <Card key={order.id} withBorder p="xl">
                  <Group justify="space-between" mb="md">
                    <Group>
                      <Text fw={500}>Order #{order.order_number}</Text>
                      <Badge color={order.order_status === 'delivered' ? 'green' : 'blue'}>
                        {order.order_status}
                      </Badge>
                    </Group>
                    <Text size="sm" c="dimmed">{new Date(order.created_at).toLocaleDateString()}</Text>
                  </Group>
                  <Group justify="space-between">
                    <Text fw={500}>Total: ${order.total_amount.toFixed(2)}</Text>
                    <Button variant="light" size="sm" component={Link} href={`/orders/${order.id}`}>
                      View Details
                    </Button>
                  </Group>
                </Card>
              ))}
            </Stack>
          )}
        </Tabs.Panel>

        {/* Wishlist Tab */}
        <Tabs.Panel value="wishlist" pt="xl">
          {wishlist.length === 0 ? (
            <Card withBorder p="xl" ta="center">
              <Text c="dimmed">Your wishlist is empty</Text>
              <Button component={Link} href="/products" mt="md">Browse Products</Button>
            </Card>
          ) : (
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3, lg: 4 }} spacing="xl">
              {wishlist.map((item) => (
                <Card key={item.id} shadow="sm" padding="lg" radius="md" withBorder>
                  <Card.Section>
                    {item.image ? (
                      <img src={item.image} alt={item.name} className="w-full h-48 object-cover" />
                    ) : (
                      <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                        <Text c="dimmed">No Image</Text>
                      </div>
                    )}
                  </Card.Section>
                  <Text fw={500} mt="md">{item.name}</Text>
                  <Text size="sm" c="dimmed">${item.price}</Text>
                  <Button variant="light" color="blue" fullWidth mt="md" component={Link} href={`/products/${item.product_id}`}>
                    View Details
                  </Button>
                </Card>
              ))}
            </SimpleGrid>
          )}
        </Tabs.Panel>

        {/* Settings Tab */}
        <Tabs.Panel value="settings" pt="xl">
          <Card withBorder p="xl">
            <Stack>
              <Title order={3}>Account Settings</Title>
              <Button variant="outline" w="fit">Change Password</Button>
              <Button variant="outline" w="fit">Manage Addresses</Button>
              <Button color="red" variant="outline" onClick={handleLogout}>
                Logout
              </Button>
            </Stack>
          </Card>
        </Tabs.Panel>
      </Tabs>
    </Container>
  );
}
