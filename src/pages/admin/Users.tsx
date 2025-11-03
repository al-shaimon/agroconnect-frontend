import { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { toast } from 'react-toastify';
import type { User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { COLORS } from '../../constants/theme';
import {
  Users as UsersIcon,
  Search,
  Filter,
  CheckCircle,
  XCircle,
  Trash2,
  Shield,
  Eye,
} from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../../components/ui/alert-dialog';

export const AdminUsers = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [filterRole, setFilterRole] = useState<string>('all');
  const [filterVerified, setFilterVerified] = useState<string>('all');
  const [filterActive, setFilterActive] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [userToDelete, setUserToDelete] = useState<User | null>(null);

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterRole, filterVerified, filterActive]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const params: { role?: string; isVerified?: boolean; isActive?: boolean } = {};
      if (filterRole !== 'all') params.role = filterRole;
      if (filterVerified !== 'all') params.isVerified = filterVerified === 'true';
      if (filterActive !== 'all') params.isActive = filterActive === 'true';

      const response = await adminService.getUsers(params);
      setUsers(response.data || []);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyUser = async (userId: string) => {
    if (!confirm('Are you sure you want to verify this user?')) return;

    try {
      setProcessing(true);
      await adminService.verifyUser(userId);
      toast.success('User verified successfully');
      fetchUsers();
      setShowUserDialog(false);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to verify user');
    } finally {
      setProcessing(false);
    }
  };

  const handleToggleStatus = async (userId: string, currentStatus: boolean) => {
    const action = currentStatus ? 'deactivate' : 'activate';
    if (!confirm(`Are you sure you want to ${action} this user?`)) return;

    try {
      setProcessing(true);
      await adminService.updateUserStatus(userId, !currentStatus);
      toast.success(`User ${action}d successfully`);
      fetchUsers();
      setShowUserDialog(false);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setProcessing(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!userToDelete) return;

    try {
      setProcessing(true);
      await adminService.deleteUser(userToDelete._id);
      toast.success('User deleted successfully');
      fetchUsers();
      setUserToDelete(null);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete user');
    } finally {
      setProcessing(false);
    }
  };

  const viewUserDetails = (user: User) => {
    setSelectedUser(user);
    setShowUserDialog(true);
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    return date.toLocaleDateString('en-US', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  };

  const filteredUsers = users.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.phone.includes(search)
    );
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">User Management</h1>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="h-8 w-8" style={{ color: COLORS.primary }} />
          <span className="text-2xl font-bold">{filteredUsers.length}</span>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">
                <Search className="h-4 w-4 inline mr-2" />
                Search
              </Label>
              <Input
                id="search"
                placeholder="Name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">
                <Filter className="h-4 w-4 inline mr-2" />
                Role
              </Label>
              <select
                id="role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="verified">Verification Status</Label>
              <select
                id="verified"
                value={filterVerified}
                onChange={(e) => setFilterVerified(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All</option>
                <option value="true">Verified</option>
                <option value="false">Unverified</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="active">Account Status</Label>
              <select
                id="active"
                value={filterActive}
                onChange={(e) => setFilterActive(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Users ({filteredUsers.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredUsers.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <UsersIcon className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No users found</p>
            </div>
          ) : (
            <>
              {/* Desktop Table View */}
              <div className="hidden md:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">User</th>
                      <th className="text-left py-3 px-4">Contact</th>
                      <th className="text-left py-3 px-4">Role</th>
                      <th className="text-left py-3 px-4">Status</th>
                      <th className="text-left py-3 px-4">Joined</th>
                      <th className="text-right py-3 px-4">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.map((user) => (
                      <tr key={user._id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <div
                              className={`h-10 w-10 rounded-full ${
                                user.role === 'farmer'
                                  ? 'bg-green-100'
                                  : user.role === 'buyer'
                                  ? 'bg-blue-100'
                                  : 'bg-purple-100'
                              } flex items-center justify-center`}
                            >
                              <span className="font-semibold">
                                {user.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium">{user.name}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <p className="text-sm">{user.email}</p>
                          <p className="text-sm text-gray-600">{user.phone}</p>
                        </td>
                        <td className="py-3 px-4">
                          <Badge
                            className={`capitalize ${
                              user.role === 'farmer'
                                ? 'bg-green-100 text-green-800'
                                : user.role === 'buyer'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-purple-100 text-purple-800'
                            }`}
                          >
                            {user.role}
                          </Badge>
                        </td>
                        <td className="py-3 px-4">
                          <div className="space-y-1">
                            {user.isVerified ? (
                              <Badge className="bg-green-100 text-green-800 flex items-center gap-1 w-fit">
                                <CheckCircle className="h-3 w-3" />
                                Verified
                              </Badge>
                            ) : (
                              <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 w-fit">
                                <XCircle className="h-3 w-3" />
                                Unverified
                              </Badge>
                            )}
                            {user.isActive ? (
                              <Badge className="bg-blue-100 text-blue-800 w-fit">Active</Badge>
                            ) : (
                              <Badge className="bg-gray-100 text-gray-800 w-fit">Inactive</Badge>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 text-sm text-gray-600">
                          {formatDate(user.createdAt)}
                        </td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewUserDetails(user)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {user.role !== 'admin' && (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => setUserToDelete(user)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4">
                {filteredUsers.map((user) => (
                  <Card
                    key={user._id}
                    className="border-l-4"
                    style={{
                      borderLeftColor:
                        user.role === 'farmer'
                          ? '#10b981'
                          : user.role === 'buyer'
                          ? '#3b82f6'
                          : '#a855f7',
                    }}
                  >
                    <CardContent className="p-4">
                      <div className="space-y-3">
                        {/* User Header */}
                        <div className="flex items-center gap-3">
                          <div
                            className={`h-12 w-12 rounded-full ${
                              user.role === 'farmer'
                                ? 'bg-green-100'
                                : user.role === 'buyer'
                                ? 'bg-blue-100'
                                : 'bg-purple-100'
                            } flex items-center justify-center flex-shrink-0`}
                          >
                            <span className="font-semibold text-lg">
                              {user.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="font-semibold text-base truncate">{user.name}</p>
                            <Badge
                              className={`capitalize text-xs mt-1 ${
                                user.role === 'farmer'
                                  ? 'bg-green-100 text-green-800'
                                  : user.role === 'buyer'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-purple-100 text-purple-800'
                              }`}
                            >
                              {user.role}
                            </Badge>
                          </div>
                        </div>

                        {/* Contact Info */}
                        <div className="space-y-1.5 text-sm">
                          <p className="text-gray-700 truncate">{user.email}</p>
                          <p className="text-gray-600">{user.phone}</p>
                        </div>

                        {/* Status Badges */}
                        <div className="flex flex-wrap gap-2">
                          {user.isVerified ? (
                            <Badge className="bg-green-100 text-green-800 flex items-center gap-1 text-xs">
                              <CheckCircle className="h-3 w-3" />
                              Verified
                            </Badge>
                          ) : (
                            <Badge className="bg-yellow-100 text-yellow-800 flex items-center gap-1 text-xs">
                              <XCircle className="h-3 w-3" />
                              Unverified
                            </Badge>
                          )}
                          {user.isActive ? (
                            <Badge className="bg-blue-100 text-blue-800 text-xs">Active</Badge>
                          ) : (
                            <Badge className="bg-gray-100 text-gray-800 text-xs">Inactive</Badge>
                          )}
                        </div>

                        {/* Joined Date */}
                        <p className="text-xs text-gray-500">
                          Joined: {formatDate(user.createdAt)}
                        </p>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2 border-t">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => viewUserDetails(user)}
                            className="flex-1"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Details
                          </Button>
                          {user.role !== 'admin' && (
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setUserToDelete(user)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* User Details Dialog */}
      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>User Details</DialogTitle>
          </DialogHeader>
          {selectedUser && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-gray-600">Name</Label>
                  <p className="font-medium">{selectedUser.name}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Email</Label>
                  <p className="font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Phone</Label>
                  <p className="font-medium">{selectedUser.phone}</p>
                </div>
                <div>
                  <Label className="text-gray-600">Role</Label>
                  <Badge
                    className={`capitalize mt-1 ${
                      selectedUser.role === 'farmer'
                        ? 'bg-green-100 text-green-800'
                        : selectedUser.role === 'buyer'
                        ? 'bg-blue-100 text-blue-800'
                        : 'bg-purple-100 text-purple-800'
                    }`}
                  >
                    {selectedUser.role}
                  </Badge>
                </div>
                <div>
                  <Label className="text-gray-600">Location</Label>
                  <p className="font-medium">
                    {selectedUser.location?.area || 'N/A'}, {selectedUser.location?.city || ''}
                  </p>
                </div>
                <div>
                  <Label className="text-gray-600">Joined Date</Label>
                  <p className="font-medium">{formatDate(selectedUser.createdAt)}</p>
                </div>
              </div>

              {selectedUser.location && (
                <div>
                  <Label className="text-gray-600">Full Location</Label>
                  <p className="font-medium">
                    {selectedUser.location.area}, {selectedUser.location.city}
                  </p>
                </div>
              )}

              {selectedUser.verificationDocuments &&
                selectedUser.verificationDocuments.length > 0 && (
                  <div>
                    <Label className="text-gray-600 mb-2 block">Verification Documents</Label>
                    <div className="space-y-2">
                      {selectedUser.verificationDocuments.map((doc, idx) => (
                        <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                          <Shield className="h-4 w-4" />
                          <span className="capitalize">{doc.documentType.replace('_', ' ')}</span>
                          <span className="text-gray-500">({doc.documentNumber})</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              <div className="flex items-center gap-4 pt-4 border-t">
                <div className="flex items-center gap-2">
                  <Label className="text-gray-600">Verification Status:</Label>
                  {selectedUser.isVerified ? (
                    <Badge className="bg-green-100 text-green-800">Verified</Badge>
                  ) : (
                    <Badge className="bg-yellow-100 text-yellow-800">Unverified</Badge>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <Label className="text-gray-600">Account Status:</Label>
                  {selectedUser.isActive ? (
                    <Badge className="bg-blue-100 text-blue-800">Active</Badge>
                  ) : (
                    <Badge className="bg-gray-100 text-gray-800">Inactive</Badge>
                  )}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <div className="flex items-center gap-2 w-full justify-between">
              <div className="flex gap-2">
                {selectedUser && !selectedUser.isVerified && (
                  <Button
                    onClick={() => handleVerifyUser(selectedUser._id)}
                    disabled={processing}
                    style={{ backgroundColor: COLORS.primary }}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Verify User
                  </Button>
                )}
                {selectedUser && (
                  <Button
                    onClick={() =>
                      handleToggleStatus(selectedUser._id, selectedUser.isActive || false)
                    }
                    disabled={processing}
                    variant={selectedUser.isActive ? 'destructive' : 'default'}
                  >
                    {selectedUser.isActive ? 'Deactivate' : 'Activate'}
                  </Button>
                )}
              </div>
              <Button variant="outline" onClick={() => setShowUserDialog(false)}>
                Close
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={!!userToDelete} onOpenChange={() => setUserToDelete(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete <strong>{userToDelete?.name}</strong>'s account. This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={processing}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteUser}
              disabled={processing}
              className="bg-red-600 hover:bg-red-700"
            >
              {processing ? 'Deleting...' : 'Delete User'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
