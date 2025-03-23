
import { Employee, TimeRecord } from '@/types/employee';

// Sample employee data
export const employees: Employee[] = [
  {
    id: '1',
    employeeNumber: 'EMP-001',
    firstName: 'John',
    lastName: 'Doe',
    birthday: '1990-05-15',
    position: 'Software Developer',
    department: 'Engineering',
    hourlyRate: 625, // ₱625 per hour (approximately ₱100k monthly)
    profileImage: 'https://randomuser.me/api/portraits/men/1.jpg'
  },
  {
    id: '2',
    employeeNumber: 'EMP-002',
    firstName: 'Jane',
    lastName: 'Smith',
    birthday: '1992-09-22',
    position: 'UI/UX Designer',
    department: 'Design',
    hourlyRate: 562.5, // ₱562.5 per hour (approximately ₱90k monthly)
    profileImage: 'https://randomuser.me/api/portraits/women/2.jpg'
  },
  {
    id: '3',
    employeeNumber: 'EMP-003',
    firstName: 'Michael',
    lastName: 'Johnson',
    birthday: '1985-12-03',
    position: 'Project Manager',
    department: 'Management',
    hourlyRate: 687.5, // ₱687.5 per hour (approximately ₱110k monthly)
    profileImage: 'https://randomuser.me/api/portraits/men/3.jpg'
  },
  {
    id: '4',
    employeeNumber: 'EMP-004',
    firstName: 'Emily',
    lastName: 'Williams',
    birthday: '1993-04-18',
    position: 'Marketing Specialist',
    department: 'Marketing',
    hourlyRate: 500, // ₱500 per hour (approximately ₱80k monthly)
    profileImage: 'https://randomuser.me/api/portraits/women/4.jpg'
  },
  {
    id: '5',
    employeeNumber: 'EMP-005',
    firstName: 'David',
    lastName: 'Brown',
    birthday: '1988-11-30',
    position: 'Accountant',
    department: 'Finance',
    hourlyRate: 531.25, // ₱531.25 per hour (approximately ₱85k monthly)
    profileImage: 'https://randomuser.me/api/portraits/men/5.jpg'
  },
];

// Generate mock time records for a week for each employee
export const generateMockTimeRecords = (): TimeRecord[] => {
  const records: TimeRecord[] = [];
  
  // Generate for the past 7 days
  const today = new Date();
  
  employees.forEach(employee => {
    // Generate a week's worth of time records
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      
      // Skip weekends (Saturday & Sunday)
      const day = date.getDay(); // 0 = Sunday, 6 = Saturday
      if (day === 0 || day === 6) continue;
      
      // Random variation in time in/out
      const getRandomMinutes = (base: number, variance: number) => {
        return base + Math.floor(Math.random() * variance * 2) - variance;
      };
      
      // 20% chance of being late beyond grace period
      const isLate = Math.random() < 0.2;
      const timeInHour = 8;
      const timeInMinute = isLate ? getRandomMinutes(15, 20) : getRandomMinutes(5, 5);
      
      // 10% chance of undertime
      const isUndertime = Math.random() < 0.1;
      const timeOutHour = isUndertime ? 16 : 17;
      const timeOutMinute = isUndertime ? getRandomMinutes(30, 25) : getRandomMinutes(0, 30);
      
      // Format times
      const formatTime = (h: number, m: number) => `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
      
      const timeIn = formatTime(timeInHour, timeInMinute);
      const timeOut = formatTime(timeOutHour, timeOutMinute);
      
      // Calculate late, undertime, and overtime minutes
      const late = isLate ? timeInMinute - 10 : 0; // Beyond 10-minute grace period
      const undertime = isUndertime ? 60 - timeOutMinute : 0;
      const overtime = !isUndertime && timeOutMinute > 0 ? timeOutMinute : 0;
      
      records.push({
        id: `${employee.id}-${date.toISOString().split('T')[0]}`,
        employeeId: employee.id,
        date: date.toISOString().split('T')[0],
        timeIn,
        timeOut,
        late,
        undertime,
        overtime
      });
    }
  });
  
  return records;
};

export const timeRecords = generateMockTimeRecords();

// Retrieve time records for a specific employee
export const getEmployeeTimeRecords = (employeeId: string): TimeRecord[] => {
  return timeRecords.filter(record => record.employeeId === employeeId);
};

// Helper function to get employee by ID
export const getEmployeeById = (id: string): Employee | undefined => {
  return employees.find(employee => employee.id === id);
};
