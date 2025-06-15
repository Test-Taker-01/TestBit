
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Mail, User } from 'lucide-react';

interface StudentsListProps {
  profiles: any[];
}

const StudentsList: React.FC<StudentsListProps> = ({ profiles }) => {
  console.log('All profiles in StudentsList:', profiles);
  
  // Filter for students - check for both 'student' and null/undefined user_type as students might be default
  const students = profiles.filter(profile => 
    profile.user_type === 'student' || 
    (profile.user_type !== 'admin' && profile.user_type !== 'teacher')
  );
  
  console.log('Filtered students:', students);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold header-text">Registered Students</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          <span className="proper-line-height">{students.length} student{students.length !== 1 ? 's' : ''} registered</span>
        </div>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Users size={48} className="text-gray-400 mb-4" />
            <CardTitle className="text-lg text-gray-600 mb-2 header-text">No Students Yet</CardTitle>
            <CardDescription className="proper-line-height">
              Students will appear here once they register for your platform.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="header-text">Student Directory</CardTitle>
            <CardDescription className="proper-line-height">
              View all registered students and their contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="proper-line-height">Name</TableHead>
                  <TableHead className="proper-line-height">Email</TableHead>
                  <TableHead className="proper-line-height">Student ID</TableHead>
                  <TableHead className="proper-line-height">Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => {
                  console.log('Rendering student:', student);
                  const studentName = student.name || student.email?.split('@')[0] || 'Unknown Student';
                  const studentEmail = student.email || 'No email';
                  const studentId = student.student_id || student.id || 'N/A';
                  const registrationDate = student.created_at ? new Date(student.created_at).toLocaleDateString() : 'Unknown';
                  
                  return (
                    <TableRow key={student.id || student.user_id}>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <User size={16} className="text-gray-400" />
                          <span className="font-medium proper-line-height">{studentName}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Mail size={16} className="text-gray-400" />
                          <span className="proper-line-height">{studentEmail}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm proper-line-height">
                          {studentId}
                        </span>
                      </TableCell>
                      <TableCell>
                        <span className="text-gray-600 proper-line-height">
                          {registrationDate}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentsList;
