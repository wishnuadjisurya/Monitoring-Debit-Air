import { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Bell, 
  Shield, 
  Database, 
  Mail,
  User,
  Save,
  RefreshCw,
  CheckCircle2,
  Smartphone,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Separator } from '@/components/ui/separator';

export function Settings() {
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Pengaturan</h1>
          <p className="text-muted-foreground">
            Konfigurasi sistem monitoring debit air
          </p>
        </div>
        <Button 
          className="bg-gradient-to-r from-blue-500 to-cyan-500"
          onClick={handleSave}
          disabled={loading}
        >
          {loading ? (
            <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
          ) : saved ? (
            <CheckCircle2 className="w-4 h-4 mr-2" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          {loading ? 'Menyimpan...' : saved ? 'Tersimpan!' : 'Simpan Perubahan'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:grid-cols-5 lg:w-auto">
          <TabsTrigger value="general">Umum</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
          <TabsTrigger value="thresholds">Threshold</TabsTrigger>
          <TabsTrigger value="users">Pengguna</TabsTrigger>
          <TabsTrigger value="system">Sistem</TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5" />
                Pengaturan Umum
              </CardTitle>
              <CardDescription>
                Konfigurasi dasar sistem monitoring
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label>Nama Instansi</Label>
                  <Input defaultValue="Dinas Lingkungan Hidup dan Kehutanan Provinsi Sulawesi Tenggara" />
                </div>
                <div className="space-y-2">
                  <Label>Email Instansi</Label>
                  <Input defaultValue="dlhk@sultraprov.go.id" type="email" />
                </div>
                <div className="space-y-2">
                  <Label>Telepon</Label>
                  <Input defaultValue="+62-401-234-5678" />
                </div>
                <div className="space-y-2">
                  <Label>Alamat</Label>
                  <Input defaultValue="Jl. Haluoleo, Kambu, Kec. Kambu, Kota Kendari" />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Preferensi Tampilan</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label>Bahasa</Label>
                    <Select defaultValue="id">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="id">Bahasa Indonesia</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Zona Waktu</Label>
                    <Select defaultValue="asia-makassar">
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="asia-makassar">Asia/Makassar (WITA)</SelectItem>
                        <SelectItem value="asia-jakarta">Asia/Jakarta (WIB)</SelectItem>
                        <SelectItem value="asia-jayapura">Asia/Jayapura (WIT)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>
                Konfigurasi alert dan pemberitahuan sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Kanal Notifikasi</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-blue-500" />
                      <div>
                        <p className="font-medium">Email</p>
                        <p className="text-sm text-muted-foreground">Kirim notifikasi via email</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-green-500" />
                      <div>
                        <p className="font-medium">SMS</p>
                        <p className="text-sm text-muted-foreground">Kirim notifikasi via SMS</p>
                      </div>
                    </div>
                    <Switch />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-purple-500" />
                      <div>
                        <p className="font-medium">Push Notification</p>
                        <p className="text-sm text-muted-foreground">Notifikasi browser real-time</p>
                      </div>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Event Notifikasi</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label>Threshold Melebihi</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Sensor Offline</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Level Kritis</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Maintenance Diperlukan</Label>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between">
                    <Label>Laporan Harian</Label>
                    <Switch />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Thresholds */}
        <TabsContent value="thresholds">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Pengaturan Threshold
              </CardTitle>
              <CardDescription>
                Batas nilai untuk alert dan warning
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card className="border-l-4 border-l-green-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Batas Normal</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs">Minimum (m³/jam)</Label>
                        <Input type="number" defaultValue="50" />
                      </div>
                      <div>
                        <Label className="text-xs">Maksimum (m³/jam)</Label>
                        <Input type="number" defaultValue="500" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-yellow-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Batas Warning</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs">Persentase dari Max</Label>
                        <Input type="number" defaultValue="80" />
                      </div>
                      <div>
                        <Label className="text-xs">Durasi (menit)</Label>
                        <Input type="number" defaultValue="15" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-l-4 border-l-red-500">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-base">Batas Kritis</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div>
                        <Label className="text-xs">Persentase dari Max</Label>
                        <Input type="number" defaultValue="120" />
                      </div>
                      <div>
                        <Label className="text-xs">Auto-notifikasi</Label>
                        <Switch defaultChecked />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Parameter Kualitas Air</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label>pH Minimum</Label>
                    <Input type="number" step="0.1" defaultValue="6.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>pH Maksimum</Label>
                    <Input type="number" step="0.1" defaultValue="8.5" />
                  </div>
                  <div className="space-y-2">
                    <Label>TDS Maksimum (mg/L)</Label>
                    <Input type="number" defaultValue="500" />
                  </div>
                  <div className="space-y-2">
                    <Label>Kekeruhan Maks (NTU)</Label>
                    <Input type="number" defaultValue="50" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Users */}
        <TabsContent value="users">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Manajemen Pengguna
              </CardTitle>
              <CardDescription>
                Kelola akses pengguna sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="font-medium">Daftar Pengguna</h3>
                  <p className="text-sm text-muted-foreground">5 pengguna terdaftar</p>
                </div>
                <Button>
                  <User className="w-4 h-4 mr-2" />
                  Tambah Pengguna
                </Button>
              </div>

              <div className="space-y-3">
                {[
                  { name: 'Admin Dinas', email: 'admin@sultra.go.id', role: 'Administrator', status: 'active' },
                  { name: 'Operator 1', email: 'operator1@sultra.go.id', role: 'Operator', status: 'active' },
                  { name: 'Operator 2', email: 'operator2@sultra.go.id', role: 'Operator', status: 'active' },
                  { name: 'Viewer', email: 'viewer@sultra.go.id', role: 'Viewer', status: 'inactive' },
                  { name: 'Teknisi', email: 'teknisi@sultra.go.id', role: 'Teknisi', status: 'active' }
                ].map((user, i) => (
                  <div key={i} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-cyan-400 flex items-center justify-center text-white font-medium">
                        {user.name.charAt(0)}
                      </div>
                      <div>
                        <p className="font-medium">{user.name}</p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <Badge variant={user.role === 'Administrator' ? 'default' : 'secondary'}>
                        {user.role}
                      </Badge>
                      <Badge variant={user.status === 'active' ? 'default' : 'secondary'} className={user.status === 'active' ? 'bg-green-500' : ''}>
                        {user.status === 'active' ? 'Aktif' : 'Non-Aktif'}
                      </Badge>
                      <Button variant="ghost" size="sm">Edit</Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* System */}
        <TabsContent value="system">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Pengaturan Sistem
              </CardTitle>
              <CardDescription>
                Konfigurasi teknis sistem
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="font-medium">Interval Pengambilan Data</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label>Sensor (menit)</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                  <div className="space-y-2">
                    <Label>Sync ke Server (menit)</Label>
                    <Input type="number" defaultValue="15" />
                  </div>
                  <div className="space-y-2">
                    <Label>Retention Data (hari)</Label>
                    <Input type="number" defaultValue="365" />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Backup & Maintenance</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Backup Otomatis</p>
                      <p className="text-sm text-muted-foreground">Backup database setiap hari</p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <p className="font-medium">Maintenance Mode</p>
                      <p className="text-sm text-muted-foreground">Nonaktifkan akses untuk maintenance</p>
                    </div>
                    <Switch />
                  </div>
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="font-medium">Informasi Sistem</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Versi</p>
                    <p className="font-medium">v2.1.0</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Database</p>
                    <p className="font-medium">PostgreSQL 14</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Last Update</p>
                    <p className="font-medium">2024-12-20</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Uptime</p>
                    <p className="font-medium">99.9%</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
