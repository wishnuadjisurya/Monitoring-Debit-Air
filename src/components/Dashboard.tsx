import { useEffect, useState } from 'react';
import { 
  Droplets, 
  Building2, 
  Activity, 
  AlertTriangle,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Line
} from 'recharts';
import { 
  dashboardStats, 
  companies, 
  waterStations, 
  alerts 
} from '@/data/mockData';

// Generate hourly data for chart
function generateHourlyData() {
  const data = [];
  const now = new Date();
  for (let i = 23; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    data.push({
      time: time.getHours().toString().padStart(2, '0') + ':00',
      debit: Math.round((2000 + Math.random() * 1500) * 10) / 10,
      threshold: 4000
    });
  }
  return data;
}

// Generate company comparison data
function generateCompanyData() {
  return companies.slice(0, 5).map(company => ({
    name: company.name.split(' ').slice(0, 2).join(' '),
    debit: Math.round((500 + Math.random() * 1500) * 10) / 10,
    stations: company.totalSites
  }));
}

export function Dashboard() {
  const [hourlyData, setHourlyData] = useState(generateHourlyData());
  const companyData = generateCompanyData();
  const recentAlerts = alerts.slice(0, 5);

  useEffect(() => {
    // Simulate real-time updates
    const interval = setInterval(() => {
      setHourlyData(generateHourlyData());
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const stats = [
    {
      title: 'Total Perusahaan',
      value: dashboardStats.totalCompanies,
      change: '+2',
      trend: 'up',
      icon: Building2,
      color: 'from-blue-500 to-blue-600',
      description: 'Perusahaan tambang aktif'
    },
    {
      title: 'Stasiun Online',
      value: dashboardStats.activeStations,
      change: `${dashboardStats.offlineStations} offline`,
      trend: 'neutral',
      icon: Activity,
      color: 'from-green-500 to-emerald-600',
      description: 'Dari 15 stasiun monitoring'
    },
    {
      title: 'Debit Hari Ini',
      value: `${dashboardStats.totalDebitToday.toLocaleString('id-ID')} m³`,
      change: '+12.5%',
      trend: 'up',
      icon: Droplets,
      color: 'from-cyan-500 to-cyan-600',
      description: 'Total volume air terukur'
    },
    {
      title: 'Tingkat Kepatuhan',
      value: `${dashboardStats.complianceRate}%`,
      change: '+5%',
      trend: 'up',
      icon: CheckCircle2,
      color: 'from-violet-500 to-purple-600',
      description: 'Memenuhi standar baku mutu'
    }
  ];

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-red-500/10 text-red-500 border-red-500/20';
      case 'high': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
      case 'medium': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
      default: return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard Monitoring</h1>
          <p className="text-muted-foreground">
            Ringkasan data monitoring debit air perusahaan tambang di Sulawesi Tenggara
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Badge variant="outline" className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
            Live Data
          </Badge>
          <Button variant="outline" size="sm">
            <Clock className="w-4 h-4 mr-2" />
            {new Date().toLocaleDateString('id-ID', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="relative overflow-hidden group hover:shadow-lg transition-shadow">
              <div className={`absolute top-0 right-0 w-24 h-24 bg-gradient-to-br ${stat.color} opacity-10 rounded-bl-full`} />
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardDescription className="text-sm font-medium">{stat.title}</CardDescription>
                  <div className={`p-2 rounded-lg bg-gradient-to-br ${stat.color}`}>
                    <Icon className="w-4 h-4 text-white" />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center gap-2 mt-1">
                  {stat.trend === 'up' ? (
                    <ArrowUpRight className="w-4 h-4 text-green-500" />
                  ) : stat.trend === 'down' ? (
                    <ArrowDownRight className="w-4 h-4 text-red-500" />
                  ) : null}
                  <span className={`text-sm ${
                    stat.trend === 'up' ? 'text-green-500' : 
                    stat.trend === 'down' ? 'text-red-500' : 'text-muted-foreground'
                  }`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{stat.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Grafik Debit Air 24 Jam Terakhir</CardTitle>
                <CardDescription>Total debit air dari seluruh stasiun monitoring</CardDescription>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  <span className="w-2 h-2 rounded-full bg-blue-500 mr-1" />
                  Debit Aktual
                </Badge>
                <Badge variant="outline" className="text-xs">
                  <span className="w-2 h-2 rounded-full bg-red-400 mr-1" />
                  Batas Maksimum
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={hourlyData}>
                  <defs>
                    <linearGradient id="colorDebit" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis 
                    dataKey="time" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                  />
                  <YAxis 
                    stroke="#6b7280"
                    fontSize={12}
                    tickLine={false}
                    tickFormatter={(value) => `${value} m³`}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                      boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                    }}
                    formatter={(value: number) => [`${value} m³/jam`, 'Debit']}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="debit" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorDebit)" 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="threshold" 
                    stroke="#ef4444" 
                    strokeWidth={2}
                    strokeDasharray="5 5"
                    dot={false}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Company Comparison */}
        <Card>
          <CardHeader>
            <CardTitle>Debit per Perusahaan</CardTitle>
            <CardDescription>Perbandingan debit air 5 perusahaan terbesar</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={companyData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" horizontal={false} />
                  <XAxis 
                    type="number" 
                    stroke="#6b7280"
                    fontSize={12}
                    tickFormatter={(value) => `${value}`}
                  />
                  <YAxis 
                    type="category" 
                    dataKey="name" 
                    stroke="#6b7280"
                    fontSize={11}
                    width={100}
                    tickLine={false}
                  />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                    formatter={(value: number) => [`${value} m³/jam`, 'Debit']}
                  />
                  <Bar 
                    dataKey="debit" 
                    fill="url(#barGradient)" 
                    radius={[0, 4, 4, 0]}
                  />
                  <defs>
                    <linearGradient id="barGradient" x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#3b82f6" />
                      <stop offset="100%" stopColor="#06b6d4" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Alerts */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-orange-500" />
                  Notifikasi Terbaru
                </CardTitle>
                <CardDescription>Alert dan peringatan sistem monitoring</CardDescription>
              </div>
              <Badge variant="destructive">{alerts.filter(a => !a.resolved).length} Aktif</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentAlerts.map((alert) => (
                <div 
                  key={alert.id} 
                  className={`flex items-start gap-3 p-3 rounded-lg border ${getSeverityColor(alert.severity)}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="font-medium text-sm">{alert.message}</span>
                      {!alert.resolved && (
                        <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1 text-xs opacity-80">
                      <Clock className="w-3 h-3" />
                      {new Date(alert.timestamp).toLocaleString('id-ID')}
                    </div>
                  </div>
                  <Badge variant="outline" className="text-xs capitalize">
                    {alert.severity}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Station Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-green-500" />
              Status Stasiun Monitoring
            </CardTitle>
            <CardDescription>Kondisi sensor dan perangkat monitoring</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm">Stasiun Online</span>
                <div className="flex items-center gap-2">
                  <Progress value={(dashboardStats.activeStations / 15) * 100} className="w-24" />
                  <span className="text-sm font-medium w-8">{dashboardStats.activeStations}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Stasiun Offline</span>
                <div className="flex items-center gap-2">
                  <Progress value={(dashboardStats.offlineStations / 15) * 100} className="w-24 bg-red-100" />
                  <span className="text-sm font-medium w-8 text-red-500">{dashboardStats.offlineStations}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Perlu Kalibrasi</span>
                <div className="flex items-center gap-2">
                  <Progress value={(1 / 15) * 100} className="w-24 bg-yellow-100" />
                  <span className="text-sm font-medium w-8 text-yellow-600">1</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Dalam Pemeliharaan</span>
                <div className="flex items-center gap-2">
                  <Progress value={(1 / 15) * 100} className="w-24 bg-orange-100" />
                  <span className="text-sm font-medium w-8 text-orange-600">1</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t">
              <h4 className="text-sm font-medium mb-3">Stasiun Perlu Perhatian</h4>
              <div className="space-y-2">
                {waterStations
                  .filter(s => s.sensorStatus !== 'online')
                  .map(station => {
                    const company = companies.find(c => c.id === station.companyId);
                    return (
                      <div key={station.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                        <div>
                          <p className="text-sm font-medium">{station.name}</p>
                          <p className="text-xs text-muted-foreground">{company?.name}</p>
                        </div>
                        <Badge 
                          variant={station.sensorStatus === 'offline' ? 'destructive' : 'secondary'}
                          className="text-xs"
                        >
                          {station.sensorStatus === 'offline' ? 'Offline' : 'Maintenance'}
                        </Badge>
                      </div>
                    );
                  })}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
