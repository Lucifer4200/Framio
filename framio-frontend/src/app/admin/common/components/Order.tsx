"use client";

import { useEffect } from "react";
import { Controller, type SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Group, Modal, NumberInput, Select, Text } from "@mantine/core";
import { IconX } from "@tabler/icons-react";
import { formatCurrency } from "../../../../utils/format";
import {
  orderStatusSchema,
  type OrderStatusFormData,
} from "../schemas/order";

type OrderModalProps = {
  opened: boolean;
  selectedOrder: any;
  status: string;
  onClose: () => void;
  onStatusChange: (status: string) => void;
  onStatusUpdate: (status: string) => void;
};

export default function OrderModal({
  opened,
  selectedOrder,
  status,
  onClose,
  onStatusChange,
  onStatusUpdate,
}: OrderModalProps) {
  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<OrderStatusFormData>({
    resolver: yupResolver(orderStatusSchema),
    defaultValues: { status },
  });

  useEffect(() => {
    reset({ status });
  }, [reset, status]);

  const handleValidSubmit: SubmitHandler<OrderStatusFormData> = (values) => {
    onStatusChange(values.status);
    onStatusUpdate(values.status);
  };

  const phoneValue = Number(selectedOrder?.phone);

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
        <form onSubmit={handleSubmit(handleValidSubmit)} className="flex flex-col gap-4">
          <Modal.Body>
            {selectedOrder && (
              <div className="!max-w-[526px] mx-auto">
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

              <NumberInput
                label="Phone"
                value={Number.isFinite(phoneValue) ? phoneValue : undefined}
                hideControls
                disabled
              />

              <Controller
                name="status"
                control={control}
                render={({ field }) => (
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
                    value={field.value}
                    onChange={(val) => {
                      const nextStatus = val || "";
                      field.onChange(nextStatus);
                      onStatusChange(nextStatus);
                    }}
                    error={errors.status?.message}
                  />
                )}
              />
              </div>
            )}
          </Modal.Body>
          {selectedOrder && (
            <div className="framio-Modal-footer">
              <div className="framio-Modal-footer-doubleButton max-w-520">
                <Button type="submit" fullWidth>
                  Update Status
                </Button>
              </div>
            </div>
          )}
        </form>
      </Modal.Content>
    </Modal.Root>
  );
}
