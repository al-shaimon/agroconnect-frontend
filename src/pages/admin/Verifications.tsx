import { useState, useEffect } from 'react';
import { adminVerificationService } from '../../services/adminVerificationService';
import { toast } from 'react-toastify';
import type { User } from '../../types';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Badge } from '../../components/ui/badge';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { COLORS } from '../../constants/theme';
import { FileText, CheckCircle, XCircle, Clock, Eye, Search, Filter } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../../components/ui/dialog';
import { Textarea } from '../../components/ui/textarea';

export const AdminVerifications = () => {
  const [verifications, setVerifications] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<{
    overall?: { total: number; pending: number; approved: number; rejected: number };
    byRole?: {
      farmer: { pending: number; approved: number; rejected: number };
      buyer: { pending: number; approved: number; rejected: number };
    };
  } | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');
  const [processing, setProcessing] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRole, setFilterRole] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    urls: string[];
    type: string;
  } | null>(null);

  useEffect(() => {
    fetchVerifications();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filterStatus, filterRole]);

  const fetchVerifications = async () => {
    try {
      setLoading(true);
      const params: { status?: string; role?: string } = {};
      if (filterStatus !== 'all') params.status = filterStatus;
      if (filterRole !== 'all') params.role = filterRole;

      const response = await adminVerificationService.getAllVerifications(params);
      setVerifications(response.data || []);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to fetch verifications');
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminVerificationService.getVerificationStats();
      if (response.data) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  };

  const handleApprove = async (userId: string) => {
    if (!confirm('Are you sure you want to approve this verification?')) return;

    try {
      setProcessing(true);
      await adminVerificationService.approveVerification(userId);
      toast.success('Verification approved successfully');
      fetchVerifications();
      fetchStats();
      setSelectedUser(null);
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to approve verification');
    } finally {
      setProcessing(false);
    }
  };

  const handleReject = async () => {
    if (!selectedUser || !rejectionReason.trim()) {
      toast.error('Please provide a rejection reason');
      return;
    }

    try {
      setProcessing(true);
      await adminVerificationService.rejectVerification(selectedUser._id, rejectionReason);
      toast.success('Verification rejected');
      fetchVerifications();
      fetchStats();
      setShowRejectDialog(false);
      setSelectedUser(null);
      setRejectionReason('');
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to reject verification');
    } finally {
      setProcessing(false);
    }
  };

  const openRejectDialog = (user: User) => {
    setSelectedUser(user);
    setShowRejectDialog(true);
  };

  const openDocumentViewer = (documentUrl: string, documentType: string) => {
    // Split URLs if multiple (separated by |||)
    const urls = documentUrl.includes('|||') ? documentUrl.split('|||') : [documentUrl];

    setSelectedDocument({
      urls,
      type: documentType,
    });
    setShowDocumentViewer(true);
  };

  const getStatusBadge = (status: string) => {
    const config = {
      pending: { color: 'bg-yellow-100 text-yellow-800', icon: Clock, text: 'Pending' },
      approved: { color: 'bg-green-100 text-green-800', icon: CheckCircle, text: 'Approved' },
      rejected: { color: 'bg-red-100 text-red-800', icon: XCircle, text: 'Rejected' },
    };

    const item = config[status as keyof typeof config] || config.pending;
    const Icon = item.icon;

    return (
      <Badge className={`${item.color} flex items-center gap-1 w-fit`}>
        <Icon className="h-3 w-3" />
        {item.text}
      </Badge>
    );
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return 'N/A';
    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const filteredVerifications = verifications.filter((user) => {
    if (!searchTerm) return true;
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.phone.includes(search)
    );
  });

  if (loading && !stats) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Statistics */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold">{stats.overall?.total || 0}</p>
                </div>
                <FileText className="h-8 w-8 text-gray-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-yellow-600">
                    {stats.overall?.pending || 0}
                  </p>
                </div>
                <Clock className="h-8 w-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Approved</p>
                  <p className="text-2xl font-bold text-green-600">
                    {stats.overall?.approved || 0}
                  </p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Rejected</p>
                  <p className="text-2xl font-bold text-red-600">{stats.overall?.rejected || 0}</p>
                </div>
                <XCircle className="h-8 w-8 text-red-400" />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">
                <Search className="h-4 w-4 inline mr-2" />
                Search
              </Label>
              <Input
                id="search"
                placeholder="Search by name, email, phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="status">
                <Filter className="h-4 w-4 inline mr-2" />
                Status
              </Label>
              <select
                id="status"
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <select
                id="role"
                value={filterRole}
                onChange={(e) => setFilterRole(e.target.value)}
                className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="all">All Roles</option>
                <option value="farmer">Farmer</option>
                <option value="buyer">Buyer</option>
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Verifications List */}
      <Card>
        <CardHeader>
          <CardTitle>Verification Requests ({filteredVerifications.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="h-8 w-8 animate-spin rounded-full border-4 border-gray-200 border-t-green-500"></div>
            </div>
          ) : filteredVerifications.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="h-12 w-12 mx-auto mb-4 text-gray-400" />
              <p>No verification requests found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredVerifications.map((user) => (
                <Card key={user._id} className="border">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          <Badge className="bg-blue-100 text-blue-800 capitalize">
                            {user.role}
                          </Badge>
                          {getStatusBadge(user.verificationStatus || 'pending')}
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2 text-sm text-gray-600">
                          <p>📧 {user.email}</p>
                          <p>📱 {user.phone}</p>
                          <p>📅 Joined: {formatDate(user.createdAt)}</p>
                        </div>
                        {user.verificationDocuments && user.verificationDocuments.length > 0 && (
                          <div className="mt-3">
                            <p className="text-sm font-medium mb-2">Submitted Documents:</p>
                            <div className="flex flex-wrap gap-2">
                              {user.verificationDocuments.map((doc, idx) => (
                                <div
                                  key={idx}
                                  className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-lg text-sm"
                                >
                                  <FileText className="h-4 w-4" />
                                  <span className="capitalize">
                                    {doc.documentType.replace('_', ' ')}
                                  </span>
                                  <span className="text-gray-500">({doc.documentNumber})</span>
                                  <button
                                    onClick={() =>
                                      openDocumentViewer(doc.documentUrl, doc.documentType)
                                    }
                                    className="text-blue-600 hover:text-blue-800 ml-2 transition-colors"
                                    title="View document"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {user.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm font-medium text-red-800">Rejection Reason:</p>
                            <p className="text-sm text-red-700">{user.rejectionReason}</p>
                          </div>
                        )}
                      </div>
                      <div className="flex gap-2 ml-4">
                        {(user.verificationStatus || 'pending') === 'pending' && (
                          <>
                            <Button
                              onClick={() => handleApprove(user._id)}
                              disabled={processing}
                              style={{ backgroundColor: COLORS.primary }}
                              className="text-white"
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              onClick={() => openRejectDialog(user)}
                              disabled={processing}
                              variant="destructive"
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Document Viewer Dialog */}
      <Dialog open={showDocumentViewer} onOpenChange={setShowDocumentViewer}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
          <DialogHeader>
            <DialogTitle className="capitalize">
              {selectedDocument?.type.replace('_', ' ')} - Document Viewer
            </DialogTitle>
          </DialogHeader>
          <div className="py-4">
            {selectedDocument && (
              <div className="w-full space-y-4">
                {selectedDocument.urls.map((url, index) => (
                  <div key={index} className="space-y-2">
                    {selectedDocument.type === 'nid' && selectedDocument.urls.length === 2 && (
                      <h3 className="text-sm font-semibold text-gray-700">
                        {index === 0 ? 'Front Side' : 'Back Side'}
                      </h3>
                    )}
                    <div className="flex justify-center items-center bg-gray-50 rounded-lg p-4">
                      <img
                        src={url}
                        alt={`${selectedDocument.type} ${index + 1}`}
                        className="max-w-full max-h-[60vh] object-contain rounded-lg shadow-lg"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          const parent = target.parentElement;
                          if (parent) {
                            parent.innerHTML = `
                              <div class="text-center p-8">
                                <p class="text-red-500 mb-4">Failed to load image</p>
                                <a href="${url}" target="_blank" rel="noopener noreferrer" 
                                   class="text-blue-600 hover:underline">
                                  Open in New Tab
                                </a>
                              </div>
                            `;
                          }
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowDocumentViewer(false);
                setSelectedDocument(null);
              }}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reject Verification Request</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <p className="text-sm text-gray-600">
              Please provide a reason for rejecting <strong>{selectedUser?.name}</strong>'s
              verification request.
            </p>
            <div className="space-y-2">
              <Label htmlFor="reason">Rejection Reason *</Label>
              <Textarea
                id="reason"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Document is not clear, ID is expired, etc."
                rows={4}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowRejectDialog(false);
                setRejectionReason('');
              }}
              disabled={processing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleReject}
              disabled={processing || !rejectionReason.trim()}
              variant="destructive"
            >
              {processing ? 'Rejecting...' : 'Reject Verification'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
