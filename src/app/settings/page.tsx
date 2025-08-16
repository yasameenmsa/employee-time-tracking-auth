'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Settings, Save, Building, Clock, DollarSign, Users } from 'lucide-react';
import Layout from '@/components/layout/Layout';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import LogoutButton from '@/components/ui/LogoutButton';
import { useThemeStyles } from '@/contexts/ThemeContext';
import { CompanyInfo, PayrollSettings, WorkHoursConfig, SystemPreferences } from '@/types/settings';

export default function SettingsPage() {
  const router = useRouter();
  const themeStyles = useThemeStyles();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState('company');
  
  const [companyInfo, setCompanyInfo] = useState<CompanyInfo>({
    name: '',
    address: {
      street: '',
      city: '',
      state: '',
      zipCode: '',
      country: ''
    },
    phone: '',
    email: '',
    website: '',
    taxId: '',
    logo: ''
  });
  
  const [payrollSettings, setPayrollSettings] = useState<PayrollSettings>({
      defaultHourlyRate: 15,
      overtimeRate: 1.5,
      overtimeThreshold: 40,
      payPeriod: 'weekly',
      payDay: 5,
      benefits: {
         healthInsuranceDeduction: 0,
         retirement401kMatch: 0,
         paidTimeOffAccrualRate: 0
       },
      taxSettings: {
        federalTaxRate: 0.22,
        stateTaxRate: 0.05,
        socialSecurityRate: 0.062,
        medicareRate: 0.0145
      }
    });
  
  const [workHoursSettings, setWorkHoursSettings] = useState<WorkHoursConfig>({
     standardWorkWeek: 40,
     workDays: {
        monday: { startTime: '09:00', endTime: '17:00', enabled: true },
        tuesday: { startTime: '09:00', endTime: '17:00', enabled: true },
        wednesday: { startTime: '09:00', endTime: '17:00', enabled: true },
        thursday: { startTime: '09:00', endTime: '17:00', enabled: true },
        friday: { startTime: '09:00', endTime: '17:00', enabled: true },
        saturday: { startTime: '09:00', endTime: '17:00', enabled: false },
        sunday: { startTime: '09:00', endTime: '17:00', enabled: false }
      },
     breakDuration: 30,
     lunchDuration: 60,
     timeZone: 'America/New_York',
     allowFlexibleHours: false,
     requireTimeApproval: true
    });
  
  const [systemSettings, setSystemSettings] = useState<SystemPreferences>({
     dateFormat: 'MM/DD/YYYY',
     timeFormat: '12h',
     currency: { code: 'USD', symbol: '$', position: 'before' },
     language: 'en',
     notifications: {
       emailNotifications: true,
       clockInReminders: true,
       overtimeAlerts: true,
       payrollReminders: true
     },
     security: {
        sessionTimeout: 30,
        requirePasswordChange: true,
        passwordChangeInterval: 90,
        twoFactorAuth: false
      },
     backup: {
        autoBackup: true,
        backupFrequency: 'daily',
        retentionPeriod: 30
      }
   });

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/auth/verify', {
          credentials: 'include'
        });
        
        if (!response.ok) {
          router.push('/login');
          return;
        }
        
        const data = await response.json();
        if (data.user?.role !== 'admin') {
          router.push('/dashboard');
          return;
        }
        
        await loadSettings();
      } catch (error) {
        console.error('Auth check failed:', error);
        router.push('/login');
      }
    };

    checkAuth();
  }, [router]);

  const loadSettings = async () => {
    try {
      setLoading(true);
      
      // Load all settings
      const [companyRes, payrollRes, workHoursRes, systemRes] = await Promise.all([
        fetch('/api/settings/company', { credentials: 'include' }),
        fetch('/api/settings/payroll', { credentials: 'include' }),
        fetch('/api/settings/work-hours', { credentials: 'include' }),
        fetch('/api/settings/system', { credentials: 'include' })
      ]);
      
      if (companyRes.ok) {
        const companyData = await companyRes.json();
        if (companyData.success && companyData.data) {
          setCompanyInfo(companyData.data);
        }
      }
      
      if (payrollRes.ok) {
        const payrollData = await payrollRes.json();
        if (payrollData.success && payrollData.data) {
          setPayrollSettings(payrollData.data);
        }
      }
      
      if (workHoursRes.ok) {
        const workHoursData = await workHoursRes.json();
        if (workHoursData.success && workHoursData.data) {
          setWorkHoursSettings(workHoursData.data);
        }
      }
      
      if (systemRes.ok) {
        const systemData = await systemRes.json();
        if (systemData.success && systemData.data) {
          setSystemSettings(systemData.data);
        }
      }
    } catch (error) {
      console.error('Failed to load settings:', error);
      setError('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const saveSettings = async () => {
    try {
      setSaving(true);
      setError('');
      setSuccess('');
      
      const settingsMap = {
        company: companyInfo,
        payroll: payrollSettings,
        'work-hours': workHoursSettings,
        system: systemSettings
      };
      
      const savePromises = Object.entries(settingsMap).map(([type, data]) =>
        fetch(`/api/settings/${type}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          credentials: 'include',
          body: JSON.stringify(data)
        })
      );
      
      const results = await Promise.all(savePromises);
      const allSuccessful = results.every(res => res.ok);
      
      if (allSuccessful) {
        setSuccess('Settings saved successfully!');
      } else {
        setError('Some settings failed to save. Please try again.');
      }
    } catch (error) {
      console.error('Failed to save settings:', error);
      setError('Failed to save settings');
    } finally {
      setSaving(false);
    }
  };

  const tabs = [
    { id: 'company', label: 'Company Info', icon: Building },
    { id: 'payroll', label: 'Payroll', icon: DollarSign },
    { id: 'work-hours', label: 'Work Hours', icon: Clock },
    { id: 'system', label: 'System', icon: Settings }
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading settings...</p>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen p-6">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">System Settings</h1>
              <p className="text-gray-600">Configure your system preferences and company information</p>
            </div>
            <LogoutButton />
          </div>

          {/* Messages */}
          {error && <ErrorMessage message={error} className="mb-6" />}
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
              {success}
            </div>
          )}

          {/* Tab Navigation */}
          <div className="border-b border-gray-200 mb-6">
            <nav className="-mb-px flex space-x-8">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                      activeTab === tab.id
                        ? 'border-blue-500 text-blue-600'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Tab Content */}
          <div className="space-y-6">
            {activeTab === 'company' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Company Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Company Name</label>
                    <input
                      type="text"
                      value={companyInfo.name}
                      onChange={(e) => setCompanyInfo((prev: CompanyInfo) => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter company name"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Phone</label>
                    <input
                      type="text"
                      value={companyInfo.phone}
                      onChange={(e) => setCompanyInfo((prev: CompanyInfo) => ({ ...prev, phone: e.target.value }))}
                      placeholder="Enter phone number"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                    <input
                      type="email"
                      value={companyInfo.email}
                      onChange={(e) => setCompanyInfo((prev: CompanyInfo) => ({ ...prev, email: e.target.value }))}
                      placeholder="Enter email address"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Website</label>
                    <input
                      type="text"
                      value={companyInfo.website}
                      onChange={(e) => setCompanyInfo((prev: CompanyInfo) => ({ ...prev, website: e.target.value }))}
                      placeholder="Enter website URL"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Tax ID</label>
                    <input
                      type="text"
                      value={companyInfo.taxId}
                      onChange={(e) => setCompanyInfo((prev: CompanyInfo) => ({ ...prev, taxId: e.target.value }))}
                      placeholder="Enter tax ID"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'payroll' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Payroll Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Default Hourly Rate ($)</label>
                    <input
                      type="number"
                      value={payrollSettings.defaultHourlyRate.toString()}
                      onChange={(e) => setPayrollSettings((prev: PayrollSettings) => ({ ...prev, defaultHourlyRate: parseFloat(e.target.value) || 0 }))}
                      placeholder="15.00"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Overtime Multiplier</label>
                    <input
                      type="number"
                      step="0.1"
                      value={payrollSettings.overtimeRate.toString()}
                       onChange={(e) => setPayrollSettings((prev: PayrollSettings) => ({ ...prev, overtimeRate: parseFloat(e.target.value) || 1.5 }))}
                      placeholder="1.5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Overtime Threshold (hours)</label>
                    <input
                      type="number"
                      value={payrollSettings.overtimeThreshold.toString()}
                      onChange={(e) => setPayrollSettings((prev: PayrollSettings) => ({ ...prev, overtimeThreshold: parseInt(e.target.value) || 40 }))}
                      placeholder="40"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'work-hours' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">Work Hours Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Standard Work Hours</label>
                    <input
                      type="number"
                      value={workHoursSettings.standardWorkWeek.toString()}
                      onChange={(e) => setWorkHoursSettings((prev: WorkHoursConfig) => ({ ...prev, standardWorkWeek: parseInt(e.target.value) }))}
                      placeholder="8"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Work Days Per Week</label>
                    <input
                      type="number"
                      value="5"
                      onChange={(e) => {}}
                      placeholder="5"
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Start Time</label>
                    <input
                      type="time"
                      value={workHoursSettings.workDays?.monday?.startTime || '09:00'}
                      onChange={(e) => setWorkHoursSettings((prev: WorkHoursConfig) => ({ ...prev, workDays: { ...prev.workDays, monday: { ...prev.workDays.monday, startTime: e.target.value } } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">End Time</label>
                    <input
                      type="time"
                      value={workHoursSettings.workDays?.monday?.endTime || '17:00'}
                      onChange={(e) => setWorkHoursSettings((prev: WorkHoursConfig) => ({ ...prev, workDays: { ...prev.workDays, monday: { ...prev.workDays.monday, endTime: e.target.value } } }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    />
                  </div>
                </div>
              </Card>
            )}

            {activeTab === 'system' && (
              <Card className="p-6">
                <h2 className="text-xl font-semibold mb-4 text-gray-900">System Settings</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Timezone</label>
                    <select
                      value={systemSettings.timeFormat || '12'}
                      onChange={(e) => setSystemSettings((prev: SystemPreferences) => ({ ...prev, timeFormat: e.target.value as '12h' | '24h' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    >
                      <option value="America/New_York">Eastern Time</option>
                      <option value="America/Chicago">Central Time</option>
                      <option value="America/Denver">Mountain Time</option>
                      <option value="America/Los_Angeles">Pacific Time</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1 text-gray-700">Date Format</label>
                    <select
                      value={systemSettings.dateFormat}
                      onChange={(e) => setSystemSettings((prev: SystemPreferences) => ({ ...prev, dateFormat: e.target.value as 'MM/DD/YYYY' | 'DD/MM/YYYY' | 'YYYY-MM-DD' }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                       style={themeStyles.inputStyle}
                    >
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                  </div>
                </div>
              </Card>
            )}
          </div>

          {/* Save Button */}
          <div className="mt-8 flex justify-end">
            <Button
              onClick={saveSettings}
              disabled={saving}
              className="flex items-center space-x-2"
            >
              <Save className="h-4 w-4" />
              <span>{saving ? 'Saving...' : 'Save Settings'}</span>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
}