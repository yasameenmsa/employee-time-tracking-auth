import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import {
  updatePayrollSettings,
  validatePayrollSettings
} from '../../../utils/settingsService';
import { SettingsUpdateResponse } from '../../../types/settings';

// Request body validation schema
const UpdatePayrollSettingsSchema = z.object({
  payPeriod: z.enum(['weekly', 'biweekly', 'monthly', 'semimonthly']).optional(),
  payDay: z.number().min(0).max(31).optional(),
  overtimeThreshold: z.number().min(0).max(168).optional(),
  overtimeRate: z.number().min(1).max(3).optional(),
  defaultHourlyRate: z.number().min(0).optional(),
  taxSettings: z.object({
    federalTaxRate: z.number().min(0).max(1).optional(),
    stateTaxRate: z.number().min(0).max(1).optional(),
    socialSecurityRate: z.number().min(0).max(1).optional(),
    medicareRate: z.number().min(0).max(1).optional()
  }).optional(),
  benefits: z.object({
    healthInsuranceDeduction: z.number().min(0).optional(),
    retirement401kMatch: z.number().min(0).max(1).optional(),
    paidTimeOffAccrualRate: z.number().min(0).optional()
  }).optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsUpdateResponse>
) {
  try {
    switch (req.method) {
      case 'PUT':
        await handleUpdatePayrollSettings(req, res);
        break;
      default:
        res.setHeader('Allow', ['PUT']);
        res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Payroll settings API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Handle PUT requests - update payroll settings
async function handleUpdatePayrollSettings(
  req: NextApiRequest,
  res: NextApiResponse<SettingsUpdateResponse>
) {
  try {
    // Validate request body
    const bodyValidation = UpdatePayrollSettingsSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: bodyValidation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      });
    }

    const updateData = bodyValidation.data;

    // Additional validation using service function
    const validation = validatePayrollSettings(updateData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: validation.errors.join(', ')
      });
    }

    // Update payroll settings
    const updatedPayrollSettings = await updatePayrollSettings(updateData);

    res.status(200).json({
      success: true,
      data: { payrollSettings: updatedPayrollSettings },
      message: 'Payroll settings updated successfully'
    });
  } catch (error) {
    console.error('Error updating payroll settings:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update payroll settings'
    });
  }
}