
import { Employee } from '@/types/employee';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/utils/dateUtils';
import { motion } from 'framer-motion';

interface EmployeeCardProps {
  employee: Employee;
  index: number;
  onClick: () => void;
}

const EmployeeCard = ({ employee, index, onClick }: EmployeeCardProps) => {
  const initials = `${employee.firstName.charAt(0)}${employee.lastName.charAt(0)}`;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
    >
      <Card 
        className="overflow-hidden hover:shadow-md cursor-pointer transition-all duration-300 border border-border/50"
        onClick={onClick}
      >
        <CardContent className="p-4">
          <div className="flex items-center space-x-4">
            <Avatar className="h-12 w-12 border">
              <AvatarImage src={employee.profileImage} alt={`${employee.firstName} ${employee.lastName}`} />
              <AvatarFallback>{initials}</AvatarFallback>
            </Avatar>
            
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-medium truncate">
                  {employee.firstName} {employee.lastName}
                </h3>
                <Badge variant="outline" className="text-xs ml-2">
                  {employee.employeeNumber}
                </Badge>
              </div>
              
              <div className="flex flex-col mt-1">
                <span className="text-sm text-muted-foreground truncate">
                  {employee.position} • {employee.department}
                </span>
                <span className="text-xs text-muted-foreground mt-0.5">
                  Birthday: {formatDate(employee.birthday)}
                </span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default EmployeeCard;
