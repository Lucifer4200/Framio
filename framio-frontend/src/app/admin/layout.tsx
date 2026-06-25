"use client";

import { useEffect, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  AppShell,
  Text,
  Burger,
  NavLink,
  ScrollArea,
  Tooltip,
  Box,
  Loader,
} from "@mantine/core";
import Link from "next/link";
import dayjs from "dayjs";
import { API_URL } from "../../services/api";
import {
  IconDashboard,
  IconBox,
  IconShoppingCart,
  IconUsers,
  IconChartBar,
  IconSettings,
} from "@tabler/icons-react";
import { useAtom } from "jotai";
import {
  darkModeAtom,
  sidebarCollapsedAtom,
  userAtom,
} from "@/atoms/admin-atoms";
import AdminHeader from "@/components/AdminHeader";

const navItems = [
  { icon: IconDashboard, label: "Dashboard", href: "/admin", exact: true },
  { icon: IconBox, label: "Products", href: "/admin/products" },
  { icon: IconBox, label: "Categories", href: "/admin/categories" },
  { icon: IconShoppingCart, label: "Orders", href: "/admin/orders" },
  { icon: IconUsers, label: "Customers", href: "/admin/customers" },
  { icon: IconChartBar, label: "Reports", href: "/admin/reports" },
  { icon: IconSettings, label: "Settings", href: "/admin/settings" },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useAtom(userAtom);
  const [collapsed, setCollapsed] = useAtom(sidebarCollapsedAtom);
  const [isDarkMode, setIsDarkMode] = useAtom(darkModeAtom);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const checkAdminAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!response.ok) throw new Error("Auth failed");

        const data = await response.json();

        if (data.user?.role !== "admin") {
          router.push("/");
          return;
        }

        setUser(data.user);
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/login");
      }
    };

    if (!user) {
      checkAdminAuth();
    }
  }, [router, setUser, user]);

  const handleLogout = async () => {
    localStorage.removeItem("token");
    setUser(null);
    router.push("/");
  };

  if (!user) {
    return (
      <div className="flex h-screen items-center justify-center bg-background dark:bg-v2foreground">
        <Loader color="v2primary" />
      </div>
    );
  }

  return (
    <AppShell
      padding={0}
      header={{ height: 65 }}
      footer={{ height: 42 }}
      navbar={{
        width: collapsed ? 84 : 268,
        breakpoint: "md",
        collapsed: { mobile: collapsed },
      }}
      withBorder={false}
      className={`${isDarkMode ? "dark" : ""} min-h-screen bg-background dark:bg-v2foreground`}
    >
      <AppShell.Header
        className="framio-header z-40 border-b border-v2grey-100 bg-white px-4 transition-opacity duration-300 dark:border-v2foreground-700 dark:bg-v2foreground"
        style={{
          opacity: isScrolled ? 0 : 1,
          pointerEvents: isScrolled ? "none" : "all",
        }}
      >
        <AdminHeader
          collapsed={collapsed}
          isDarkMode={isDarkMode}
          user={user}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          onToggleColorScheme={() => setIsDarkMode(!isDarkMode)}
          onLogout={handleLogout}
        />
      </AppShell.Header>

      <AppShell.Navbar
        p={0}
        className={`framio-sideNavbar border-r-0 bg-v2foreground transition-all duration-300 ${collapsed ? "framio-sideNavbar-closed" : ""}`}
      >
        <div className="flex h-full flex-col overflow-hidden rounded-ee-xl rounded-se-xl bg-v2foreground py-1">
          <div
            className={`hidden items-center gap-4 border-b border-v2foreground-700 px-6 py-[14px] transition-all duration-300 lg:flex ${collapsed ? "justify-center px-0" : "justify-start"}`}
          >
            <Tooltip
              label={collapsed ? "Show menu" : "Hide menu"}
              position="right"
              withArrow
            >
              <button
                type="button"
                className="flex size-8 items-center justify-center rounded-md text-white transition-colors hover:bg-v2foreground-800"
                onClick={() => setCollapsed(!collapsed)}
                aria-label={collapsed ? "Show menu" : "Hide menu"}
              >
                <Burger opened={!collapsed} size="sm" color="white" />
              </button>
            </Tooltip>

            <Link
              href="/admin"
              className={`overflow-hidden font-serif text-2xl font-semibold text-white transition-all duration-500 ease-in-out ${collapsed ? "invisible w-0 -translate-x-4 opacity-0" : "visible w-auto translate-x-0 opacity-100"}`}
            >
              Framio
            </Link>
          </div>

          <ScrollArea.Autosize
            type="hover"
            scrollbarSize={6}
            scrollbars="y"
            offsetScrollbars
            mah="100%"
            classNames={{
              root: "h-[calc(100vh_-_112px)]",
              viewport: "px-0",
            }}
            styles={{
              viewport: {
                WebkitOverflowScrolling: "touch",
              },
            }}
          >
            <Box className="flex flex-col">
              {navItems.map((item) => {
                const isActive = item.exact
                  ? pathname === item.href
                  : pathname === item.href ||
                    pathname.startsWith(`${item.href}/`);
                const Icon = item.icon;

                return (
                  <Tooltip
                    key={item.label}
                    label={item.label}
                    offset={{ mainAxis: -20 }}
                    position="right"
                    events={{
                      hover: collapsed,
                      focus: collapsed,
                      touch: collapsed,
                    }}
                  >
                    <NavLink
                      component={Link}
                      href={item.href}
                      label={
                        <span
                          className={`text-sm font-medium ${collapsed ? "lg:opacity-0" : ""}`}
                        >
                          {item.label}
                        </span>
                      }
                      leftSection={<Icon size={24} stroke={1.8} />}
                      active={isActive}
                      px={15}
                      py={24}
                      className={`framio-sidebar-navlink font-medium text-white hover:bg-v2primary-800 ${isActive ? "bg-v2primary text-white" : "text-white"}`}
                      classNames={{
                        label: "truncate",
                        section: "text-white",
                      }}
                    />
                  </Tooltip>
                );
              })}
            </Box>
          </ScrollArea.Autosize>
        </div>
      </AppShell.Navbar>

      <AppShell.Main
        className={`bg-background transition-all duration-300 dark:bg-v2foreground-900 ${
          isScrolled ? "pt-0 pb-0" : "pt-[65px] pb-[42px]"
        }`}
      >
        <ScrollArea
          type="auto"
          scrollbarSize={6}
          scrollbars="y"
          onScrollPositionChange={({ y }) => setIsScrolled(y > 120)}
          classNames={{
            viewport: "only-vertical-scroll",
          }}
          styles={{
            root: {
              height:
                "calc(100vh - var(--app-shell-header-height, 65px) - var(--app-shell-footer-height, 42px))",
            },
            viewport: {
              WebkitOverflowScrolling: "touch",
            },
          }}
        >
          <div className="framio-appShell-main-custom-style mx-auto w-full max-w-[1440px] p-4 md:p-6">
            {children}
          </div>
        </ScrollArea>
      </AppShell.Main>

      <AppShell.Footer
        className="footer-bottom border-t-0 bg-white transition-transform duration-300 dark:bg-v2foreground"
        style={{
          transition: "transform 400ms ease",
          transform: isScrolled ? "translateY(100%)" : "translateY(0)",
        }}
      >
        <Text className="text-grey text-fs-xs" px={6} py={8}>
          Copyright (c) {dayjs().format("YYYY")} Framio. All rights reserved.
        </Text>
      </AppShell.Footer>
    </AppShell>
  );
}
