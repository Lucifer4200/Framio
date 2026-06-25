"use client";

import Link from "next/link";
import {
  ActionIcon,
  Avatar,
  Burger,
  Divider,
  Group,
  Indicator,
  Menu,
  Text,
  Tooltip,
  UnstyledButton,
  rem,
} from "@mantine/core";
import {
  IconBell,
  IconLogout,
  IconMoon,
  IconSettings,
  IconSun,
} from "@tabler/icons-react";

interface AdminHeaderUser {
  name: string;
  email: string;
}

interface AdminHeaderProps {
  collapsed: boolean;
  isDarkMode: boolean;
  user: AdminHeaderUser;
  onToggleSidebar: () => void;
  onToggleColorScheme: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  collapsed,
  isDarkMode,
  user,
  onToggleSidebar,
  onToggleColorScheme,
  onLogout,
}: AdminHeaderProps) {
  return (
    <Group className="flex items-center h-full sm:pl-[16px] pl-4 sm:pr-6 pr-4">
      <Tooltip label={collapsed ? "Show menu" : "Hide menu"} position="bottom" withArrow>
        <Burger
          opened={!collapsed}
          onClick={onToggleSidebar}
          size="sm"
          color={isDarkMode ? "white" : "dark"}
          aria-label={collapsed ? "Show menu" : "Hide menu"}
           className="lg:hidden"
        />
      </Tooltip>

      <Group className="ml-auto" gap={16} wrap="nowrap">
        <ActionIcon variant="light" color="v2primary" radius="md" onClick={onToggleColorScheme}>
          {isDarkMode ? <IconSun size={18} /> : <IconMoon size={18} />}
        </ActionIcon>

        <Indicator inline label="3" size={16}>
          <ActionIcon variant="light" color="v2primary" radius="md">
            <IconBell size={18} />
          </ActionIcon>
        </Indicator>

        <Menu shadow="md" width={220} transitionProps={{ transition: "pop-top-left", duration: 200 }}>
          <Menu.Target>
            <UnstyledButton>
              <Group className="cursor-pointer" gap={16} wrap="nowrap">
                <div className="relative overflow-visible after:absolute after:right-0 after:top-[75%] after:block after:size-2.5 after:rounded-full after:bg-green-middle">
                  <Avatar src={null} alt={user.name} color="blue" radius="xl" className="size-10 border border-grey-low" />
                </div>

                <div className="hidden flex-col gap-1 md:flex">
                  <Text className="text-base font-bold text-v2foreground dark:text-white">
                    {user.name}
                  </Text>
                  <Text className="max-w-48 truncate text-xs text-grey-medium">
                    {user.email}
                  </Text>
                </div>
              </Group>
            </UnstyledButton>
          </Menu.Target>

          <Menu.Dropdown className="dark:bg-v2foreground-900">
            <div className="px-3 pb-2 pt-3">
              <Text className="mb-2 text-xs tracking-wide text-v2foreground dark:text-white">
                Theme
              </Text>
              <button
                type="button"
                onClick={onToggleColorScheme}
                className="flex w-full items-center gap-2 rounded-lg px-2 py-2 text-left text-sm text-secondary transition-all duration-200 hover:bg-v2primary hover:text-white dark:text-white"
              >
                {isDarkMode ? <IconSun size={16} /> : <IconMoon size={16} />}
                {isDarkMode ? "Light mode" : "Dark mode"}
              </button>
            </div>

            <Divider />

            <Menu.Item
              leftSection={<IconSettings style={{ width: rem(14), height: rem(14) }} />}
              className="text-sm transition-all duration-200 dark:hover:!bg-v2primary dark:!text-white"
            >
              Settings
            </Menu.Item>

            <Divider />

            <Menu.Item
              color="red"
              leftSection={<IconLogout style={{ width: rem(14), height: rem(14) }} />}
              onClick={onLogout}
              classNames={{
                itemLabel: "text-danger",
              }}
            >
              Logout
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>
      </Group>
    </Group>
  );
}
