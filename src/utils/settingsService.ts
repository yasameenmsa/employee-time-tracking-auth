import { MongoClient, Db, Collection } from 'mongodb';
import {
  CompanySettings,
  CompanyInfo,
  PayrollSettings,
  WorkHoursConfig,
  SystemPreferences,
  UpdateCompanyInfoRequest,
  UpdatePayrollSettingsRequest,
  UpdateWorkHoursRequest,
  UpdateSystemPreferencesRequest,
  DEFAULT_COMPANY_SETTINGS
} from '../types/settings';

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const DB_NAME = 'employee_management';
const SETTINGS_COLLECTION = 'company_settings';

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Database connection helper
async function connectToDatabase(): Promise<{ client: MongoClient; db: Db }> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    const db = client.db(DB_NAME);

    cachedClient = client;
    cachedDb = db;

    return { client, db };
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
    throw new Error('Database connection failed');
  }
}

// Get settings collection
async function getSettingsCollection(): Promise<Collection<CompanySettings>> {
  const { db } = await connectToDatabase();
  return db.collection<CompanySettings>(SETTINGS_COLLECTION);
}

// Initialize default settings if none exist
export async function initializeDefaultSettings(): Promise<CompanySettings> {
  try {
    const collection = await getSettingsCollection();
    
    // Check if settings already exist
    const existingSettings = await collection.findOne({});
    if (existingSettings) {
      return existingSettings;
    }

    // Create default settings with timestamps
    const defaultSettings: CompanySettings = {
      ...DEFAULT_COMPANY_SETTINGS,
      companyInfo: {
        ...DEFAULT_COMPANY_SETTINGS.companyInfo,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      payrollSettings: {
        ...DEFAULT_COMPANY_SETTINGS.payrollSettings,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      workHoursConfig: {
        ...DEFAULT_COMPANY_SETTINGS.workHoursConfig,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      systemPreferences: {
        ...DEFAULT_COMPANY_SETTINGS.systemPreferences,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    };

    await collection.insertOne(defaultSettings);
    return defaultSettings;
  } catch (error) {
    console.error('Error initializing default settings:', error);
    throw new Error('Failed to initialize default settings');
  }
}

// Get all company settings
export async function getCompanySettings(): Promise<CompanySettings> {
  try {
    const collection = await getSettingsCollection();
    const settings = await collection.findOne({});
    
    if (!settings) {
      // Initialize default settings if none exist
      return await initializeDefaultSettings();
    }
    
    return settings;
  } catch (error) {
    console.error('Error fetching company settings:', error);
    throw new Error('Failed to fetch company settings');
  }
}

// Update company information
export async function updateCompanyInfo(updates: UpdateCompanyInfoRequest): Promise<CompanyInfo> {
  try {
    const collection = await getSettingsCollection();
    
    // Prepare update object
    const updateData: Record<string, any> = {
      'companyInfo.updatedAt': new Date()
    };
    
    // Add specific field updates
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'address' && typeof value === 'object') {
        // Handle nested address updates
        Object.entries(value).forEach(([addressKey, addressValue]) => {
          updateData[`companyInfo.address.${addressKey}`] = addressValue;
        });
      } else {
        updateData[`companyInfo.${key}`] = value;
      }
    });

    const result = await collection.updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      throw new Error('Failed to update company information');
    }

    // Return updated company info
    const updatedSettings = await getCompanySettings();
    return updatedSettings.companyInfo;
  } catch (error) {
    console.error('Error updating company info:', error);
    throw new Error('Failed to update company information');
  }
}

// Update payroll settings
export async function updatePayrollSettings(updates: UpdatePayrollSettingsRequest): Promise<PayrollSettings> {
  try {
    const collection = await getSettingsCollection();
    
    // Prepare update object
    const updateData: Record<string, any> = {
      'payrollSettings.updatedAt': new Date()
    };
    
    // Add specific field updates
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'taxSettings' && typeof value === 'object') {
        Object.entries(value).forEach(([taxKey, taxValue]) => {
          updateData[`payrollSettings.taxSettings.${taxKey}`] = taxValue;
        });
      } else if (key === 'benefits' && typeof value === 'object') {
        Object.entries(value).forEach(([benefitKey, benefitValue]) => {
          updateData[`payrollSettings.benefits.${benefitKey}`] = benefitValue;
        });
      } else {
        updateData[`payrollSettings.${key}`] = value;
      }
    });

    const result = await collection.updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      throw new Error('Failed to update payroll settings');
    }

    // Return updated payroll settings
    const updatedSettings = await getCompanySettings();
    return updatedSettings.payrollSettings;
  } catch (error) {
    console.error('Error updating payroll settings:', error);
    throw new Error('Failed to update payroll settings');
  }
}

// Update work hours configuration
export async function updateWorkHoursConfig(updates: UpdateWorkHoursRequest): Promise<WorkHoursConfig> {
  try {
    const collection = await getSettingsCollection();
    
    // Prepare update object
    const updateData: Record<string, any> = {
      'workHoursConfig.updatedAt': new Date()
    };
    
    // Add specific field updates
    Object.entries(updates).forEach(([key, value]) => {
      if (key === 'workDays' && typeof value === 'object') {
        Object.entries(value).forEach(([dayKey, dayValue]) => {
          if (typeof dayValue === 'object' && dayValue !== null) {
            Object.entries(dayValue).forEach(([dayProp, dayPropValue]) => {
              updateData[`workHoursConfig.workDays.${dayKey}.${dayProp}`] = dayPropValue;
            });
          }
        });
      } else {
        updateData[`workHoursConfig.${key}`] = value;
      }
    });

    const result = await collection.updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      throw new Error('Failed to update work hours configuration');
    }

    // Return updated work hours config
    const updatedSettings = await getCompanySettings();
    return updatedSettings.workHoursConfig;
  } catch (error) {
    console.error('Error updating work hours config:', error);
    throw new Error('Failed to update work hours configuration');
  }
}

// Update system preferences
export async function updateSystemPreferences(updates: UpdateSystemPreferencesRequest): Promise<SystemPreferences> {
  try {
    const collection = await getSettingsCollection();
    
    // Prepare update object
    const updateData: Record<string, any> = {
      'systemPreferences.updatedAt': new Date()
    };
    
    // Add specific field updates
    Object.entries(updates).forEach(([key, value]) => {
      if (typeof value === 'object' && value !== null) {
        // Handle nested object updates
        Object.entries(value).forEach(([nestedKey, nestedValue]) => {
          updateData[`systemPreferences.${key}.${nestedKey}`] = nestedValue;
        });
      } else {
        updateData[`systemPreferences.${key}`] = value;
      }
    });

    const result = await collection.updateOne(
      {},
      { $set: updateData },
      { upsert: true }
    );

    if (result.matchedCount === 0 && result.upsertedCount === 0) {
      throw new Error('Failed to update system preferences');
    }

    // Return updated system preferences
    const updatedSettings = await getCompanySettings();
    return updatedSettings.systemPreferences;
  } catch (error) {
    console.error('Error updating system preferences:', error);
    throw new Error('Failed to update system preferences');
  }
}

// Reset settings to default
export async function resetSettingsToDefault(): Promise<CompanySettings> {
  try {
    const collection = await getSettingsCollection();
    
    // Delete existing settings
    await collection.deleteMany({});
    
    // Initialize default settings
    return await initializeDefaultSettings();
  } catch (error) {
    console.error('Error resetting settings to default:', error);
    throw new Error('Failed to reset settings to default');
  }
}

// Backup current settings
export async function backupSettings(): Promise<CompanySettings> {
  try {
    const settings = await getCompanySettings();
    
    // In a real application, you might want to save this to a backup collection
    // or export to a file. For now, we'll just return the current settings.
    const backupCollection = await getSettingsCollection();
    const backupData = {
      ...settings,
      backupDate: new Date(),
      isBackup: true
    };
    
    // Save to backup collection (you might want to create a separate collection)
    await backupCollection.insertOne(backupData);
    
    return settings;
  } catch (error) {
    console.error('Error backing up settings:', error);
    throw new Error('Failed to backup settings');
  }
}

// Validate settings data
export function validateCompanyInfo(data: UpdateCompanyInfoRequest): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.name !== undefined && (!data.name || data.name.trim().length < 2)) {
    errors.push('Company name must be at least 2 characters long');
  }
  
  if (data.email !== undefined && data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push('Invalid email format');
  }
  
  if (data.phone !== undefined && data.phone && !/^[\d\s\-\(\)\+]+$/.test(data.phone)) {
    errors.push('Invalid phone number format');
  }
  
  return { isValid: errors.length === 0, errors };
}

export function validatePayrollSettings(data: UpdatePayrollSettingsRequest): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.overtimeThreshold !== undefined && (data.overtimeThreshold < 0 || data.overtimeThreshold > 168)) {
    errors.push('Overtime threshold must be between 0 and 168 hours');
  }
  
  if (data.overtimeRate !== undefined && (data.overtimeRate < 1 || data.overtimeRate > 3)) {
    errors.push('Overtime rate must be between 1.0 and 3.0');
  }
  
  if (data.defaultHourlyRate !== undefined && data.defaultHourlyRate < 0) {
    errors.push('Default hourly rate must be positive');
  }
  
  return { isValid: errors.length === 0, errors };
}

export function validateWorkHoursConfig(data: UpdateWorkHoursRequest): { isValid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (data.standardWorkWeek !== undefined && (data.standardWorkWeek < 1 || data.standardWorkWeek > 168)) {
    errors.push('Standard work week must be between 1 and 168 hours');
  }
  
  if (data.breakDuration !== undefined && (data.breakDuration < 0 || data.breakDuration > 120)) {
    errors.push('Break duration must be between 0 and 120 minutes');
  }
  
  if (data.lunchDuration !== undefined && (data.lunchDuration < 0 || data.lunchDuration > 180)) {
    errors.push('Lunch duration must be between 0 and 180 minutes');
  }
  
  return { isValid: errors.length === 0, errors };
}