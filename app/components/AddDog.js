'use client';

import styled from 'styled-components';
import {
  HTMLSelect,
  Overlay2,
  Classes,
  Section,
  SectionCard,
  Button,
  InputGroup,
  FormGroup,
} from '@blueprintjs/core';
import { devices } from '../constants/constants';
import { COLOR_OPTIONS } from '../config/api';
import { useState } from 'react';
import { FileInput } from '@blueprintjs/core';
import axios from 'axios';

const ModalWrapper = styled.div`
  left: calc(50vw - 17vw);
  margin: 10vh 0;
  top: 0;
  width: 33vw;

  @media ${devices['2xl']} {
    width: 33vw;
  }
  @media ${devices.xl} {
    width: 33vw;
  }
  @media ${devices.lg} {
    width: 50vw;
    left: calc(50vw - 22vw);
  }
  @media ${devices.md} {
    width: 95vw;
    left: calc(50vw - 47vw);
  }
  @media ${devices.sm} {
    width: 95vw;
    left: calc(50vw - 47vw);
  }
  @media ${devices.xs} {
    width: 95vw;
    left: calc(50vw - 47vw);
  }
`;

const StyledSectionCard = styled(SectionCard)`
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding: 20px;
`;

const StyledButton = styled(Button)`
  margin-right: 5px;
`;

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

      const response = await axios.post(
        `${
          process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:8080'
        }/upload/image`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

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
    <Overlay2
      isOpen={isOpen}
      className={Classes.OVERLAY_SCROLL_CONTAINER}
      usePortal={true}
      canOutsideClickClose={true}
      onClose={handleCancel}
    >
      <ModalWrapper>
        <Section
          title="Add New Dog"
          rightElement={
            <Button
              icon="cross"
              outlined={false}
              minimal={true}
              onClick={handleCancel}
            />
          }
        >
          <StyledSectionCard>
            <FormGroup
              label="Dog Name"
              labelFor="dog-name"
              labelInfo="(required)"
            >
              <InputGroup
                id="dog-name"
                placeholder="Enter dog name"
                value={dogData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Date of Birth" labelFor="dog-dob">
              <InputGroup
                id="dog-dob"
                type="date"
                placeholder="Select date of birth"
                value={dogData.dob}
                onChange={(e) => handleInputChange('dob', e.target.value)}
              />
            </FormGroup>

            <FormGroup
              label="Initial Location"
              labelFor="dog-location"
              labelInfo="(required)"
            >
              <HTMLSelect
                id="dog-location"
                minimal={true}
                fill={true}
                value={dogData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
              >
                <option value="">Select Location...</option>
                {locations
                  .filter((location) => {
                    return (
                      !('walkable' in location) || location.walkable == false
                    );
                  })
                  .map((location, index) => (
                    <option key={index} value={location._id}>
                      {location.name}
                    </option>
                  ))}
              </HTMLSelect>
            </FormGroup>

            <FormGroup label="Level 1 Color" labelFor="level1-color">
              <HTMLSelect
                id="level1-color"
                minimal={true}
                fill={true}
                value={dogData.level1}
                onChange={(e) => handleInputChange('level1', e.target.value)}
              >
                {COLOR_OPTIONS.map((color) => (
                  <option key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </HTMLSelect>
            </FormGroup>

            <FormGroup label="Level 2 Color" labelFor="level2-color">
              <HTMLSelect
                id="level2-color"
                minimal={true}
                fill={true}
                value={dogData.level2}
                onChange={(e) => handleInputChange('level2', e.target.value)}
              >
                {COLOR_OPTIONS.map((color) => (
                  <option key={color} value={color}>
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </option>
                ))}
              </HTMLSelect>
            </FormGroup>

            <FormGroup label="Profile Picture" labelFor="picture">
              <FileInput
                id="imageName"
                name="imageName"
                text={
                  isUploading
                    ? 'Uploading...'
                    : dogData.imageUrl
                    ? `✓ ${dogData.imageName}`
                    : dogData.imageName || 'Choose image file...'
                }
                onInputChange={handleImageSelection}
                accept="image/*"
                disabled={isUploading}
              />
              {dogData.imageName && (
                <small
                  style={{
                    color: dogData.imageUrl
                      ? '#0d8050'
                      : isUploading
                      ? '#5c7080'
                      : '#5C7080',
                    marginTop: '4px',
                    display: 'block',
                  }}
                >
                  {isUploading
                    ? `Uploading ${dogData.imageName}...`
                    : dogData.imageUrl
                    ? `✓ Image uploaded successfully`
                    : `Selected: ${dogData.imageName}`}
                </small>
              )}
            </FormGroup>
          </StyledSectionCard>

          <SectionCard>
            <StyledButton
              intent="primary"
              minimal={true}
              outlined={true}
              onClick={handleSubmit}
              disabled={isUploading}
            >
              {isUploading ? 'Uploading Image...' : 'Add Dog'}
            </StyledButton>
            <StyledButton
              intent="danger"
              minimal={true}
              outlined={true}
              onClick={handleCancel}
              disabled={isUploading}
            >
              Cancel
            </StyledButton>
          </SectionCard>
        </Section>
      </ModalWrapper>
    </Overlay2>
  );
};

export default AddDog;
