import { useState } from 'react';
import { X, Plus, Trash2, Edit } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { toast } from 'sonner@2.0.3';

interface Project {
  id: number;
  title: string;
  description: string;
  image: string;
  category: string;
}

const initialProjects: Project[] = [
  {
    id: 1,
    title: 'Торговый центр "Горизонт"',
    description: 'Комплексная реконструкция фасада и внутренних помещений',
    image: 'https://images.unsplash.com/photo-1677381667267-5b922eb18eae?crop=entropy&cs=tinysrgb&fit=max&fm=jpg',
    category: 'Торговые помещения',
  },
  {
    id: 2,
    title: 'Бизнес-центр "Альфа"',
    description: 'Устройство вентилируемого фасада и благоустройство территории',
    image: 'https://images.unsplash.com/photo-1694702730868-a34da58c1427?crop=entropy&cs=tinysrgb&fit=max&fm=jpg',
    category: 'Офисные здания',
  },
];

interface AdminPanelProps {
  onClose: () => void;
}

export function AdminPanel({ onClose }: AdminPanelProps) {
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    image: '',
    category: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleAddProject = () => {
    if (!formData.title || !formData.description || !formData.image || !formData.category) {
      toast.error('Заполните все поля');
      return;
    }

    const newProject: Project = {
      id: Date.now(),
      ...formData,
    };

    setProjects(prev => [...prev, newProject]);
    setFormData({ title: '', description: '', image: '', category: '' });
    setIsAddDialogOpen(false);
    toast.success('Проект добавлен');
  };

  const handleEditProject = () => {
    if (!editingProject) return;
    
    setProjects(prev => prev.map(p => 
      p.id === editingProject.id 
        ? { ...p, ...formData }
        : p
    ));
    
    setEditingProject(null);
    setFormData({ title: '', description: '', image: '', category: '' });
    toast.success('Проект обновлён');
  };

  const handleDeleteProject = (id: number) => {
    setProjects(prev => prev.filter(p => p.id !== id));
    toast.success('Проект удалён');
  };

  const startEdit = (project: Project) => {
    setEditingProject(project);
    setFormData({
      title: project.title,
      description: project.description,
      image: project.image,
      category: project.category,
    });
  };

  const cancelEdit = () => {
    setEditingProject(null);
    setFormData({ title: '', description: '', image: '', category: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-blue-600 text-white py-4 px-4 sticky top-0 z-50 shadow-lg">
        <div className="container mx-auto flex items-center justify-between">
          <h1 className="text-2xl">Панель администратора</h1>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="text-white hover:bg-blue-700"
          >
            <X className="w-6 h-6" />
          </Button>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-2xl">Управление проектами</CardTitle>
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Добавить проект
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Добавить новый проект</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 mt-4">
                  <Input
                    name="title"
                    placeholder="Название проекта"
                    value={formData.title}
                    onChange={handleInputChange}
                  />
                  <Input
                    name="category"
                    placeholder="Категория"
                    value={formData.category}
                    onChange={handleInputChange}
                  />
                  <Textarea
                    name="description"
                    placeholder="Описание проекта"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                  />
                  <Input
                    name="image"
                    placeholder="URL изображения"
                    value={formData.image}
                    onChange={handleInputChange}
                  />
                  <Button onClick={handleAddProject} className="w-full bg-blue-600 hover:bg-blue-700">
                    Добавить
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id} className="border rounded-lg p-4">
                  {editingProject?.id === project.id ? (
                    <div className="space-y-4">
                      <Input
                        name="title"
                        value={formData.title}
                        onChange={handleInputChange}
                        placeholder="Название проекта"
                      />
                      <Input
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        placeholder="Категория"
                      />
                      <Textarea
                        name="description"
                        value={formData.description}
                        onChange={handleInputChange}
                        placeholder="Описание"
                        rows={3}
                      />
                      <Input
                        name="image"
                        value={formData.image}
                        onChange={handleInputChange}
                        placeholder="URL изображения"
                      />
                      <div className="flex gap-2">
                        <Button onClick={handleEditProject} className="bg-blue-600 hover:bg-blue-700">
                          Сохранить
                        </Button>
                        <Button onClick={cancelEdit} variant="outline">
                          Отмена
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start gap-4">
                      <img 
                        src={project.image} 
                        alt={project.title}
                        className="w-32 h-24 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="inline-block px-2 py-1 bg-blue-100 text-blue-600 text-xs rounded mb-2">
                          {project.category}
                        </div>
                        <h3 className="text-lg mb-1">{project.title}</h3>
                        <p className="text-gray-600 text-sm">{project.description}</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => startEdit(project)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-600 hover:bg-red-50"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-sm text-yellow-800">
            <strong>Примечание:</strong> Изменения сохраняются только в текущей сессии. 
            Для постоянного хранения данных необходимо подключение к базе данных.
          </p>
        </div>
      </div>
    </div>
  );
}
