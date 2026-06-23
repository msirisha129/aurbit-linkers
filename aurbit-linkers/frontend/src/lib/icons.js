import {
  Building2,
  FileBadge2,
  ShieldCheck,
  Receipt,
  Banknote,
  Landmark,
  ClipboardCheck,
  Globe,
  Gift,
  Sparkles,
} from 'lucide-react';

export const iconMap = {
  'building-2': Building2,
  'file-badge-2': FileBadge2,
  'shield-check': ShieldCheck,
  receipt: Receipt,
  banknote: Banknote,
  landmark: Landmark,
  'clipboard-check': ClipboardCheck,
  globe: Globe,
  gift: Gift,
  sparkles: Sparkles,
};

export function getIcon(name) {
  return iconMap[name] || Building2;
}
