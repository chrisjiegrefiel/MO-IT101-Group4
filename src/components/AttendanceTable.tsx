
import { useState, useEffect } from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TimeRecord } from '@/types/employee';
import { formatDate, formatTime } from '@/utils/dateUtils';
import { motion } from 'framer-motion';

interface AttendanceTableProps {
  timeRecords: TimeRecord[];
}

const AttendanceTable = ({ timeRecords }: AttendanceTableProps) => {
  const [sortedRecords, setSortedRecords] = useState<TimeRecord[]>([]);
  
  useEffect(() => {
    // Sort records by date (newest first)
    const sorted = [...timeRecords].sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });
    setSortedRecords(sorted);
  }, [timeRecords]);
  
  const getStatusBadge = (record: TimeRecord) => {
    // Logic to determine attendance status
    if (record.late > 0) {
      return <Badge variant="destructive" className="font-normal">Late ({record.late} min)</Badge>;
    } else if (record.undertime > 0) {
      return <Badge variant="secondary" className="bg-yellow-500 text-white font-normal">Undertime</Badge>;
    } else if (record.overtime > 0) {
      return <Badge variant="default" className="bg-green-600 font-normal">Overtime</Badge>;
    } else {
      return <Badge variant="outline" className="text-green-700 bg-green-50 border-green-200 font-normal">On Time</Badge>;
    }
  };
  
  return (
    <Card className="w-full overflow-hidden">
      <CardHeader className="bg-muted/50 pb-2 pt-4">
        <CardTitle className="text-lg">Attendance Records</CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table className="table-hover">
            <TableHeader>
              <TableRow>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead>Time In</TableHead>
                <TableHead>Time Out</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Work Hours</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecords.length > 0 ? (
                sortedRecords.map((record, index) => (
                  <motion.tr
                    key={record.id}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="[&>td]:py-3"
                  >
                    <TableCell className="font-medium">{formatDate(record.date)}</TableCell>
                    <TableCell>{formatTime(record.timeIn)}</TableCell>
                    <TableCell>{formatTime(record.timeOut)}</TableCell>
                    <TableCell>{getStatusBadge(record)}</TableCell>
                    <TableCell className="text-right">
                      {/* This is a simplified calculation - the actual calculation is in dateUtils.ts */}
                      {(
                        (parseInt(record.timeOut.split(':')[0]) * 60 + parseInt(record.timeOut.split(':')[1])) - 
                        (parseInt(record.timeIn.split(':')[0]) * 60 + parseInt(record.timeIn.split(':')[1]))
                      ) / 60 - (record.late / 60)}h
                    </TableCell>
                  </motion.tr>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No attendance records found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default AttendanceTable;
