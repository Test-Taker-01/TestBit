import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, BookOpen, FileText, Video, Link, Trash2, ExternalLink, Calendar, Edit3 } from 'lucide-react';

interface ResourceManagerProps {
  resources: any[];
  onAddResource: (resource: any) => void;
  onUpdateResource?: (resource: any) => void;
  onDeleteResource?: (resourceId: string) => void;
  userType?: 'teacher' | 'student';
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ 
  resources, 
  onAddResource, 
  onUpdateResource,
  onDeleteResource,
  userType = 'teacher' 
}) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [editingResource, setEditingResource] = useState<any>(null);
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
      if (editingResource) {
        // Update existing resource
        const updatedResource = {
          ...editingResource,
          ...newResource,
          updated_at: new Date().toISOString()
        };
        onUpdateResource?.(updatedResource);
      } else {
        // Add new resource
        const resource = {
          id: Date.now().toString(),
          ...newResource,
          createdAt: new Date().toISOString()
        };
        onAddResource(resource);
      }
      
      setNewResource({
        title: '',
        description: '',
        subject: '',
        course: '',
        type: 'document',
        driveLink: '',
        content: ''
      });
      setEditingResource(null);
      setShowAddDialog(false);
    }
  };

  const handleEditResource = (resource: any) => {
    setEditingResource(resource);
    setNewResource({
      title: resource.title || '',
      description: resource.description || '',
      subject: resource.subject || '',
      course: resource.course || '',
      type: resource.type || 'document',
      driveLink: resource.drive_link || resource.driveLink || '',
      content: resource.content || ''
    });
    setShowAddDialog(true);
  };

  const handleDeleteResource = (resourceId: string) => {
    if (window.confirm('Are you sure you want to delete this resource?')) {
      onDeleteResource?.(resourceId);
    }
  };

  const handleCloseDialog = () => {
    setShowAddDialog(false);
    setEditingResource(null);
    setNewResource({
      title: '',
      description: '',
      subject: '',
      course: '',
      type: 'document',
      driveLink: '',
      content: ''
    });
  };

  const getResourceIcon = (type: string) => {
    switch (type) {
      case 'video':
        return <Video size={20} className="text-red-600" />;
      case 'link':
        return <Link size={20} className="text-blue-600" />;
      case 'document':
      default:
        return <FileText size={20} className="text-green-600" />;
    }
  };

  const getResourceTypeColor = (type: string) => {
    switch (type) {
      case 'video':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'link':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'document':
      default:
        return 'bg-green-100 text-green-800 border-green-200';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Resource Management</h2>
          <p className="text-gray-500 mt-1">Manage your educational resources and materials</p>
        </div>
        {userType === 'teacher' && (
          <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700">
            <Plus size={16} />
            Add Resource
          </Button>
        )}
      </div>

      <div className="grid gap-6">
        {resources.length === 0 ? (
          <Card className="border-dashed border-2 border-gray-300">
            <CardContent className="text-center py-12">
              <BookOpen size={64} className="mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-semibold text-gray-700 mb-2">No Resources Yet</h3>
              <p className="text-gray-500 mb-4">
                {userType === 'teacher' 
                  ? "Start building your resource library by adding your first educational material." 
                  : "No resources are available at the moment."}
              </p>
              {userType === 'teacher' && (
                <Button onClick={() => setShowAddDialog(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus size={16} className="mr-2" />
                  Add Your First Resource
                </Button>
              )}
            </CardContent>
          </Card>
        ) : (
          resources.map((resource) => (
            <Card key={resource.id} className="hover:shadow-lg transition-shadow duration-200 border-l-4 border-l-blue-500">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start">
                  <div className="flex items-start gap-4 flex-1">
                    <div className="p-2 bg-gray-50 rounded-lg">
                      {getResourceIcon(resource.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-2">
                        <CardTitle className="text-lg font-semibold text-gray-900 truncate">
                          {resource.title}
                        </CardTitle>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getResourceTypeColor(resource.type)}`}>
                          {resource.type}
                        </span>
                      </div>
                      {resource.description && (
                        <CardDescription className="text-sm text-gray-600 mb-3 line-clamp-2">
                          {resource.description}
                        </CardDescription>
                      )}
                      <div className="flex flex-wrap gap-2">
                        <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                          <span className="font-medium">Subject:</span>
                          <span>{resource.subject}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                          <span className="font-medium">Course:</span>
                          <span>{resource.course}</span>
                        </div>
                        <div className="flex items-center gap-1 text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-md">
                          <Calendar size={12} />
                          <span>{new Date(resource.created_at || resource.createdAt).toLocaleDateString()}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  {userType === 'teacher' && (
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-red-600 hover:text-red-800 hover:bg-red-50"
                      onClick={() => handleDeleteResource(resource.id)}
                    >
                      <Trash2 size={16} />
                    </Button>
                  )}
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex justify-end items-center gap-2">
                  {userType === 'teacher' && (
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="flex items-center gap-2"
                      onClick={() => handleEditResource(resource)}
                    >
                      <Edit3 size={14} />
                      Edit
                    </Button>
                  )}
                  {resource.drive_link || resource.driveLink ? (
                    <Button 
                      size="sm" 
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700"
                      onClick={() => window.open(resource.drive_link || resource.driveLink, '_blank')}
                    >
                      <ExternalLink size={14} />
                      Open Link
                    </Button>
                  ) : (
                    userType === 'teacher' && (
                      <Button size="sm" variant="outline" className="flex items-center gap-2">
                        <FileText size={14} />
                        View Content
                      </Button>
                    )
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {userType === 'teacher' && (
        <Dialog open={showAddDialog} onOpenChange={handleCloseDialog}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-xl font-semibold">
                {editingResource ? 'Edit Resource' : 'Add New Resource'}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Subject *</label>
                  <Input
                    value={newResource.subject}
                    onChange={(e) => setNewResource({...newResource, subject: e.target.value})}
                    placeholder="e.g., Mathematics"
                    className="w-full"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Course *</label>
                  <Input
                    value={newResource.course}
                    onChange={(e) => setNewResource({...newResource, course: e.target.value})}
                    placeholder="e.g., Algebra 1"
                    className="w-full"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Title *</label>
                <Input
                  value={newResource.title}
                  onChange={(e) => setNewResource({...newResource, title: e.target.value})}
                  placeholder="Enter resource title"
                  className="w-full"
                />
              </div>
              
              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Description</label>
                <Textarea
                  value={newResource.description}
                  onChange={(e) => setNewResource({...newResource, description: e.target.value})}
                  placeholder="Enter resource description"
                  rows={3}
                  className="w-full"
                />
              </div>

              <div>
                <label className="text-sm font-medium text-gray-700 mb-1 block">Type</label>
                <Select value={newResource.type} onValueChange={(value) => setNewResource({...newResource, type: value})}>
                  <SelectTrigger className="w-full">
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
                <label className="text-sm font-medium text-gray-700 mb-1 block">Drive Link *</label>
                <Input
                  value={newResource.driveLink}
                  onChange={(e) => setNewResource({...newResource, driveLink: e.target.value})}
                  placeholder="https://drive.google.com/..."
                  className="w-full"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Paste the Google Drive or other cloud storage link here
                </p>
              </div>

              {newResource.type === 'document' && (
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Additional Content (Optional)</label>
                  <Textarea
                    value={newResource.content}
                    onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                    placeholder="Enter additional document content or notes"
                    rows={4}
                    className="w-full"
                  />
                </div>
              )}

              <div className="flex justify-end gap-4 pt-4">
                <Button variant="outline" onClick={handleCloseDialog}>
                  Cancel
                </Button>
                <Button onClick={handleAddResource} className="bg-blue-600 hover:bg-blue-700">
                  {editingResource ? 'Update Resource' : 'Add Resource'}
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
