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
  });

  const handleInputChange = (field, value) => {
    setDogData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = () => {
    if (!dogData.name || !dogData.location) {
      alert('Please fill in all required fields');
      return;
    }

    onSubmit(dogData);

    // Reset form
    setDogData({
      name: '',
      level1: 'green',
      level2: 'yellow',
      location: '',
      dob: '',
      image: null,
    });
  };

  const handleCancel = () => {
    // Reset form
    setDogData({
      name: '',
      level1: 'green',
      level2: 'yellow',
      location: '',
      dob: '',
      image: null,
    });
    onClose();
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    const name = file.name;
    setDogData((prev) => ({
      ...prev,
      imageName: name,
    }));
    let data = new FormData();
    data.append('file', file);

    const config = {
      url: `${process.env.REACT_APP_base_url}/user/upload-profile-image`,
      method: 'POST',
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      data,
    };

    const res = await axios(config);
    if (res.status === 200) {
      setDogData((prev) => ({
        ...prev,
        image: res.data.imageUrl,
      }));
    } else {
      alert('Image upload failed');
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
            <FormGroup label="Picture" labelFor="picture">
              <FileInput
                id="imageName"
                name="imageName"
                text={dogData.imageName || 'Choose file...'}
                onInputChange={(e) => handleImageUpload(e)}
              />
            </FormGroup>
          </StyledSectionCard>

          <SectionCard>
            <StyledButton
              intent="primary"
              minimal={true}
              outlined={true}
              onClick={handleSubmit}
            >
              Add Dog
            </StyledButton>
            <StyledButton
              intent="danger"
              minimal={true}
              outlined={true}
              onClick={handleCancel}
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
