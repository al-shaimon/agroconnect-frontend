import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../../services/api';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { COLORS } from '../../constants/theme';
import { Upload, Truck, FileText, AlertCircle, X } from 'lucide-react';
import { Alert, AlertDescription } from '../../components/ui/alert';

export const DriverSignup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    area: '',
    city: '',
    driverType: 'volunteer',
    vehicleType: 'bicycle',
    vehicleModel: '',
    vehicleNumber: '',
    hasFreezer: false,
    drivingLicenseNumber: '',
    nidNumber: '',
  });

  const [files, setFiles] = useState<{
    profileImage: File | null;
    vehicleImage: File | null;
    drivingLicense: File | null;
    nidFront: File | null;
    nidBack: File | null;
  }>({
    profileImage: null,
    vehicleImage: null,
    drivingLicense: null,
    nidFront: null,
    nidBack: null,
  });

  const [profileImagePreview, setProfileImagePreview] = useState<string | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    fieldName: keyof typeof files
  ) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];

      // Special handling for profile image
      if (fieldName === 'profileImage') {
        // Validate file type
        if (!file.type.startsWith('image/')) {
          toast.error('Please select an image file');
          return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
          toast.error('Image size should be less than 5MB');
          return;
        }

        // Create preview
        const reader = new FileReader();
        reader.onloadend = () => {
          setProfileImagePreview(reader.result as string);
        };
        reader.readAsDataURL(file);
      }

      setFiles((prev) => ({
        ...prev,
        [fieldName]: file,
      }));
    }
  };

  const removeProfileImage = () => {
    setFiles((prev) => ({ ...prev, profileImage: null }));
    setProfileImagePreview(null);
    const fileInput = document.getElementById('profileImage') as HTMLInputElement;
    if (fileInput) fileInput.value = '';
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }

    if (!files.profileImage) {
      toast.error('Profile image is required');
      return;
    }

    // Driving license is not required for bicycle
    if (formData.vehicleType !== 'bicycle' && !files.drivingLicense) {
      toast.error('Driving license is required');
      return;
    }

    try {
      setLoading(true);

      const submitData = new FormData();
      submitData.append('name', formData.name);
      submitData.append('email', formData.email);
      submitData.append('password', formData.password);
      submitData.append('phone', formData.phone);
      submitData.append('driverType', formData.driverType);

      // Location
      const location = {
        area: formData.area,
        city: formData.city,
      };
      submitData.append('location', JSON.stringify(location));

      // Vehicle Info - only include vehicle number if not bicycle
      const vehicleInfo: {
        vehicleType: string;
        vehicleModel: string;
        vehicleNumber?: string;
        hasFreezer: boolean;
      } = {
        vehicleType: formData.vehicleType,
        vehicleModel: formData.vehicleModel,
        hasFreezer: formData.hasFreezer,
      };

      // Only add vehicle number if not a bicycle
      if (formData.vehicleType !== 'bicycle' && formData.vehicleNumber) {
        vehicleInfo.vehicleNumber = formData.vehicleNumber;
      }

      submitData.append('vehicleInfo', JSON.stringify(vehicleInfo));

      // Document numbers
      if (formData.vehicleType !== 'bicycle') {
        submitData.append('drivingLicenseNumber', formData.drivingLicenseNumber);
      }
      if (formData.nidNumber) {
        submitData.append('nidNumber', formData.nidNumber);
      }

      // Files
      if (files.profileImage) {
        submitData.append('profileImage', files.profileImage);
      }
      if (files.vehicleImage) {
        submitData.append('vehicleImage', files.vehicleImage);
      }
      // Only send driving license if not bicycle
      if (formData.vehicleType !== 'bicycle' && files.drivingLicense) {
        submitData.append('drivingLicense', files.drivingLicense);
      }
      if (files.nidFront) {
        submitData.append('nidFront', files.nidFront);
      }
      if (files.nidBack) {
        submitData.append('nidBack', files.nidBack);
      }

      const response = await api.post('/auth/register-driver', submitData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.data.success) {
        // Store token
        localStorage.setItem('token', response.data.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.data));

        toast.success(response.data.message);
        navigate('/driver/dashboard');
      }
    } catch (error: unknown) {
      console.error('Registration error:', error);
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <Truck className="mx-auto h-12 w-12" style={{ color: COLORS.primary }} />
          <h2 className="mt-4 text-3xl font-extrabold text-gray-900">Register as a Driver</h2>
          <p className="mt-2 text-sm text-gray-600">
            Join our delivery network and help farmers reach buyers
          </p>
        </div>

        <Card>
          <CardContent className="p-6">
            <Alert className="mb-6">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                <strong>Required:</strong> Profile Image{' '}
                {formData.vehicleType !== 'bicycle' && '+ Driving License'} (NID is optional but
                recommended)
              </AlertDescription>
            </Alert>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Personal Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Personal Information</h3>

                {/* Profile Image Upload */}
                <div className="mb-6">
                  <Label htmlFor="profileImage" className="block mb-2">
                    Profile Image * (Required)
                  </Label>
                  {profileImagePreview ? (
                    <div className="relative w-32 h-32 mx-auto">
                      <img
                        src={profileImagePreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover rounded-full border-2 border-gray-200"
                      />
                      <button
                        type="button"
                        onClick={removeProfileImage}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <div className="flex justify-center">
                      <label
                        htmlFor="profileImage"
                        className="cursor-pointer flex flex-col items-center justify-center w-32 h-32 border-2 border-dashed border-gray-300 rounded-full hover:border-green-500 transition-colors"
                      >
                        <Upload className="h-8 w-8 text-gray-400" />
                        <span className="text-xs text-gray-500 mt-2">Upload Photo</span>
                      </label>
                      <input
                        id="profileImage"
                        type="file"
                        accept="image/*"
                        required
                        onChange={(e) => handleFileChange(e, 'profileImage')}
                        className="hidden"
                      />
                    </div>
                  )}
                  <p className="text-xs text-gray-500 text-center mt-2">
                    Max size: 5MB. Formats: JPG, PNG, WebP
                  </p>
                </div>

                {/* Driver Type */}
                <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <Label htmlFor="driverType" className="block mb-2 font-semibold">
                    I am registering as: *
                  </Label>
                  <div className="space-y-3">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="driverType"
                        value="volunteer"
                        checked={formData.driverType === 'volunteer'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div>
                        <span className="font-medium">Volunteer Driver</span>
                        <p className="text-sm text-gray-600">
                          (IIUC students, community helpers, emergency volunteers)
                        </p>
                      </div>
                    </label>
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input
                        type="radio"
                        name="driverType"
                        value="professional"
                        checked={formData.driverType === 'professional'}
                        onChange={handleInputChange}
                        className="h-4 w-4 text-blue-600"
                      />
                      <div>
                        <span className="font-medium">Professional Driver</span>
                        <p className="text-sm text-gray-600">
                          (Full-time delivery drivers, transport professionals)
                        </p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="block mb-2">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      placeholder="Enter your full name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block mb-2">
                      Phone Number *
                    </Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="01XXXXXXXXX"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="block mb-2">
                      Email *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="your@email.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="area" className="block mb-2">
                      Area *
                    </Label>
                    <Input
                      id="area"
                      name="area"
                      type="text"
                      required
                      value={formData.area}
                      onChange={handleInputChange}
                      placeholder="e.g., Agrabad"
                    />
                  </div>
                  <div>
                    <Label htmlFor="city" className="block mb-2">
                      City *
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      required
                      value={formData.city}
                      onChange={handleInputChange}
                      placeholder="e.g., Chattogram"
                    />
                  </div>
                </div>
              </div>

              {/* Password */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="password" className="block mb-2">
                    Password *
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    required
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Min. 6 characters"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword" className="block mb-2">
                    Confirm Password *
                  </Label>
                  <Input
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    required
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm password"
                  />
                </div>
              </div>

              {/* Vehicle Information */}
              <div>
                <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="vehicleType" className="block mb-2">
                      Vehicle Type *
                    </Label>
                    <select
                      id="vehicleType"
                      name="vehicleType"
                      required
                      value={formData.vehicleType}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="bicycle">Bicycle</option>
                      <option value="bike">Bike/Motorcycle</option>
                      <option value="car">Car</option>
                      <option value="van">Van</option>
                      <option value="truck">Truck</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="vehicleModel" className="block mb-2">
                      Vehicle Model
                    </Label>
                    <Input
                      id="vehicleModel"
                      name="vehicleModel"
                      type="text"
                      value={formData.vehicleModel}
                      onChange={handleInputChange}
                      placeholder="e.g., Honda CB150"
                    />
                  </div>
                  {/* Only show vehicle number if not bicycle */}
                  {formData.vehicleType !== 'bicycle' && (
                    <div>
                      <Label htmlFor="vehicleNumber" className="block mb-2">
                        Vehicle Number *
                      </Label>
                      <Input
                        id="vehicleNumber"
                        name="vehicleNumber"
                        type="text"
                        required={formData.vehicleType !== 'bicycle'}
                        value={formData.vehicleNumber}
                        onChange={handleInputChange}
                        placeholder="e.g., DHAKA-Metro-Ka-11-1234"
                      />
                    </div>
                  )}
                  <>
                    {formData.vehicleType === 'van' ? (
                      <div className="flex items-center space-x-2 mt-8">
                        <input
                          id="hasFreezer"
                          name="hasFreezer"
                          type="checkbox"
                          checked={formData.hasFreezer}
                          onChange={handleInputChange}
                          className="h-4 w-4 rounded border-gray-300"
                        />
                        <Label htmlFor="hasFreezer" className="font-normal">
                          Has Freezer Van (for perishable goods)
                        </Label>
                      </div>
                    ) : (
                      <></>
                    )}
                  </>
                  {/* <div className="flex items-center space-x-2 mt-8">
                    <input
                      id="hasFreezer"
                      name="hasFreezer"
                      type="checkbox"
                      checked={formData.hasFreezer}
                      onChange={handleInputChange}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="hasFreezer" className="font-normal">
                      Has Freezer Van (for perishable goods)
                    </Label>
                  </div> */}
                </div>

                <div className="mt-4">
                  <Label htmlFor="vehicleImage" className="block mb-2">
                    Vehicle Image (Optional)
                  </Label>
                  <div className="mt-2">
                    <input
                      id="vehicleImage"
                      type="file"
                      accept="image/*"
                      onChange={(e) => handleFileChange(e, 'vehicleImage')}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-green-50 file:text-green-700
                        hover:file:bg-green-100"
                    />
                    {files.vehicleImage && (
                      <p className="mt-1 text-sm text-green-600">✓ {files.vehicleImage.name}</p>
                    )}
                  </div>
                </div>
              </div>

              {/* Documents */}
              <div>
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Verification Documents
                </h3>

                {/* Driving License - Only show if not bicycle */}
                {formData.vehicleType !== 'bicycle' && (
                  <div className="mb-4">
                    <Label htmlFor="drivingLicense">Driving License * (Required)</Label>
                    <Input
                      id="drivingLicenseNumber"
                      name="drivingLicenseNumber"
                      type="text"
                      required={formData.vehicleType !== 'bicycle'}
                      value={formData.drivingLicenseNumber}
                      onChange={handleInputChange}
                      placeholder="License Number"
                      className="mb-2"
                    />
                    <input
                      id="drivingLicense"
                      type="file"
                      accept="image/*,.pdf"
                      required={formData.vehicleType !== 'bicycle'}
                      onChange={(e) => handleFileChange(e, 'drivingLicense')}
                      className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                    />
                    {files.drivingLicense && (
                      <p className="mt-1 text-sm text-green-600">✓ {files.drivingLicense.name}</p>
                    )}
                  </div>
                )}

                {/* NID */}
                <div className="p-4 bg-gray-50 rounded-lg">
                  <Label className="text-base font-semibold">
                    National ID (NID) - Optional but Recommended
                  </Label>
                  <p className="text-sm text-gray-600 mb-2">
                    Providing NID helps verify your identity faster
                  </p>
                  <Input
                    id="nidNumber"
                    name="nidNumber"
                    type="text"
                    value={formData.nidNumber}
                    onChange={handleInputChange}
                    placeholder="NID Number"
                    className="mb-2"
                  />
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                    <div>
                      <Label htmlFor="nidFront" className="text-sm">
                        NID Front Side
                      </Label>
                      <input
                        id="nidFront"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'nidFront')}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {files.nidFront && (
                        <p className="mt-1 text-sm text-green-600">✓ {files.nidFront.name}</p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="nidBack" className="text-sm">
                        NID Back Side (Optional)
                      </Label>
                      <input
                        id="nidBack"
                        type="file"
                        accept="image/*,.pdf"
                        onChange={(e) => handleFileChange(e, 'nidBack')}
                        className="block w-full text-sm text-gray-500
                          file:mr-4 file:py-2 file:px-4
                          file:rounded-full file:border-0
                          file:text-sm file:font-semibold
                          file:bg-blue-50 file:text-blue-700
                          hover:file:bg-blue-100"
                      />
                      {files.nidBack && (
                        <p className="mt-1 text-sm text-green-600">✓ {files.nidBack.name}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit Button */}
              <div className="flex items-center justify-between pt-6 border-t">
                <Link to="/login" className="text-sm text-gray-600 hover:text-gray-900">
                  Already have an account? Login
                </Link>
                <Button
                  type="submit"
                  disabled={loading}
                  style={{ backgroundColor: COLORS.primary }}
                  className="text-white px-8"
                >
                  {loading ? (
                    <>
                      <Upload className="animate-spin h-5 w-5 mr-2" />
                      Registering...
                    </>
                  ) : (
                    'Register as Driver'
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
