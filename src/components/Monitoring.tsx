import { useState, useEffect } from 'react';
import { 
  Activity, 
  Droplets, 
  Thermometer, 
  Gauge, 
  Waves,
  RefreshCw,
  TrendingUp,
  TrendingDown
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
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  AreaChart,
  Area,
  ReferenceLine
} from 'recharts';
import { companies, waterStations, generateReadings, getStationsByCompany, getCompanyById } from '@/data/mockData';
import type { WaterDebitReading } from '@/types';

interface MonitoringProps {
  selectedCompanyId?: string;
}

export function Monitoring({ selectedCompanyId }: MonitoringProps) {
  const [companyId, setCompanyId] = useState<string>(selectedCompanyId || 'all');
  const [stationId, setStationId] = useState<string>('all');
  const [timeRange, setTimeRange] = useState<string>('24h');
  const [readings, setReadings] = useState<WaterDebitReading[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [lastUpdate, setLastUpdate] = useState(new Date());

  // Get filtered stations based on company selection
  const filteredStations = companyId === 'all' 
    ? waterStations 
    : getStationsByCompany(companyId);

  // Get current station
  const currentStation = stationId !== 'all' 
    ? waterStations.find(s => s.id === stationId)
    : null;

  // Get current company
  const currentCompany = companyId !== 'all'
    ? getCompanyById(companyId)
    : null;

  // Load readings
  useEffect(() => {
    loadReadings();
  }, [companyId, stationId, timeRange]);

  // Auto refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      loadReadings();
      setLastUpdate(new Date());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  function loadReadings() {
    setIsLoading(true);
    
    let allReadings: WaterDebitReading[] = [];
    const hours = timeRange === '1h' ? 1 : timeRange === '6h' ? 6 : timeRange === '12h' ? 12 : 24;
    
    if (stationId !== 'all') {
      allReadings = generateReadings(stationId, hours);
    } else if (companyId !== 'all') {
      const stations = getStationsByCompany(companyId);
      stations.forEach(station => {
        allReadings = [...allReadings, ...generateReadings(station.id, hours)];
      });
    } else {
      waterStations.forEach(station => {
        allReadings = [...allReadings, ...generateReadings(station.id, hours)];
      });
    }
    
    // Sort by timestamp
    allReadings.sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());
    
    setReadings(allReadings);
    setIsLoading(false);
  }

  // Prepare chart data
  const chartData = readings.map(r => ({
    time: new Date(r.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    debit: r.debit,
    threshold: currentStation?.threshold.max || 500,
    temperature: r.quality?.temperature || 0,
    ph: r.quality?.ph || 0
  }));

  // Calculate statistics
  const stats = {
    current: readings.length > 0 ? readings[readings.length - 1].debit : 0,
    avg: readings.length > 0 ? readings.reduce((acc, r) => acc + r.debit, 0) / readings.length : 0,
    max: readings.length > 0 ? Math.max(...readings.map(r => r.debit)) : 0,
    min: readings.length > 0 ? Math.min(...readings.map(r => r.debit)) : 0,
    total: readings.length > 0 ? readings[readings.length - 1].totalVolume : 0
  };

  // Get latest quality data
  const latestQuality = readings.length > 0 ? readings[readings.length - 1].quality : null;

  const getStatusBadge = (debit: number, threshold: { min: number; max: number; critical: number }) => {
    if (debit > threshold.critical) return <Badge variant="destructive">Kritis</Badge>;
    if (debit > threshold.max) return <Badge variant="default" className="bg-orange-500">Warning</Badge>;
    if (debit < threshold.min) return <Badge variant="secondary">Rendah</Badge>;
    return <Badge variant="default" className="bg-green-500">Normal</Badge>;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Monitoring Real-time</h1>
          <p className="text-muted-foreground">
            Pemantauan debit air secara langsung dari stasiun monitoring
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live
          </Badge>
          <span className="text-sm text-muted-foreground">
            Update: {lastUpdate.toLocaleTimeString('id-ID')}
          </span>
          <Button variant="outline" size="icon" onClick={loadReadings} disabled={isLoading}>
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1.5 block">Perusahaan</label>
              <Select value={companyId} onValueChange={(value) => {
                setCompanyId(value);
                setStationId('all');
              }}>
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
            <div className="flex-1">
              <label className="text-sm text-muted-foreground mb-1.5 block">Stasiun</label>
              <Select value={stationId} onValueChange={setStationId}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Stasiun" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Stasiun</SelectItem>
                  {filteredStations.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-40">
              <label className="text-sm text-muted-foreground mb-1.5 block">Rentang Waktu</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Waktu" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1h">1 Jam</SelectItem>
                  <SelectItem value="6h">6 Jam</SelectItem>
                  <SelectItem value="12h">12 Jam</SelectItem>
                  <SelectItem value="24h">24 Jam</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Status Cards */}
      {currentStation && (
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-lg">{currentStation.name}</h3>
                <p className="text-sm text-muted-foreground">{currentStation.location.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Status Sensor</p>
                  <Badge 
                    variant={currentStation.sensorStatus === 'online' ? 'default' : 'destructive'}
                    className={currentStation.sensorStatus === 'online' ? 'bg-green-500' : ''}
                  >
                    {currentStation.sensorStatus === 'online' ? 'Online' : 
                     currentStation.sensorStatus === 'offline' ? 'Offline' : 'Maintenance'}
                  </Badge>
                </div>
                <div className="text-right">
                  <p className="text-sm text-muted-foreground">Kalibrasi Terakhir</p>
                  <p className="text-sm font-medium">{new Date(currentStation.lastCalibration).toLocaleDateString('id-ID')}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Droplets className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Debit Saat Ini</span>
            </div>
            <div className="text-2xl font-bold">{stats.current.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">m³/jam</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Activity className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Rata-rata</span>
            </div>
            <div className="text-2xl font-bold">{stats.avg.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">m³/jam</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-sm text-muted-foreground">Maksimum</span>
            </div>
            <div className="text-2xl font-bold">{stats.max.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">m³/jam</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingDown className="w-4 h-4 text-purple-500" />
              <span className="text-sm text-muted-foreground">Minimum</span>
            </div>
            <div className="text-2xl font-bold">{stats.min.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">m³/jam</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Gauge className="w-4 h-4 text-cyan-500" />
              <span className="text-sm text-muted-foreground">Total Volume</span>
            </div>
            <div className="text-2xl font-bold">{stats.total.toFixed(1)}</div>
            <p className="text-xs text-muted-foreground">m³</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Chart */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Grafik Debit Air</CardTitle>
              <CardDescription>
                {currentStation ? currentStation.name : 
                 currentCompany ? `Semua stasiun - ${currentCompany.name}` : 
                 'Semua stasiun monitoring'}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="text-xs">
                <span className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                Debit
              </Badge>
              {currentStation && (
                <Badge variant="outline" className="text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-400 mr-1" />
                  Batas: {currentStation.threshold.max} m³/jam
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorDebit2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis 
                  dataKey="time" 
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  interval="preserveStartEnd"
                />
                <YAxis 
                  stroke="#6b7280"
                  fontSize={11}
                  tickLine={false}
                  tickFormatter={(value) => `${value}`}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: 'white', 
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px',
                    boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                  }}
                  formatter={(value: number, name: string) => {
                    if (name === 'debit') return [`${value} m³/jam`, 'Debit'];
                    if (name === 'temperature') return [`${value}°C`, 'Suhu'];
                    if (name === 'ph') return [`${value}`, 'pH'];
                    return [value, name];
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="debit" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  fillOpacity={1} 
                  fill="url(#colorDebit2)" 
                />
                {currentStation && (
                  <ReferenceLine 
                    y={currentStation.threshold.max} 
                    stroke="#ef4444" 
                    strokeDasharray="5 5"
                    label={{ value: 'Max', fill: '#ef4444', fontSize: 12 }}
                  />
                )}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Quality Parameters */}
      {latestQuality && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-cyan-500" />
              Parameter Kualitas Air
            </CardTitle>
            <CardDescription>Pengukuran kualitas air terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100 border border-blue-200">
                <div className="flex items-center gap-2 mb-2">
                  <Gauge className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">pH</span>
                </div>
                <div className="text-2xl font-bold text-blue-700">{latestQuality.ph}</div>
                <p className="text-xs text-blue-600">Normal: 6.5 - 8.5</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100 border border-orange-200">
                <div className="flex items-center gap-2 mb-2">
                  <Waves className="w-4 h-4 text-orange-600" />
                  <span className="text-sm font-medium text-orange-900">Kekeruhan</span>
                </div>
                <div className="text-2xl font-bold text-orange-700">{latestQuality.turbidity}</div>
                <p className="text-xs text-orange-600">NTU</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100 border border-green-200">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-green-600" />
                  <span className="text-sm font-medium text-green-900">TDS</span>
                </div>
                <div className="text-2xl font-bold text-green-700">{latestQuality.tds}</div>
                <p className="text-xs text-green-600">mg/L</p>
              </div>
              <div className="p-4 rounded-lg bg-gradient-to-br from-red-50 to-red-100 border border-red-200">
                <div className="flex items-center gap-2 mb-2">
                  <Thermometer className="w-4 h-4 text-red-600" />
                  <span className="text-sm font-medium text-red-900">Suhu</span>
                </div>
                <div className="text-2xl font-bold text-red-700">{latestQuality.temperature}°C</div>
                <p className="text-xs text-red-600">Celsius</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Station List */}
      {companyId !== 'all' && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Stasiun Monitoring</CardTitle>
            <CardDescription>Semua stasiun untuk perusahaan ini</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {filteredStations.map(station => {
                const stationReadings = generateReadings(station.id, 1);
                const latestReading = stationReadings[stationReadings.length - 1];
                
                return (
                  <div 
                    key={station.id} 
                    className={`flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                      stationId === station.id ? 'border-blue-500 bg-blue-50/50' : 'border-border'
                    }`}
                    onClick={() => setStationId(station.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        station.sensorStatus === 'online' ? 'bg-green-100 text-green-600' :
                        station.sensorStatus === 'offline' ? 'bg-red-100 text-red-600' :
                        'bg-yellow-100 text-yellow-600'
                      }`}>
                        <Droplets className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">{station.name}</p>
                        <p className="text-sm text-muted-foreground">{station.location.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Debit</p>
                        <p className="font-semibold">{latestReading?.debit.toFixed(1) || '-'} m³/jam</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-muted-foreground">Status</p>
                        {getStatusBadge(latestReading?.debit || 0, station.threshold)}
                      </div>
                      <Badge 
                        variant={station.sensorStatus === 'online' ? 'default' : 'destructive'}
                        className={station.sensorStatus === 'online' ? 'bg-green-500' : ''}
                      >
                        {station.sensorStatus === 'online' ? 'Online' : 
                         station.sensorStatus === 'offline' ? 'Offline' : 'Maintenance'}
                      </Badge>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
