import { z } from 'zod';
import { EMPLOYEE_ROLES, DEFAULT_DEPARTMENTS } from '@/types/employee';

// Base employee validation schema
export const employeeBaseSchema = z.object({
  name: z.string()
    .min(2, 'Name must be at least 2 characters long')
    .max(100, 'Name must not exceed 100 characters')
    .regex(/^[a-zA-Z\s'-]+$/, 'Name can only contain letters, spaces, hyphens, and apostrophes')
    .trim(),
  
  email: z.string()
    .email('Invalid email format')
    .max(255, 'Email must not exceed 255 characters')
    .toLowerCase()
    .trim(),
  
  role: z.enum([...EMPLOYEE_ROLES]),
  
  department: z.string()
    .min(2, 'Department must be at least 2 characters long')
    .max(100, 'Department must not exceed 100 characters')
    .trim(),
  
  hourlyRate: z.number()
    .min(0, 'Hourly rate cannot be negative')
    .max(1000, 'Hourly rate cannot exceed $1000')
    .multipleOf(0.01, 'Hourly rate must be a valid currency amount'),
  
  startDate: z.string()
    .datetime('Invalid date format. Use ISO 8601 format')
    .or(z.date())
    .transform((val) => {
      const date = typeof val === 'string' ? new Date(val) : val;
      if (isNaN(date.getTime())) {
        throw new Error('Invalid date');
      }
      return date;
    })
    .refine((date) => {
      const now = new Date();
      const oneYearFromNow = new Date(now.getFullYear() + 1, now.getMonth(), now.getDate());
      return date <= oneYearFromNow;
    }, 'Start date cannot be more than 1 year in the future'),
  
  phone: z.string()
    .regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, 'Invalid phone number format')
    .optional()
    .or(z.literal('')),
  
  address: z.string()
    .max(500, 'Address must not exceed 500 characters')
    .trim()
    .optional(),
  
  emergencyContact: z.object({
    name: z.string()
      .min(2, 'Emergency contact name must be at least 2 characters')
      .max(100, 'Emergency contact name must not exceed 100 characters')
      .trim(),
    phone: z.string()
      .regex(/^[\+]?[1-9][\d\s\-\(\)]{7,15}$/, 'Invalid emergency contact phone number'),
    relationship: z.string()
      .min(2, 'Relationship must be at least 2 characters')
      .max(50, 'Relationship must not exceed 50 characters')
      .trim()
  }).optional(),
  
  position: z.string()
    .min(2, 'Position must be at least 2 characters long')
    .max(100, 'Position must not exceed 100 characters')
    .trim()
    .optional(),
  
  manager: z.string()
    .regex(/^[0-9a-fA-F]{24}$/, 'Manager must be a valid ObjectId')
    .optional()
    .or(z.literal(''))
});

// Schema for creating new employees
export const createEmployeeSchema = employeeBaseSchema.extend({
  // All base fields are required for creation except optional ones
}).strict(); // Prevent additional properties

// Schema for updating employees (all fields optional)
export const updateEmployeeSchema = employeeBaseSchema.partial().extend({
  isActive: z.boolean().optional()
}).strict();

// Schema for employee filters
export const employeeFiltersSchema = z.object({
  search: z.string().max(100).trim().optional(),
  department: z.string().max(100).trim().optional(),
  role: z.enum([...EMPLOYEE_ROLES]).optional(),
  isActive: z.boolean().optional(),
  manager: z.string().regex(/^[0-9a-fA-F]{24}$/).optional(),
  page: z.number().int().min(1).optional().default(1),
  limit: z.number().int().min(1).max(100).optional().default(10),
  sortBy: z.enum(['name', 'email', 'department', 'startDate', 'createdAt']).optional().default('name'),
  sortOrder: z.enum(['asc', 'desc']).optional().default('asc')
});

// Validation functions
export function validateCreateEmployee(data: unknown) {
  try {
    return {
      success: true,
      data: createEmployeeSchema.parse(data),
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: 'Validation failed', code: 'unknown' }]
    };
  }
}

export function validateUpdateEmployee(data: unknown) {
  try {
    return {
      success: true,
      data: updateEmployeeSchema.parse(data),
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: 'Validation failed', code: 'unknown' }]
    };
  }
}

export function validateEmployeeFilters(data: unknown) {
  try {
    return {
      success: true,
      data: employeeFiltersSchema.parse(data),
      errors: []
    };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        data: null,
        errors: error.issues.map(err => ({
          field: err.path.join('.'),
          message: err.message,
          code: err.code
        }))
      };
    }
    return {
      success: false,
      data: null,
      errors: [{ field: 'unknown', message: 'Validation failed', code: 'unknown' }]
    };
  }
}

// Sanitization functions
export function sanitizeEmployeeData(data: unknown) {
  if (!data || typeof data !== 'object') {
    return data;
  }

  const sanitized = { ...data } as Record<string, any>;

  // Trim string fields
  const stringFields = ['name', 'email', 'department', 'phone', 'address', 'position'];
  stringFields.forEach(field => {
    if (typeof sanitized[field] === 'string') {
      sanitized[field] = sanitized[field].trim();
    }
  });

  // Sanitize emergency contact
  if (sanitized.emergencyContact && typeof sanitized.emergencyContact === 'object') {
    const contact = sanitized.emergencyContact;
    if (typeof contact.name === 'string') contact.name = contact.name.trim();
    if (typeof contact.phone === 'string') contact.phone = contact.phone.trim();
    if (typeof contact.relationship === 'string') contact.relationship = contact.relationship.trim();
  }

  // Convert email to lowercase
  if (typeof sanitized.email === 'string') {
    sanitized.email = sanitized.email.toLowerCase();
  }

  // Ensure hourlyRate is a number
  if (sanitized.hourlyRate !== undefined && sanitized.hourlyRate !== null) {
    const rate = parseFloat(sanitized.hourlyRate);
    if (!isNaN(rate)) {
      sanitized.hourlyRate = Math.round(rate * 100) / 100; // Round to 2 decimal places
    }
  }

  return sanitized;
}

// Custom validation rules
export const customValidationRules = {
  // Check if email is unique (to be used with database check)
  isEmailUnique: (email: string, excludeId?: string) => {
    // This would typically involve a database check
    // Implementation would be in the service layer
    return true;
  },
  
  // Check if employee ID is unique
  isEmployeeIdUnique: (employeeId: string, excludeId?: string) => {
    // This would typically involve a database check
    // Implementation would be in the service layer
    return true;
  },
  
  // Validate manager exists and is not the same as employee
  isValidManager: (managerId: string, employeeId?: string) => {
    // This would typically involve a database check
    // Implementation would be in the service layer
    return true;
  }
};

// Export types for use in other files
export type CreateEmployeeInput = z.infer<typeof createEmployeeSchema>;
export type UpdateEmployeeInput = z.infer<typeof updateEmployeeSchema>;
export type EmployeeFiltersInput = z.infer<typeof employeeFiltersSchema>;
export type ValidationResult<T> = {
  success: boolean;
  data: T | null;
  errors: Array<{
    field: string;
    message: string;
    code: string;
  }>;
};