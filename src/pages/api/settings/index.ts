import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import {
  getCompanySettings,
  initializeDefaultSettings,
  resetSettingsToDefault,
  backupSettings
} from '../../../utils/settingsService';
import { SettingsResponse } from '../../../types/settings';

// Query parameter validation schema
const GetSettingsQuerySchema = z.object({
  section: z.enum(['company', 'payroll', 'workhours', 'preferences', 'all']).optional().default('all'),
  initialize: z.enum(['true', 'false']).optional().transform(val => val === 'true')
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsResponse>
) {
  try {
    switch (req.method) {
      case 'GET':
        await handleGetSettings(req, res);
        break;
      case 'POST':
        await handlePostSettings(req, res);
        break;
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Settings API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Handle GET requests - retrieve settings
async function handleGetSettings(
  req: NextApiRequest,
  res: NextApiResponse<SettingsResponse>
) {
  try {
    // Validate query parameters
    const queryValidation = GetSettingsQuerySchema.safeParse(req.query);
    if (!queryValidation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid query parameters',
        message: queryValidation.error.issues.map(e => e.message).join(', ')
      });
    }

    const { section, initialize } = queryValidation.data;

    // Initialize default settings if requested
    if (initialize) {
      const defaultSettings = await initializeDefaultSettings();
      return res.status(200).json({
        success: true,
        data: defaultSettings,
        message: 'Default settings initialized successfully'
      });
    }

    // Get current settings
    const settings = await getCompanySettings();

    // Return specific section or all settings
    let responseData;
    switch (section) {
      case 'company':
        responseData = { companyInfo: settings.companyInfo };
        break;
      case 'payroll':
        responseData = { payrollSettings: settings.payrollSettings };
        break;
      case 'workhours':
        responseData = { workHoursConfig: settings.workHoursConfig };
        break;
      case 'preferences':
        responseData = { systemPreferences: settings.systemPreferences };
        break;
      case 'all':
      default:
        responseData = settings;
        break;
    }

    res.status(200).json({
      success: true,
      data: responseData,
      message: 'Settings retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve settings'
    });
  }
}

// Handle POST requests - special operations
async function handlePostSettings(
  req: NextApiRequest,
  res: NextApiResponse<SettingsResponse>
) {
  try {
    const { action } = req.body;

    switch (action) {
      case 'reset':
        const resetSettings = await resetSettingsToDefault();
        res.status(200).json({
          success: true,
          data: resetSettings,
          message: 'Settings reset to default successfully'
        });
        break;

      case 'backup':
        const backupData = await backupSettings();
        res.status(200).json({
          success: true,
          data: backupData,
          message: 'Settings backed up successfully'
        });
        break;

      default:
        res.status(400).json({
          success: false,
          error: 'Invalid action. Supported actions: reset, backup'
        });
    }
  } catch (error) {
    console.error('Error in POST settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to perform settings operation'
    });
  }
}