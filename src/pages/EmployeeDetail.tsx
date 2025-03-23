
import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  getEmployeeById, 
  getEmployeeTimeRecords 
} from '@/data/mockData';
import { Employee, TimeRecord } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { formatDate } from '@/utils/dateUtils';
import { calculateWorkHours } from '@/utils/dateUtils';
import { calculateWeeklyHours, calculateGrossSalary, calculateNetSalary } from '@/utils/payrollUtils';
import AttendanceTable from '@/components/AttendanceTable';
import PayrollSummary from '@/components/PayrollSummary';
import { Calendar, Clock, Calculator, Mail, Phone, MapPin, Building, Cake } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

const EmployeeDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [employee, setEmployee] = useState<Employee | null>(null);
  const [timeRecords, setTimeRecords] = useState<TimeRecord[]>([]);
  const [activeTab, setActiveTab] = useState('info');
  
  useEffect(() => {
    if (id) {
      const emp = getEmployeeById(id);
      if (emp) {
        setEmployee(emp);
        
        // Get time records
        const records = getEmployeeTimeRecords(id);
        setTimeRecords(records);
      }
    }
  }, [id]);
  
  if (!employee) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold">Employee not found</h2>
          <Button asChild className="mt-4">
            <Link to="/employees">Back to Employees</Link>
          </Button>
        </div>
      </div>
    );
  }
  
  // Calculate salary data
  const hoursData = calculateWeeklyHours(timeRecords);
  const grossSalaryData = calculateGrossSalary(
    hoursData.regularHours,
    hoursData.overtimeHours,
    employee.hourlyRate
  );
  const netSalaryData = calculateNetSalary(grossSalaryData.grossPay, employee.hourlyRate);
  
  const salaryData = {
    ...hoursData,
    ...grossSalaryData,
    ...netSalaryData
  };
  
  // Get current week dates for PayrollSummary
  const today = new Date();
  const weekStart = new Date(today);
  weekStart.setDate(today.getDate() - today.getDay()); // Start of week (Sunday)
  const weekEnd = new Date(today);
  weekEnd.setDate(weekStart.getDate() + 6); // End of week (Saturday)
  
  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className="mb-8">
            <Link to="/employees" className="text-sm text-primary hover:underline inline-block mb-2">
              ← Back to Employees
            </Link>
            
            {/* Employee header card */}
            <Card className="border overflow-hidden">
              <CardContent className="p-0">
                <div className="bg-primary/5 p-6">
                  <div className="flex items-center space-x-4">
                    <Avatar className="h-16 w-16 border-2 border-white">
                      <AvatarImage src={employee.profileImage} alt={`${employee.firstName} ${employee.lastName}`} />
                      <AvatarFallback>
                        {employee.firstName.charAt(0)}{employee.lastName.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                    
                    <div>
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2">
                        <h1 className="text-2xl font-bold">{employee.firstName} {employee.lastName}</h1>
                        <span className="text-sm bg-primary/10 text-primary px-2 py-0.5 rounded-full">
                          {employee.employeeNumber}
                        </span>
                      </div>
                      <p className="text-muted-foreground mt-1">{employee.position} • {employee.department}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Tabs */}
          <Tabs defaultValue="info" value={activeTab} onValueChange={setActiveTab} className="mb-8">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="info">
                <Calendar className="h-4 w-4 mr-2" />
                Information
              </TabsTrigger>
              <TabsTrigger value="attendance">
                <Clock className="h-4 w-4 mr-2" />
                Attendance
              </TabsTrigger>
              <TabsTrigger value="payroll">
                <Calculator className="h-4 w-4 mr-2" />
                Payroll
              </TabsTrigger>
            </TabsList>
            
            {/* Information Tab */}
            <TabsContent value="info" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card className="border">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Employee Information</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Cake className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Birthday</p>
                            <p className="font-medium">{formatDate(employee.birthday)}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Mail className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Email</p>
                            <p className="font-medium">{employee.firstName.toLowerCase()}.{employee.lastName.toLowerCase()}@company.com</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Phone</p>
                            <p className="font-medium">+63 {Math.floor(Math.random() * 900000000) + 100000000}</p>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-start space-x-3">
                          <Building className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Department</p>
                            <p className="font-medium">{employee.department}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Address</p>
                            <p className="font-medium">123 Main Street, Makati City, Metro Manila</p>
                          </div>
                        </div>
                        
                        <div className="flex items-start space-x-3">
                          <Calculator className="h-5 w-5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-sm text-muted-foreground">Hourly Rate</p>
                            <p className="font-medium">₱{employee.hourlyRate.toFixed(2)}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </TabsContent>
            
            {/* Attendance Tab */}
            <TabsContent value="attendance" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center h-full p-2">
                        <div className="text-2xl font-bold">{hoursData.regularHours.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Regular Hours</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center h-full p-2">
                        <div className="text-2xl font-bold">{hoursData.overtimeHours.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Overtime Hours</div>
                      </div>
                    </CardContent>
                  </Card>
                  
                  <Card className="border">
                    <CardContent className="p-4">
                      <div className="flex flex-col items-center justify-center h-full p-2">
                        <div className="text-2xl font-bold">{hoursData.totalHours.toFixed(1)}</div>
                        <div className="text-sm text-muted-foreground">Total Hours</div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                
                <AttendanceTable timeRecords={timeRecords} />
              </motion.div>
            </TabsContent>
            
            {/* Payroll Tab */}
            <TabsContent value="payroll" className="space-y-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <PayrollSummary
                  employee={employee}
                  timeRecords={timeRecords}
                  weekStart={weekStart}
                  weekEnd={weekEnd}
                />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default EmployeeDetail;
