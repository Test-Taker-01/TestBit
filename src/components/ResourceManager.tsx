
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, BookOpen, FileText, Video, Link, Trash2 } from 'lucide-react';

interface ResourceManagerProps {
  resources: any[];
  onAddResource: (resource: any) => void;
}

const ResourceManager: React.FC<ResourceManagerProps> = ({ resources, onAddResource }) => {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newResource, setNewResource] = useState({
    title: '',
    description: '',
    type: 'document',
    url: '',
    content: ''
  });

  const handleAddResource = () => {
    if (newResource.title && (newResource.url || newResource.content)) {
      const resource = {
        id: Date.now().toString(),
        ...newResource,
        createdAt: new Date().toISOString()
      };
      onAddResource(resource);
      setNewResource({
        title: '',
        description: '',
        type: 'document',
        url: '',
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
        <Button onClick={() => setShowAddDialog(true)} className="flex items-center gap-2">
          <Plus size={16} />
          Add Resource
        </Button>
      </div>

      <div className="grid gap-4">
        {resources.length === 0 ? (
          <Card>
            <CardContent className="text-center py-8">
              <BookOpen size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-gray-500">No resources yet. Add your first resource to help students learn!</p>
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
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getResourceTypeColor(resource.type)}`}>
                      {resource.type}
                    </span>
                    <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                      <Trash2 size={16} />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">
                    Added: {new Date(resource.createdAt).toLocaleDateString()}
                  </span>
                  <div className="space-x-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button size="sm">
                      View
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Resource</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Title</label>
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

            {(newResource.type === 'link' || newResource.type === 'video') && (
              <div>
                <label className="text-sm font-medium">URL</label>
                <Input
                  value={newResource.url}
                  onChange={(e) => setNewResource({...newResource, url: e.target.value})}
                  placeholder="Enter URL"
                />
              </div>
            )}

            {newResource.type === 'document' && (
              <div>
                <label className="text-sm font-medium">Content</label>
                <Textarea
                  value={newResource.content}
                  onChange={(e) => setNewResource({...newResource, content: e.target.value})}
                  placeholder="Enter document content"
                  rows={5}
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
    </div>
  );
};

export default ResourceManager;
