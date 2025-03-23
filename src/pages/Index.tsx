
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Users, 
  Clock, 
  Calculator, 
  CreditCard, 
  ArrowUpRight,
  BarChart3,
  TrendingUp
} from 'lucide-react';
import { employees, timeRecords } from '@/data/mockData';
// Re-import framer-motion to ensure proper module resolution
import { motion } from 'framer-motion';
import Header from '@/components/Header';

const Dashboard = () => {
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [activeEmployees, setActiveEmployees] = useState(0);
  const [totalHoursThisWeek, setTotalHoursThisWeek] = useState(0);
  const [avgHoursPerEmployee, setAvgHoursPerEmployee] = useState(0);
  
  useEffect(() => {
    // Set total employees
    setTotalEmployees(employees.length);
    
    // Calculate active employees (those with time records in the past week)
    const today = new Date();
    const oneWeekAgo = new Date(today);
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    
    const activeIds = new Set();
    let totalHours = 0;
    
    timeRecords.forEach(record => {
      const recordDate = new Date(record.date);
      if (recordDate >= oneWeekAgo && recordDate <= today) {
        activeIds.add(record.employeeId);
        
        // Simple hour calculation
        const timeInParts = record.timeIn.split(':').map(Number);
        const timeOutParts = record.timeOut.split(':').map(Number);
        const timeInMinutes = timeInParts[0] * 60 + timeInParts[1];
        const timeOutMinutes = timeOutParts[0] * 60 + timeOutParts[1];
        let workedMinutes = timeOutMinutes - timeInMinutes;
        
        // Adjust for late arrival
        if (record.late > 0) {
          workedMinutes -= record.late;
        }
        
        totalHours += workedMinutes / 60;
      }
    });
    
    setActiveEmployees(activeIds.size);
    setTotalHoursThisWeek(totalHours);
    setAvgHoursPerEmployee(activeIds.size > 0 ? totalHours / activeIds.size : 0);
  }, []);
  
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
  
  // Stats cards
  const statsCards = [
    {
      title: "Total Employees",
      value: totalEmployees,
      icon: <Users className="h-5 w-5 text-blue-600" />,
      linkTo: "/employees"
    },
    {
      title: "Active This Week",
      value: activeEmployees,
      icon: <Clock className="h-5 w-5 text-green-600" />,
      linkTo: "/attendance"
    },
    {
      title: "Total Hours",
      value: totalHoursThisWeek.toFixed(1) + "h",
      icon: <TrendingUp className="h-5 w-5 text-purple-600" />,
      linkTo: "/attendance"
    },
    {
      title: "Avg. Hours/Employee",
      value: avgHoursPerEmployee.toFixed(1) + "h",
      icon: <BarChart3 className="h-5 w-5 text-amber-600" />,
      linkTo: "/attendance"
    },
  ];
  
  // Module cards
  const moduleCards = [
    {
      title: "Employees",
      description: "Manage employee information including personal details and employment information.",
      icon: <Users className="h-6 w-6" />,
      linkTo: "/employees",
      color: "bg-blue-50 text-blue-600"
    },
    {
      title: "Attendance",
      description: "Track employee time records, including hours worked, late arrivals, and overtime.",
      icon: <Clock className="h-6 w-6" />,
      linkTo: "/attendance",
      color: "bg-green-50 text-green-600"
    },
    {
      title: "Payroll",
      description: "Calculate and manage employee salaries, including gross and net pay computations.",
      icon: <Calculator className="h-6 w-6" />,
      linkTo: "/payroll",
      color: "bg-purple-50 text-purple-600"
    },
  ];
  
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
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome to Payfolk Wizardry - Your payroll management system</p>
        </motion.div>
        
        {/* Stats Overview */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
        >
          {statsCards.map((card, index) => (
            <motion.div key={index} variants={itemVariants}>
              <Card className="border">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3 p-2">
                      <div className="rounded-full bg-background p-2">
                        {card.icon}
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">{card.title}</p>
                        <h3 className="text-2xl font-bold">{card.value}</h3>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon" asChild>
                      <Link to={card.linkTo}>
                        <ArrowUpRight className="h-4 w-4" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
        
        {/* Core Modules */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mb-8"
        >
          <h2 className="text-xl font-semibold mb-4">Core Modules</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {moduleCards.map((module, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full border hover:shadow-md transition-all">
                  <CardContent className="p-6">
                    <div className={`w-12 h-12 rounded-full ${module.color} flex items-center justify-center mb-4`}>
                      {module.icon}
                    </div>
                    <h3 className="text-lg font-semibold mb-2">{module.title}</h3>
                    <p className="text-muted-foreground text-sm mb-4">{module.description}</p>
                    <Button asChild className="w-full">
                      <Link to={module.linkTo}>
                        Access {module.title}
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Recent Updates Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <Card className="border">
            <CardHeader>
              <CardTitle>Latest Updates</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-green-100 p-1.5">
                    <CreditCard className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <p className="font-medium">Payroll Processing</p>
                    <p className="text-sm text-muted-foreground">Weekly payroll has been processed for all active employees</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-blue-100 p-1.5">
                    <Users className="h-4 w-4 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium">Employee Records</p>
                    <p className="text-sm text-muted-foreground">All employee information has been updated successfully</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3">
                  <div className="rounded-full bg-purple-100 p-1.5">
                    <Clock className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="font-medium">Attendance Records</p>
                    <p className="text-sm text-muted-foreground">Time records for the past week have been finalized</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;
