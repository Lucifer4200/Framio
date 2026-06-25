import {
  VariantColorsResolver,
  createTheme,
  defaultVariantColorsResolver,
  parseThemeColor,
} from "@mantine/core";

const variantColorResolver: VariantColorsResolver = (input) => {
  const defaultResolvedColors = defaultVariantColorsResolver(input);

  const parsedColor = parseThemeColor({
    color: input.color || input.theme.primaryColor,
    theme: input.theme,
  });

  // Add new variants support
  // if (input.variant === "light") {
  //   return {
  //     background: "var(--framio-color-grey-low)",
  //     hover: "var(--framio-color-grey-low)",
  //     color: "var(--framio-color-secondary)",
  //     border: "none",
  //   };
  // }

  if (parsedColor.isThemeColor && parsedColor.color === input.theme.primaryColor && input.variant === "light") {
    return {
      ...defaultResolvedColors,
      // hoverColor: "var(--framio-color-primary-light)",
      background: "var(--framio-color-primary-light)",
    };
  }
  return defaultResolvedColors;
};

export const theme = createTheme({
  /** Your theme override here */
  autoContrast: true,
  luminanceThreshold: 0.4,
  fontFamily: "Outfit, sans-serif",
  colors: {
    background: [
      "color-mix(in srgb, var(--framio-color-background), #FFF 60%)", //0
      "color-mix(in srgb, var(--framio-color-background), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-background), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-background), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-background), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-background), #FFF 10%)", //5
      "var(--framio-color-background)", // 6 Base color
      "color-mix(in srgb, var(--framio-color-background), #000 15%)", // 7
      "color-mix(in srgb, var(--framio-color-background), #000 25%)", // 8
      "color-mix(in srgb, var(--framio-color-background), #000 35%)", // 9
    ],
    foreground: [
      "color-mix(in srgb, var(--framio-color-foreground), #FFF 60%)", //0
      "color-mix(in srgb, var(--framio-color-foreground), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-foreground), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-foreground), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-foreground), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-foreground), #FFF 10%)", //5
      "var(--framio-color-foreground)", // 6 Base color
      "color-mix(in srgb, var(--framio-color-foreground), #000 15%)", // 7
      "color-mix(in srgb, var(--framio-color-foreground), #000 25%)", // 8
      "color-mix(in srgb, var(--framio-color-foreground), #000 35%)", // 9
    ],
    v2foreground: [
      "color-mix(in srgb, var(--framio-color-v2foreground), #FFF 60%)", //0
      "color-mix(in srgb, var(--framio-color-v2foreground), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2foreground), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-v2foreground), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-v2foreground), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-v2foreground), #FFF 10%)", //5
      "var(--framio-color-v2foreground)", // 6 Base color
      "color-mix(in srgb, var(--framio-color-v2foreground), #000 15%)", // 7
      "color-mix(in srgb, var(--framio-color-v2foreground), #000 25%)", // 8
      "color-mix(in srgb, var(--framio-color-v2foreground), #000 35%)", // 9
    ],
    primary: [
      "var(--framio-color-primary)", //0
      "color-mix(in srgb, var(--framio-color-primary), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-primary), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-primary), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-primary), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-primary), #FFF 10%)", //5
      "var(--framio-color-primary)", //6 base color
      "color-mix(in srgb, var(--framio-color-primary), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-primary), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-primary), #000 35%)", //9
    ],
    v2primary: [
      "var(--framio-color-v2primary)", //0
      "color-mix(in srgb, var(--framio-color-v2primary), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2primary), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-v2primary), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-v2primary), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-v2primary), #FFF 10%)", //5
      "var(--framio-color-v2primary)", //6 base color
      "color-mix(in srgb, var(--framio-color-v2primary), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-v2primary), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-v2primary), #000 35%)", //9
    ],
    secondary: [
      "color-mix(in srgb, var(--framio-color-secondary), #FFF 60%)", //0
      "color-mix(in srgb, var(--framio-color-secondary), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-secondary), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-secondary), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-secondary), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-secondary), #000 10%)", //5
      "var(--framio-color-secondary)", //6 base color
      "color-mix(in srgb, var(--framio-color-secondary), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-secondary), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-secondary), #000 35%)", //9
    ],
    danger: [
      "var(--framio-color-danger-light)", //0
      "color-mix(in srgb, var(--framio-color-danger), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-danger), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-danger), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-danger), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-danger), #FFF 10%)", //5
      "var(--framio-color-danger)", //6 base color
      "color-mix(in srgb, var(--framio-color-danger), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-danger), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-danger), #000 35%)", //9
    ],

    grey: [
      "color-mix(in srgb, var(--framio-color-grey), #FFF 60%)", //0
      "color-mix(in srgb, var(--framio-color-grey), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-grey), #FFF 40%)", //2
      "var(--framio-color-grey-low)", //3
      "var(--framio-color-grey-btn)", //4
      "var(--framio-color-grey-medium)", //5
      "var(--framio-color-grey)", //6 base color
      "color-mix(in srgb, var(--framio-color-grey), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-grey), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-grey), #000 35%)", //9
    ],

    v2grey: [
      "color-mix(in srgb, var(--framio-color-v2grey), #FFF 60%)", //0
      "color-mix(in srgb, var(--framio-color-v2grey), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2grey), #FFF 40%)", //2
      "var(--framio-color-v2grey-low)", //3
      "var(--framio-color-v2grey-btn)", //4
      "var(--framio-color-v2grey-medium)", //5
      "var(--framio-color-v2grey)", //6 base color
      "color-mix(in srgb, var(--framio-color-v2grey), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-v2grey), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-v2grey), #000 35%)", //9
    ],

    green: [
      "color-mix(in srgb, var(--framio-color-green), #FFF 60%)", //0
      "color-mix(in srgb, var(--framio-color-green), #FFF 50%)", //1
      "var(--framio-color-green-medium)", //2
      "var(--framio-color-green-low)", //3
      "var(--framio-color-green-btn)", //4
      "var(--framio-color-green-middle)", //5
      "var(--framio-color-green)", //6 base color
      "color-mix(in srgb, var(--framio-color-green), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-green), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-green), #000 35%)", //9
    ],
    v2orange: [
      "var(--framio-color-v2orange)", //0
      "color-mix(in srgb, var(--framio-color-v2orange), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2orange), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-v2orange), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-v2orange), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-v2orange), #FFF 10%)", //5
      "var(--framio-color-v2orange)", //6 base color
      "color-mix(in srgb, var(--framio-color-v2orange), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-v2orange), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-v2orange), #000 35%)", //9
    ],
    v2purple: [
      "var(--framio-color-v2purple)", //0
      "color-mix(in srgb, var(--framio-color-v2purple), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2purple), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-v2purple), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-v2purple), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-v2purple), #FFF 10%)", //5
      "var(--framio-color-v2purple)", //6 base color
      "color-mix(in srgb, var(--framio-color-v2purple), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-v2purple), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-v2purple), #000 35%)", //9
    ],
    v2cyan: [
      "var(--framio-color-v2cyan)", //0
      "color-mix(in srgb, var(--framio-color-v2cyan), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2cyan), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-v2cyan), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-v2cyan), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-v2cyan), #FFF 10%)", //5
      "var(--framio-color-v2cyan)", //6 base color
      "color-mix(in srgb, var(--framio-color-v2cyan), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-v2cyan), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-v2cyan), #000 35%)", //9
    ],
    v2rose: [
      "var(--framio-color-v2rose)", //0
      "color-mix(in srgb, var(--framio-color-v2rose), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2rose), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-v2rose), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-v2rose), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-v2rose), #FFF 10%)", //5
      "var(--framio-color-v2rose)", //6 base color
      "color-mix(in srgb, var(--framio-color-v2rose), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-v2rose), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-v2rose), #000 35%)", //9
    ],
    v2gold: [
      "var(--framio-color-v2gold)", //0
      "color-mix(in srgb, var(--framio-color-v2gold), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2gold), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-v2gold), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-v2gold), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-v2gold), #FFF 10%)", //5
      "var(--framio-color-v2gold)", //6 base color
      "color-mix(in srgb, var(--framio-color-v2gold), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-v2gold), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-v2gold), #000 35%)", //9
    ],
    v2lime: [
      "var(--framio-color-v2lime)", //0
      "color-mix(in srgb, var(--framio-color-v2lime), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2lime), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-v2lime), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-v2lime), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-v2lime), #FFF 10%)", //5
      "var(--framio-color-v2lime)", //6 base color
      "color-mix(in srgb, var(--framio-color-v2lime), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-v2lime), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-v2lime), #000 35%)", //9
    ],
    v2apricot: [
      "var(--framio-color-v2apricot)", //0 (Default)
      "color-mix(in srgb, var(--framio-color-v2apricot), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2apricot), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-v2apricot), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-v2apricot), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-v2apricot), #FFF 10%)", //5
      "var(--framio-color-v2apricot)", //6 base color (#F28B5C)
      "color-mix(in srgb, var(--framio-color-v2apricot), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-v2apricot), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-v2apricot), #000 35%)", //9
    ],
    v2teal: [
      "var(--framio-color-v2teal)", //0
      "color-mix(in srgb, var(--framio-color-v2teal), #FFF 50%)", //1
      "color-mix(in srgb, var(--framio-color-v2teal), #FFF 40%)", //2
      "color-mix(in srgb, var(--framio-color-v2teal), #FFF 30%)", //3
      "color-mix(in srgb, var(--framio-color-v2teal), #FFF 20%)", //4
      "color-mix(in srgb, var(--framio-color-v2teal), #FFF 10%)", //5
      "var(--framio-color-v2teal)", //6 base color
      "color-mix(in srgb, var(--framio-color-v2teal), #000 15%)", //7
      "color-mix(in srgb, var(--framio-color-v2teal), #000 25%)", //8
      "color-mix(in srgb, var(--framio-color-v2teal), #000 35%)", //9
    ],
  },
  primaryColor: "primary",
  components: {
    AppShellFooter: {
      classNames: {
        footer: "framio-footer",
      },
    },
    Textarea: {
      classNames: {
        input: "dark:bg-v2foreground-900 placeholder:text-v2grey-300",
      },
    },
    // In your theme configuration
    DatePickerInput: {
      classNames: {
        root: "group framio-datepicker-input shadow-[0px_0px_12px_0px_#00000014] rounded-full font-bold ",
        wrapper: "group-hover:bg-gray-50/80 rounded-[24px] dark:group-hover:bg-gray-800/80",
        input:
          "framio-control  ![transition:all_300ms_ease-in-out_!important] !min-h-10 !h-10 !pr-10 !bg-white hover:!bg-v2grey-100 !border-none dark:!bg-v2foreground dark:hover:!bg-[rgba(255,255,255,0.12)] !text-v2foreground dark:!text-white  dark:border dark:border-transparent ",

        day: "hover:!bg-gray-100 dark:hover:!bg-gray-800 hover:!text-gray-800 dark:hover:!text-white data-[selected]:bg-v2foreground dark:data-[selected]:bg-white data-[selected]:text-white dark:data-[selected]:text-v2foreground !rounded-full",
        calendarHeaderControl: "hover:!bg-gray-100 dark:hover:!bg-gray-800 dark:text-white",
        calendarHeaderLevel: "hover:!bg-gray-100 dark:hover:!bg-gray-800 dark:text-white",
        weekday: "text-v2foreground dark:text-white",
        section: "w-10 [&_i]:text-lg [&_.icon-filter]:text-lg [&_.icon-cross1]:text-lg text-black   [&_.icon-filter]:dark:!text-white [&_.icon-cross1]:dark:!text-white",
      },
      styles: {
        root: {
          // color: "red",
        },

        wrapper: {
          width: "100%",
        },
        input: {
          borderRadius: "24px",
          paddingLeft: "16px",
          transition: "all 200ms ease-in-out",
          // "&, &:focus, &:focus-within, &:focus-visible, &:active, &[data-focused], &[data-focus-visible]": {
          //   outline: "none !important",
          //   border: "none !important",
          //   boxShadow: "none !important",
          //   ring: "none !important",
          //   WebkitTapHighlightColor: "transparent",
          // },
          "&:focus, &:focus-within, &:focus-visible, &:active, &[data-focused], &[data-focus-visible]": {
            outline: "none !important",
            boxShadow: "none !important",
            WebkitTapHighlightColor: "transparent",
          },
        },
      },
      defaultProps: {
        popoverProps: {
          classNames: {
            dropdown: "!rounded-xl !shadow-lg !border !border-gray-200 dark:!border-gray-700 !p-3 !bg-white dark:!bg-v2foreground !text-black dark:!text-white",
          },
        },
      },
    },
    Tooltip: {
      defaultProps: {
        withArrow: true,
        arrowSize: 8,
        transitionProps: { transition: "pop", duration: 300 },
      },
      classNames: {
        tooltip: "tooltip-sm",
      },
    },
    ModalCloseButton: {
      defaultProps: {
        className: "modal-close-hover",
      },
    },
    Modal: {
      defaultProps: {
        transitionProps: { transition: "fade-down", duration: 500 },
      },

      vars: (_: unknown, props: { size?: string; verticalSpacing?: string }) => {
        if (props.size == "md" || props.size == "" || props.size == undefined) {
          return {
            root: {
              "--modal-size": "var(--framio-modal-width-md)",
            },
          };
        }

        return { root: {} };
      },
    },
    ModalRoot: {
      defaultProps: {
        transitionProps: { transition: "fade-down", duration: 500 },
      },
    },
    ModalContent: {
      defaultProps: {
        radius: "0px",
      },
    },
    Burger: {
      classNames: {
        burger: "w-4",
      },
    },
    InputWrapper: {
      defaultProps: {
        inputWrapperOrder: ["label", "error", "input", "description"],
      },
      classNames: {
        label: "text-foreground dark:text-white mb-1",
        error: "text-red mt-1",
      },
    },
    Input: {
      defaultProps: {
        variant: "filled",
        size: "lg",
      },
      classNames: {
        wrapper: "mt-0",
        input:
          "framio-control transition-all text-v2foreground dark:text-white duration-300 ease-in-out hover:border-blue-400 focus:border-blue-400 dark:bg-v2foreground dark:border-v2primary-600 dark:text-v2grey-50 rounded-4xl dark:hover:!border-v2primary-100 dark:read-only:hover:!border-transparent dark:disabled:!border-transparent",
      },
    },
    Select: {
      classNames: {
        wrapper: "bg-grey-btn bg-transparent rounded-[32px]   transition-all duration-300 ease-in-out ",
        label: "text-v2foreground dark:text-white",

        input:
          "bg-transparent hover:rounded-[32px] dark:hover:rounded-[32px] dark:!bg-v2foreground dark:!text-v2grey-50 read-only:!border-transparent disabled:!border-transparent",
        dropdown: "dark:bg-v2foreground-light dark:!border-v2primary ",
        option: "dark:text-white dark:hover:bg-v2primary",
      },
    },

    NumberInput: {
      classNames: {
        input: "framio-control transition-all duration-300 ease-in-out hover:border-blue-400 focus:border-blue-400",
      },
    },
    TagsInput: {
      styles: {
        input: {
          paddingBlock: "13px",
          paddingInline: "12px",
        },
        inputField: {
          flex: "auto",
          width: "100%",
          order: -1,
        },
        pill: {
          height: "auto",
          minHeight: "30px",
          borderRadius: "8px",
          fontSize: "var(--framio-para-fs-sm)",
          background: "var(--framio-color-natural-white)",
          border: "1px solid var(--framio-color-grey-medium)",
        },
      },
    },
    MultiSelect: {
      styles: {
        input: {
          paddingBlock: "13px",
          paddingInline: "12px",
        },
        inputField: {
          flex: "auto",
          width: "100%",
          order: -1,
        },
        pill: {
          height: "auto",
          minHeight: "30px",
          borderRadius: "8px",
          fontSize: "var(--framio-para-fs-sm)",
          background: "var(--framio-color-natural-white)",
          border: "1px solid var(--framio-color-grey-medium)",
        },
      },
    },
    Button: {
      defaultProps: {
        variant: "filled",
        size: "md",
        radius: "xl",
        color: "v2foreground",
        classNames: {
          root: "font-medium px-3",
        },
      },
      vars: (_: unknown, props: { size?: string; verticalSpacing?: string }) => {
        if (props.size == "lg") {
          return {
            root: {
              "--button-height": "var(--framio-btn-lg-height)",
            },
          };
        } else if (props.size == "md" || props.size == "") {
          return {
            root: {
              "--button-height": "var(--framio-btn-md-height)",
            },
          };
        } else if (props.size == "sm") {
          return {
            root: {
              "--button-height": "var(--framio-btn-sm-height)",
              "--button-padding-x": "var(--framio-btn-pad-x-sm)",
            },
            label: {
              "--button-text": "var(--framio-para-fs-sm)",
              "--font-weight": "var(--framio-fw-medium)",
            },
          };
        } else if (props.size == "sm-2") {
          return {
            root: {
              "--button-height": "var(--framio-btn-sm-2-height)",
              "--button-padding-x": "var(--framio-btn-pad-x-sm-2)",
            },
            label: {
              "--button-text": "var(--framio-para-fs-sm)",
              "--font-weight": "var(--framio-fw-medium)",
            },
          };
        } else if (props.size == "esm") {
          return {
            root: {
              "--button-height": "var(--framio-btn-esm-height)",
              "--button-padding-x": "var(--framio-btn-pad-x-esm)",
            },
            label: {
              "--button-text": "var(--framio-para-fs-sm)",
            },
          };
        } else if (props.size == "xs") {
          return {
            root: {
              "--button-height": "var(--framio-btn-xs-height)",
              "--button-fz": "var(--framio-para-fs-sm)",
            },
          };
        } else if (props.size == "xxs") {
          return {
            root: {
              "--button-height": "var(--framio-btn-xxs-height)",
              "--button-fz": "var(--framio-para-fs-xs)",
              "--button-padding-x": "var(--framio-btn-pad-x-xxs)",
              "--button-radius": "var(--framio-border-radius)",
            },
          };
        }

        return { root: {} };
      },
    },
    Table: {
      vars: (_: unknown, props: { size?: string; verticalSpacing?: string }) => {
        if (props.verticalSpacing == "md") {
          return {
            table: {
              "--table-vertical-spacing": "var(--framio-table-vr-spacing-md)",
            },
          };
        }
        return { table: {} };
      },
    },
    Pagination: {
      vars: () => {
        return {
          root: {
            "--pagination-control-fz": "16px",
            "--pagination-control-size": "48px",
            "--pagination-control-radius": "8px",
          },
        };
      },
    },
    ActionIcon: {
      vars: (_: unknown, props: { size?: string; verticalSpacing?: string }) => {
        if (props.size == "lg") {
          return {
            root: {
              "--ai-size": "var(--framio-action-icon-size-md)",
            },
          };
        }
        return { root: {} };
      },
    },
    Checkbox: {
      defaultProps: {
        color: "foreground",
      },
    },
    PinInput: {
      classNames: {
        pinInput: "framio-control-pinInput",
        input: "framio-control-pinInput-inputHeight",
      },
    },
    Switch: {
      styles: {
        root: {
          background: "white",
          borderRadius: "8px",
          paddingInline: "12.25px",
          paddingBlock: "9px",
          boxShadow: "var(--framio-box-shadow)",
        },
        label: {
          fontSize: "17px",
          color: "var(--framio-color-foreground)",
        },
        track: {
          height: "30px",
          width: "50px",
        },
        body: {
          alignItems: "Center",
        },
        thumb: {
          height: "15px",
          width: "15px",
        },
        trackLabel: {
          // marginInlineEnd: "20px",
        },
      },
    },
    PillsInputField: {
      classNames: {
        field: "text-v2foreground dark:text-white placeholder:text-v2grey-50",
      },
    },
    DateInput: {
      defaultProps: {
        variant: "filled",
        size: "lg",
      },
      classNames: {
        root: "group framio-date-input",
        wrapper: "mt-0",
        input:
          "framio-control transition-all text-v2foreground dark:text-white duration-300 ease-in-out hover:border-blue-400 focus:border-blue-400 dark:bg-v2foreground dark:border-v2primary-600 dark:text-v2grey-50 rounded-4xl dark:hover:!border-v2primary-100 dark:read-only:hover:!border-transparent placeholder:text-gray-400 dark:placeholder:text-white disabled:!border-transparent disabled:hover:!border-transparent disabled:cursor-not-allowed",
        section: "text-black dark:text-white [&_i]:text-lg [&_.icon-calendar]:text-2xl disabled:opacity-50",
        day: "hover:!bg-gray-100 dark:hover:!bg-gray-800 hover:!text-gray-800 dark:hover:!text-white data-[selected]:bg-v2foreground dark:data-[selected]:bg-white data-[selected]:text-white dark:data-[selected]:text-v2foreground !rounded-full",
        calendarHeaderControl: "hover:!bg-gray-100 dark:hover:!bg-gray-800 dark:text-white",
        calendarHeaderLevel: "hover:!bg-gray-100 dark:hover:!bg-gray-800 dark:text-white",
        weekday: "text-v2foreground dark:text-white",
      },
      styles: {
        input: {
          "&:focus, &:focus-within, &:focus-visible, &:active, &[data-focused], &[data-focus-visible]": {
            outline: "none !important",
            boxShadow: "none !important",
            WebkitTapHighlightColor: "transparent",
          },
          "&:disabled": {
            opacity: 0.6,
            cursor: "not-allowed",
          },
        },
      },
    },

    Menu: {
      styles: {
        dropdown: {
          padding: "0px",
          borderRadius: "8px",
        },
        item: {
          padding: "8px 16px",
          color: "var(--framio-color-foreground)",
        },
        itemLabel: {
          lineHeight: "20px",
        },
      },
      classNames: {
        dropdown: "framio-menu-dropdown",
        item: "framio-Menu-item-custom",
      },
    },
    ScrollArea: {
      defaultProps: {
        scrollbarSize: 6,
      },
      classNames: {
        viewport: "ai-chat-viewport",
      },
    },
  },
  // notification: {
  //   defaultProps: {
  //     icon: '<i className="checkmark-circle"></i>',
  //   },
  // },
  variantColorResolver: variantColorResolver,
  cursorType: "pointer",

  other: {
    Notification: {
      defaultProps: {
        icon: '<i className="checkmark-circle"></i>',
      },
      classNames: {
        body: "bg-red",
      },
    },
  },
});
