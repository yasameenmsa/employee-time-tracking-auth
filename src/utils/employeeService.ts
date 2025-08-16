import { MongoClient, Db, Collection, ObjectId } from 'mongodb';
import { Employee, CreateEmployeeRequest, UpdateEmployeeRequest, EmployeeFilters, EmployeeListResponse, EmployeeStats } from '@/types/employee';

let client: MongoClient;
let db: Db;
let employeesCollection: Collection<Employee>;

// Initialize MongoDB connection
export async function connectToDatabase() {
  if (!client) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI environment variable is not defined');
    }
    
    client = new MongoClient(uri);
    await client.connect();
    db = client.db();
    employeesCollection = db.collection<Employee>('employees');
    
    // Create indexes for better performance
    await createIndexes();
  }
  
  return { client, db, employeesCollection };
}

// Create database indexes
async function createIndexes() {
  try {
    await employeesCollection.createIndex({ email: 1 }, { unique: true });
    await employeesCollection.createIndex({ employeeId: 1 }, { unique: true });
    await employeesCollection.createIndex({ department: 1 });
    await employeesCollection.createIndex({ role: 1 });
    await employeesCollection.createIndex({ isActive: 1 });
    await employeesCollection.createIndex({ name: 'text', email: 'text' });
  } catch (error) {
    console.error('Error creating indexes:', error);
  }
}

// Generate unique employee ID
export function generateEmployeeId(): string {
  const timestamp = Date.now().toString(36);
  const randomStr = Math.random().toString(36).substring(2, 8);
  return `EMP-${timestamp}-${randomStr}`.toUpperCase();
}

// Create a new employee
export async function createEmployee(employeeData: CreateEmployeeRequest): Promise<Employee> {
  await connectToDatabase();
  
  // Check if email already exists
  const existingEmployee = await employeesCollection.findOne({ email: employeeData.email });
  if (existingEmployee) {
    throw new Error('Employee with this email already exists');
  }
  
  const now = new Date();
  const employee: Employee = {
    employeeId: generateEmployeeId(),
    name: employeeData.name,
    email: employeeData.email.toLowerCase(),
    role: employeeData.role,
    department: employeeData.department,
    hourlyRate: employeeData.hourlyRate,
    startDate: new Date(employeeData.startDate),
    isActive: true,
    phone: employeeData.phone,
    address: employeeData.address,
    emergencyContact: employeeData.emergencyContact,
    position: employeeData.position,
    manager: employeeData.manager,
    createdAt: now,
    updatedAt: now
  };
  
  const result = await employeesCollection.insertOne(employee);
  
  return {
    ...employee,
    _id: result.insertedId.toString()
  };
}

// Get employee by ID
export async function getEmployeeById(id: string): Promise<Employee | null> {
  await connectToDatabase();
  
  let query: Record<string, any>;
  if (ObjectId.isValid(id)) {
    query = { _id: new ObjectId(id) };
  } else {
    query = { employeeId: id };
  }
  
  const employee = await employeesCollection.findOne(query);
  
  if (employee) {
    return {
      ...employee,
      _id: employee._id?.toString()
    };
  }
  
  return null;
}

// Get employee by email
export async function getEmployeeByEmail(email: string): Promise<Employee | null> {
  await connectToDatabase();
  
  const employee = await employeesCollection.findOne({ email: email.toLowerCase() });
  
  if (employee) {
    return {
      ...employee,
      _id: employee._id?.toString()
    };
  }
  
  return null;
}

// Get all employees with filtering and pagination
export async function getEmployees(filters: EmployeeFilters = {}): Promise<EmployeeListResponse> {
  await connectToDatabase();
  
  const {
    search,
    department,
    role,
    isActive = true,
    manager,
    page = 1,
    limit = 10,
    sortBy = 'name',
    sortOrder = 'asc'
  } = filters;
  
  // Build query
  const query: Record<string, any> = { isActive };
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { employeeId: { $regex: search, $options: 'i' } }
    ];
  }
  
  if (department) {
    query.department = department;
  }
  
  if (role) {
    query.role = role;
  }
  
  if (manager) {
    query.manager = manager;
  }
  
  // Build sort
  const sort: Record<string, any> = {};
  sort[sortBy] = sortOrder === 'asc' ? 1 : -1;
  
  // Calculate pagination
  const skip = (page - 1) * limit;
  
  // Execute queries
  const [employees, total] = await Promise.all([
    employeesCollection
      .find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .toArray(),
    employeesCollection.countDocuments(query)
  ]);
  
  const totalPages = Math.ceil(total / limit);
  
  return {
    employees: employees.map(emp => ({
      ...emp,
      _id: emp._id?.toString()
    })),
    total,
    page,
    limit,
    totalPages
  };
}

// Update employee
export async function updateEmployee(id: string, updateData: UpdateEmployeeRequest): Promise<Employee | null> {
  await connectToDatabase();
  
  let query: Record<string, any>;
  if (ObjectId.isValid(id)) {
    query = { _id: new ObjectId(id) };
  } else {
    query = { employeeId: id };
  }
  
  // Check if email is being updated and if it already exists
  if (updateData.email) {
    const existingEmployee = await employeesCollection.findOne({ 
      email: updateData.email.toLowerCase(),
      ...query
    });
    if (existingEmployee) {
      throw new Error('Employee with this email already exists');
    }
  }
  
  const updateFields: Record<string, any> = {
    ...updateData,
    updatedAt: new Date()
  };
  
  // Convert date strings to Date objects
  if (updateData.startDate) {
    updateFields.startDate = new Date(updateData.startDate);
  }
  if (updateData.endDate) {
    updateFields.endDate = new Date(updateData.endDate);
  }
  if (updateData.email) {
    updateFields.email = updateData.email.toLowerCase();
  }
  
  const result = await employeesCollection.findOneAndUpdate(
    query,
    { $set: updateFields },
    { returnDocument: 'after' }
  );

  if (result) {
    return {
      ...result,
      _id: result._id?.toString()
    };
  }

  return null;
}

// Soft delete employee (deactivate)
export async function deactivateEmployee(id: string): Promise<boolean> {
  await connectToDatabase();
  
  let query: Record<string, any>;
  if (ObjectId.isValid(id)) {
    query = { _id: new ObjectId(id) };
  } else {
    query = { employeeId: id };
  }
  
  const result = await employeesCollection.updateOne(
    query,
    { 
      $set: { 
        isActive: false,
        endDate: new Date(),
        updatedAt: new Date()
      }
    }
  );
  
  return result.modifiedCount > 0;
}

// Reactivate employee
export async function reactivateEmployee(id: string): Promise<boolean> {
  await connectToDatabase();
  
  let query: Record<string, any>;
  if (ObjectId.isValid(id)) {
    query = { _id: new ObjectId(id) };
  } else {
    query = { employeeId: id };
  }
  
  const result = await employeesCollection.updateOne(
    query,
    { 
      $set: { 
        isActive: true,
        updatedAt: new Date()
      },
      $unset: { endDate: 1 }
    }
  );
  
  return result.modifiedCount > 0;
}

// Hard delete employee (permanent deletion)
export async function deleteEmployee(id: string): Promise<boolean> {
  await connectToDatabase();
  
  let query: Record<string, any>;
  if (ObjectId.isValid(id)) {
    query = { _id: new ObjectId(id) };
  } else {
    query = { employeeId: id };
  }
  
  const result = await employeesCollection.deleteOne(query);
  return result.deletedCount > 0;
}

// Alias for permanent deletion (for API compatibility)
export const deleteEmployeePermanently = deleteEmployee;

// Get employee statistics
export async function getEmployeeStats(): Promise<EmployeeStats> {
  await connectToDatabase();
  
  const [totalEmployees, activeEmployees, departmentStats, roleStats] = await Promise.all([
    employeesCollection.countDocuments({}),
    employeesCollection.countDocuments({ isActive: true }),
    employeesCollection.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$department', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray(),
    employeesCollection.aggregate([
      { $match: { isActive: true } },
      { $group: { _id: '$role', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]).toArray()
  ]);
  
  return {
    totalEmployees,
    activeEmployees,
    inactiveEmployees: totalEmployees - activeEmployees,
    departmentBreakdown: departmentStats.map(stat => ({
      department: stat._id,
      count: stat.count
    })),
    roleBreakdown: roleStats.map(stat => ({
      role: stat._id,
      count: stat.count
    }))
  };
}

// Get employees by department
export async function getEmployeesByDepartment(department: string): Promise<Employee[]> {
  await connectToDatabase();
  
  const employees = await employeesCollection
    .find({ department, isActive: true })
    .sort({ name: 1 })
    .toArray();
  
  return employees.map(emp => ({
    ...emp,
    _id: emp._id?.toString()
  }));
}

// Get employees by manager
export async function getEmployeesByManager(managerId: string): Promise<Employee[]> {
  await connectToDatabase();
  
  const employees = await employeesCollection
    .find({ manager: managerId, isActive: true })
    .sort({ name: 1 })
    .toArray();
  
  return employees.map(emp => ({
    ...emp,
    _id: emp._id?.toString()
  }));
}

// Validate employee data
export function validateEmployeeData(data: CreateEmployeeRequest | UpdateEmployeeRequest): string[] {
  const errors: string[] = [];
  
  if ('name' in data && data.name && data.name.trim().length < 2) {
    errors.push('Name must be at least 2 characters long');
  }
  
  if ('email' in data && data.email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      errors.push('Invalid email format');
    }
  }
  
  if ('hourlyRate' in data && data.hourlyRate !== undefined) {
    if (data.hourlyRate < 0) {
      errors.push('Hourly rate must be a positive number');
    }
  }
  
  if ('role' in data && data.role) {
    const validRoles = ['admin', 'hr', 'employee'];
    if (!validRoles.includes(data.role)) {
      errors.push('Invalid role. Must be admin, hr, or employee');
    }
  }
  
  return errors;
}