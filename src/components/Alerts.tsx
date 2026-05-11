import { useState } from 'react';
import { 
  Bell, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  Filter, 
  Search,
  Building2,
  Droplets,
  Check,
  AlertOctagon,
  Info
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { alerts, waterStations, getCompanyById } from '@/data/mockData';
import type { Alert } from '@/types';

export function Alerts() {
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('unresolved');
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);
  const [resolveDialogOpen, setResolveDialogOpen] = useState(false);
  const [localAlerts, setLocalAlerts] = useState<Alert[]>(alerts);

  // Filter alerts
  const filteredAlerts = localAlerts.filter(alert => {
    const company = getCompanyById(alert.companyId);
    const station = waterStations.find(s => s.id === alert.stationId);
    
    const matchesSearch = 
      alert.message.toLowerCase().includes(searchQuery.toLowerCase()) ||
      company?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      station?.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesSeverity = severityFilter === 'all' || alert.severity === severityFilter;
    const matchesType = typeFilter === 'all' || alert.type === typeFilter;
    const matchesStatus = statusFilter === 'all' ? true :
      statusFilter === 'unresolved' ? !alert.resolved :
      statusFilter === 'resolved' ? alert.resolved : true;
    
    return matchesSearch && matchesSeverity && matchesType && matchesStatus;
  });

  const unresolvedCount = localAlerts.filter(a => !a.resolved).length;
  const criticalCount = localAlerts.filter(a => !a.resolved && a.severity === 'critical').length;
  const highCount = localAlerts.filter(a => !a.resolved && a.severity === 'high').length;

  const getSeverityIcon = (severity: string) => {
    switch (severity) {
      case 'critical': return <AlertOctagon className="w-5 h-5 text-red-500" />;
      case 'high': return <AlertTriangle className="w-5 h-5 text-orange-500" />;
      case 'medium': return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  const getSeverityBadge = (severity: string) => {
    const styles: Record<string, string> = {
      critical: 'bg-red-500/10 text-red-500 border-red-500/20',
      high: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
      medium: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
      low: 'bg-blue-500/10 text-blue-500 border-blue-500/20'
    };
    return styles[severity] || styles.low;
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      threshold_exceeded: 'Threshold Melebihi',
      sensor_offline: 'Sensor Offline',
      critical_level: 'Level Kritis',
      maintenance_required: 'Perlu Maintenance'
    };
    return labels[type] || type;
  };

  const handleResolve = (alert: Alert) => {
    setSelectedAlert(alert);
    setResolveDialogOpen(true);
  };

  const confirmResolve = () => {
    if (selectedAlert) {
      setLocalAlerts(prev => prev.map(a => 
        a.id === selectedAlert.id 
          ? { ...a, resolved: true, resolvedAt: new Date().toISOString(), resolvedBy: 'Admin' }
          : a
      ));
      setResolveDialogOpen(false);
      setSelectedAlert(null);
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor(diff / (1000 * 60));
    
    if (hours > 24) return `${Math.floor(hours / 24)} hari yang lalu`;
    if (hours > 0) return `${hours} jam yang lalu`;
    if (minutes > 0) return `${minutes} menit yang lalu`;
    return 'Baru saja';
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notifikasi & Alert</h1>
          <p className="text-muted-foreground">
            Kelola dan respon alert dari sistem monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="destructive" className="px-3 py-1">
            <AlertOctagon className="w-4 h-4 mr-1" />
            {criticalCount} Kritis
          </Badge>
          <Badge variant="default" className="bg-orange-500 px-3 py-1">
            <AlertTriangle className="w-4 h-4 mr-1" />
            {highCount} Tinggi
          </Badge>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Bell className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Alert</span>
            </div>
            <div className="text-2xl font-bold">{localAlerts.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertOctagon className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Belum Diselesaikan</span>
            </div>
            <div className="text-2xl font-bold text-red-500">{unresolvedCount}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle2 className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Sudah Diselesaikan</span>
            </div>
            <div className="text-2xl font-bold text-green-500">
              {localAlerts.filter(a => a.resolved).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Respon Rata-rata</span>
            </div>
            <div className="text-2xl font-bold">2.5 jam</div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari alert..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={severityFilter} onValueChange={setSeverityFilter}>
                <SelectTrigger className="w-[130px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Severity" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua</SelectItem>
                  <SelectItem value="critical">Kritis</SelectItem>
                  <SelectItem value="high">Tinggi</SelectItem>
                  <SelectItem value="medium">Sedang</SelectItem>
                  <SelectItem value="low">Rendah</SelectItem>
                </SelectContent>
              </Select>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Tipe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Tipe</SelectItem>
                  <SelectItem value="threshold_exceeded">Threshold</SelectItem>
                  <SelectItem value="sensor_offline">Sensor Offline</SelectItem>
                  <SelectItem value="critical_level">Level Kritis</SelectItem>
                  <SelectItem value="maintenance_required">Maintenance</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Tabs */}
      <Tabs value={statusFilter} onValueChange={setStatusFilter}>
        <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
          <TabsTrigger value="unresolved">
            Belum Selesai
            {unresolvedCount > 0 && (
              <Badge variant="destructive" className="ml-2 text-xs">{unresolvedCount}</Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="resolved">Sudah Selesai</TabsTrigger>
          <TabsTrigger value="all">Semua</TabsTrigger>
        </TabsList>

        <TabsContent value={statusFilter} className="mt-4">
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12"></TableHead>
                      <TableHead>Alert</TableHead>
                      <TableHead>Perusahaan</TableHead>
                      <TableHead>Stasiun</TableHead>
                      <TableHead>Severity</TableHead>
                      <TableHead>Waktu</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAlerts.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8">
                          <CheckCircle2 className="w-12 h-12 text-green-500 mx-auto mb-3" />
                          <p className="text-muted-foreground">Tidak ada alert</p>
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredAlerts.map((alert) => {
                        const company = getCompanyById(alert.companyId);
                        const station = waterStations.find(s => s.id === alert.stationId);
                        
                        return (
                          <TableRow key={alert.id} className={alert.resolved ? 'opacity-60' : ''}>
                            <TableCell>
                              {getSeverityIcon(alert.severity)}
                            </TableCell>
                            <TableCell>
                              <div>
                                <p className="font-medium">{alert.message}</p>
                                <p className="text-xs text-muted-foreground">{getTypeLabel(alert.type)}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Building2 className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{company?.name || '-'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <Droplets className="w-4 h-4 text-muted-foreground" />
                                <span className="text-sm">{station?.name || '-'}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className={`${getSeverityBadge(alert.severity)} capitalize`}>
                                {alert.severity}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm">
                                {formatTimeAgo(alert.timestamp)}
                              </div>
                              {alert.resolved && alert.resolvedAt && (
                                <div className="text-xs text-green-600">
                                  Selesai: {formatTimeAgo(alert.resolvedAt)}
                                </div>
                              )}
                            </TableCell>
                            <TableCell className="text-right">
                              {!alert.resolved ? (
                                <Button 
                                  size="sm" 
                                  variant="outline"
                                  onClick={() => handleResolve(alert)}
                                >
                                  <Check className="w-4 h-4 mr-1" />
                                  Selesai
                                </Button>
                              ) : (
                                <Badge variant="outline" className="bg-green-500/10 text-green-500 border-green-500/20">
                                  <Check className="w-3 h-3 mr-1" />
                                  Selesai
                                </Badge>
                              )}
                            </TableCell>
                          </TableRow>
                        );
                      })
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Resolve Dialog */}
      <Dialog open={resolveDialogOpen} onOpenChange={setResolveDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Konfirmasi Penyelesaian</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menandai alert ini sebagai selesai?
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="p-4 bg-muted rounded-lg">
              <p className="font-medium">{selectedAlert.message}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {getCompanyById(selectedAlert.companyId)?.name} - {waterStations.find(s => s.id === selectedAlert.stationId)?.name}
              </p>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setResolveDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={confirmResolve} className="bg-green-500 hover:bg-green-600">
              <Check className="w-4 h-4 mr-2" />
              Tandai Selesai
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
