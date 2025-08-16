import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import {
  updateWorkHoursConfig,
  validateWorkHoursConfig
} from '../../../utils/settingsService';
import { SettingsUpdateResponse } from '../../../types/settings';

// Work day validation schema
const WorkDaySchema = z.object({
  enabled: z.boolean().optional(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional(),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, 'Invalid time format (HH:MM)').optional()
});

// Request body validation schema
const UpdateWorkHoursSchema = z.object({
  standardWorkWeek: z.number().min(1).max(168).optional(),
  workDays: z.object({
    monday: WorkDaySchema.optional(),
    tuesday: WorkDaySchema.optional(),
    wednesday: WorkDaySchema.optional(),
    thursday: WorkDaySchema.optional(),
    friday: WorkDaySchema.optional(),
    saturday: WorkDaySchema.optional(),
    sunday: WorkDaySchema.optional()
  }).optional(),
  breakDuration: z.number().min(0).max(120).optional(),
  lunchDuration: z.number().min(0).max(180).optional(),
  timeZone: z.string().optional(),
  allowFlexibleHours: z.boolean().optional(),
  requireTimeApproval: z.boolean().optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsUpdateResponse>
) {
  try {
    switch (req.method) {
      case 'PUT':
        await handleUpdateWorkHours(req, res);
        break;
      default:
        res.setHeader('Allow', ['PUT']);
        res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Work hours settings API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Handle PUT requests - update work hours configuration
async function handleUpdateWorkHours(
  req: NextApiRequest,
  res: NextApiResponse<SettingsUpdateResponse>
) {
  try {
    // Validate request body
    const bodyValidation = UpdateWorkHoursSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: bodyValidation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      });
    }

    const updateData = bodyValidation.data;

    // Transform the data to match the expected type structure
    const transformedData: Record<string, unknown> = { ...updateData };
    if (updateData.workDays) {
      transformedData.workDays = {} as Record<string, any>;
      Object.entries(updateData.workDays).forEach(([day, config]) => {
        if (config) {
          (transformedData.workDays as Record<string, any>)[day] = {
            enabled: config.enabled ?? true,
            startTime: config.startTime ?? '09:00',
            endTime: config.endTime ?? '17:00'
          };
        }
      });
    }

    // Additional validation using service function
    const validation = validateWorkHoursConfig(transformedData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: validation.errors.join(', ')
      });
    }

    // Validate work day times
    if (updateData.workDays) {
      const timeValidationErrors: string[] = [];
      
      Object.entries(updateData.workDays).forEach(([day, config]) => {
        if (config && config.startTime && config.endTime) {
          const startTime = new Date(`2000-01-01T${config.startTime}:00`);
          const endTime = new Date(`2000-01-01T${config.endTime}:00`);
          
          if (startTime >= endTime) {
            timeValidationErrors.push(`${day}: Start time must be before end time`);
          }
        }
      });
      
      if (timeValidationErrors.length > 0) {
        return res.status(400).json({
          success: false,
          error: 'Time validation failed',
          message: timeValidationErrors.join(', ')
        });
      }
    }

    // Update work hours configuration
    const updatedWorkHours = await updateWorkHoursConfig(transformedData);

    res.status(200).json({
      success: true,
      data: { workHoursConfig: updatedWorkHours },
      message: 'Work hours configuration updated successfully'
    });
  } catch (error) {
    console.error('Error updating work hours config:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update work hours configuration'
    });
  }
}