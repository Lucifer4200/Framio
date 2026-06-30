import { notifications } from "@mantine/notifications";
import type { NotificationData } from "@mantine/notifications";
import { IconCheck, IconX } from "@tabler/icons-react";

type DmlToastProps = Omit<NotificationData, "message"> & {
  message?: NotificationData["message"];
};

class DmlToast {
  constructor() {}

  show(props: DmlToastProps) {
    notifications.show({
      position: "top-center",
      ...props,
      message: props.message ?? "",
    });
  }
  success(props: DmlToastProps) {
    this.show({
      autoClose: true,
      withCloseButton: true,
      color: "green.5",
      icon: <IconCheck stroke={2} />,
      classNames: {
        root: "border-l-[11px] border-green-middle h-[92px] shadow-custom-2 rounded-xl",
        title: "heading-xxs",
        description: "text-fs-sm",
        closeButton: "text-foreground  dark:text-white",
      },
      ...props,
    });
  }

  error(props: DmlToastProps) {
    this.show({
      autoClose: true,
      withCloseButton: true,
      color: "danger",
      icon: <IconX stroke={2} />,
      classNames: {
        root: "border-l-[11px] border-danger h-[92px] shadow-custom-2 rounded-xl",
        title: "heading-xxs",
        description: "text-fs-sm",
        closeButton: "text-foreground dark:text-white",
      },
      ...props,
    });
  }

  warning(props: DmlToastProps) {
    this.show({
      autoClose: true,
      withCloseButton: true,
      color: "warning",
      icon: <IconX stroke={2} />,
      classNames: {
        root: "border-l-[11px] border-danger h-[92px] shadow-custom-2 rounded-xl",
        title: "heading-xxs",
        description: "text-fs-sm",
        closeButton: "text-foreground  dark:text-white",
      },
      ...props,
    });
  }
}

const dmlToast = new DmlToast();

export default dmlToast;
