
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { employees } from '@/data/mockData';
import EmployeeCard from '@/components/EmployeeCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, Plus, Users } from 'lucide-react';
import { motion } from 'framer-motion';
import Header from '@/components/Header';

const Employees = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredEmployees = employees.filter(employee => {
    const fullName = `${employee.firstName} ${employee.lastName}`.toLowerCase();
    const position = employee.position.toLowerCase();
    const department = employee.department.toLowerCase();
    const empNumber = employee.employeeNumber.toLowerCase();
    const search = searchTerm.toLowerCase();
    
    return fullName.includes(search) || 
           position.includes(search) || 
           department.includes(search) || 
           empNumber.includes(search);
  });
  
  const handleEmployeeClick = (id: string) => {
    navigate(`/employees/${id}`);
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
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold">Employees</h1>
              <p className="text-muted-foreground mt-1">Manage employee information and records</p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Search employees..."
                  className="pl-8 pr-4"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Add Employee
              </Button>
            </div>
          </div>
        </motion.div>
        
        {filteredEmployees.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEmployees.map((employee, index) => (
              <EmployeeCard
                key={employee.id}
                employee={employee}
                index={index}
                onClick={() => handleEmployeeClick(employee.id)}
              />
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <div className="bg-muted rounded-full p-6">
              <Users className="h-12 w-12 text-muted-foreground" />
            </div>
            <h3 className="mt-4 text-xl font-medium">No employees found</h3>
            <p className="text-muted-foreground mt-1">Try adjusting your search or filters</p>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default Employees;
