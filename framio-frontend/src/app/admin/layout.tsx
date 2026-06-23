'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import {
  AppShell,
  Text,
  Group,
  Burger,
  Avatar,
  Menu,
  UnstyledButton,
  rem,
  useMantineTheme,
  ActionIcon,
  Badge,
  Indicator,
  TextInput,
} from '@mantine/core';
import Link from 'next/link';
import { API_URL } from '../../services/api';
import {
  IconDashboard,
  IconBox,
  IconShoppingCart,
  IconUsers,
  IconChartBar,
  IconLogout,
  IconSettings,
  IconBell,
  IconSun,
  IconMoon,
} from '@tabler/icons-react';
import { useAtom } from 'jotai';
import { darkModeAtom, sidebarCollapsedAtom, userAtom } from '@/atoms/admin-atoms';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const theme = useMantineTheme();
  const [user, setUser] = useAtom(userAtom);
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const [isDarkMode, setIsDarkMode] = useAtom(darkModeAtom);

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error('Auth failed');

        const data = await response.json();

        if (data.user?.role !== 'admin') {
          router.push('/');
          return;
        }

        setUser(data.user);
      } catch (error) {
        localStorage.removeItem('token');
        router.push('/login');
      }
    };

    if (!user) {
      checkAdminAuth();
    }
  }, [router, setUser, user]);

  const handleLogout = async () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const navItems = [
    { icon: IconDashboard, label: 'Dashboard', value: 'dashboard', href: '/admin' },
    { icon: IconBox, label: 'Products', value: 'products', href: '/admin/products' },
    { icon: IconBox, label: 'Categories', value: 'categories', href: '/admin/categories' },
    { icon: IconShoppingCart, label: 'Orders', value: 'orders', href: '/admin/orders' },
    { icon: IconUsers, label: 'Customers', value: 'customers', href: '/admin/customers' },
    { icon: IconChartBar, label: 'Reports', value: 'reports', href: '/admin/reports' },
    { icon: IconSettings, label: 'Settings', value: 'settings', href: '/admin/settings' },
  ];

  if (!user) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  return (
    <AppShell
      padding="md"
      header={{ height: 60 }}
      navbar={{ width: collapsed ? 80 : 250, breakpoint: 'sm', collapsed: { mobile: collapsed } }}
      className={isDarkMode ? 'dark' : ''}
    >
      <AppShell.Header className="z-40 border-b border-gray-200 dark:border-zinc-800 px-4">
        <Group h="100%" justify="space-between">
          <Group>
            <Burger opened={!collapsed} onClick={() => setCollapsed(!collapsed)} size="sm" />
            <Link href="/" className="font-serif text-2xl font-semibold tracking-normal">
              Framio
            </Link>
          </Group>
          <Group>
            <ActionIcon variant="outline" color="gray" onClick={() => setIsDarkMode(!isDarkMode)}>
              {isDarkMode ? <IconSun size={18} /> : <IconMoon size={18} />}
            </ActionIcon>
            <Indicator inline label="3" size={16}>
              <ActionIcon variant="outline" color="gray">
                <IconBell size={18} />
              </ActionIcon>
            </Indicator>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <UnstyledButton>
                  <Group gap="xs">
                    <Avatar src={null} alt={user.name} color="blue" radius="xl" />
                    <div className="hidden sm:block">
                      <Text size="sm" fw={500}>{user.name}</Text>
                      <Text size="xs" c="dimmed">{user.email}</Text>
                    </div>
                  </Group>
                </UnstyledButton>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Label>Application</Menu.Label>
                <Menu.Item leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}>
                  Settings
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item color="red" leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />} onClick={handleLogout}>
                  Logout
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
          </Group>
        </Group>
      </AppShell.Header>

      <AppShell.Navbar p="md" className="border-r border-gray-200 dark:border-zinc-800">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link href={item.href} key={item.label}>
              <UnstyledButton
                className={`w-full p-2 rounded-md transition-colors ${
                  isActive
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-gray-100 dark:hover:bg-zinc-800'
                }`}
              >
                <Group>
                  <item.icon size={20} />
                  {!collapsed && <Text size="sm">{item.label}</Text>}
                </Group>
              </UnstyledButton>
            </Link>
          );
        })}
      </AppShell.Navbar>

      <AppShell.Main className="bg-gray-50 dark:bg-zinc-900 transition-colors duration-200">
        {children}
      </AppShell.Main>
    </AppShell>
  );
}
