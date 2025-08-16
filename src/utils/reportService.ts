import { Db } from 'mongodb';
import { getDatabase } from './mongodb';
import {
  AttendanceReportFilter,
  DailyAttendanceSummary,
  WeeklyAttendanceSummary,
  MonthlyAttendanceSummary,
  AttendanceReport,
  AttendanceAnalytics
} from '../types/report';

export class ReportService {
  private db: Db | null = null;

  private async getDatabase(): Promise<Db> {
    if (!this.db) {
      const db = await getDatabase();
      this.db = db;
    }
    return this.db;
  }

  /**
   * Generate daily attendance summary for specified date range
   */
  async generateDailyAttendanceSummary(
    filter: AttendanceReportFilter
  ): Promise<DailyAttendanceSummary[]> {
    const db = await this.getDatabase();
    
    const pipeline = [
      {
        $match: {
          date: {
            $gte: filter.startDate,
            $lte: filter.endDate
          },
          ...(filter.employeeId && { employeeId: filter.employeeId }),
          ...(filter.status && { status: filter.status })
        }
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
        $match: {
          ...(filter.department && { 'employee.department': filter.department })
        }
      },
      {
        $project: {
          date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          employeeId: '$employeeId',
          employeeName: { $concat: ['$employee.firstName', ' ', '$employee.lastName'] },
          department: '$employee.department',
          clockIn: '$clockIn',
          clockOut: '$clockOut',
          totalHours: {
            $cond: {
              if: { $and: ['$clockIn', '$clockOut'] },
              then: {
                $divide: [
                  { $subtract: ['$clockOut', '$clockIn'] },
                  1000 * 60 * 60 // Convert milliseconds to hours
                ]
              },
              else: 0
            }
          },
          status: '$status',
          overtimeHours: {
            $cond: {
              if: { $and: ['$clockIn', '$clockOut'] },
              then: {
                $max: [
                  0,
                  {
                    $subtract: [
                      {
                        $divide: [
                          { $subtract: ['$clockOut', '$clockIn'] },
                          1000 * 60 * 60
                        ]
                      },
                      8 // Standard 8-hour workday
                    ]
                  }
                ]
              },
              else: 0
            }
          },
          breakDuration: { $ifNull: ['$breakDuration', 0] }
        }
      },
      {
        $sort: { date: 1, employeeName: 1 }
      }
    ];

    const result = await db.collection('attendance').aggregate(pipeline).toArray();
    return result as DailyAttendanceSummary[];
  }

  /**
   * Generate weekly attendance summary
   */
  async generateWeeklyAttendanceSummary(
    filter: AttendanceReportFilter
  ): Promise<WeeklyAttendanceSummary[]> {
    const db = await this.getDatabase();
    
    const pipeline = [
      {
        $match: {
          date: {
            $gte: filter.startDate,
            $lte: filter.endDate
          },
          ...(filter.employeeId && { employeeId: filter.employeeId })
        }
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
        $match: {
          ...(filter.department && { 'employee.department': filter.department })
        }
      },
      {
        $addFields: {
          weekStart: {
            $dateFromParts: {
              isoWeekYear: { $isoWeekYear: '$date' },
              isoWeek: { $isoWeek: '$date' },
              isoDayOfWeek: 1
            }
          },
          weekEnd: {
            $dateAdd: {
              startDate: {
                $dateFromParts: {
                  isoWeekYear: { $isoWeekYear: '$date' },
                  isoWeek: { $isoWeek: '$date' },
                  isoDayOfWeek: 1
                }
              },
              unit: 'day',
              amount: 6
            }
          }
        }
      },
      {
        $group: {
          _id: {
            employeeId: '$employeeId',
            weekStart: '$weekStart'
          },
          weekStartDate: { $first: { $dateToString: { format: '%Y-%m-%d', date: '$weekStart' } } },
          weekEndDate: { $first: { $dateToString: { format: '%Y-%m-%d', date: '$weekEnd' } } },
          employeeId: { $first: '$employeeId' },
          employeeName: { $first: { $concat: ['$employee.firstName', ' ', '$employee.lastName'] } },
          department: { $first: '$employee.department' },
          totalWorkingDays: { $sum: 1 },
          daysPresent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          },
          daysAbsent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
            }
          },
          daysLate: {
            $sum: {
              $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
            }
          },
          totalHours: {
            $sum: {
              $cond: {
                if: { $and: ['$clockIn', '$clockOut'] },
                then: {
                  $divide: [
                    { $subtract: ['$clockOut', '$clockIn'] },
                    1000 * 60 * 60
                  ]
                },
                else: 0
              }
            }
          },
          totalOvertimeHours: {
            $sum: {
              $max: [
                0,
                {
                  $subtract: [
                    {
                      $cond: {
                        if: { $and: ['$clockIn', '$clockOut'] },
                        then: {
                          $divide: [
                            { $subtract: ['$clockOut', '$clockIn'] },
                            1000 * 60 * 60
                          ]
                        },
                        else: 0
                      }
                    },
                    8
                  ]
                }
              ]
            }
          }
        }
      },
      {
        $addFields: {
          averageHoursPerDay: {
            $cond: {
              if: { $gt: ['$daysPresent', 0] },
              then: { $divide: ['$totalHours', '$daysPresent'] },
              else: 0
            }
          }
        }
      },
      {
        $sort: { weekStartDate: 1, employeeName: 1 }
      }
    ];

    const result = await db.collection('attendance').aggregate(pipeline).toArray();
    return result as WeeklyAttendanceSummary[];
  }

  /**
   * Generate monthly attendance summary
   */
  async generateMonthlyAttendanceSummary(
    filter: AttendanceReportFilter
  ): Promise<MonthlyAttendanceSummary[]> {
    const db = await this.getDatabase();
    
    const pipeline = [
      {
        $match: {
          date: {
            $gte: filter.startDate,
            $lte: filter.endDate
          },
          ...(filter.employeeId && { employeeId: filter.employeeId })
        }
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
        $match: {
          ...(filter.department && { 'employee.department': filter.department })
        }
      },
      {
        $group: {
          _id: {
            employeeId: '$employeeId',
            month: { $dateToString: { format: '%Y-%m', date: '$date' } }
          },
          month: { $first: { $dateToString: { format: '%Y-%m', date: '$date' } } },
          employeeId: { $first: '$employeeId' },
          employeeName: { $first: { $concat: ['$employee.firstName', ' ', '$employee.lastName'] } },
          department: { $first: '$employee.department' },
          totalWorkingDays: { $sum: 1 },
          daysPresent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          },
          daysAbsent: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
            }
          },
          daysLate: {
            $sum: {
              $cond: [{ $eq: ['$status', 'late'] }, 1, 0]
            }
          },
          totalHours: {
            $sum: {
              $cond: {
                if: { $and: ['$clockIn', '$clockOut'] },
                then: {
                  $divide: [
                    { $subtract: ['$clockOut', '$clockIn'] },
                    1000 * 60 * 60
                  ]
                },
                else: 0
              }
            }
          },
          totalOvertimeHours: {
            $sum: {
              $max: [
                0,
                {
                  $subtract: [
                    {
                      $cond: {
                        if: { $and: ['$clockIn', '$clockOut'] },
                        then: {
                          $divide: [
                            { $subtract: ['$clockOut', '$clockIn'] },
                            1000 * 60 * 60
                          ]
                        },
                        else: 0
                      }
                    },
                    8
                  ]
                }
              ]
            }
          }
        }
      },
      {
        $addFields: {
          averageHoursPerDay: {
            $cond: {
              if: { $gt: ['$daysPresent', 0] },
              then: { $divide: ['$totalHours', '$daysPresent'] },
              else: 0
            }
          },
          attendanceRate: {
            $cond: {
              if: { $gt: ['$totalWorkingDays', 0] },
              then: {
                $multiply: [
                  { $divide: ['$daysPresent', '$totalWorkingDays'] },
                  100
                ]
              },
              else: 0
            }
          }
        }
      },
      {
        $sort: { month: 1, employeeName: 1 }
      }
    ];

    const result = await db.collection('attendance').aggregate(pipeline).toArray();
    return result as MonthlyAttendanceSummary[];
  }

  /**
   * Generate comprehensive attendance report
   */
  async generateAttendanceReport(
    reportType: 'daily' | 'weekly' | 'monthly',
    filter: AttendanceReportFilter
  ): Promise<AttendanceReport> {
    let data: DailyAttendanceSummary[] | WeeklyAttendanceSummary[] | MonthlyAttendanceSummary[];
    
    switch (reportType) {
      case 'daily':
        data = await this.generateDailyAttendanceSummary(filter);
        break;
      case 'weekly':
        data = await this.generateWeeklyAttendanceSummary(filter);
        break;
      case 'monthly':
        data = await this.generateMonthlyAttendanceSummary(filter);
        break;
      default:
        throw new Error(`Unsupported report type: ${reportType}`);
    }

    // Calculate summary statistics
    const summary = {
      totalEmployees: new Set(data.map(item => item.employeeId)).size,
      totalPresent: data.reduce((sum, item) => {
        if ('daysPresent' in item) {
          return sum + item.daysPresent;
        } else if ('status' in item) {
          return sum + (item.status === 'present' ? 1 : 0);
        }
        return sum;
      }, 0),
      totalAbsent: data.reduce((sum, item) => {
        if ('daysAbsent' in item) {
          return sum + item.daysAbsent;
        } else if ('status' in item) {
          return sum + (item.status === 'absent' ? 1 : 0);
        }
        return sum;
      }, 0),
      totalLate: data.reduce((sum, item) => {
        if ('daysLate' in item) {
          return sum + item.daysLate;
        } else if ('status' in item) {
          return sum + (item.status === 'late' ? 1 : 0);
        }
        return sum;
      }, 0),
      averageAttendanceRate: 0
    };

    const totalDays = summary.totalPresent + summary.totalAbsent + summary.totalLate;
    summary.averageAttendanceRate = totalDays > 0 ? (summary.totalPresent / totalDays) * 100 : 0;

    return {
      reportType,
      generatedAt: new Date(),
      filter,
      summary,
      data
    };
  }

  /**
   * Generate attendance analytics with trends and insights
   */
  async generateAttendanceAnalytics(
    filter: AttendanceReportFilter
  ): Promise<AttendanceAnalytics> {
    const db = await this.getDatabase();
    
    // Get department breakdown
    const departmentPipeline = [
      {
        $match: {
          date: {
            $gte: filter.startDate,
            $lte: filter.endDate
          }
        }
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
          _id: '$employee.department',
          totalDays: { $sum: 1 },
          presentDays: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          },
          employeeCount: { $addToSet: '$employeeId' }
        }
      },
      {
        $project: {
          department: '$_id',
          attendanceRate: {
            $multiply: [
              { $divide: ['$presentDays', '$totalDays'] },
              100
            ]
          },
          employeeCount: { $size: '$employeeCount' }
        }
      }
    ];

    const departmentBreakdown = await db.collection('attendance').aggregate(departmentPipeline).toArray() as {
      department: string;
      attendanceRate: number;
      employeeCount: number;
    }[];

    // Get daily trends
    const trendsPipeline = [
      {
        $match: {
          date: {
            $gte: filter.startDate,
            $lte: filter.endDate
          }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          presentCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'present'] }, 1, 0]
            }
          },
          absentCount: {
            $sum: {
              $cond: [{ $eq: ['$status', 'absent'] }, 1, 0]
            }
          },
          totalCount: { $sum: 1 }
        }
      },
      {
        $project: {
          date: '$_id',
          presentCount: 1,
          absentCount: 1,
          attendanceRate: {
            $multiply: [
              { $divide: ['$presentCount', '$totalCount'] },
              100
            ]
          }
        }
      },
      {
        $sort: { date: 1 }
      }
    ];

    const trends = await db.collection('attendance').aggregate(trendsPipeline).toArray() as {
      date: string;
      attendanceRate: number;
      presentCount: number;
      absentCount: number;
    }[];

    // Calculate overall statistics
    const totalEmployees = await db.collection('employees').countDocuments({ isActive: true });
    const totalAttendanceRecords = await db.collection('attendance').countDocuments({
      date: { $gte: filter.startDate, $lte: filter.endDate }
    });
    const presentRecords = await db.collection('attendance').countDocuments({
      date: { $gte: filter.startDate, $lte: filter.endDate },
      status: 'present'
    });

    const absentRecords = await db.collection('attendance').countDocuments({
      date: { $gte: filter.startDate, $lte: filter.endDate },
      status: 'absent'
    });

    const averageAttendanceRate = totalAttendanceRecords > 0 ? (presentRecords / totalAttendanceRecords) * 100 : 0;
    const punctualityRate = totalAttendanceRecords > 0 ? ((presentRecords) / totalAttendanceRecords) * 100 : 0;
    const absenteeismRate = totalAttendanceRecords > 0 ? (absentRecords / totalAttendanceRecords) * 100 : 0;

    // Calculate total overtime hours
    const overtimePipeline = [
      {
        $match: {
          date: { $gte: filter.startDate, $lte: filter.endDate },
          clockIn: { $exists: true },
          clockOut: { $exists: true }
        }
      },
      {
        $project: {
          overtimeHours: {
            $max: [
              0,
              {
                $subtract: [
                  {
                    $divide: [
                      { $subtract: ['$clockOut', '$clockIn'] },
                      1000 * 60 * 60
                    ]
                  },
                  8
                ]
              }
            ]
          }
        }
      },
      {
        $group: {
          _id: null,
          totalOvertimeHours: { $sum: '$overtimeHours' }
        }
      }
    ];

    const overtimeResult = await db.collection('attendance').aggregate(overtimePipeline).toArray();
    const overtimeHours = overtimeResult.length > 0 ? overtimeResult[0].totalOvertimeHours : 0;

    return {
      period: `${filter.startDate.toISOString().split('T')[0]} to ${filter.endDate.toISOString().split('T')[0]}`,
      totalEmployees,
      averageAttendanceRate,
      punctualityRate,
      absenteeismRate,
      overtimeHours,
      departmentBreakdown,
      trends
    };
  }
}

// Export singleton instance
export const reportService = new ReportService();