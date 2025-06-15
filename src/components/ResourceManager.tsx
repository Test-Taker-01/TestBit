
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, BookOpen, FileText, Video, Link, Trash2, ExternalLink } from 'lucide-react';

interface ResourceManagerProps {
  resources: any[];
  onAddResource: (resource: any) => void;
  userType?: 'teacher' | 'student';
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ resources, onAddResource, userType = 'teacher' }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    subject: '',
    course: '',
    type: 'document',
    driveLink: '',
    content: ''
  });

  const handleAddResource = () => {
    if (newResource.title && newResource.subject && newResource.course && (newResource.driveLink || newResource.content)) {
      const resource = {
        id: Date.now().toString(),
        ...newResource,
        createdAt: new Date().toISOString()
      };
      onAddResource(resource);
      setNewResource({
        title: '',
        description: '',
        subject: '',
        course: '',
        type: 'document',
        driveLink: '',
        content: ''
      });
      setShowAddDialog(false);
    }
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={20} />;
      case 'link':
        return <Link size={20} />;
      case 'document':
      default:
        return <FileText size={20} />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800';
      case 'link':
        return 'bg-blue-100 text-blue-800';
      case 'document':
      default:
        return 'bg-green-100 text-green-800';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Resource Management</h2>
        {userType === 'teacher' && (
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
            <Plus size={16} />
            Add Resource
          </Button>
        )}
      </div>

      <div className="grid gap-4">
        {resources.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">
                {userType === 'teacher' 
                  ? "No resources yet. Add your first resource to help students learn!" 
                  : "No resources available yet."}
              </p>
            </CardContent>
          </Card>
        ) : (
          resources.map((resource) => (
            <Card key={resource.id}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div className="flex items-center gap-3">
                    {getResourceIcon(resource.type)}
                    <div>
                      <CardTitle>{resource.title}</CardTitle>
                      <CardDescription>{resource.description}</CardDescription>
                      <div className="flex gap-2 mt-2">
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Subject: {resource.subject}
                        </span>
                        <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                          Course: {resource.course}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResourceTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                    {userType === 'teacher' && (
                      <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                        <Trash2 size={16} />
                      </Button>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Added: {new Date(resource.created_at || resource.createdAt).toLocaleDateString()}
                  </span>
                  <div className="space-x-2">
                    {userType === 'teacher' && (
                      <Button variant="outline" size="sm">
                        Edit
                      </Button>
                    )}
                    {resource.drive_link || resource.driveLink ? (
                      <Button 
                        size="sm" 
                        className="flex items-center gap-2"
                        onClick={() => window.open(resource.drive_link || resource.driveLink, '_blank')}
                      >
                        <ExternalLink size={14} />
                        Open Link
                      </Button>
                    ) : null}
                    {userType === 'teacher' && !(resource.drive_link || resource.driveLink) && (
                      <Button size="sm">
                        View Content
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {userType === 'teacher' && (
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium">Subject *</label>
                  <Input
                    value={newResource.subject}
                    onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                    placeholder="e.g., Mathematics"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Course *</label>
                  <Input
                    value={newResource.course}
                    onChange={(e) => setNewResource({...newResource, course: e.target.value})}
                    placeholder="e.g., Algebra 1"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium">Title *</label>
                <Input
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  placeholder="Enter resource title"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium">Description</label>
                <Textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  placeholder="Enter resource description"
                  rows={3}
                />
              </div>

              <div>
                <label className="text-sm font-medium">Type</label>
                <Select value={newResource.type} onValueChange={(value) => setNewResource({...newResource, type: value})}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="document">Document</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="link">Link</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium">Drive Link *</label>
                <Input
                  value={newResource.driveLink}
                  onChange={(e) => setNewResource({...newResource, driveLink: e.target.value})}
                  placeholder="https://drive.google.com/..."
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the Google Drive or other cloud storage link here
                </p>
              </div>

              {newResource.type === 'document' && (
                <div>
                  <label className="text-sm font-medium">Additional Content (Optional)</label>
                  <Textarea
                    value={newResource.content}
                    onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                    placeholder="Enter additional document content or notes"
                    rows={4}
                  />
                </div>
              )}

              <div className="flex justify-end gap-4">
                <Button variant="outline" onClick={() => setShowAddDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={handleAddResource}>
                  Add Resource
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
};

export default ResourceManager;
