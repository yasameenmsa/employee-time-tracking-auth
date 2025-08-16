import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import {
  updateCompanyInfo,
  validateCompanyInfo
} from '../../../utils/settingsService';
import { SettingsUpdateResponse } from '../../../types/settings';

// Request body validation schema
const UpdateCompanyInfoSchema = z.object({
  name: z.string().min(2, 'Company name must be at least 2 characters').optional(),
  address: z.object({
    street: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    zipCode: z.string().optional(),
    country: z.string().optional()
  }).optional(),
  phone: z.string().regex(/^[\d\s\-\(\)\+]+$/, 'Invalid phone number format').optional(),
  email: z.string().email('Invalid email format').optional(),
  website: z.string().url('Invalid website URL').optional(),
  taxId: z.string().optional(),
  logo: z.string().optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SettingsUpdateResponse>
) {
  try {
    switch (req.method) {
      case 'PUT':
        await handleUpdateCompanyInfo(req, res);
        break;
      default:
        res.setHeader('Allow', ['PUT']);
        res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Company settings API error:', error);
    res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

// Handle PUT requests - update company information
async function handleUpdateCompanyInfo(
  req: NextApiRequest,
  res: NextApiResponse<SettingsUpdateResponse>
) {
  try {
    // Validate request body
    const bodyValidation = UpdateCompanyInfoSchema.safeParse(req.body);
    if (!bodyValidation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: bodyValidation.error.issues.map(e => `${e.path.join('.')}: ${e.message}`).join(', ')
      });
    }

    const updateData = bodyValidation.data;

    // Additional validation using service function
    const validation = validateCompanyInfo(updateData);
    if (!validation.isValid) {
      return res.status(400).json({
        success: false,
        error: 'Validation failed',
        message: validation.errors.join(', ')
      });
    }

    // Update company information
    const updatedCompanyInfo = await updateCompanyInfo(updateData);

    res.status(200).json({
      success: true,
      data: { companyInfo: updatedCompanyInfo },
      message: 'Company information updated successfully'
    });
  } catch (error) {
    console.error('Error updating company info:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update company information'
    });
  }
}