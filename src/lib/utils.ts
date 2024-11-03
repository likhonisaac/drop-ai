import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import TimeAgo from "javascript-time-ago";
import en from "javascript-time-ago/locale/en";
TimeAgo.addDefaultLocale(en);

export const timeAgo = new TimeAgo("en-US");
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
