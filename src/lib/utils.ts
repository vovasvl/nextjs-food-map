import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge";

const twMergeConfig = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": ["text-22px"],
    },
  },
});

export function cn(...inputs: ClassValue[]) {
  return twMergeConfig(clsx(inputs));
}
