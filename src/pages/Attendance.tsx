
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { employees, timeRecords } from '@/data/mockData';
import { Employee, TimeRecord } from '@/types/employee';
import { formatDate, formatTime, getCurrentWeek, getWeek } from '@/utils/dateUtils';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';
import Header from '@/components/Header';

const Attendance = () => {
  const [currentWeekOffset, setCurrentWeekOffset] = useState(0);
  const [week, setWeek] = useState(getCurrentWeek());
  const [selectedDepartment, setSelectedDepartment] = useState<string>('all');
  const [displayRecords, setDisplayRecords] = useState<Record<string, TimeRecord[]>>({});
  
  // Update week when offset changes
  useEffect(() => {
    setWeek(getWeek(currentWeekOffset));
  }, [currentWeekOffset]);
  
  // Filter and prepare records whenever week or department changes
  useEffect(() => {
    const startDate = week.start.toISOString().split('T')[0];
    const endDate = week.end.toISOString().split('T')[0];
    
    // Filter time records for the current week
    const weekRecords = timeRecords.filter(record => {
      return record.date >= startDate && record.date <= endDate;
    });
    
    // Group records by employee
    const recordsByEmployee: Record<string, TimeRecord[]> = {};
    
    weekRecords.forEach(record => {
      const employee = employees.find(emp => emp.id === record.employeeId);
      
      // Apply department filter if selected
      if (selectedDepartment !== 'all' && employee?.department !== selectedDepartment) {
        return;
      }
      
      if (!recordsByEmployee[record.employeeId]) {
        recordsByEmployee[record.employeeId] = [];
      }
      
      recordsByEmployee[record.employeeId].push(record);
    });
    
    setDisplayRecords(recordsByEmployee);
  }, [week, selectedDepartment]);
  
  // Get all departments for the filter
  const departments = ['all', ...new Set(employees.map(emp => emp.department))];
  
  // Helper to get employee by ID
  const getEmployee = (id: string): Employee | undefined => {
    return employees.find(emp => emp.id === id);
  };
  
  // Calculate total hours for an employee's records
  const calculateTotalHours = (records: TimeRecord[]): number => {
    return records.reduce((total, record) => {
      const timeInParts = record.timeIn.split(':').map(Number);
      const timeOutParts = record.timeOut.split(':').map(Number);
      const inMinutes = timeInParts[0] * 60 + timeInParts[1];
      const outMinutes = timeOutParts[0] * 60 + timeOutParts[1];
      let workedMinutes = outMinutes - inMinutes;
      
      // Adjust for late
      if (record.late > 0) {
        workedMinutes -= record.late;
      }
      
      return total + (workedMinutes / 60);
    }, 0);
  };
  
  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    }
  };
  
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold">Attendance</h1>
          <p className="text-muted-foreground mt-1">Track employee attendance and work hours</p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="mb-8"
        >
          {/* Week selector */}
          <Card className="mb-6 border">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentWeekOffset(prev => prev - 1)}
                >
                  <ChevronLeft className="h-4 w-4 mr-1" />
                  Previous
                </Button>
                
                <div className="text-center">
                  <div className="font-medium">
                    Week {week.weekNumber}, {new Date(week.start).getFullYear()}
                  </div>
                  <div className="text-sm text-muted-foreground">
                    {formatDate(week.start)} - {formatDate(week.end)}
                  </div>
                </div>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setCurrentWeekOffset(prev => prev + 1)}
                  disabled={currentWeekOffset >= 0}
                >
                  Next
                  <ChevronRight className="h-4 w-4 ml-1" />
                </Button>
              </div>
            </CardContent>
          </Card>
          
          {/* Department filter */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Weekly Attendance Records</h2>
            
            <div className="flex items-center space-x-2">
              <span className="text-sm text-muted-foreground">Department:</span>
              <Select value={selectedDepartment} onValueChange={setSelectedDepartment}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="All Departments" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Departments</SelectItem>
                  {departments.filter(d => d !== 'all').map(dept => (
                    <SelectItem key={dept} value={dept}>
                      {dept}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Attendance records */}
          <Card className="border">
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table className="table-hover">
                  <TableHeader>
                    <TableRow>
                      <TableHead>Employee</TableHead>
                      <TableHead>Department</TableHead>
                      <TableHead>Days Present</TableHead>
                      <TableHead>Total Hours</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {Object.keys(displayRecords).length > 0 ? (
                      Object.entries(displayRecords).map(([employeeId, records], index) => {
                        const employee = getEmployee(employeeId);
                        if (!employee) return null;
                        
                        const totalHours = calculateTotalHours(records);
                        const daysPresent = records.length;
                        
                        // Determine status
                        let status = "On Track";
                        let statusColor = "bg-green-500 text-white";
                        
                        // Simple logic: less than 35 hours is "Incomplete"
                        if (totalHours < 35) {
                          status = "Incomplete";
                          statusColor = "bg-yellow-500 text-white";
                        }
                        
                        return (
                          <motion.tr
                            key={employeeId}
                            initial={{ opacity: 0, y: 5 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.2, delay: index * 0.05 }}
                            className="[&>td]:py-3"
                          >
                            <TableCell>
                              <div className="flex items-center space-x-2">
                                <div className="font-medium">{employee.firstName} {employee.lastName}</div>
                              </div>
                            </TableCell>
                            <TableCell>{employee.department}</TableCell>
                            <TableCell>{daysPresent} days</TableCell>
                            <TableCell>{totalHours.toFixed(1)} hrs</TableCell>
                            <TableCell>
                              <Badge className={statusColor}>{status}</Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <Button variant="outline" size="sm" asChild>
                                <a href={`/employees/${employeeId}?tab=attendance`}>
                                  <Clock className="h-4 w-4 mr-1" />
                                  Details
                                </a>
                              </Button>
                            </TableCell>
                          </motion.tr>
                        );
                      })
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                          No attendance records found for this week
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Attendance;
