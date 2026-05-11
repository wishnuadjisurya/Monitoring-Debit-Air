import { useState } from 'react';
import { 
  Building2, 
  MapPin, 
  Phone, 
  Mail, 
  User, 
  Filter, 
  Search,
  ChevronRight,
  Droplets,
  Activity,
  FileText,
  MoreHorizontal
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
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
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { companies, getStationsByCompany } from '@/data/mockData';
import type { Company } from '@/types';

interface CompaniesProps {
  onViewChange: (view: string, companyId?: string) => void;
}

const companyTypeLabels: Record<string, { label: string; color: string }> = {
  nickel: { label: 'Nikel', color: 'bg-slate-500' },
  gold: { label: 'Emas', color: 'bg-yellow-500' },
  iron: { label: 'Besi', color: 'bg-orange-500' },
  bauxite: { label: 'Bauksit', color: 'bg-red-500' },
  coal: { label: 'Batu Bara', color: 'bg-gray-700' }
};

export function Companies({ onViewChange }: CompaniesProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);

  const filteredCompanies = companies.filter(company => {
    const matchesSearch = company.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         company.location.regency.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || company.type === typeFilter;
    const matchesStatus = statusFilter === 'all' || company.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const getStationStats = (companyId: string) => {
    const stations = getStationsByCompany(companyId);
    return {
      total: stations.length,
      online: stations.filter(s => s.sensorStatus === 'online').length,
      offline: stations.filter(s => s.sensorStatus === 'offline').length
    };
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Daftar Perusahaan Tambang</h1>
          <p className="text-muted-foreground">
            {filteredCompanies.length} perusahaan terdaftar di Sulawesi Tenggara
          </p>
        </div>
        <Button className="bg-gradient-to-r from-blue-500 to-cyan-500">
          <Building2 className="w-4 h-4 mr-2" />
          Tambah Perusahaan
        </Button>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Cari perusahaan atau lokasi..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="flex gap-2">
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger className="w-[140px]">
                  <Filter className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Jenis Tambang" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="nickel">Nikel</SelectItem>
                  <SelectItem value="gold">Emas</SelectItem>
                  <SelectItem value="iron">Besi</SelectItem>
                  <SelectItem value="bauxite">Bauksit</SelectItem>
                  <SelectItem value="coal">Batu Bara</SelectItem>
                </SelectContent>
              </Select>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <Activity className="w-4 h-4 mr-2" />
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Non-Aktif</SelectItem>
                  <SelectItem value="suspended">Ditangguhkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCompanies.map((company) => {
          const stationStats = getStationStats(company.id);
          const typeInfo = companyTypeLabels[company.type];
          
          return (
            <Card key={company.id} className="group hover:shadow-lg transition-all duration-300">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 rounded-xl ${typeInfo.color} flex items-center justify-center text-white font-bold text-lg`}>
                      {company.name.charAt(3)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <CardTitle className="text-base truncate">{company.name}</CardTitle>
                      <CardDescription className="flex items-center gap-1">
                        <MapPin className="w-3 h-3" />
                        {company.location.regency}
                      </CardDescription>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewChange('monitoring', company.id)}>
                        <Activity className="w-4 h-4 mr-2" />
                        Lihat Monitoring
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => onViewChange('reports', company.id)}>
                        <FileText className="w-4 h-4 mr-2" />
                        Lihat Laporan
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Badges */}
                <div className="flex flex-wrap gap-2">
                  <Badge variant="outline" className={`${typeInfo.color} text-white border-0`}>
                    {typeInfo.label}
                  </Badge>
                  <Badge variant={company.status === 'active' ? 'default' : 'secondary'}>
                    {company.status === 'active' ? 'Aktif' : company.status === 'inactive' ? 'Non-Aktif' : 'Ditangguhkan'}
                  </Badge>
                </div>

                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <FileText className="w-4 h-4" />
                    <span className="truncate">{company.licenseNumber}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <User className="w-4 h-4" />
                    <span>{company.contact.pic}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{company.contact.phone}</span>
                  </div>
                </div>

                {/* Station Stats */}
                <div className="pt-3 border-t">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{stationStats.total} Stasiun</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-xs text-green-600">
                        <span className="w-2 h-2 rounded-full bg-green-500" />
                        {stationStats.online}
                      </span>
                      {stationStats.offline > 0 && (
                        <span className="flex items-center gap-1 text-xs text-red-600">
                          <span className="w-2 h-2 rounded-full bg-red-500" />
                          {stationStats.offline}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button 
                    variant="outline" 
                    className="flex-1"
                    onClick={() => setSelectedCompany(company)}
                  >
                    Detail
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
                    onClick={() => onViewChange('monitoring', company.id)}
                  >
                    Monitoring
                    <ChevronRight className="w-4 h-4 ml-1" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Company Detail Dialog */}
      <Dialog open={!!selectedCompany} onOpenChange={() => setSelectedCompany(null)}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          {selectedCompany && (
            <>
              <DialogHeader>
                <DialogTitle className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg ${companyTypeLabels[selectedCompany.type].color} flex items-center justify-center text-white font-bold`}>
                    {selectedCompany.name.charAt(3)}
                  </div>
                  <div>
                    <div>{selectedCompany.name}</div>
                    <div className="text-sm font-normal text-muted-foreground">
                      {selectedCompany.licenseNumber}
                    </div>
                  </div>
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm text-muted-foreground">Jenis Tambang</label>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge className={companyTypeLabels[selectedCompany.type].color}>
                        {companyTypeLabels[selectedCompany.type].label}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Status</label>
                    <div className="mt-1">
                      <Badge variant={selectedCompany.status === 'active' ? 'default' : 'secondary'}>
                        {selectedCompany.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Tahun Berdiri</label>
                    <p className="font-medium">{selectedCompany.establishedYear}</p>
                  </div>
                  <div>
                    <label className="text-sm text-muted-foreground">Total Lokasi</label>
                    <p className="font-medium">{selectedCompany.totalSites} site</p>
                  </div>
                </div>

                {/* Location */}
                <div>
                  <label className="text-sm text-muted-foreground">Lokasi</label>
                  <div className="mt-1 p-3 bg-muted rounded-lg">
                    <p className="text-sm">{selectedCompany.location.address}</p>
                    <p className="text-sm">{selectedCompany.location.district}, {selectedCompany.location.regency}</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Koordinat: {selectedCompany.location.lat}, {selectedCompany.location.lng}
                    </p>
                  </div>
                </div>

                {/* Contact */}
                <div>
                  <label className="text-sm text-muted-foreground">Kontak</label>
                  <div className="mt-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCompany.contact.pic}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Phone className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCompany.contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      <span className="text-sm">{selectedCompany.contact.email}</span>
                    </div>
                  </div>
                </div>

                {/* Stations */}
                <div>
                  <label className="text-sm text-muted-foreground">Stasiun Monitoring</label>
                  <div className="mt-1 space-y-2">
                    {getStationsByCompany(selectedCompany.id).map(station => (
                      <div key={station.id} className="flex items-center justify-between p-2 bg-muted rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{station.name}</p>
                          <p className="text-xs text-muted-foreground">{station.location.description}</p>
                        </div>
                        <Badge 
                          variant={station.sensorStatus === 'online' ? 'default' : 'destructive'}
                          className="text-xs"
                        >
                          {station.sensorStatus === 'online' ? 'Online' : station.sensorStatus === 'offline' ? 'Offline' : 'Maintenance'}
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-4">
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-500 to-cyan-500"
                    onClick={() => {
                      setSelectedCompany(null);
                      onViewChange('monitoring', selectedCompany.id);
                    }}
                  >
                    <Activity className="w-4 h-4 mr-2" />
                    Lihat Monitoring
                  </Button>
                  <Button 
                    variant="outline"
                    className="flex-1"
                    onClick={() => {
                      setSelectedCompany(null);
                      onViewChange('reports', selectedCompany.id);
                    }}
                  >
                    <FileText className="w-4 h-4 mr-2" />
                    Lihat Laporan
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
