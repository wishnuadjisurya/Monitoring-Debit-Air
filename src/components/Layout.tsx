import { useState } from 'react';
import { 
  LayoutDashboard, 
  Building2, 
  Activity, 
  FileText, 
  Map, 
  Bell, 
  Settings, 
  Menu,
  Droplets,
  LogOut,
  User
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { alerts } from '@/data/mockData';

type ViewType = 'dashboard' | 'companies' | 'monitoring' | 'reports' | 'map' | 'alerts' | 'settings';

interface LayoutProps {
  children: React.ReactNode;
  currentView: ViewType;
  onViewChange: (view: ViewType) => void;
}

const navigation = [
  { name: 'Dashboard', view: 'dashboard' as ViewType, icon: LayoutDashboard },
  { name: 'Perusahaan', view: 'companies' as ViewType, icon: Building2 },
  { name: 'Monitoring Real-time', view: 'monitoring' as ViewType, icon: Activity },
  { name: 'Rekap Laporan', view: 'reports' as ViewType, icon: FileText },
  { name: 'Peta Lokasi', view: 'map' as ViewType, icon: Map },
  { name: 'Notifikasi', view: 'alerts' as ViewType, icon: Bell },
  { name: 'Pengaturan', view: 'settings' as ViewType, icon: Settings },
];

export function Layout({ children, currentView, onViewChange }: LayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const unresolvedAlerts = alerts.filter(a => !a.resolved).length;

  const NavContent = () => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 py-5 border-b border-border/50">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center shadow-lg shadow-blue-500/20">
          <Droplets className="w-6 h-6 text-white" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-lg leading-tight">Sistem Monitoring</span>
          <span className="text-xs text-muted-foreground">Debit Air - Sulawesi Tenggara</span>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.view;
          const isAlerts = item.view === 'alerts';
          
          return (
            <button
              key={item.view}
              onClick={() => {
                onViewChange(item.view);
                setSidebarOpen(false);
              }}
              className={`
                w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                ${isActive 
                  ? 'bg-gradient-to-r from-blue-500/10 to-cyan-500/10 text-blue-600 border-r-2 border-blue-500' 
                  : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                }
              `}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'text-blue-500' : ''}`} />
              <span className="flex-1 text-left">{item.name}</span>
              {isAlerts && unresolvedAlerts > 0 && (
                <Badge variant="destructive" className="text-xs px-1.5 py-0">
                  {unresolvedAlerts}
                </Badge>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border/50">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-muted/50">
          <Avatar className="w-8 h-8">
            <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-xs">
              AD
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Admin Dinas</p>
            <p className="text-xs text-muted-foreground truncate">admin@sultra.go.id</p>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex">
      {/* Desktop Sidebar */}
      <aside className="hidden lg:block w-72 border-r border-border/50 bg-card/50 backdrop-blur-sm fixed left-0 top-0 h-screen">
        <NavContent />
      </aside>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetContent side="left" className="w-72 p-0">
          <NavContent />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 min-h-screen">
        {/* Header */}
        <header className="sticky top-0 z-40 w-full border-b border-border/50 bg-background/80 backdrop-blur-md">
          <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild className="lg:hidden">
                  <Button variant="ghost" size="icon" className="lg:hidden">
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-72 p-0">
                  <NavContent />
                </SheetContent>
              </Sheet>
              
              <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
                <span>Sistem Monitoring Debit Air</span>
                <span>/</span>
                <span className="text-foreground font-medium">
                  {navigation.find(n => n.view === currentView)?.name}
                </span>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="w-5 h-5" />
                    {unresolvedAlerts > 0 && (
                      <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full text-[10px] text-white flex items-center justify-center">
                        {unresolvedAlerts}
                      </span>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <DropdownMenuLabel className="flex items-center justify-between">
                    <span>Notifikasi</span>
                    {unresolvedAlerts > 0 && (
                      <Badge variant="destructive" className="text-xs">
                        {unresolvedAlerts} baru
                      </Badge>
                    )}
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {alerts.filter(a => !a.resolved).slice(0, 3).map((alert) => (
                    <DropdownMenuItem key={alert.id} className="flex flex-col items-start gap-1 p-3">
                      <div className="flex items-center gap-2 w-full">
                        <span className={`w-2 h-2 rounded-full ${
                          alert.severity === 'critical' ? 'bg-red-500' :
                          alert.severity === 'high' ? 'bg-orange-500' :
                          alert.severity === 'medium' ? 'bg-yellow-500' : 'bg-blue-500'
                        }`} />
                        <span className="font-medium text-sm truncate flex-1">{alert.message}</span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(alert.timestamp).toLocaleString('id-ID')}
                      </span>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="justify-center text-blue-500 cursor-pointer"
                    onClick={() => onViewChange('alerts')}
                  >
                    Lihat semua notifikasi
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Menu */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-gradient-to-br from-blue-500 to-cyan-400 text-white text-xs">
                        AD
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <User className="w-4 h-4 mr-2" />
                    Profil
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Settings className="w-4 h-4 mr-2" />
                    Pengaturan
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="text-red-500">
                    <LogOut className="w-4 h-4 mr-2" />
                    Keluar
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <div className="p-4 lg:p-6">
          {children}
        </div>
      </main>
    </div>
  );
}
