import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { 
  MapPin, 
  Building2, 
  Droplets, 
  Activity,
  Layers
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { companies, waterStations, getStationsByCompany } from '@/data/mockData';
// Company type used implicitly
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

// Custom icons
const createCompanyIcon = (type: string) => {
  const colors: Record<string, string> = {
    nickel: '#64748b',
    gold: '#eab308',
    iron: '#f97316',
    bauxite: '#ef4444',
    coal: '#374151'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 32px; 
      height: 32px; 
      background: ${colors[type] || '#3b82f6'}; 
      border-radius: 50%; 
      border: 3px solid white; 
      box-shadow: 0 2px 6px rgba(0,0,0,0.3);
      display: flex;
      align-items: center;
      justify-content: center;
      color: white;
      font-weight: bold;
      font-size: 12px;
    ">T</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16]
  });
};

const createStationIcon = (status: string) => {
  const colors: Record<string, string> = {
    online: '#22c55e',
    offline: '#ef4444',
    maintenance: '#f59e0b'
  };
  
  return L.divIcon({
    className: 'custom-marker',
    html: `<div style="
      width: 20px; 
      height: 20px; 
      background: ${colors[status] || '#3b82f6'}; 
      border-radius: 50%; 
      border: 2px solid white; 
      box-shadow: 0 2px 4px rgba(0,0,0,0.3);
    "></div>`,
    iconSize: [20, 20],
    iconAnchor: [10, 10]
  });
};

export function Map() {
  const [selectedCompany, setSelectedCompany] = useState<string>('all');
  const [showStations, setShowStations] = useState(true);
  const [mapCenter, setMapCenter] = useState<[number, number]>([-4.0, 121.5]);
  const [mapZoom, setMapZoom] = useState(8);

  // Filter companies
  const filteredCompanies = selectedCompany === 'all' 
    ? companies 
    : companies.filter(c => c.id === selectedCompany);

  // Get stations to display
  const stationsToShow = selectedCompany === 'all'
    ? waterStations
    : getStationsByCompany(selectedCompany);

  // Focus on company when selected
  useEffect(() => {
    if (selectedCompany !== 'all') {
      const company = companies.find(c => c.id === selectedCompany);
      if (company) {
        setMapCenter([company.location.lat, company.location.lng]);
        setMapZoom(11);
      }
    } else {
      setMapCenter([-4.0, 121.5]);
      setMapZoom(8);
    }
  }, [selectedCompany]);

  const companyTypeLabels: Record<string, string> = {
    nickel: 'Nikel',
    gold: 'Emas',
    iron: 'Besi',
    bauxite: 'Bauksit',
    coal: 'Batu Bara'
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Peta Lokasi</h1>
          <p className="text-muted-foreground">
            Lokasi perusahaan tambang dan stasiun monitoring di Sulawesi Tenggara
          </p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Perusahaan</span>
            </div>
            <div className="text-2xl font-bold">{companies.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-muted-foreground">Total Stasiun</span>
            </div>
            <div className="text-2xl font-bold">{waterStations.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Stasiun Online</span>
            </div>
            <div className="text-2xl font-bold">
              {waterStations.filter(s => s.sensorStatus === 'online').length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-red-500" />
              <span className="text-sm text-muted-foreground">Kabupaten</span>
            </div>
            <div className="text-2xl font-bold">
              {new Set(companies.map(c => c.location.regency)).size}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Map Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1.5 block">Filter Perusahaan</label>
              <Select value={selectedCompany} onValueChange={setSelectedCompany}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Perusahaan" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Perusahaan</SelectItem>
                  {companies.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-end">
              <Button 
                variant={showStations ? 'default' : 'outline'}
                onClick={() => setShowStations(!showStations)}
              >
                <Layers className="w-4 h-4 mr-2" />
                {showStations ? 'Sembunyikan Stasiun' : 'Tampilkan Stasiun'}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Map */}
      <Card className="overflow-hidden">
        <div className="h-[500px] relative">
          <MapContainer 
            center={mapCenter} 
            zoom={mapZoom} 
            style={{ height: '100%', width: '100%' }}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            
            {/* Company Markers */}
            {filteredCompanies.map(company => (
              <Marker
                key={company.id}
                position={[company.location.lat, company.location.lng]}
                icon={createCompanyIcon(company.type)}
              >
                <Popup>
                  <div className="p-2 min-w-[200px]">
                    <h3 className="font-bold text-sm">{company.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {company.location.regency}
                    </p>
                    <Badge className="mt-2 text-xs">
                      {companyTypeLabels[company.type]}
                    </Badge>
                    <div className="mt-2 text-xs">
                      <p>Stasiun: {getStationsByCompany(company.id).length}</p>
                      <p>Status: {company.status === 'active' ? 'Aktif' : 'Non-Aktif'}</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
            
            {/* Station Markers */}
            {showStations && stationsToShow.map(station => (
              <Marker
                key={station.id}
                position={[station.location.lat, station.location.lng]}
                icon={createStationIcon(station.sensorStatus)}
              >
                <Popup>
                  <div className="p-2 min-w-[180px]">
                    <h3 className="font-bold text-sm">{station.name}</h3>
                    <p className="text-xs text-muted-foreground mt-1">
                      {station.location.description}
                    </p>
                    <Badge 
                      variant={station.sensorStatus === 'online' ? 'default' : 'destructive'}
                      className={`mt-2 text-xs ${station.sensorStatus === 'online' ? 'bg-green-500' : ''}`}
                    >
                      {station.sensorStatus === 'online' ? 'Online' : 
                       station.sensorStatus === 'offline' ? 'Offline' : 'Maintenance'}
                    </Badge>
                    <div className="mt-2 text-xs">
                      <p>Threshold: {station.threshold.max} m³/jam</p>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>

          {/* Legend */}
          <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm p-3 rounded-lg shadow-lg border">
            <h4 className="text-xs font-semibold mb-2">Legenda</h4>
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-slate-500 border-2 border-white shadow" />
                <span className="text-xs">Tambang Nikel</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-4 h-4 rounded-full bg-yellow-500 border-2 border-white shadow" />
                <span className="text-xs">Tambang Emas</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-500 border border-white shadow" />
                <span className="text-xs">Stasiun Online</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500 border border-white shadow" />
                <span className="text-xs">Stasiun Offline</span>
              </div>
            </div>
          </div>
        </div>
      </Card>

      {/* Company List */}
      <Card>
        <CardHeader>
          <CardTitle>Daftar Perusahaan di Peta</CardTitle>
          <CardDescription>Klik untuk melihat detail lokasi</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {filteredCompanies.map(company => {
              const stations = getStationsByCompany(company.id);
              const onlineStations = stations.filter(s => s.sensorStatus === 'online').length;
              
              return (
                <div 
                  key={company.id}
                  className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 cursor-pointer transition-colors"
                  onClick={() => {
                    setSelectedCompany(company.id);
                    setMapCenter([company.location.lat, company.location.lng]);
                    setMapZoom(12);
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold ${
                      company.type === 'nickel' ? 'bg-slate-500' :
                      company.type === 'gold' ? 'bg-yellow-500' :
                      company.type === 'iron' ? 'bg-orange-500' :
                      company.type === 'bauxite' ? 'bg-red-500' : 'bg-gray-700'
                    }`}>
                      {company.name.charAt(3)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{company.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {company.location.district}, {company.location.regency}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center gap-2">
                      <Droplets className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{stations.length}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-green-600">
                      <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                      {onlineStations} online
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
