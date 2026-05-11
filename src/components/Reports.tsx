import { useState, useRef } from 'react';
import { 
  FileText,
  Filter,
  Printer,
  FileSpreadsheet,
  TrendingUp,
  Activity,
  Droplets,
  CheckCircle2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart as RePieChart,
  Pie,
  Cell,
  Legend,
  LineChart,
  Line
} from 'recharts';
import { companies, waterStations, generateReadings, getStationsByCompany, getCompanyById } from '@/data/mockData';
import type { ReportPeriod } from '@/types';

interface ReportsProps {
  selectedCompanyId?: string;
}

const periodOptions = [
  { value: 'daily', label: 'Harian' },
  { value: 'weekly', label: 'Mingguan' },
  { value: 'monthly', label: 'Bulanan' },
  { value: 'yearly', label: 'Tahunan' }
];

export function Reports({ selectedCompanyId }: ReportsProps) {
  const [companyId, setCompanyId] = useState<string>(selectedCompanyId || 'all');
  const [stationId, setStationId] = useState<string>('all');
  const [period, setPeriod] = useState<ReportPeriod>('daily');
  const [date, setDate] = useState<string>(new Date().toISOString().split('T')[0]);
  const [showPreview, setShowPreview] = useState(false);
  const reportRef = useRef<HTMLDivElement>(null);

  const filteredStations = companyId === 'all' 
    ? waterStations 
    : getStationsByCompany(companyId);

  const currentCompany = companyId !== 'all' ? getCompanyById(companyId) : null;
  const currentStation = stationId !== 'all' ? waterStations.find(s => s.id === stationId) : null;

  // Generate report data
  function generateReportData() {
    const data: any[] = [];
    const stationsToProcess = stationId === 'all' ? filteredStations : [currentStation!];
    
    stationsToProcess.forEach(station => {
      const readings = generateReadings(station.id, 24);
      const company = getCompanyById(station.companyId);
      
      const avgDebit = readings.reduce((acc, r) => acc + r.debit, 0) / readings.length;
      const maxDebit = Math.max(...readings.map(r => r.debit));
      const minDebit = Math.min(...readings.map(r => r.debit));
      const totalVolume = readings[readings.length - 1]?.totalVolume || 0;
      const exceedances = readings.filter(r => r.debit > station.threshold.max).length;
      
      data.push({
        station: station.name,
        company: company?.name || '-',
        avgDebit: avgDebit.toFixed(2),
        maxDebit: maxDebit.toFixed(2),
        minDebit: minDebit.toFixed(2),
        totalVolume: totalVolume.toFixed(2),
        exceedances,
        status: exceedances > 0 ? 'Warning' : 'Normal',
        readings
      });
    });
    
    return data;
  }

  const reportData = generateReportData();

  // Generate chart data
  const chartData = reportData[0]?.readings.map((r: any) => ({
    time: new Date(r.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }),
    debit: r.debit,
    threshold: currentStation?.threshold.max || 500
  })) || [];

  // Generate summary stats
  const summaryStats = {
    totalStations: reportData.length,
    totalVolume: reportData.reduce((acc, d) => acc + parseFloat(d.totalVolume), 0).toFixed(2),
    avgDebit: (reportData.reduce((acc, d) => acc + parseFloat(d.avgDebit), 0) / reportData.length || 0).toFixed(2),
    maxDebit: Math.max(...reportData.map(d => parseFloat(d.maxDebit)), 0).toFixed(2),
    totalExceedances: reportData.reduce((acc, d) => acc + d.exceedances, 0),
    complianceRate: ((reportData.filter(d => d.exceedances === 0).length / reportData.length) * 100 || 0).toFixed(1)
  };

  // Pie chart data for status
  const statusData = [
    { name: 'Normal', value: reportData.filter(d => d.exceedances === 0).length, color: '#22c55e' },
    { name: 'Warning', value: reportData.filter(d => d.exceedances > 0).length, color: '#f97316' }
  ];

  const handleExportExcel = () => {
    // Simulate Excel export
    const csvContent = [
      ['Laporan Monitoring Debit Air - Sulawesi Tenggara'],
      [''],
      ['Periode:', periodOptions.find(p => p.value === period)?.label],
      ['Tanggal:', new Date(date).toLocaleDateString('id-ID')],
      ['Perusahaan:', currentCompany?.name || 'Semua Perusahaan'],
      ['Stasiun:', currentStation?.name || 'Semua Stasiun'],
      [''],
      ['Stasiun', 'Perusahaan', 'Rata-rata (m³/jam)', 'Maksimum (m³/jam)', 'Minimum (m³/jam)', 'Total Volume (m³)', 'Pelanggaran', 'Status'],
      ...reportData.map(d => [d.station, d.company, d.avgDebit, d.maxDebit, d.minDebit, d.totalVolume, d.exceedances, d.status])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `laporan-debit-air-${date}.csv`;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Rekap Laporan</h1>
          <p className="text-muted-foreground">
            Generate dan export laporan monitoring debit air
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleExportExcel}>
            <FileSpreadsheet className="w-4 h-4 mr-2" />
            Export Excel
          </Button>
          <Button variant="outline" onClick={handlePrint}>
            <Printer className="w-4 h-4 mr-2" />
            Cetak
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filter Laporan
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <Label className="mb-1.5 block">Periode</Label>
              <Select value={period} onValueChange={(v) => setPeriod(v as ReportPeriod)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {periodOptions.map(o => (
                    <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Tanggal</Label>
              <Input 
                type="date" 
                value={date} 
                onChange={(e) => setDate(e.target.value)}
              />
            </div>
            <div>
              <Label className="mb-1.5 block">Perusahaan</Label>
              <Select value={companyId} onValueChange={(v) => {
                setCompanyId(v);
                setStationId('all');
              }}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Perusahaan</SelectItem>
                  {companies.map(c => (
                    <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="mb-1.5 block">Stasiun</Label>
              <Select value={stationId} onValueChange={setStationId}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Stasiun</SelectItem>
                  {filteredStations.map(s => (
                    <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button 
              className="bg-gradient-to-r from-blue-500 to-cyan-500"
              onClick={() => setShowPreview(true)}
            >
              <FileText className="w-4 h-4 mr-2" />
              Tampilkan Laporan
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Report Preview */}
      {showPreview && (
        <div ref={reportRef} className="space-y-6 print:space-y-4">
          {/* Report Header */}
          <Card className="border-2">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <h2 className="text-xl font-bold">LAPORAN MONITORING DEBIT AIR</h2>
                <p className="text-muted-foreground">Dinas Lingkungan Hidup dan Kehutanan</p>
                <p className="text-muted-foreground">Provinsi Sulawesi Tenggara</p>
                <div className="pt-4 border-t mt-4">
                  <div className="grid grid-cols-2 gap-4 text-left">
                    <div>
                      <p className="text-sm text-muted-foreground">Periode</p>
                      <p className="font-medium">{periodOptions.find(p => p.value === period)?.label}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Tanggal</p>
                      <p className="font-medium">{new Date(date).toLocaleDateString('id-ID', { 
                        weekday: 'long', 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Perusahaan</p>
                      <p className="font-medium">{currentCompany?.name || 'Semua Perusahaan'}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Stasiun</p>
                      <p className="font-medium">{currentStation?.name || 'Semua Stasiun'}</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Summary Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="w-4 h-4 text-blue-500" />
                  <span className="text-sm text-muted-foreground">Total Stasiun</span>
                </div>
                <div className="text-2xl font-bold">{summaryStats.totalStations}</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Droplets className="w-4 h-4 text-cyan-500" />
                  <span className="text-sm text-muted-foreground">Total Volume</span>
                </div>
                <div className="text-2xl font-bold">{summaryStats.totalVolume} m³</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Rata-rata Debit</span>
                </div>
                <div className="text-2xl font-bold">{summaryStats.avgDebit} m³/jam</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-green-500" />
                  <span className="text-sm text-muted-foreground">Tingkat Kepatuhan</span>
                </div>
                <div className="text-2xl font-bold">{summaryStats.complianceRate}%</div>
              </CardContent>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Card className="lg:col-span-2">
              <CardHeader>
                <CardTitle>Grafik Debit Air</CardTitle>
                <CardDescription>Perkembangan debit selama periode laporan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="time" fontSize={11} />
                      <YAxis fontSize={11} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="debit" 
                        stroke="#3b82f6" 
                        strokeWidth={2}
                        dot={false}
                      />
                      <Line 
                        type="monotone" 
                        dataKey="threshold" 
                        stroke="#ef4444" 
                        strokeDasharray="5 5"
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Status Stasiun</CardTitle>
                <CardDescription>Distribusi status monitoring</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RePieChart>
                      <Pie
                        data={statusData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {statusData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Legend />
                      <Tooltip />
                    </RePieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Data Table */}
          <Card>
            <CardHeader>
              <CardTitle>Detail Data Monitoring</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Stasiun</TableHead>
                      <TableHead>Perusahaan</TableHead>
                      <TableHead className="text-right">Rata-rata (m³/jam)</TableHead>
                      <TableHead className="text-right">Maksimum (m³/jam)</TableHead>
                      <TableHead className="text-right">Minimum (m³/jam)</TableHead>
                      <TableHead className="text-right">Total Volume (m³)</TableHead>
                      <TableHead className="text-center">Pelanggaran</TableHead>
                      <TableHead>Status</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reportData.map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{row.station}</TableCell>
                        <TableCell>{row.company}</TableCell>
                        <TableCell className="text-right">{row.avgDebit}</TableCell>
                        <TableCell className="text-right">{row.maxDebit}</TableCell>
                        <TableCell className="text-right">{row.minDebit}</TableCell>
                        <TableCell className="text-right">{row.totalVolume}</TableCell>
                        <TableCell className="text-center">
                          {row.exceedances > 0 ? (
                            <Badge variant="destructive">{row.exceedances}</Badge>
                          ) : (
                            <span className="text-green-500">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant={row.status === 'Normal' ? 'default' : 'destructive'} className={row.status === 'Normal' ? 'bg-green-500' : ''}>
                            {row.status}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>

          {/* Footer */}
          <div className="text-center text-sm text-muted-foreground pt-4 border-t print:mt-8">
            <p>Laporan ini digenerate secara otomatis dari sistem monitoring debit air</p>
            <p>Dinas Lingkungan Hidup dan Kehutanan Provinsi Sulawesi Tenggara</p>
            <p className="mt-2">Tanggal Generate: {new Date().toLocaleString('id-ID')}</p>
          </div>
        </div>
      )}
    </div>
  );
}
