import { MongoClient, Db, ObjectId } from 'mongodb';
import {
  PayrollTimeData,
  PayrollDeductions,
  PayrollCalculation,
  PayrollSummary,
  PayrollSettings
} from '../types/payroll';
import { Employee } from '../types/employee';

const MONGODB_URI = process.env.MONGODB_URI!;
let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

// Database connection helper
async function connectToDatabase(): Promise<Db> {
  if (cachedClient && cachedDb) {
    return cachedDb;
  }

  const client = new MongoClient(MONGODB_URI);
  await client.connect();
  const db = client.db('calculate_auth');

  cachedClient = client;
  cachedDb = db;
  return db;
}

// Default payroll settings
const DEFAULT_PAYROLL_SETTINGS: PayrollSettings = {
  companyId: 'default',
  defaultOvertimeRate: 1.5,
  payFrequency: 'biweekly',
  overtimeThreshold: 40,
  taxSettings: {
    federalTaxRate: 0.12, // 12%
    stateTaxRate: 0.05, // 5%
    socialSecurityRate: 0.062, // 6.2%
    medicareRate: 0.0145 // 1.45%
  },
  defaultDeductions: {
    healthInsurance: 150,
    retirement401k: 0
  }
};

/**
 * Calculate regular and overtime hours based on total hours worked
 */
export function calculateHours(totalHours: number, overtimeThreshold: number = 40): {
  regularHours: number;
  overtimeHours: number;
} {
  if (totalHours <= overtimeThreshold) {
    return {
      regularHours: totalHours,
      overtimeHours: 0
    };
  }

  return {
    regularHours: overtimeThreshold,
    overtimeHours: totalHours - overtimeThreshold
  };
}

/**
 * Calculate gross pay based on hours and rates
 */
export function calculateGrossPay(
  regularHours: number,
  overtimeHours: number,
  hourlyRate: number,
  overtimeRate: number = 1.5
): {
  regularPay: number;
  overtimePay: number;
  grossPay: number;
} {
  const regularPay = regularHours * hourlyRate;
  const overtimePay = overtimeHours * (hourlyRate * overtimeRate);
  const grossPay = regularPay + overtimePay;

  return {
    regularPay: Math.round(regularPay * 100) / 100,
    overtimePay: Math.round(overtimePay * 100) / 100,
    grossPay: Math.round(grossPay * 100) / 100
  };
}

/**
 * Calculate payroll deductions
 */
export function calculateDeductions(
  grossPay: number,
  employeeId: string,
  customDeductions?: Partial<PayrollDeductions>
): PayrollDeductions {
  const settings = DEFAULT_PAYROLL_SETTINGS;
  
  const federalTax = grossPay * settings.taxSettings.federalTaxRate;
  const stateTax = grossPay * settings.taxSettings.stateTaxRate;
  const socialSecurity = grossPay * settings.taxSettings.socialSecurityRate;
  const medicare = grossPay * settings.taxSettings.medicareRate;
  const healthInsurance = customDeductions?.healthInsurance ?? settings.defaultDeductions.healthInsurance;
  const retirement401k = customDeductions?.retirement401k ?? settings.defaultDeductions.retirement401k;

  return {
    employeeId,
    federalTax: Math.round(federalTax * 100) / 100,
    stateTax: Math.round(stateTax * 100) / 100,
    socialSecurity: Math.round(socialSecurity * 100) / 100,
    medicare: Math.round(medicare * 100) / 100,
    healthInsurance,
    retirement401k,
    otherDeductions: customDeductions?.otherDeductions || []
  };
}

/**
 * Calculate total deductions amount
 */
export function calculateTotalDeductions(deductions: PayrollDeductions): number {
  const baseDeductions = 
    deductions.federalTax +
    deductions.stateTax +
    deductions.socialSecurity +
    deductions.medicare +
    (deductions.healthInsurance || 0) +
    (deductions.retirement401k || 0);

  const otherDeductionsTotal = deductions.otherDeductions?.reduce(
    (sum, deduction) => sum + deduction.amount,
    0
  ) || 0;

  return Math.round((baseDeductions + otherDeductionsTotal) * 100) / 100;
}

/**
 * Get employee time data from attendance records
 */
export async function getEmployeeTimeData(
  employeeId: string,
  startDate: Date,
  endDate: Date
): Promise<PayrollTimeData> {
  try {
    const db = await connectToDatabase();
    const attendanceCollection = db.collection('attendance');

    // Aggregate attendance data for the pay period
    const timeData = await attendanceCollection.aggregate([
      {
        $match: {
          employeeId,
          date: {
            $gte: startDate,
            $lte: endDate
          }
        }
      },
      {
        $group: {
          _id: null,
          totalHours: { $sum: '$hoursWorked' },
          sickLeaveHours: { $sum: { $ifNull: ['$sickLeaveHours', 0] } },
          vacationHours: { $sum: { $ifNull: ['$vacationHours', 0] } },
          holidayHours: { $sum: { $ifNull: ['$holidayHours', 0] } }
        }
      }
    ]).toArray();

    const result = timeData[0] || { totalHours: 0, sickLeaveHours: 0, vacationHours: 0, holidayHours: 0 };
    const hours = calculateHours(result.totalHours);

    return {
      employeeId,
      payPeriodStart: startDate,
      payPeriodEnd: endDate,
      regularHours: hours.regularHours,
      overtimeHours: hours.overtimeHours,
      sickLeaveHours: result.sickLeaveHours,
      vacationHours: result.vacationHours,
      holidayHours: result.holidayHours
    };
  } catch (error) {
    console.error('Error getting employee time data:', error);
    throw new Error('Failed to retrieve employee time data');
  }
}

/**
 * Calculate payroll for a single employee
 */
export async function calculateEmployeePayroll(
  employeeId: string,
  startDate: Date,
  endDate: Date,
  customDeductions?: Partial<PayrollDeductions>
): Promise<PayrollCalculation> {
  try {
    const db = await connectToDatabase();
    const employeesCollection = db.collection('employees');

    // Get employee information
    const employeeDoc = await employeesCollection.findOne({ _id: new ObjectId(employeeId) });
    if (!employeeDoc) {
      throw new Error('Employee not found');
    }
    const employee = {
      ...employeeDoc,
      _id: employeeDoc._id?.toString()
    } as Employee;

    // Get time data for the pay period
    const timeData = await getEmployeeTimeData(employeeId, startDate, endDate);

    // Calculate gross pay
    const hourlyRate = employee.hourlyRate || 0;
    const overtimeRate = DEFAULT_PAYROLL_SETTINGS.defaultOvertimeRate;
    const grossPayData = calculateGrossPay(
      timeData.regularHours,
      timeData.overtimeHours,
      hourlyRate,
      overtimeRate
    );

    // Calculate deductions
    const deductions = calculateDeductions(grossPayData.grossPay, employeeId, customDeductions);
    const totalDeductions = calculateTotalDeductions(deductions);
    const netPay = Math.round((grossPayData.grossPay - totalDeductions) * 100) / 100;

    return {
      employeeId,
      employeeName: employee.name,
      payPeriodStart: startDate,
      payPeriodEnd: endDate,
      regularHours: timeData.regularHours,
      overtimeHours: timeData.overtimeHours,
      regularPay: grossPayData.regularPay,
      overtimePay: grossPayData.overtimePay,
      grossPay: grossPayData.grossPay,
      totalDeductions,
      netPay,
      deductionsBreakdown: deductions,
      calculatedAt: new Date()
    };
  } catch (error) {
    console.error('Error calculating employee payroll:', error);
    throw new Error(`Failed to calculate payroll for employee ${employeeId}`);
  }
}

/**
 * Calculate payroll for multiple employees
 */
export async function calculateBulkPayroll(
  employeeIds: string[],
  startDate: Date,
  endDate: Date
): Promise<PayrollCalculation[]> {
  try {
    const calculations: PayrollCalculation[] = [];

    for (const employeeId of employeeIds) {
      try {
        const calculation = await calculateEmployeePayroll(employeeId, startDate, endDate);
        calculations.push(calculation);
      } catch (error) {
        console.error(`Error calculating payroll for employee ${employeeId}:`, error);
        // Continue with other employees even if one fails
      }
    }

    return calculations;
  } catch (error) {
    console.error('Error calculating bulk payroll:', error);
    throw new Error('Failed to calculate bulk payroll');
  }
}

/**
 * Save payroll calculation to database
 */
export async function savePayrollCalculation(
  calculation: PayrollCalculation,
  payrollPeriodId: string
): Promise<string> {
  try {
    const db = await connectToDatabase();
    const payrollCollection = db.collection('payroll_records');

    const payrollRecord = {
      employeeId: calculation.employeeId,
      payrollPeriodId,
      calculation,
      status: 'draft' as const,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await payrollCollection.insertOne(payrollRecord);
    return result.insertedId.toString();
  } catch (error) {
    console.error('Error saving payroll calculation:', error);
    throw new Error('Failed to save payroll calculation');
  }
}

/**
 * Generate payroll summary for a pay period
 */
export async function generatePayrollSummary(
  payrollPeriodId: string
): Promise<PayrollSummary> {
  try {
    const db = await connectToDatabase();
    const payrollCollection = db.collection('payroll_records');

    const summary = await payrollCollection.aggregate([
      {
        $match: { payrollPeriodId }
      },
      {
        $lookup: {
          from: 'employees',
          localField: 'employeeId',
          foreignField: '_id',
          as: 'employee'
        }
      },
      {
        $unwind: '$employee'
      },
      {
        $group: {
          _id: null,
          totalEmployees: { $sum: 1 },
          totalRegularHours: { $sum: '$calculation.regularHours' },
          totalOvertimeHours: { $sum: '$calculation.overtimeHours' },
          totalGrossPay: { $sum: '$calculation.grossPay' },
          totalDeductions: { $sum: '$calculation.totalDeductions' },
          totalNetPay: { $sum: '$calculation.netPay' },
          departments: {
            $push: {
              department: '$employee.department',
              grossPay: '$calculation.grossPay',
              netPay: '$calculation.netPay'
            }
          }
        }
      },
      {
        $project: {
          _id: 0,
          totalEmployees: 1,
          totalRegularHours: 1,
          totalOvertimeHours: 1,
          totalGrossPay: 1,
          totalDeductions: 1,
          totalNetPay: 1,
          departments: 1
        }
      }
    ]).toArray();

    const result = summary[0] || {
      totalEmployees: 0,
      totalRegularHours: 0,
      totalOvertimeHours: 0,
      totalGrossPay: 0,
      totalDeductions: 0,
      totalNetPay: 0,
      departments: []
    };

    // Group by department
    const departmentMap = new Map<string, { employeeCount: number; totalGrossPay: number; totalNetPay: number }>();
    
    result.departments?.forEach((dept: { department: string; grossPay: number; netPay: number }) => {
      const existing = departmentMap.get(dept.department) || { employeeCount: 0, totalGrossPay: 0, totalNetPay: 0 };
      departmentMap.set(dept.department, {
        employeeCount: existing.employeeCount + 1,
        totalGrossPay: existing.totalGrossPay + dept.grossPay,
        totalNetPay: existing.totalNetPay + dept.netPay
      });
    });

    const departmentBreakdown = Array.from(departmentMap.entries()).map(([department, data]) => ({
      department,
      employeeCount: data.employeeCount,
      totalGrossPay: Math.round(data.totalGrossPay * 100) / 100,
      totalNetPay: Math.round(data.totalNetPay * 100) / 100
    }));

    return {
      payrollPeriodId,
      totalEmployees: result.totalEmployees,
      totalRegularHours: Math.round(result.totalRegularHours * 100) / 100,
      totalOvertimeHours: Math.round(result.totalOvertimeHours * 100) / 100,
      totalGrossPay: Math.round(result.totalGrossPay * 100) / 100,
      totalDeductions: Math.round(result.totalDeductions * 100) / 100,
      totalNetPay: Math.round(result.totalNetPay * 100) / 100,
      departmentBreakdown
    };
  } catch (error) {
    console.error('Error generating payroll summary:', error);
    throw new Error('Failed to generate payroll summary');
  }
}