// Types for Water Debit Monitoring System - Sulawesi Tenggara Mining Companies

export interface Company {
  id: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    address: string;
    district: string;
    regency: string;
  };
  type: 'nickel' | 'gold' | 'iron' | 'bauxite' | 'coal';
  licenseNumber: string;
  contact: {
    phone: string;
    email: string;
    pic: string;
  };
  status: 'active' | 'inactive' | 'suspended';
  establishedYear: number;
  totalSites: number;
}

export interface WaterStation {
  id: string;
  companyId: string;
  name: string;
  location: {
    lat: number;
    lng: number;
    description: string;
  };
  type: 'inlet' | 'outlet' | 'processing' | 'waste' | 'river';
  sensorStatus: 'online' | 'offline' | 'maintenance';
  lastCalibration: string;
  threshold: {
    min: number;
    max: number;
    critical: number;
  };
}

export interface WaterDebitReading {
  id: string;
  stationId: string;
  companyId: string;
  timestamp: string;
  debit: number; // in m³/hour
  totalVolume: number; // in m³
  quality?: {
    ph: number;
    turbidity: number;
    tds: number;
    temperature: number;
  };
  status: 'normal' | 'warning' | 'critical';
}

export interface DailyReport {
  date: string;
  companyId: string;
  stationId: string;
  readings: WaterDebitReading[];
  summary: {
    avgDebit: number;
    maxDebit: number;
    minDebit: number;
    totalVolume: number;
    hoursExceeded: number;
  };
}

export interface MonthlyReport {
  month: number;
  year: number;
  companyId: string;
  stationId: string;
  dailySummaries: DailyReport['summary'][];
  summary: {
    avgDebit: number;
    maxDebit: number;
    minDebit: number;
    totalVolume: number;
    daysExceeded: number;
    compliance: number; // percentage
  };
}

export interface Alert {
  id: string;
  companyId: string;
  stationId: string;
  type: 'threshold_exceeded' | 'sensor_offline' | 'critical_level' | 'maintenance_required';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  timestamp: string;
  resolved: boolean;
  resolvedAt?: string;
  resolvedBy?: string;
}

export interface DashboardStats {
  totalCompanies: number;
  activeStations: number;
  offlineStations: number;
  totalDebitToday: number;
  alertsToday: number;
  complianceRate: number;
}

export interface ChartData {
  time: string;
  debit: number;
  threshold: number;
  stationName?: string;
}

export interface CompanySummary {
  company: Company;
  stations: WaterStation[];
  latestReadings: WaterDebitReading[];
  todayStats: {
    totalVolume: number;
    avgDebit: number;
    maxDebit: number;
    alertCount: number;
  };
}

export type ReportPeriod = 'daily' | 'weekly' | 'monthly' | 'yearly';
export type ExportFormat = 'pdf' | 'excel' | 'csv';
