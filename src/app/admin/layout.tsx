'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { LayoutDashboard, Megaphone, BrainCircuit, LogOut, Wind } from 'lucide-react';
import React from 'react';

const adminNavItems = [
  { href: '/admin/dashboard', label: 'Dashboard', icon: <LayoutDashboard /> },
  { href: '/admin/broadcast', label: 'Broadcast', icon: <Megaphone /> },
  { href: '/admin/crowd-predictor', label: 'Crowd Predictor', icon: <BrainCircuit /> },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-2">
            <Wind className="size-8 text-primary" />
            <div className="flex flex-col">
              <span className="font-headline text-xl font-bold">Govinda Seva</span>
              <span className="text-sm text-muted-foreground">Admin Panel</span>
            </div>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            {adminNavItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <Link href={item.href}>
                  <SidebarMenuButton isActive={pathname === item.href}>
                    {item.icon}
                    <span>{item.label}</span>
                  </SidebarMenuButton>
                </Link>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarHeader>
           <Link href="/login">
            <Button variant="outline" className="w-full">
              <LogOut className="mr-2 size-4" />
              Logout
            </Button>
          </Link>
        </SidebarHeader>
      </Sidebar>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}
