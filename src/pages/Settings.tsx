import React, { useState, useEffect, useRef } from 'react';
import Layout from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/components/ui/use-toast';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/contexts/AuthContext';

// KendoReact imports
import { Button } from '@progress/kendo-react-buttons';
import { Input } from '@progress/kendo-react-inputs';
import { DropDownList } from '@progress/kendo-react-dropdowns';
import { Avatar } from '@progress/kendo-react-layout';
import { Upload } from '@progress/kendo-react-upload';
import { Dialog, DialogActionsBar } from '@progress/kendo-react-dialogs';

interface UserSettings {
  emailNotifications: boolean;
  desktopNotifications: boolean;
  theme: string;
  language: string;
  locationTracking: boolean;
}

interface UserProfile {
  email: string;
  username: string;
  fullName: string;
  profilePicture: string;
  country: string;
  timezone: string;
  location: {
    enabled: boolean;
    coordinates: [number, number];
    lastUpdated: string;
  };
}

const languageOptions = [
  { text: 'English', value: 'en' },
  { text: 'Spanish', value: 'es' },
  { text: 'French', value: 'fr' }
];

const themeOptions = [
  { text: 'Light', value: 'light' },
  { text: 'Dark', value: 'dark' }
];

const timezoneOptions = [
  { text: 'UTC', value: 'UTC' },
  { text: 'Eastern Time', value: 'America/New_York' },
  { text: 'Central Time', value: 'America/Chicago' },
  { text: 'Mountain Time', value: 'America/Denver' },
  { text: 'Pacific Time', value: 'America/Los_Angeles' }
];

// Helper function to resize images
const resizeImage = async (dataUrl: string, maxWidth = 800, maxHeight = 800, quality = 0.85): Promise<string> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.src = dataUrl;
    img.onload = () => {
      let width = img.width;
      let height = img.height;
      
      // Calculate new dimensions
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round(height * maxWidth / width);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round(width * maxHeight / height);
          height = maxHeight;
        }
      }
      
      const canvas = document.createElement('canvas');
      canvas.width = width;
      canvas.height = height;
      
      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Could not create canvas context'));
        return;
      }
      
      ctx.drawImage(img, 0, 0, width, height);
      
      // Get the MIME type from the original data URL
      const mimeMatch = dataUrl.match(/^data:([^;]+);/);
      const mime = mimeMatch ? mimeMatch[1] : 'image/jpeg';
      
      resolve(canvas.toDataURL(mime, quality));
    };
    img.onerror = () => reject(new Error('Failed to load image'));
  });
};

const Settings = () => {
  const { toast } = useToast();
  const { user, updateUser, token } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [showImageEditor, setShowImageEditor] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  
  const [settings, setSettings] = useState<UserSettings>({
    emailNotifications: true,
    desktopNotifications: true,
    theme: 'light',
    language: 'en',
    locationTracking: false,
  });
  
  const [profile, setProfile] = useState<UserProfile>({
    email: '',
    username: '',
    fullName: '',
    profilePicture: '',
    country: '',
    timezone: '',
    location: {
      enabled: false,
      coordinates: [0, 0],
      lastUpdated: new Date().toISOString(),
    },
  });
  
  const [passwords, setPasswords] = useState({
    current: '',
    new: '',
    confirm: '',
  });

  useEffect(() => {
    const loadSettings = async () => {
      if (!token) {
        setInitialLoading(false);
        return;
      }
      
      try {
        const response = await fetch('http://localhost:3001/frontend/user/settings', {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
        
        if (!response.ok) {
          throw new Error('Failed to load settings');
        }

        const data = await response.json();
        setSettings(data.settings);
        setProfile(data.profile);
      } catch (error) {
        console.error('Error loading settings:', error);
        toast({
          title: 'Error',
          description: 'Failed to load settings. Please try again.',
          variant: 'destructive',
        });
      } finally {
        setInitialLoading(false);
      }
    };

    loadSettings();
  }, [toast, token]);

  const handleSaveSettings = async () => {
    if (passwords.new && passwords.new !== passwords.confirm) {
      toast({
        title: 'Error',
        description: 'New passwords do not match.',
        variant: 'destructive',
      });
      return;
    }

    if (!token) {
      toast({
        title: 'Error',
        description: 'Authentication token is missing. Please log in again.',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/frontend/user/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          settings,
          profile,
          currentPassword: passwords.current || undefined,
          newPassword: passwords.new || undefined,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new Error(errorData?.message || 'Failed to save settings');
      }

      const data = await response.json();
      setSettings(data.settings);
      setProfile(data.profile);
      
      // Update user in auth context if available
      if (updateUser) {
        updateUser({
          ...user,
          profilePicture: data.profile.profilePicture,
          fullName: data.profile.fullName
        });
      }
      
      // Clear password fields
      setPasswords({ current: '', new: '', confirm: '' });
      
      toast({
        title: 'Settings saved',
        description: 'Your preferences have been updated successfully.',
      });

      // Apply theme change immediately
      document.documentElement.classList.toggle('dark', settings.theme === 'dark');
    } catch (error) {
      console.error('Error saving settings:', error);
      toast({
        title: 'Error',
        description: error instanceof Error ? error.message : 'Failed to save settings. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLocationToggle = async (enabled: boolean) => {
    setSettings(prev => ({ ...prev, locationTracking: enabled }));
    
    if (enabled) {
      try {
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject);
        });

        const { latitude, longitude } = position.coords;
        setProfile(prev => ({
          ...prev,
          location: {
            ...prev.location,
            enabled,
            coordinates: [longitude, latitude],
            lastUpdated: new Date().toISOString(),
          },
        }));
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to get location. Please enable location access.',
          variant: 'destructive',
        });
        setSettings(prev => ({ ...prev, locationTracking: false }));
      }
    }
  };

  const handleProfilePictureClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      try {
        // Check file size before proceeding
        if (file.size > 10 * 1024 * 1024) { // 10MB limit
          toast({
            title: 'Error',
            description: 'Image size too large. Maximum size is 10MB.',
            variant: 'destructive',
          });
          return;
        }
        
        // Read file as data URL
        const originalDataUrl = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => {
            if (typeof reader.result === 'string') {
              resolve(reader.result);
            } else {
              reject(new Error('Failed to read file'));
            }
          };
          reader.onerror = reject;
          reader.readAsDataURL(file);
        });
        
        // Resize the image
        const resizedDataUrl = await resizeImage(originalDataUrl);
        
        setImagePreview(resizedDataUrl);
        setShowImageEditor(true);
      } catch (error) {
        toast({
          title: 'Error',
          description: 'Failed to process image. Please try another file.',
          variant: 'destructive',
        });
      }
    }
  };

  const handleSaveImage = () => {
    if (imagePreview) {
      setProfile(prev => ({
        ...prev,
        profilePicture: imagePreview
      }));
      setShowImageEditor(false);
    }
  };

  const handleCancelImage = () => {
    setImagePreview(null);
    setShowImageEditor(false);
  };

  if (initialLoading) {
    return (
      <Layout>
        <div className="container mx-auto py-6">
          <div className="animate-pulse">
            <div className="h-8 w-48 bg-gray-200 dark:bg-gray-700 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
              <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto py-6 animate-fade-up">
        <h1 className="text-3xl font-bold mb-6 text-[#014D71] dark:text-[#014D71]/90">Settings</h1>
        
        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList className="bg-[#014D71]/10 dark:bg-[#014D71]/20">
            <TabsTrigger value="profile" className="hover-button">Profile</TabsTrigger>
            <TabsTrigger value="security" className="hover-button">Security</TabsTrigger>
            <TabsTrigger value="notifications" className="hover-button">Notifications</TabsTrigger>
            <TabsTrigger value="appearance" className="hover-button">Appearance</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="animate-slide-in">
            <Card className="hover-card">
              <CardHeader>
                <CardTitle className="text-[#014D71] dark:text-[#014D71]/90">Profile Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-4 animate-fade-up">
                  <div className="relative cursor-pointer hover-button" onClick={handleProfilePictureClick}>
                    <div className="rounded-full overflow-hidden w-24 h-24">
                      <img 
                        src={profile.profilePicture || 'https://via.placeholder.com/100'} 
                        alt="Profile" 
                        className="w-full h-full object-cover transition-all duration-300 hover:scale-110"
                      />
                    </div>
                    <input
                      type="file"
                      ref={fileInputRef}
                      className="hidden"
                      accept="image/*"
                      onChange={handleFileChange}
                      aria-label="Upload profile picture"
                      title="Upload profile picture"
                    />
                    <div className="absolute bottom-0 right-0 bg-[#014D71] text-white rounded-full p-1 hover:scale-110 transition-transform">
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                        <circle cx="8.5" cy="7" r="4"></circle>
                        <line x1="20" y1="8" x2="20" y2="14"></line>
                        <line x1="23" y1="11" x2="17" y2="11"></line>
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p className="font-medium text-[#014D71] dark:text-[#014D71]/90">{profile.fullName || profile.username}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{profile.email}</p>
                  </div>
                </div>
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={profile.fullName}
                    onChange={(e) => setProfile({ ...profile, fullName: e.value })}
                    className="w-full focus-input"
                  />
                </div>
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    value={profile.email}
                    disabled
                    className="w-full focus-input"
                  />
                </div>
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="country">Country</Label>
                  <Input
                    id="country"
                    value={profile.country}
                    onChange={(e) => setProfile({ ...profile, country: e.value })}
                    className="w-full focus-input"
                  />
                </div>
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="timezone">Timezone</Label>
                  <DropDownList
                    id="timezone"
                    data={timezoneOptions}
                    textField="text"
                    dataItemKey="value"
                    value={timezoneOptions.find(tz => tz.value === profile.timezone)}
                    onChange={(e) => setProfile({ ...profile, timezone: e.value.value })}
                    className="w-full focus-input"
                  />
                </div>
                <div className="flex items-center justify-between animate-fade-up">
                  <div>
                    <Label htmlFor="location-tracking">Location Tracking</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Allow the app to track your location</p>
                  </div>
                  <Switch
                    id="location-tracking"
                    checked={settings.locationTracking}
                    onCheckedChange={handleLocationToggle}
                  />
                </div>
                {settings.locationTracking && profile.location.lastUpdated && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 animate-fade-up">
                    Last updated: {new Date(profile.location.lastUpdated).toLocaleString()}
                  </p>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security" className="animate-slide-in">
            <Card className="hover-card">
              <CardHeader>
                <CardTitle className="text-[#014D71] dark:text-[#014D71]/90">Change Password</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="current-password">Current Password</Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={passwords.current}
                    onChange={(e) => setPasswords({ ...passwords, current: e.value })}
                    className="w-full focus-input"
                  />
                </div>
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="new-password">New Password</Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={passwords.new}
                    onChange={(e) => setPasswords({ ...passwords, new: e.value })}
                    className="w-full focus-input"
                  />
                </div>
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="confirm-password">Confirm New Password</Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={passwords.confirm}
                    onChange={(e) => setPasswords({ ...passwords, confirm: e.value })}
                    className="w-full focus-input"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="notifications" className="animate-slide-in">
            <Card className="hover-card">
              <CardHeader>
                <CardTitle className="text-[#014D71] dark:text-[#014D71]/90">Notification Preferences</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between animate-fade-up">
                  <Label htmlFor="email-notifications">Email Notifications</Label>
                  <Switch
                    id="email-notifications"
                    checked={settings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, emailNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between animate-fade-up">
                  <Label htmlFor="desktop-notifications">Desktop Notifications</Label>
                  <Switch
                    id="desktop-notifications"
                    checked={settings.desktopNotifications}
                    onCheckedChange={(checked) =>
                      setSettings({ ...settings, desktopNotifications: checked })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="appearance" className="animate-slide-in">
            <Card className="hover-card">
              <CardHeader>
                <CardTitle className="text-[#014D71] dark:text-[#014D71]/90">Appearance Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="language">Language</Label>
                  <DropDownList
                    id="language"
                    data={languageOptions}
                    textField="text"
                    dataItemKey="value"
                    value={languageOptions.find(lang => lang.value === settings.language)}
                    onChange={(e) => setSettings({ ...settings, language: e.value.value })}
                    className="w-full focus-input"
                  />
                </div>
                <div className="space-y-2 animate-fade-up">
                  <Label htmlFor="theme">Theme</Label>
                  <DropDownList
                    id="theme"
                    data={themeOptions}
                    textField="text"
                    dataItemKey="value"
                    value={themeOptions.find(theme => theme.value === settings.theme)}
                    onChange={(e) => setSettings({ ...settings, theme: e.value.value })}
                    className="w-full focus-input"
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-6">
          <Button
            onClick={handleSaveSettings}
            disabled={loading}
            themeColor="primary"
            className="hover-button bg-[#014D71] hover:bg-[#014D71]/90 text-white"
          >
            {loading ? (
              <span className="flex items-center">
                <span className="loading-spinner mr-2">⌛</span>
                Saving...
              </span>
            ) : (
              'Save Settings'
            )}
          </Button>
        </div>
      </div>

      {showImageEditor && imagePreview && (
        <Dialog title="Edit Profile Picture" onClose={handleCancelImage}>
          <div className="p-4">
            <div className="flex justify-center mb-4">
              <img 
                src={imagePreview} 
                alt="Profile Preview" 
                className="rounded-full w-32 h-32 object-cover animate-scale" 
              />
            </div>
          </div>
          <DialogActionsBar>
            <Button onClick={handleCancelImage} className="hover-button">Cancel</Button>
            <Button 
              onClick={handleSaveImage}
              className="hover-button bg-[#014D71] hover:bg-[#014D71]/90 text-white"
            >
              Save Image
            </Button>
          </DialogActionsBar>
        </Dialog>
      )}
    </Layout>
  );
};

export default Settings; 