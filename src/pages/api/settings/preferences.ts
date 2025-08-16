import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import {
  updateSystemPreferences
} from '../../../utils/settingsService';
import { SettingsUpdateResponse } from '../../../types/settings';

// Request body validation schema
const UpdateSystemPreferencesSchema = z.object({
  dateFormat: z.enum(['MM/DD/YYYY', 'DD/MM/YYYY', 'YYYY-MM-DD']).optional(),
  timeFormat: z.enum(['12h', '24h']).optional(),
  currency: z.object({
    code: z.string().length(3, 'Currency code must be 3 characters').optional(),
    symbol: z.string().min(1, 'Currency symbol is required').optional(),
    position: z.enum(['before', 'after']).optional()
  }).optional(),
  language: z.string().min(2, 'Language code must be at least 2 characters').optional(),
  notifications: z.object({
    emailNotifications: z.boolean().optional(),
    clockInReminders: z.boolean().optional(),
    overtimeAlerts: z.boolean().optional(),
    payrollReminders: z.boolean().optional()
  }).optional(),
  security: z.object({
    sessionTimeout: z.number().min(5).max(1440).optional(), // 5 minutes to 24 hours
    requirePasswordChange: z.boolean().optional(),
    passwordChangeInterval: z.number().min(1).max(365).optional(), // 1 to 365 days
    twoFactorAuth: z.boolean().optional()
  }).optional(),
  backup: z.object({
    autoBackup: z.boolean().optional(),
    backupFrequency: z.enum(['daily', 'weekly', 'monthly']).optional(),
    retentionPeriod: z.number().min(1).max(365).optional() // 1 to 365 days
  }).optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsUpdateResponse>
) {
  try {
    switch (req.method) {
      case 'PUT':
        await handleUpdateSystemPreferences(req, res);
        break;
      default:
        res.setHeader('Allow', ['PUT']);
        res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('System preferences API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Handle PUT requests - update system preferences
async function handleUpdateSystemPreferences(
  req: NextApiRequest,
  res: NextApiResponse<SettingsUpdateResponse>
) {
  try {
    // Validate request body
    const bodyValidation = UpdateSystemPreferencesSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: bodyValidation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      });
    }

    const updateData = bodyValidation.data;

    // Additional validation for security settings
    if (updateData.security) {
      const { sessionTimeout, passwordChangeInterval } = updateData.security;
      
      if (sessionTimeout !== undefined && sessionTimeout < 5) {
        return res.status(400).json({
          success: false,
          error: 'Session timeout must be at least 5 minutes'
        });
      }
      
      if (passwordChangeInterval !== undefined && passwordChangeInterval < 1) {
        return res.status(400).json({
          success: false,
          error: 'Password change interval must be at least 1 day'
        });
      }
    }

    // Validate backup settings
    if (updateData.backup) {
      const { retentionPeriod, autoBackup, backupFrequency } = updateData.backup;
      
      if (autoBackup && !backupFrequency) {
        return res.status(400).json({
          success: false,
          error: 'Backup frequency is required when auto backup is enabled'
        });
      }
      
      if (retentionPeriod !== undefined && retentionPeriod < 1) {
        return res.status(400).json({
          success: false,
          error: 'Backup retention period must be at least 1 day'
        });
      }
    }

    // Update system preferences
    const updatedPreferences = await updateSystemPreferences(updateData);

    res.status(200).json({
      success: true,
      data: { systemPreferences: updatedPreferences },
      message: 'System preferences updated successfully'
    });
  } catch (error) {
    console.error('Error updating system preferences:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update system preferences'
    });
  }
}