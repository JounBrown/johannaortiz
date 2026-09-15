import { type LucideIcon, Users } from "lucide-react";

import {
  IconHome,
  IconPackages,
} from "../components/icons";

export interface NavigationItem {
  title: string;
  url: string;
  icon: LucideIcon;
}

export const NAVIGATION_ITEMS: readonly NavigationItem[] = [
  { title: "Inicio", url: "/dashboard", icon: IconHome },
  { title: "Empleados", url: "/empleados", icon: Users },
] as const;
