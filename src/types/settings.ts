// Company Settings Types
export interface CompanyInfo {
  id?: string;
  name: string;
  address: {
    street: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  logo?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// Payroll Settings
export interface PayrollSettings {
  id?: string;
  payPeriod: 'weekly' | 'biweekly' | 'monthly' | 'semimonthly';
  payDay: number; // Day of week (0-6) or day of month (1-31)
  overtimeThreshold: number; // Hours per week
  overtimeRate: number; // Multiplier (e.g., 1.5 for time and a half)
  defaultHourlyRate: number;
  taxSettings: {
    federalTaxRate: number;
    stateTaxRate: number;
    socialSecurityRate: number;
    medicareRate: number;
  };
  benefits: {
    healthInsuranceDeduction: number;
    retirement401kMatch: number;
    paidTimeOffAccrualRate: number; // Hours per pay period
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Work Hours Configuration
export interface WorkHoursConfig {
  id?: string;
  standardWorkWeek: number; // Hours per week
  workDays: {
    monday: { enabled: boolean; startTime: string; endTime: string; };
    tuesday: { enabled: boolean; startTime: string; endTime: string; };
    wednesday: { enabled: boolean; startTime: string; endTime: string; };
    thursday: { enabled: boolean; startTime: string; endTime: string; };
    friday: { enabled: boolean; startTime: string; endTime: string; };
    saturday: { enabled: boolean; startTime: string; endTime: string; };
    sunday: { enabled: boolean; startTime: string; endTime: string; };
  };
  breakDuration: number; // Minutes
  lunchDuration: number; // Minutes
  timeZone: string;
  allowFlexibleHours: boolean;
  requireTimeApproval: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// System Preferences
export interface SystemPreferences {
  id?: string;
  dateFormat: 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD';
  timeFormat: '12h' | '24h';
  currency: {
    code: string; // USD, EUR, etc.
    symbol: string; // $, €, etc.
    position: 'before' | 'after';
  };
  language: string;
  notifications: {
    emailNotifications: boolean;
    clockInReminders: boolean;
    overtimeAlerts: boolean;
    payrollReminders: boolean;
  };
  security: {
    sessionTimeout: number; // Minutes
    requirePasswordChange: boolean;
    passwordChangeInterval: number; // Days
    twoFactorAuth: boolean;
  };
  backup: {
    autoBackup: boolean;
    backupFrequency: 'daily' | 'weekly' | 'monthly';
    retentionPeriod: number; // Days
  };
  createdAt?: Date;
  updatedAt?: Date;
}

// Complete Settings Object
export interface CompanySettings {
  companyInfo: CompanyInfo;
  payrollSettings: PayrollSettings;
  workHoursConfig: WorkHoursConfig;
  systemPreferences: SystemPreferences;
}

// API Request/Response Types
export interface UpdateCompanyInfoRequest {
  name?: string;
  address?: Partial<CompanyInfo['address']>;
  phone?: string;
  email?: string;
  website?: string;
  taxId?: string;
  logo?: string;
}

export interface UpdatePayrollSettingsRequest {
  payPeriod?: PayrollSettings['payPeriod'];
  payDay?: number;
  overtimeThreshold?: number;
  overtimeRate?: number;
  defaultHourlyRate?: number;
  taxSettings?: Partial<PayrollSettings['taxSettings']>;
  benefits?: Partial<PayrollSettings['benefits']>;
}

export interface UpdateWorkHoursRequest {
  standardWorkWeek?: number;
  workDays?: Partial<WorkHoursConfig['workDays']>;
  breakDuration?: number;
  lunchDuration?: number;
  timeZone?: string;
  allowFlexibleHours?: boolean;
  requireTimeApproval?: boolean;
}

export interface UpdateSystemPreferencesRequest {
  dateFormat?: SystemPreferences['dateFormat'];
  timeFormat?: SystemPreferences['timeFormat'];
  currency?: Partial<SystemPreferences['currency']>;
  language?: string;
  notifications?: Partial<SystemPreferences['notifications']>;
  security?: Partial<SystemPreferences['security']>;
  backup?: Partial<SystemPreferences['backup']>;
}

// Settings Response Types
export interface SettingsResponse {
  success: boolean;
  data?: CompanySettings | Partial<CompanySettings>;
  message?: string;
  error?: string;
}

export interface SettingsUpdateResponse {
  success: boolean;
  data?: Partial<CompanySettings>;
  message?: string;
  error?: string;
}

// Default Settings
export const DEFAULT_COMPANY_SETTINGS: CompanySettings = {
  companyInfo: {
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: 'United States'
    }
  },
  payrollSettings: {
    payPeriod: 'biweekly',
    payDay: 5, // Friday
    overtimeThreshold: 40,
    overtimeRate: 1.5,
    defaultHourlyRate: 15.00,
    taxSettings: {
      federalTaxRate: 0.22,
      stateTaxRate: 0.05,
      socialSecurityRate: 0.062,
      medicareRate: 0.0145
    },
    benefits: {
      healthInsuranceDeduction: 150,
      retirement401kMatch: 0.03,
      paidTimeOffAccrualRate: 4
    }
  },
  workHoursConfig: {
    standardWorkWeek: 40,
    workDays: {
      monday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      tuesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      wednesday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      thursday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      friday: { enabled: true, startTime: '09:00', endTime: '17:00' },
      saturday: { enabled: false, startTime: '09:00', endTime: '17:00' },
      sunday: { enabled: false, startTime: '09:00', endTime: '17:00' }
    },
    breakDuration: 15,
    lunchDuration: 60,
    timeZone: 'America/New_York',
    allowFlexibleHours: false,
    requireTimeApproval: true
  },
  systemPreferences: {
    dateFormat: 'MM/DD/YYYY',
    timeFormat: '12h',
    currency: {
      code: 'USD',
      symbol: '$',
      position: 'before'
    },
    language: 'en',
    notifications: {
      emailNotifications: true,
      clockInReminders: true,
      overtimeAlerts: true,
      payrollReminders: true
    },
    security: {
      sessionTimeout: 480, // 8 hours
      requirePasswordChange: false,
      passwordChangeInterval: 90,
      twoFactorAuth: false
    },
    backup: {
      autoBackup: true,
      backupFrequency: 'daily',
      retentionPeriod: 30
    }
  }
};