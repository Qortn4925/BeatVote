'use client';

import Link from 'next/link';
import { LucideIcon } from 'lucide-react';
import { ReactNode } from 'react';
import { Button} from '../ui/button';

interface RouteButtonProps extends React.ComponentPropsWithoutRef<typeof Button> {
  href: string;
  icon?: LucideIcon;
  iconSize?: number;
}

export default function RouteButton({
  href,
  icon: Icon,
  children,
  className,
  variant = 'outline', // 기본 스타일 설정
  ...props
}: RouteButtonProps) {
  return (
    <Button asChild variant={variant} className={className} {...props}>
      <Link href={href} className="flex items-center gap-2">
        {Icon && <Icon size={18} className="shrink-0" />}
        {children}
      </Link>
    </Button>
  );
}