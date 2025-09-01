import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { toast } from 'sonner';
import { 
  User, 
  Phone, 
  Mail, 
  MapPin, 
  Calendar, 
  Settings, 
  LogOut,
  Star,
  Briefcase,
  Video,
  Upload
} from 'lucide-react';

interface User {
  id: number;
  name: string;
  phone: string;
  email?: string;
  user_type: string;
  is_verified: boolean;
  created_at: string;
}

const Dashboard = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    if (!token) {
      navigate('/login');
      return;
    }

    try {
      const response = await fetch('/auth.php?action=user', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        localStorage.removeItem('authToken');
        navigate('/login');
      }
    } catch (error) {
      toast.error('Failed to load user data');
      navigate('/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/auth.php?action=logout', { method: 'POST' });
    } catch (error) {
      // Ignore logout errors
    }
    
    localStorage.removeItem('authToken');
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  const getUserTypeColor = (userType: string) => {
    switch (userType) {
      case 'mistri': return 'bg-blue-500';
      case 'driver': return 'bg-green-500';
      case 'customer': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getQuickActions = () => {
    if (!user) return [];

    const baseActions = [
      { 
        title: 'Upload Video', 
        description: 'Share your work or skills',
        icon: Video,
        action: () => navigate('/upload-video')
      },
      { 
        title: 'View Profile', 
        description: 'Manage your profile',
        icon: User,
        action: () => navigate('/profile')
      }
    ];

    switch (user.user_type) {
      case 'mistri':
        return [
          ...baseActions,
          { 
            title: 'My Jobs', 
            description: 'View assigned jobs',
            icon: Briefcase,
            action: () => navigate('/my-jobs')
          }
        ];
      case 'driver':
        return [
          ...baseActions,
          { 
            title: 'My Rides', 
            description: 'View ride requests',
            icon: MapPin,
            action: () => navigate('/my-rides')
          }
        ];
      case 'customer':
        return [
          ...baseActions,
          { 
            title: 'Find Services', 
            description: 'Book a mistri or driver',
            icon: Briefcase,
            action: () => navigate('/services')
          }
        ];
      default:
        return baseActions;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-secondary/5">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-primary">Mistri Adda</h1>
          <div className="flex items-center gap-4">
            <Button variant="outline" size="sm" onClick={() => navigate('/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Settings
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="max-w-6xl mx-auto p-6">
        {/* Welcome Section */}
        <div className="mb-8">
          <Card>
            <CardHeader>
              <div className="flex items-center gap-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/api/placeholder/64/64" />
                  <AvatarFallback className={`${getUserTypeColor(user.user_type)} text-white text-lg`}>
                    {user.name.charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <CardTitle className="text-2xl">Welcome back, {user.name}!</CardTitle>
                  <CardDescription className="flex items-center gap-4 mt-2">
                    <Badge variant="secondary" className="capitalize">
                      {user.user_type}
                    </Badge>
                    {user.is_verified ? (
                      <Badge variant="default" className="bg-green-500">
                        ✓ Verified
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        Not Verified
                      </Badge>
                    )}
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4" />
                  {user.phone}
                </div>
                {user.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    {user.email}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Joined {new Date(user.created_at).toLocaleDateString()}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {getQuickActions().map((action, index) => (
              <Card key={index} className="cursor-pointer hover:shadow-md transition-shadow" onClick={action.action}>
                <CardHeader className="pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <action.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <CardTitle className="text-lg">{action.title}</CardTitle>
                      <CardDescription className="text-sm">{action.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
              <Briefcase className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">+0% from last month</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rating</CardTitle>
              <Star className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0.0</div>
              <p className="text-xs text-muted-foreground">No reviews yet</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Videos</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">0</div>
              <p className="text-xs text-muted-foreground">Upload your first video</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Earnings</CardTitle>
              <span className="h-4 w-4 text-muted-foreground">₹</span>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">₹0</div>
              <p className="text-xs text-muted-foreground">Complete jobs to earn</p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your latest activities on Mistri Adda</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-8 text-muted-foreground">
              <p>No recent activity</p>
              <p className="text-sm">Start by uploading a video or booking a service</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;