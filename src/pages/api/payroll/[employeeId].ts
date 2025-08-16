import { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import {
  calculateEmployeePayroll,
  savePayrollCalculation
} from '../../../utils/payrollService';
import { PayrollResponse } from '../../../types/payroll';

// Validation schema for employee payroll calculation
const employeePayrollSchema = z.object({
  payPeriodStart: z.string().datetime('Invalid start date format'),
  payPeriodEnd: z.string().datetime('Invalid end date format'),
  saveToDatabase: z.boolean().optional().default(false),
  payrollPeriodId: z.string().optional()
});

/**
 * Calculate payroll for a specific employee
 * POST /api/payroll/[employeeId]
 */
async function handleCalculateEmployeePayroll(
  req: NextApiRequest,
  res: NextApiResponse<PayrollResponse>,
  employeeId: string
) {
  try {
    const validation = employeePayrollSchema.safeParse(req.body);
    if (!validation.success) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request data',
        message: validation.error.issues.map(e => e.message).join(', ')
      });
    }

    const { payPeriodStart, payPeriodEnd, saveToDatabase, payrollPeriodId } = validation.data;
    const startDate = new Date(payPeriodStart);
    const endDate = new Date(payPeriodEnd);

    const calculation = await calculateEmployeePayroll(employeeId, startDate, endDate);

    // Optionally save to database
    if (saveToDatabase && payrollPeriodId) {
      await savePayrollCalculation(calculation, payrollPeriodId);
    }

    return res.status(200).json({
      success: true,
      data: calculation,
      message: saveToDatabase ? 'Payroll calculated and saved successfully' : 'Payroll calculated successfully'
    });
  } catch (error) {
    console.error('Error calculating employee payroll:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to calculate employee payroll'
    });
  }
}

/**
 * Get payroll history for a specific employee
 * GET /api/payroll/[employeeId]?startDate=xxx&endDate=xxx
 */
async function handleGetEmployeePayrollHistory(
  req: NextApiRequest,
  res: NextApiResponse<PayrollResponse>,
  employeeId: string
) {
  try {
    // This would typically fetch payroll history from database
    // For now, return a placeholder response
    return res.status(200).json({
      success: true,
      data: [],
      message: 'Employee payroll history retrieved successfully'
    });
  } catch (error) {
    console.error('Error getting employee payroll history:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get employee payroll history'
    });
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PayrollResponse>
) {
  const { employeeId } = req.query;

  if (!employeeId || typeof employeeId !== 'string') {
    return res.status(400).json({
      success: false,
      error: 'Employee ID is required'
    });
  }

  try {
    switch (req.method) {
      case 'POST':
        return await handleCalculateEmployeePayroll(req, res, employeeId);
      case 'GET':
        return await handleGetEmployeePayrollHistory(req, res, employeeId);
      default:
        res.setHeader('Allow', ['POST', 'GET']);
        return res.status(405).json({
          success: false,
          error: `Method ${req.method} not allowed`
        });
    }
  } catch (error) {
    console.error('Employee payroll API error:', error);
    return res.status(500).json({
      success: false,
      error: 'Internal server error'
    });
  }
}