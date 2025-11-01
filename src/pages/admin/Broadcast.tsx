import { useState } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Textarea } from '../../components/ui/textarea';
import { COLORS } from '../../constants/theme';
import { Bell, Send, Users, User } from 'lucide-react';

export const AdminBroadcast = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [recipientRole, setRecipientRole] = useState<'farmer' | 'buyer' | 'all'>('all');
  const [sending, setSending] = useState(false);

  const handleSendBroadcast = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim() || !message.trim()) {
      toast.error('Please provide both title and message');
      return;
    }

    try {
      setSending(true);
      await adminService.sendBroadcast({
        title: title.trim(),
        message: message.trim(),
        recipientRole,
      });

      toast.success('Broadcast notification sent successfully!');

      // Reset form
      setTitle('');
      setMessage('');
      setRecipientRole('all');
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to send broadcast');
    } finally {
      setSending(false);
    }
  };

  const recipientOptions = [
    { value: 'all', label: 'All Users', icon: Users, color: 'text-purple-600' },
    { value: 'farmer', label: 'Farmers Only', icon: User, color: 'text-green-600' },
    { value: 'buyer', label: 'Buyers Only', icon: User, color: 'text-blue-600' },
  ];

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="text-center">
        <div className="flex items-center justify-center gap-3 mb-4">
          <Bell className="h-10 w-10" style={{ color: COLORS.primary }} />
          <h1 className="text-3xl font-bold">Broadcast Notification</h1>
        </div>
      </div>

      {/* Recipient Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Select Recipients</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recipientOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = recipientRole === option.value;
              return (
                <button
                  key={option.value}
                  onClick={() => setRecipientRole(option.value as typeof recipientRole)}
                  className={`p-6 border-2 rounded-lg transition-all ${
                    isSelected
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-gray-300 bg-white'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3">
                    <Icon className={`h-12 w-12 ${isSelected ? 'text-green-600' : option.color}`} />
                    <span className="font-semibold text-lg">{option.label}</span>
                    {isSelected && (
                      <div className="w-full h-1 bg-green-500 rounded-full mt-2"></div>
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Broadcast Form */}
      <Card>
        <CardHeader>
          <CardTitle>Compose Notification</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSendBroadcast} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">
                Notification Title <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="Enter notification title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={100}
                disabled={sending}
              />
              <p className="text-xs text-gray-500">{title.length}/100 characters</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">
                Message <span className="text-red-500">*</span>
              </Label>
              <Textarea
                id="message"
                placeholder="Enter your message here..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={8}
                maxLength={500}
                disabled={sending}
              />
              <p className="text-xs text-gray-500">{message.length}/500 characters</p>
            </div>

            {/* Preview */}
            {(title || message) && (
              <div className="space-y-2">
                <Label>Preview</Label>
                <div className="p-4 border border-gray-200 rounded-lg bg-gray-50">
                  <div className="flex items-start gap-3">
                    <Bell className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                    <div className="flex-1">
                      {title && <h4 className="font-semibold mb-1">{title}</h4>}
                      {message && (
                        <p className="text-sm text-gray-700 whitespace-pre-wrap">{message}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div className="flex items-center justify-between pt-4 border-t">
              <div className="text-sm text-gray-600">
                Sending to:{' '}
                <span className="font-semibold capitalize">
                  {recipientRole === 'all' ? 'All Users' : `${recipientRole}s`}
                </span>
              </div>
              <Button
                type="submit"
                disabled={sending || !title.trim() || !message.trim()}
                style={{ backgroundColor: COLORS.primary }}
                className="text-white"
              >
                {sending ? (
                  <>
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                    Sending...
                  </>
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Broadcast
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Guidelines */}
      <Card className="bg-blue-50 border-blue-200">
        <CardHeader>
          <CardTitle className="text-blue-900">Broadcasting Guidelines</CardTitle>
        </CardHeader>
        <CardContent className="text-sm text-blue-800 space-y-2">
          <ul className="list-disc list-inside space-y-1">
            <li>Keep your message clear, concise, and relevant</li>
            <li>Use proper grammar and avoid all caps (unless necessary for emphasis)</li>
            <li>Test the preview before sending to ensure proper formatting</li>
            <li>Avoid sending too many broadcasts to prevent notification fatigue</li>
            <li>Use appropriate recipient groups to target the right audience</li>
          </ul>
        </CardContent>
      </Card>

      {/* Examples */}
      <Card>
        <CardHeader>
          <CardTitle>Example Notifications</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-3 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-sm mb-1">Platform Maintenance</h4>
            <p className="text-sm text-gray-700">
              We'll be performing scheduled maintenance on Dec 15, 2024 from 2:00 AM to 4:00 AM. The
              platform may be temporarily unavailable during this time.
            </p>
            <p className="text-xs text-gray-500 mt-2">Recipients: All Users</p>
          </div>
          <div className="p-3 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-sm mb-1">New Feature: Bulk Upload</h4>
            <p className="text-sm text-gray-700">
              Farmers can now upload multiple products at once using our new bulk upload feature!
              Check it out in your dashboard.
            </p>
            <p className="text-xs text-gray-500 mt-2">Recipients: Farmers Only</p>
          </div>
          <div className="p-3 border rounded-lg bg-gray-50">
            <h4 className="font-semibold text-sm mb-1">Holiday Sale Alert</h4>
            <p className="text-sm text-gray-700">
              Special discounts on fresh produce this weekend! Browse our marketplace to find great
              deals from verified farmers.
            </p>
            <p className="text-xs text-gray-500 mt-2">Recipients: Buyers Only</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
