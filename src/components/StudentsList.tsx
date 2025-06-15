
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Users, Mail, User } from 'lucide-react';

interface StudentsListProps {
  profiles: any[];
}

const StudentsList: React.FC<StudentsListProps> = ({ profiles }) => {
  const students = profiles.filter(profile => profile.user_type === 'student');

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Registered Students</h2>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Users size={16} />
          {students.length} student{students.length !== 1 ? 's' : ''} registered
        </div>
      </div>

      {students.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-8">
            <Users size={48} className="text-gray-400 mb-4" />
            <CardTitle className="text-lg text-gray-600 mb-2">No Students Yet</CardTitle>
            <CardDescription>
              Students will appear here once they register for your platform.
            </CardDescription>
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Student Directory</CardTitle>
            <CardDescription>
              View all registered students and their contact information
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Student ID</TableHead>
                  <TableHead>Registration Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((student) => (
                  <TableRow key={student.id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <User size={16} className="text-gray-400" />
                        <span className="font-medium">{student.name}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail size={16} className="text-gray-400" />
                        <span>{student.email}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">
                        {student.student_id || 'N/A'}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-gray-600">
                        {new Date(student.created_at).toLocaleDateString()}
                      </span>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default StudentsList;
