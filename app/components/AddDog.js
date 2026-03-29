'use client';

import { COLOR_OPTIONS, API_ENDPOINTS } from '../config/api';
import { useState } from 'react';
import axios from 'axios';
import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import { Label } from '@/app/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/app/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/app/components/ui/select';

const AddDog = ({ isOpen, onClose, onSubmit, locations }) => {
  const [dogData, setDogData] = useState({
    name: '',
    level1: 'green',
    level2: 'yellow',
    location: '',
    dob: '',
    image: null,
    imageName: '',
    imageUrl: '', // Store the uploaded image URL
  });

  const [isUploading, setIsUploading] = useState(false);
  const [createdDogId, setCreatedDogId] = useState(null);

  const handleInputChange = (field, value) => {
    setDogData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async () => {
    if (!dogData.name || !dogData.location) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      // Create the dog with image URL if available
      const dogPayload = {
        name: dogData.name,
        level1: dogData.level1,
        level2: dogData.level2,
        location: dogData.location,
        dob: dogData.dob,
        imageUrl: dogData.imageUrl || null, // Include the uploaded image URL
      };

      await onSubmit(dogPayload);

      // Reset form
      resetForm();
    } catch (error) {
      console.error('Error creating dog:', error);
      alert('Failed to create dog. Please try again.');
    }
  };

  const resetForm = () => {
    setDogData({
      name: '',
      level1: 'green',
      level2: 'yellow',
      location: '',
      dob: '',
      image: null,
      imageName: '',
      imageUrl: '',
    });
    setCreatedDogId(null);
  };

  const handleCancel = () => {
    resetForm();
    onClose();
  };

  const handleImageSelection = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setDogData((prev) => ({
        ...prev,
        image: file,
        imageName: file.name,
      }));

      // Upload the image immediately when selected
      await handleImageUpload(file);
    }
  };

  const handleImageUpload = async (imageFile) => {
    if (!imageFile) return null;

    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', imageFile);

      const response = await axios.post(API_ENDPOINTS.IMAGE_UPLOAD, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200 && response.data.isSuccessful) {
        console.log('Image uploaded successfully');
        const imageUrl = response.data.data.fileUrl; // Updated to match new response structure

        // Update dogData with the uploaded image URL
        setDogData((prev) => ({
          ...prev,
          imageUrl: imageUrl,
        }));

        return imageUrl; // Return the S3 URL
      } else {
        throw new Error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image. You can try selecting a different image.');

      // Clear the failed image selection
      setDogData((prev) => ({
        ...prev,
        image: null,
        imageName: '',
        imageUrl: '',
      }));

      return null;
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => { if (!open) handleCancel(); }}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Dog</DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4">
          <div className="space-y-2">
            <Label htmlFor="dog-name">Dog Name <span className="text-muted-foreground text-xs">(required)</span></Label>
            <Input
              id="dog-name"
              placeholder="Enter dog name"
              value={dogData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dog-dob">Date of Birth</Label>
            <Input
              id="dog-dob"
              type="date"
              value={dogData.dob}
              onChange={(e) => handleInputChange('dob', e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dog-location">Initial Location <span className="text-muted-foreground text-xs">(required)</span></Label>
            <Select value={dogData.location} onValueChange={(val) => handleInputChange('location', val)}>
              <SelectTrigger>
                <SelectValue placeholder="Select Location..." />
              </SelectTrigger>
              <SelectContent>
                {locations
                  .filter((location) => !('walkable' in location) || location.walkable == false)
                  .map((location) => (
                    <SelectItem key={location._id} value={location._id}>
                      {location.name}
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level1-color">Level 1 Color</Label>
            <Select value={dogData.level1} onValueChange={(val) => handleInputChange('level1', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="level2-color">Level 2 Color</Label>
            <Select value={dogData.level2} onValueChange={(val) => handleInputChange('level2', val)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COLOR_OPTIONS.map((color) => (
                  <SelectItem key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="picture">Profile Picture</Label>
            <Input
              id="picture"
              type="file"
              accept="image/*"
              onChange={handleImageSelection}
              disabled={isUploading}
            />
            {dogData.imageName && (
              <p className={`text-xs mt-1 ${dogData.imageUrl ? 'text-emerald-600' : 'text-muted-foreground'}`}>
                {isUploading
                  ? `Uploading ${dogData.imageName}...`
                  : dogData.imageUrl
                  ? `✓ Image uploaded successfully`
                  : `Selected: ${dogData.imageName}`}
              </p>
            )}
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0">
          <Button variant="outline" onClick={handleCancel} disabled={isUploading}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isUploading}>
            {isUploading ? 'Uploading Image...' : 'Add Dog'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddDog;
