
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { Key, Eye, EyeClosed } from 'lucide-react';

const TeacherCodeManager = () => {
  const { user } = useAuth();
  const [currentCode, setCurrentCode] = useState('');
  const [newCode, setNewCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [showCurrentCode, setShowCurrentCode] = useState(false);
  const [showNewCode, setShowNewCode] = useState(false);

  useEffect(() => {
    fetchCurrentCode();
  }, []);

  const fetchCurrentCode = async () => {
    try {
      const { data, error } = await supabase.rpc('get_teacher_special_code');
      
      if (error) {
        console.error('Error fetching current code:', error);
        toast({
          title: "Error",
          description: "Failed to fetch current special code",
          variant: "destructive"
        });
        return;
      }

      setCurrentCode(data || '');
    } catch (error) {
      console.error('Error fetching current code:', error);
    }
  };

  const handleUpdateCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newCode.trim()) return;

    setLoading(true);
    try {
      const { error } = await supabase
        .from('teacher_settings')
        .update({
          special_code: newCode.trim(),
          updated_by: user.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', (await supabase.from('teacher_settings').select('id').single()).data?.id);

      if (error) {
        toast({
          title: "Error",
          description: "Failed to update special code: " + error.message,
          variant: "destructive"
        });
        return;
      }

      setCurrentCode(newCode.trim());
      setNewCode('');
      toast({
        title: "Code Updated",
        description: "Teacher special code has been updated successfully",
      });
    } catch (error) {
      console.error('Error updating special code:', error);
      toast({
        title: "Error",
        description: "Failed to update special code",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Key size={20} />
          Teacher Special Code
        </CardTitle>
        <CardDescription>
          Manage the special code required for teacher registration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Current Special Code</Label>
          <div className="relative">
            <Input
              type={showCurrentCode ? "text" : "password"}
              value={currentCode}
              readOnly
              className="bg-gray-50 pr-10"
            />
            <button
              type="button"
              onClick={() => setShowCurrentCode(!showCurrentCode)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showCurrentCode ? <EyeClosed size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        <form onSubmit={handleUpdateCode} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="newCode" className="text-sm font-medium">
              New Special Code
            </Label>
            <div className="relative">
              <Input
                id="newCode"
                type={showNewCode ? "text" : "password"}
                value={newCode}
                onChange={(e) => setNewCode(e.target.value)}
                placeholder="Enter new special code"
                required
                className="pr-10"
              />
              <button
                type="button"
                onClick={() => setShowNewCode(!showNewCode)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showNewCode ? <EyeClosed size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <Button type="submit" disabled={loading || !newCode.trim()} className="w-full">
            {loading ? 'Updating...' : 'Update Special Code'}
          </Button>
        </form>

        <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
          <p className="font-medium mb-1">Important:</p>
          <p>
            This code is required for new teachers to register. Make sure to share it securely 
            with authorized personnel only.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeacherCodeManager;
