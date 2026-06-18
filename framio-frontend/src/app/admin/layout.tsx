'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AppShell, Navbar, Text, Group, Button, UnstyledButton, Avatar, Stack, Title } from '@mantine/core';
import Link from 'next/link';
import { IconDashboard, IconBox, IconCategory, IconShoppingCart, IconUsers, IconChartBar, IconLogout } from '@tabler/icons-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [active, setActive] = useState('dashboard');

  useEffect(() => {
    checkAdminAuth();
  }, []);

  const checkAdminAuth = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();

      if (data.user?.role !== 'admin') {
        router.push('/');
        return;
      }

      setUser(data.user);
    } catch (error) {
      router.push('/login');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  const navItems = [
    { icon: IconDashboard, label: 'Dashboard', value: 'dashboard', href: '/admin' },
    { icon: IconBox, label: 'Products', value: 'products', href: '/admin/products' },
    { icon: IconCategory, label: 'Categories', value: 'categories', href: '/admin/categories' },
    { icon: IconShoppingCart, label: 'Orders', value: 'orders', href: '/admin/orders' },
    { icon: IconUsers, label: 'Customers', value: 'customers', href: '/admin/customers' },
    { icon: IconChartBar, label: 'Reports', value: 'reports', href: '/admin/reports' },
  ];

  return (
    <AppShell padding="md">
      <AppShell.Navbar p="md" width={{ base: 250 }}>
        <Stack>
          <Group justify="center" mb="xl">
            <Title order={3}>Framio Admin</Title>
          </Group>

          {navItems.map((item) => (
            <UnstyledButton
              key={item.value}
              component={Link}
              href={item.href}
              className={active === item.value ? 'bg-blue-50' : ''}
              onClick={() => setActive(item.value)}
            >
              <Group>
                <item.icon size={20} />
                <Text>{item.label}</Text>
              </Group>
            </UnstyledButton>
          ))}

          <div className="mt-auto">
            <Button
              variant="subtle"
              color="red"
              fullWidth
              leftSection={<IconLogout size={20} />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Stack>
      </AppShell.Navbar>

      <AppShell.Main>
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
