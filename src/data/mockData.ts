import type { Company, WaterStation, WaterDebitReading, Alert, DashboardStats } from '@/types';

// Mining Companies in Southeast Sulawesi
export const companies: Company[] = [
  {
    id: 'comp-001',
    name: 'PT Vale Indonesia Tbk',
    location: {
      lat: -4.1333,
      lng: 121.6167,
      address: 'Block Sorowako, Desa Sorowako',
      district: 'Kecamatan Nuha',
      regency: 'Kabupaten Luwu Timur'
    },
    type: 'nickel',
    licenseNumber: 'IUP-001/KEP-MEM/2020',
    contact: {
      phone: '+62-21-526-9000',
      email: 'info@vale.com',
      pic: 'Budi Santoso'
    },
    status: 'active',
    establishedYear: 1968,
    totalSites: 5
  },
  {
    id: 'comp-002',
    name: 'PT Antam Tbk Unit Bisnis Pertambangan Nikel Sulawesi',
    location: {
      lat: -3.7167,
      lng: 121.5000,
      address: 'Desa Pomalaa',
      district: 'Kecamatan Pomalaa',
      regency: 'Kabupaten Kolaka'
    },
    type: 'nickel',
    licenseNumber: 'IUP-002/KEP-MEM/2019',
    contact: {
      phone: '+62-21-789-1234',
      email: 'nikel.sultra@antam.co.id',
      pic: 'Ahmad Wijaya'
    },
    status: 'active',
    establishedYear: 1974,
    totalSites: 4
  },
  {
    id: 'comp-003',
    name: 'PT Ceria Nugraha Indotama',
    location: {
      lat: -4.2500,
      lng: 121.8333,
      address: 'Desa Wawonii',
      district: 'Kecamatan Wawonii',
      regency: 'Kabupaten Konawe Kepulauan'
    },
    type: 'nickel',
    licenseNumber: 'IUP-003/KEP-MEM/2018',
    contact: {
      phone: '+62-401-234-5678',
      email: 'info@ceria.co.id',
      pic: 'Dewi Kusuma'
    },
    status: 'active',
    establishedYear: 2012,
    totalSites: 3
  },
  {
    id: 'comp-004',
    name: 'PT Aneka Tambang Tbk Unit Nikel Pomala',
    location: {
      lat: -3.7500,
      lng: 121.4500,
      address: 'Desa Latambaga',
      district: 'Kecamatan Pomalaa',
      regency: 'Kabupaten Kolaka'
    },
    type: 'nickel',
    licenseNumber: 'IUP-004/KEP-MEM/2017',
    contact: {
      phone: '+62-21-525-1000',
      email: 'nikel@amb.co.id',
      pic: 'Siti Rahayu'
    },
    status: 'active',
    establishedYear: 1979,
    totalSites: 3
  },
  {
    id: 'comp-005',
    name: 'PT Konawe Industries',
    location: {
      lat: -3.9667,
      lng: 122.0833,
      address: 'Kawasan Industri Mandiodo',
      district: 'Kecamatan Morosi',
      regency: 'Kabupaten Konawe'
    },
    type: 'nickel',
    licenseNumber: 'IUP-005/KEP-MEM/2021',
    contact: {
      phone: '+62-408-876-5432',
      email: 'info@konawe-ind.com',
      pic: 'Hendra Gunawan'
    },
    status: 'active',
    establishedYear: 2019,
    totalSites: 2
  },
  {
    id: 'comp-006',
    name: 'PT Sulawesi Mining Investment',
    location: {
      lat: -4.0500,
      lng: 121.6500,
      address: 'Desa Malili',
      district: 'Kecamatan Malili',
      regency: 'Kabupaten Kolaka Timur'
    },
    type: 'nickel',
    licenseNumber: 'IUP-006/KEP-MEM/2016',
    contact: {
      phone: '+62-21-555-7890',
      email: 'contact@sulawesi-mining.com',
      pic: 'Rudi Hartono'
    },
    status: 'active',
    establishedYear: 2015,
    totalSites: 4
  },
  {
    id: 'comp-007',
    name: 'PT Bumi Resources Minerals Tbk',
    location: {
      lat: -3.8333,
      lng: 121.2500,
      address: 'Desa Samaturu',
      district: 'Kecamatan Samaturu',
      regency: 'Kabupaten Kolaka'
    },
    type: 'gold',
    licenseNumber: 'IUP-007/KEP-MEM/2015',
    contact: {
      phone: '+62-21-2988-1234',
      email: 'info@bumiresources.com',
      pic: 'Maya Sari'
    },
    status: 'active',
    establishedYear: 2010,
    totalSites: 2
  },
  {
    id: 'comp-008',
    name: 'PT Central Omega Resources Tbk',
    location: {
      lat: -4.1833,
      lng: 121.7500,
      address: 'Desa Bahodopi',
      district: 'Kecamatan Bahodopi',
      regency: 'Kabupaten Morowali'
    },
    type: 'nickel',
    licenseNumber: 'IUP-008/KEP-MEM/2018',
    contact: {
      phone: '+62-21-3000-5678',
      email: 'info@centralomega.co.id',
      pic: 'Fajar Pratama'
    },
    status: 'active',
    establishedYear: 2011,
    totalSites: 3
  }
];

// Water Monitoring Stations
export const waterStations: WaterStation[] = [
  // PT Vale Indonesia
  {
    id: 'st-001',
    companyId: 'comp-001',
    name: 'Stasiun Inlet Sungai Larona',
    location: { lat: -4.1333, lng: 121.6167, description: 'Hulu sungai sebelum area tambang' },
    type: 'inlet',
    sensorStatus: 'online',
    lastCalibration: '2024-12-15',
    threshold: { min: 50, max: 500, critical: 800 }
  },
  {
    id: 'st-002',
    companyId: 'comp-001',
    name: 'Stasiun Outlet Pengolahan',
    location: { lat: -4.1400, lng: 121.6200, description: 'Outlet dari area pengolahan' },
    type: 'outlet',
    sensorStatus: 'online',
    lastCalibration: '2024-12-10',
    threshold: { min: 30, max: 400, critical: 600 }
  },
  {
    id: 'st-003',
    companyId: 'comp-001',
    name: 'Stasiun Limbah Tambang',
    location: { lat: -4.1450, lng: 121.6250, description: 'Monitoring limbah tambang' },
    type: 'waste',
    sensorStatus: 'online',
    lastCalibration: '2024-12-05',
    threshold: { min: 10, max: 200, critical: 400 }
  },
  // PT Antam
  {
    id: 'st-004',
    companyId: 'comp-002',
    name: 'Stasiun Inlet Pomalaa',
    location: { lat: -3.7167, lng: 121.5000, description: 'Sumber air masuk Pomalaa' },
    type: 'inlet',
    sensorStatus: 'online',
    lastCalibration: '2024-12-12',
    threshold: { min: 40, max: 450, critical: 700 }
  },
  {
    id: 'st-005',
    companyId: 'comp-002',
    name: 'Stasiun Proses Pengolahan',
    location: { lat: -3.7200, lng: 121.5050, description: 'Area pengolahan bijih' },
    type: 'processing',
    sensorStatus: 'online',
    lastCalibration: '2024-12-08',
    threshold: { min: 25, max: 350, critical: 550 }
  },
  // PT Ceria
  {
    id: 'st-006',
    companyId: 'comp-003',
    name: 'Stasiun Wawonii Utara',
    location: { lat: -4.2500, lng: 121.8333, description: 'Pulau Wawonii - zona utara' },
    type: 'river',
    sensorStatus: 'online',
    lastCalibration: '2024-12-18',
    threshold: { min: 20, max: 300, critical: 500 }
  },
  {
    id: 'st-007',
    companyId: 'comp-003',
    name: 'Stasiun Wawonii Selatan',
    location: { lat: -4.2600, lng: 121.8400, description: 'Pulau Wawonii - zona selatan' },
    type: 'outlet',
    sensorStatus: 'maintenance',
    lastCalibration: '2024-11-20',
    threshold: { min: 15, max: 250, critical: 450 }
  },
  // PT Aneka Tambang
  {
    id: 'st-008',
    companyId: 'comp-004',
    name: 'Stasiun Latambaga Inlet',
    location: { lat: -3.7500, lng: 121.4500, description: 'Sungai Latambaga' },
    type: 'inlet',
    sensorStatus: 'online',
    lastCalibration: '2024-12-14',
    threshold: { min: 35, max: 400, critical: 650 }
  },
  {
    id: 'st-009',
    companyId: 'comp-004',
    name: 'Stasiun Outlet Tambang',
    location: { lat: -3.7550, lng: 121.4550, description: 'Outlet area tambang' },
    type: 'outlet',
    sensorStatus: 'online',
    lastCalibration: '2024-12-09',
    threshold: { min: 20, max: 300, critical: 500 }
  },
  // PT Konawe Industries
  {
    id: 'st-010',
    companyId: 'comp-005',
    name: 'Stasiun Kawasan Industri',
    location: { lat: -3.9667, lng: 122.0833, description: 'Kawasan Industri Mandiodo' },
    type: 'processing',
    sensorStatus: 'online',
    lastCalibration: '2024-12-16',
    threshold: { min: 30, max: 350, critical: 550 }
  },
  // PT Sulawesi Mining
  {
    id: 'st-011',
    companyId: 'comp-006',
    name: 'Stasiun Malili Hulu',
    location: { lat: -4.0500, lng: 121.6500, description: 'Hulu sungai Malili' },
    type: 'inlet',
    sensorStatus: 'online',
    lastCalibration: '2024-12-11',
    threshold: { min: 45, max: 480, critical: 750 }
  },
  {
    id: 'st-012',
    companyId: 'comp-006',
    name: 'Stasiun Malili Hilir',
    location: { lat: -4.0600, lng: 121.6600, description: 'Hilir sungai Malili' },
    type: 'outlet',
    sensorStatus: 'offline',
    lastCalibration: '2024-11-15',
    threshold: { min: 30, max: 350, critical: 550 }
  },
  // PT Bumi Resources
  {
    id: 'st-013',
    companyId: 'comp-007',
    name: 'Stasiun Samaturu',
    location: { lat: -3.8333, lng: 121.2500, description: 'Area tambang emas Samaturu' },
    type: 'processing',
    sensorStatus: 'online',
    lastCalibration: '2024-12-13',
    threshold: { min: 15, max: 200, critical: 350 }
  },
  // PT Central Omega
  {
    id: 'st-014',
    companyId: 'comp-008',
    name: 'Stasiun Bahodopi Barat',
    location: { lat: -4.1833, lng: 121.7500, description: 'Zona barat Bahodopi' },
    type: 'inlet',
    sensorStatus: 'online',
    lastCalibration: '2024-12-17',
    threshold: { min: 40, max: 420, critical: 680 }
  },
  {
    id: 'st-015',
    companyId: 'comp-008',
    name: 'Stasiun Bahodopi Timur',
    location: { lat: -4.1900, lng: 121.7600, description: 'Zona timur Bahodopi' },
    type: 'outlet',
    sensorStatus: 'online',
    lastCalibration: '2024-12-07',
    threshold: { min: 25, max: 320, critical: 520 }
  }
];

// Generate realistic water debit readings
export function generateReadings(stationId: string, hours: number = 24): WaterDebitReading[] {
  const readings: WaterDebitReading[] = [];
  const station = waterStations.find(s => s.id === stationId);
  if (!station) return readings;

  const now = new Date();
  const baseDebit = station.threshold.max * 0.6;

  for (let i = hours; i >= 0; i--) {
    const timestamp = new Date(now.getTime() - i * 60 * 60 * 1000);
    const hour = timestamp.getHours();
    
    // Simulate daily pattern - higher during day, lower at night
    const dailyFactor = 1 + 0.3 * Math.sin((hour - 6) * Math.PI / 12);
    const randomFactor = 0.9 + Math.random() * 0.2;
    const debit = Math.round(baseDebit * dailyFactor * randomFactor * 10) / 10;
    
    let status: WaterDebitReading['status'] = 'normal';
    if (debit > station.threshold.critical) status = 'critical';
    else if (debit > station.threshold.max) status = 'warning';

    readings.push({
      id: `rd-${stationId}-${timestamp.getTime()}`,
      stationId,
      companyId: station.companyId,
      timestamp: timestamp.toISOString(),
      debit,
      totalVolume: Math.round(debit * (24 - i + 1) * 100) / 100,
      quality: {
        ph: Math.round((6.5 + Math.random() * 2) * 10) / 10,
        turbidity: Math.round(Math.random() * 50 * 10) / 10,
        tds: Math.round((100 + Math.random() * 200) * 10) / 10,
        temperature: Math.round((25 + Math.random() * 5) * 10) / 10
      },
      status
    });
  }
  return readings;
}

// Generate alerts
export const alerts: Alert[] = [
  {
    id: 'alt-001',
    companyId: 'comp-001',
    stationId: 'st-002',
    type: 'threshold_exceeded',
    severity: 'high',
    message: 'Debit air melebihi batas maksimum 450 m³/jam',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolved: false
  },
  {
    id: 'alt-002',
    companyId: 'comp-006',
    stationId: 'st-012',
    type: 'sensor_offline',
    severity: 'medium',
    message: 'Sensor stasiun Malili Hilir offline selama 6 jam',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(),
    resolved: false
  },
  {
    id: 'alt-003',
    companyId: 'comp-003',
    stationId: 'st-007',
    type: 'maintenance_required',
    severity: 'low',
    message: 'Kalibrasi sensor diperlukan dalam 7 hari',
    timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(),
    resolved: false
  },
  {
    id: 'alt-004',
    companyId: 'comp-002',
    stationId: 'st-005',
    type: 'threshold_exceeded',
    severity: 'medium',
    message: 'Debit air mendekati batas kritis',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    resolved: true,
    resolvedAt: new Date(Date.now() - 20 * 60 * 60 * 1000).toISOString(),
    resolvedBy: 'Admin'
  },
  {
    id: 'alt-005',
    companyId: 'comp-008',
    stationId: 'st-015',
    type: 'critical_level',
    severity: 'critical',
    message: 'Peningkatan debit drastis terdeteksi - 580 m³/jam',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    resolved: true,
    resolvedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    resolvedBy: 'Teknisi'
  }
];

// Dashboard statistics
export const dashboardStats: DashboardStats = {
  totalCompanies: companies.length,
  activeStations: waterStations.filter(s => s.sensorStatus === 'online').length,
  offlineStations: waterStations.filter(s => s.sensorStatus === 'offline').length,
  totalDebitToday: 2847.5,
  alertsToday: alerts.filter(a => !a.resolved).length,
  complianceRate: 87.5
};

// Helper functions
export function getCompanyById(id: string): Company | undefined {
  return companies.find(c => c.id === id);
}

export function getStationsByCompany(companyId: string): WaterStation[] {
  return waterStations.filter(s => s.companyId === companyId);
}

export function getAlertsByCompany(companyId: string): Alert[] {
  return alerts.filter(a => a.companyId === companyId);
}

export function getRecentAlerts(limit: number = 10): Alert[] {
  return alerts
    .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
    .slice(0, limit);
}
