import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import {
  calculateEmployeePayroll,
  calculateBulkPayroll,
  savePayrollCalculation,
  generatePayrollSummary
} from '../../../utils/payrollService';
import {
  PayrollCalculationRequest,
  CreatePayrollRequest,
  PayrollResponse
} from '../../../types/payroll';

// Validation schemas
const calculatePayrollSchema = z.object({
  employeeId: z.string().min(1, 'Employee ID is required'),
  payPeriodStart: z.string().datetime('Invalid start date format'),
  payPeriodEnd: z.string().datetime('Invalid end date format'),
  overrideHours: z.object({
    regularHours: z.number().min(0).optional(),
    overtimeHours: z.number().min(0).optional()
  }).optional()
});

const createBulkPayrollSchema = z.object({
  payPeriodStart: z.string().datetime('Invalid start date format'),
  payPeriodEnd: z.string().datetime('Invalid end date format'),
  employeeIds: z.array(z.string()).optional()
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PayrollResponse>
) {
  try {
    switch (req.method) {
      case 'POST':
        return await handleCalculatePayroll(req, res);
      case 'GET':
        return await handleGetPayrollSummary(req, res);
      default:
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Payroll API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}

/**
 * Handle payroll calculation requests
 * POST /api/payroll
 */
async function handleCalculatePayroll(
  req: NextApiRequest,
  res: NextApiResponse<PayrollResponse>
) {
  try {
    const { action } = req.query;

    if (action === 'bulk') {
      // Bulk payroll calculation
      const validation = createBulkPayrollSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          message: validation.error.issues.map(e => e.message).join(', ')
        });
      }

      const { payPeriodStart, payPeriodEnd, employeeIds } = validation.data;
      const startDate = new Date(payPeriodStart);
      const endDate = new Date(payPeriodEnd);

      let targetEmployeeIds = employeeIds;
      
      // If no specific employees provided, get all active employees
      if (!targetEmployeeIds || targetEmployeeIds.length === 0) {
        // TODO: Implement getAllActiveEmployeeIds function
        targetEmployeeIds = []; // For now, return empty array
      }

      const calculations = await calculateBulkPayroll(targetEmployeeIds, startDate, endDate);
      
      return res.status(200).json({
        success: true,
        data: calculations,
        message: `Calculated payroll for ${calculations.length} employees`
      });
    } else {
      // Single employee payroll calculation
      const validation = calculatePayrollSchema.safeParse(req.body);
      if (!validation.success) {
        return res.status(400).json({
          success: false,
          error: 'Invalid request data',
          message: validation.error.issues.map(e => e.message).join(', ')
        });
      }

      const { employeeId, payPeriodStart, payPeriodEnd } = validation.data;
      const startDate = new Date(payPeriodStart);
      const endDate = new Date(payPeriodEnd);

      const calculation = await calculateEmployeePayroll(employeeId, startDate, endDate);
      
      return res.status(200).json({
        success: true,
        data: calculation,
        message: 'Payroll calculated successfully'
      });
    }
  } catch (error) {
    console.error('Error calculating payroll:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate payroll'
    });
  }
}

/**
 * Handle payroll summary requests
 * GET /api/payroll?payrollPeriodId=xxx
 */
async function handleGetPayrollSummary(
  req: NextApiRequest,
  res: NextApiResponse<PayrollResponse>
) {
  try {
    const { payrollPeriodId } = req.query;

    if (!payrollPeriodId || typeof payrollPeriodId !== 'string') {
      return res.status(400).json({
        success: false,
        error: 'Payroll period ID is required'
      });
    }

    const summary = await generatePayrollSummary(payrollPeriodId);
    
    return res.status(200).json({
      success: true,
      data: summary,
      message: 'Payroll summary generated successfully'
    });
  } catch (error) {
    console.error('Error generating payroll summary:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate payroll summary'
    });
  }
}