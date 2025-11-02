import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { authService } from '../services/authService';
import { toast } from 'react-toastify';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { COLORS } from '../constants/theme';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Save,
  Upload,
  FileText,
  AlertCircle,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  Camera,
  X,
} from 'lucide-react';
import type { User as UserType } from '../types';
import { Alert, AlertDescription } from '../components/ui/alert';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../components/ui/dialog';

export const Profile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadingDoc, setUploadingDoc] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    location: {
      area: user?.location?.area || '',
      city: user?.location?.city || '',
    },
  });
  const [documentData, setDocumentData] = useState<{
    documentType: 'nid' | 'passport' | 'driving_license' | 'birth_certificate' | 'trade_license';
    documentNumber: string;
    documentFiles: (File | null)[];
  }>({
    documentType: 'nid',
    documentNumber: '',
    documentFiles: [] as (File | null)[],
  });
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<{
    urls: string[];
    type: string;
  } | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<{ id: string; type: string } | null>(
    null
  );
  const [deletingDoc, setDeletingDoc] = useState(false);

  useEffect(() => {
    if (user) {
      console.log('User object in Profile:', user);
      console.log('createdAt:', user.createdAt);
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: {
          area: user?.location?.area || '',
          city: user?.location?.city || '',
        },
      });
    }
  }, [user]);

  const handleProfileImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        toast.error('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeProfileImage = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    const fileInput = document.getElementById('profileImageInput') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    if (name.startsWith('location.')) {
      const field = name.split('.')[1];
      setFormData((prev) => ({
        ...prev,
        location: {
          ...prev.location,
          [field]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.phone) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      let submitData: Partial<UserType> | FormData;

      if (profileImage) {
        const formDataToSubmit = new FormData();
        formDataToSubmit.append('name', formData.name);
        formDataToSubmit.append('phone', formData.phone);
        formDataToSubmit.append('location[area]', formData.location.area);
        formDataToSubmit.append('location[city]', formData.location.city);
        formDataToSubmit.append('profileImage', profileImage);
        submitData = formDataToSubmit;
      } else {
        submitData = formData;
      }

      const response = await authService.updateProfile(submitData);

      if (response.success) {
        setUser(response.data as UserType);
        toast.success('Profile updated successfully');
        setIsEditing(false);
        setProfileImage(null);
        setProfileImagePreview(null);
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    if (user) {
      setFormData({
        name: user.name,
        email: user.email,
        phone: user.phone,
        location: {
          area: user?.location?.area || '',
          city: user?.location?.city || '',
        },
      });
    }
    setProfileImage(null);
    setProfileImagePreview(null);
    setIsEditing(false);
  };

  const handleDocumentSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!documentData.documentNumber || documentData.documentFiles.length === 0) {
      toast.error('Please fill in all document fields and upload at least one image');
      return;
    }

    // For NID, require exactly 2 images (front and back)
    if (documentData.documentType === 'nid' && documentData.documentFiles.length !== 2) {
      toast.error('Please upload both front and back images of your NID');
      return;
    }

    // For other documents, allow only 1 image
    if (documentData.documentType !== 'nid' && documentData.documentFiles.length > 1) {
      toast.error('Please upload only one image for this document type');
      return;
    }

    try {
      setUploadingDoc(true);
      const formDataToSend = new FormData();
      formDataToSend.append('documentType', documentData.documentType);
      formDataToSend.append('documentNumber', documentData.documentNumber);

      // Append all files (skip nulls)
      documentData.documentFiles.forEach((file) => {
        if (file) {
          formDataToSend.append('documents', file);
        }
      });

      const response = await authService.uploadVerificationDocument(formDataToSend);

      if (response.success && response.data) {
        // Update user in state and localStorage
        const updatedUser = response.data as UserType;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));

        toast.success(
          'Verification document uploaded successfully. Please wait for admin approval.'
        );
        setDocumentData({
          documentType: 'nid',
          documentNumber: '',
          documentFiles: [],
        });

        // Reset file inputs
        const frontInput = document.getElementById('documentFront') as HTMLInputElement;
        const backInput = document.getElementById('documentBack') as HTMLInputElement;
        const singleInput = document.getElementById('documentFile') as HTMLInputElement;
        if (frontInput) frontInput.value = '';
        if (backInput) backInput.value = '';
        if (singleInput) singleInput.value = '';
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to upload document');
    } finally {
      setUploadingDoc(false);
    }
  };

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) {
      console.log('No date string provided');
      return 'N/A';
    }

    console.log('Date string received:', dateString, typeof dateString);

    const date = new Date(dateString);
    console.log('Parsed date:', date, 'Valid:', !isNaN(date.getTime()));

    // Check if date is valid
    if (isNaN(date.getTime())) {
      // Try parsing as timestamp if it's a number string
      const timestamp = parseInt(dateString);
      if (!isNaN(timestamp)) {
        const dateFromTimestamp = new Date(timestamp);
        if (!isNaN(dateFromTimestamp.getTime())) {
          const day = dateFromTimestamp.getDate().toString().padStart(2, '0');
          const month = dateFromTimestamp.toLocaleDateString('en-US', { month: 'short' });
          const year = dateFromTimestamp.getFullYear();
          return `${day}-${month}-${year}`;
        }
      }
      return 'N/A';
    }

    const day = date.getDate().toString().padStart(2, '0');
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear();
    return `${day}-${month}-${year}`;
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

  const handleDeleteDocument = async () => {
    if (!documentToDelete) return;

    try {
      setDeletingDoc(true);
      const response = await authService.deleteVerificationDocument(documentToDelete.id);

      if (response.success && response.data) {
        const updatedUser = response.data as UserType;
        setUser(updatedUser);
        localStorage.setItem('user', JSON.stringify(updatedUser));
        toast.success('Document deleted successfully');
      }
    } catch (error) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to delete document');
    } finally {
      setDeletingDoc(false);
      setShowDeleteDialog(false);
      setDocumentToDelete(null);
    }
  };

  const openDeleteDialog = (documentId: string, documentType: string) => {
    setDocumentToDelete({ id: documentId, type: documentType });
    setShowDeleteDialog(true);
  };

  const getVerificationStatusBadge = () => {
    if (!user) return null;

    // Default to 'pending' if verificationStatus is not set
    const status = user.verificationStatus || 'pending';

    const statusConfig = {
      pending: {
        color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        icon: AlertCircle,
        text: 'Pending Verification',
      },
      approved: {
        color: 'bg-green-100 text-green-800 border-green-200',
        icon: CheckCircle,
        text: 'Verified',
      },
      rejected: {
        color: 'bg-red-100 text-red-800 border-red-200',
        icon: XCircle,
        text: 'Rejected',
      },
    };

    const config = statusConfig[status];
    const Icon = config.icon;

    return (
      <span
        className={`px-3 py-1 rounded-full text-sm font-medium border flex items-center gap-1 w-fit ${config.color}`}
      >
        <Icon className="h-4 w-4" />
        {config.text}
      </span>
    );
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-600">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Profile Picture Section */}
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-4">
          <div className="relative">
            <img
              src={
                profileImagePreview ||
                user?.profileImage ||
                'https://via.placeholder.com/150?text=No+Image'
              }
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
            />
            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-green-600 rounded-full p-2 cursor-pointer hover:bg-green-700 transition-colors shadow-lg">
                <Camera className="h-5 w-5 text-white" />
                <input type="file" onChange={handleProfileImageChange} hidden accept="image/*" />
              </label>
            )}
          </div>
          {profileImagePreview && isEditing && (
            <Button
              type="button"
              variant="outline"
              onClick={removeProfileImage}
              className="flex items-center gap-2"
            >
              <X className="h-4 w-4" />
              Remove New Image
            </Button>
          )}
          {isEditing && (
            <p className="text-sm text-gray-500 text-center">
              Click the camera icon to change your profile picture. Max size: 5MB
            </p>
          )}
        </CardContent>
      </Card>

      {/* Personal Information Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Personal Information</CardTitle>
            {!isEditing && (
              <Button
                onClick={() => setIsEditing(true)}
                style={{ backgroundColor: COLORS.primary }}
              >
                Edit Profile
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name */}
            <div className="space-y-2">
              <Label htmlFor="name" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                Full Name
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Email */}
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                disabled={true}
                required
                className="bg-gray-50 cursor-not-allowed"
              />
            </div>

            {/* Phone */}
            <div className="space-y-2">
              <Label htmlFor="phone" className="flex items-center gap-2">
                <Phone className="h-4 w-4" />
                Phone Number
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                disabled={!isEditing}
                required
              />
            </div>

            {/* Location */}
            <div className="space-y-4">
              <Label className="flex items-center gap-2">
                <MapPin className="h-4 w-4" />
                Location
              </Label>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="location.area">Area</Label>
                  <Input
                    id="location.area"
                    name="location.area"
                    value={formData.location.area}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g., Gulshan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location.city">City</Label>
                  <Input
                    id="location.city"
                    name="location.city"
                    value={formData.location.city}
                    onChange={handleChange}
                    disabled={!isEditing}
                    placeholder="e.g., Dhaka"
                  />
                </div>
              </div>
            </div>

            {/* Role and Verification Status */}
            <div className="space-y-2">
              <Label>Account Type & Status</Label>
              <div className="flex items-center gap-2">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 capitalize">
                  {user.role}
                </span>
                {getVerificationStatusBadge()}
              </div>
            </div>

            {/* Action Buttons */}
            {isEditing && (
              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: COLORS.primary }}
                  className="flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button type="button" variant="outline" onClick={handleCancel} disabled={loading}>
                  Cancel
                </Button>
              </div>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Account Details */}
      <Card>
        <CardHeader>
          <CardTitle>Account Details</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between py-2 border-b">
            <span className="text-gray-600">Verification Status</span>
            <span className="font-medium">
              {(() => {
                const status = user.verificationStatus || 'pending';
                if (status === 'approved') {
                  return <span className="text-green-600">Verified</span>;
                } else if (status === 'rejected') {
                  return <span className="text-red-600">Rejected</span>;
                } else {
                  return <span className="text-yellow-600">Unverified</span>;
                }
              })()}
            </span>
          </div>
          <div className="flex justify-between py-2">
            <span className="text-gray-600">Member Since</span>
            <span className="font-medium">{formatDate(user.createdAt)}</span>
          </div>
        </CardContent>
      </Card>

      {/* Verification Section */}
      {user.role !== 'admin' && (user.verificationStatus || 'pending') !== 'approved' && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Identity Verification
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {(user.verificationStatus || 'pending') === 'rejected' && user.rejectionReason && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  <strong>Verification Rejected:</strong> {user.rejectionReason}
                </AlertDescription>
              </Alert>
            )}

            {(user.verificationStatus || 'pending') === 'pending' &&
            user.verificationDocuments &&
            user.verificationDocuments.length > 0 ? (
              <Alert>
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>
                  Your verification documents have been submitted and are under review by our admin
                  team. You'll be notified once the review is complete.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <p className="text-sm text-gray-600">
                  To access all features, please upload a government-issued ID document for
                  verification. Accepted documents: National ID, Passport, Driving License, Birth
                  Certificate, or Trade License.
                </p>

                <form onSubmit={handleDocumentSubmit} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="documentType">Document Type</Label>
                    <select
                      id="documentType"
                      value={documentData.documentType}
                      onChange={(e) =>
                        setDocumentData({
                          ...documentData,
                          documentType: e.target.value as
                            | 'nid'
                            | 'passport'
                            | 'driving_license'
                            | 'birth_certificate'
                            | 'trade_license',
                        })
                      }
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                      disabled={uploadingDoc}
                    >
                      <option value="nid">National ID (NID)</option>
                      <option value="passport">Passport</option>
                      <option value="driving_license">Driving License</option>
                      <option value="birth_certificate">Birth Certificate</option>
                      <option value="trade_license">Trade License</option>
                    </select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="documentNumber">Document Number</Label>
                    <Input
                      id="documentNumber"
                      value={documentData.documentNumber}
                      onChange={(e) =>
                        setDocumentData({
                          ...documentData,
                          documentNumber: e.target.value,
                        })
                      }
                      placeholder="Enter your document number"
                      disabled={uploadingDoc}
                      required
                    />
                  </div>

                  {/* Conditional rendering based on document type */}
                  {documentData.documentType === 'nid' ? (
                    // NID - Two separate upload inputs for front and back
                    <>
                      <div className="space-y-2">
                        <Label htmlFor="documentFront">
                          NID Front Image <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="documentFront"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const newFiles = [...documentData.documentFiles];
                              newFiles[0] = file;
                              setDocumentData({
                                ...documentData,
                                documentFiles: newFiles,
                              });
                            }
                          }}
                          disabled={uploadingDoc}
                          required
                        />
                        {documentData.documentFiles[0] && (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">
                              {documentData.documentFiles[0].name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = [...documentData.documentFiles];
                                newFiles[0] = null;
                                setDocumentData({
                                  ...documentData,
                                  documentFiles: newFiles.filter(Boolean),
                                });
                                (
                                  document.getElementById('documentFront') as HTMLInputElement
                                ).value = '';
                              }}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="documentBack">
                          NID Back Image <span className="text-red-500">*</span>
                        </Label>
                        <Input
                          id="documentBack"
                          type="file"
                          accept="image/jpeg,image/jpg,image/png"
                          onChange={(e) => {
                            const file = e.target.files?.[0];
                            if (file) {
                              const newFiles = [...documentData.documentFiles];
                              newFiles[1] = file;
                              setDocumentData({
                                ...documentData,
                                documentFiles: newFiles,
                              });
                            }
                          }}
                          disabled={uploadingDoc}
                          required
                        />
                        {documentData.documentFiles[1] && (
                          <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                            <span className="text-sm text-gray-600">
                              {documentData.documentFiles[1].name}
                            </span>
                            <button
                              type="button"
                              onClick={() => {
                                const newFiles = [...documentData.documentFiles];
                                newFiles[1] = null;
                                setDocumentData({
                                  ...documentData,
                                  documentFiles: newFiles.filter(Boolean),
                                });
                                (
                                  document.getElementById('documentBack') as HTMLInputElement
                                ).value = '';
                              }}
                              className="text-red-500 hover:text-red-700 text-sm"
                            >
                              Remove
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  ) : (
                    // Other documents - Single upload input
                    <div className="space-y-2">
                      <Label htmlFor="documentFile">
                        Upload Document Image <span className="text-red-500">*</span>
                      </Label>
                      <Input
                        id="documentFile"
                        type="file"
                        accept="image/jpeg,image/jpg,image/png"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setDocumentData({
                              ...documentData,
                              documentFiles: [file],
                            });
                          }
                        }}
                        disabled={uploadingDoc}
                        required
                      />
                      {documentData.documentFiles[0] && (
                        <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                          <span className="text-sm text-gray-600">
                            {documentData.documentFiles[0].name}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              setDocumentData({
                                ...documentData,
                                documentFiles: [],
                              });
                              (document.getElementById('documentFile') as HTMLInputElement).value =
                                '';
                            }}
                            className="text-red-500 hover:text-red-700 text-sm"
                          >
                            Remove
                          </button>
                        </div>
                      )}
                    </div>
                  )}

                  <Button
                    type="submit"
                    disabled={uploadingDoc}
                    style={{ backgroundColor: COLORS.primary }}
                    className="flex items-center gap-2"
                  >
                    {uploadingDoc ? (
                      <>
                        <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                        Uploading...
                      </>
                    ) : (
                      <>
                        <Upload className="h-4 w-4" />
                        Submit for Verification
                      </>
                    )}
                  </Button>
                </form>
              </>
            )}

            {/* Show uploaded documents */}
            {user.verificationDocuments && user.verificationDocuments.length > 0 && (
              <div className="mt-4 space-y-2">
                <Label>Submitted Documents</Label>
                <div className="space-y-2">
                  {user.verificationDocuments.map((doc, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <div className="flex items-center gap-2 flex-1">
                        <FileText className="h-4 w-4 text-gray-600" />
                        <div className="flex-1">
                          <p className="text-sm font-medium capitalize">
                            {doc.documentType.replace('_', ' ')}
                          </p>
                          <p className="text-xs text-gray-600">No: {doc.documentNumber}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-500">{formatDate(doc.uploadedAt)}</span>
                        <button
                          onClick={() => openDocumentViewer(doc.documentUrl, doc.documentType)}
                          className="text-blue-600 hover:text-blue-800 transition-colors p-1"
                          title="View document"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => openDeleteDialog(doc._id, doc.documentType)}
                          className="text-red-600 hover:text-red-800 transition-colors p-1"
                          title="Delete document"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

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

      {/* Delete Confirmation Dialog */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Document</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-700">
              Are you sure you want to delete this{' '}
              <span className="font-semibold capitalize">
                {documentToDelete?.type.replace('_', ' ')}
              </span>{' '}
              document? This action cannot be undone.
            </p>
            {user?.verificationStatus === 'approved' && (
              <Alert className="mt-4 border-yellow-400 bg-yellow-50">
                <AlertCircle className="h-4 w-4 text-yellow-600" />
                <AlertDescription className="text-yellow-800">
                  Warning: Deleting this document may affect your verification status.
                </AlertDescription>
              </Alert>
            )}
          </div>
          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => {
                setShowDeleteDialog(false);
                setDocumentToDelete(null);
              }}
              disabled={deletingDoc}
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteDocument}
              disabled={deletingDoc}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              {deletingDoc ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2"></div>
                  Deleting...
                </>
              ) : (
                <>
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Document
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
