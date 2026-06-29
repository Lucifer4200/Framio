"use client";

import { Button, Group, Modal, Select, Stack, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { formatCurrency } from "../../../utils/format";

type OrderModalProps = {
  opened: boolean;
  selectedOrder: any;
  status: string;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onStatusUpdate: () => void;
};

export default function OrderModal({
  opened,
  selectedOrder,
  status,
  onClose,
  onStatusChange,
  onStatusUpdate,
}: OrderModalProps) {
  return (
    <Modal.Root opened={opened} onClose={onClose} fullScreen centered>
      <Modal.Overlay />
      <Modal.Content>
        <Modal.Header>
          <Modal.Title>Order {selectedOrder?.order_number}</Modal.Title>
          <span onClick={onClose} className="framio-Modal-header-close">
            <IconX stroke={2} />
          </span>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <Stack className="!max-w-[526px] mx-auto">
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
                <Text>{selectedOrder.phone || "N/A"}</Text>
              </Group>

              <Select
                label="Update Status"
                data={[
                  { value: "pending", label: "Pending" },
                  { value: "confirmed", label: "Confirmed" },
                  { value: "processing", label: "Processing" },
                  { value: "shipped", label: "Shipped" },
                  { value: "delivered", label: "Delivered" },
                  { value: "cancelled", label: "Cancelled" },
                ]}
                value={status}
                onChange={(val) => onStatusChange(val || "")}
              />

              <Button onClick={onStatusUpdate}>Update Status</Button>
            </Stack>
          )}
        </Modal.Body>
      </Modal.Content>
    </Modal.Root>
  );
}
