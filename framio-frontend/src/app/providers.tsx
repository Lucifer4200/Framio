"use client";

import { MantineProvider } from "@mantine/core";
import { theme } from "@/common/config/mantine-theme-config";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <MantineProvider defaultColorScheme="light" classNamesPrefix="framio" theme={theme}>
      {children}
    </MantineProvider>
  );
}
