"use client";

import { useState, useEffect, useMemo } from "react";
import { Container, Title, SimpleGrid, Badge } from "@mantine/core";
import {
  IconTrendingUp,
  IconUsers,
  IconBox,
  IconShoppingCart,
} from "@tabler/icons-react";
import DynamicTable from "@/components/table/DynamicTable";
import MetrixCard from "../../components/cards/card";
import { API_URL } from "../../services/api";
import { formatCurrency } from "../../utils/format";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const tableProps = {
    miw: 1000,
    verticalSpacing: "sm" as const,
    withRowBorders: false,
    striped: true,
    stripedColor: "background",
    highlightOnHover: true,
    highlightOnHoverColor: "primary",
    className: "framio-list-table",
  };

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`${API_URL}/admin/dashboard`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error("Error fetching dashboard stats:", error);
    } finally {
      setLoading(false);
    }
  };

  const recentOrderColumns = useMemo(
    () => [
      {
        id: "order_number",
        label: "Order #",
        accessor: "order_number",
        align: "left" as const,
      },
      {
        id: "customer_name",
        label: "Customer",
        accessor: "customer_name",
        align: "left" as const,
      },
      {
        id: "total",
        label: "Total",
        accessor: (order: any) => `$${formatCurrency(order.total_amount)}`,
        align: "right" as const,
      },
      {
        id: "status",
        label: "Status",
        accessor: (order: any) => (
          <Badge color={order.order_status === "delivered" ? "green" : "blue"}>
            {order.order_status}
          </Badge>
        ),
        align: "right" as const,
      },
    ],
    [],
  );

  const bestSellingProductColumns = useMemo(
    () => [
      {
        id: "name",
        label: "Product",
        accessor: "name",
        align: "left" as const,
      },
      {
        id: "total_sold",
        label: "Units Sold",
        accessor: "total_sold",
        align: "right" as const,
      },
      {
        id: "revenue",
        label: "Revenue",
        accessor: (product: any) => `$${formatCurrency(product.revenue)}`,
        align: "right" as const,
      },
    ],
    [],
  );

  return (
    <Container size="xl">
      <Title order={1} mb="xl">
        Admin Dashboard
      </Title>

      {/* Stats Cards */}
      <SimpleGrid cols={{ base: 1, sm: 2, lg: 4 }} spacing="xl" mb="xl">
        <MetrixCard
          title="Total Sales"
          value={`$${formatCurrency(stats?.total_sales)}`}
          delta={stats?.sales_change_percent ?? undefined}
          deltaPositive={Number(stats?.sales_change_percent) >= 0}
          icon={<IconTrendingUp size={20} className="text-blue-600" />}
          bgIconClass="bg-blue-100"
          footerText="View more..."
        />

        <MetrixCard
          title="Total Orders"
          value={stats?.total_orders || 0}
          delta={stats?.orders_change_percent ?? undefined}
          deltaPositive={Number(stats?.orders_change_percent) >= 0}
          icon={<IconShoppingCart size={20} className="text-green-600" />}
          bgIconClass="bg-green-100"
          footerText="View more..."
        />

        <MetrixCard
          title="Total Customers"
          value={stats?.total_customers || 0}
          delta={stats?.customers_change_percent ?? undefined}
          deltaPositive={Number(stats?.customers_change_percent) >= 0}
          icon={<IconUsers size={20} className="text-purple-600" />}
          bgIconClass="bg-purple-100"
          footerText="View more..."
        />

        <MetrixCard
          title="Total Products"
          value={stats?.total_products || 0}
          delta={stats?.products_change_percent ?? undefined}
          deltaPositive={Number(stats?.products_change_percent) >= 0}
          icon={<IconBox size={20} className="text-orange-600" />}
          bgIconClass="bg-orange-100"
          footerText="View more..."
        />
      </SimpleGrid>

      {/* Recent Orders */}
      <div className="">
        <h4 className="text-foreground pb-3">Recent Orders</h4>
        <div className="card">
          <DynamicTable
            columns={recentOrderColumns}
            data={stats?.recent_orders || []}
            isLoading={loading}
            emptyMessage="No recent orders"
            tableProps={tableProps}
          />
        </div>
      </div>

      {/* Best Selling Products */}
      <div className="mt-8">
        <h4 className="text-foreground pb-3">Best Selling Products</h4>
      <div className="card">
          <DynamicTable
          columns={bestSellingProductColumns}
          data={stats?.best_selling_products || []}
          isLoading={loading}
          emptyMessage="No sales data yet"
          tableProps={tableProps}
        />
      </div>
      </div>
    </Container>
  );
}
