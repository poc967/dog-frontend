'use client';

import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import {
  Button,
  FormGroup,
  InputGroup,
  Card,
  Elevation,
  Intent,
  Callout,
} from '@blueprintjs/core';
import styled from 'styled-components';
import { devices } from '../constants/constants';

const LoginWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  padding: 1rem;
`;

const LoginCard = styled(Card)`
  width: 100%;
  max-width: 400px;
  padding: 2rem;

  @media ${devices.sm} {
    padding: 1.5rem;
  }
`;

const LoginTitle = styled.h1`
  text-align: center;
  margin-bottom: 2rem;
  color: #394b59;
  font-weight: 600;
`;

const LoginForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const SubmitButton = styled(Button)`
  margin-top: 1rem;
`;

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleInputChange = (field) => (e) => {
    setFormData((prev) => ({
      ...prev,
      [field]: e.target.value,
    }));
    // Clear error when user starts typing
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (!formData.email || !formData.password) {
      setError('Please fill in all fields');
      setIsLoading(false);
      return;
    }

    const result = await login(formData.email, formData.password);

    if (!result.success) {
      setError(result.error);
    }

    setIsLoading(false);
  };

  return (
    <LoginWrapper>
      <LoginCard elevation={Elevation.TWO}>
        <LoginTitle>Baypath Volunteer Ops</LoginTitle>

        {error && (
          <Callout intent={Intent.DANGER} style={{ marginBottom: '1rem' }}>
            {error}
          </Callout>
        )}

        <LoginForm onSubmit={handleSubmit}>
          <FormGroup label="Email" labelFor="email">
            <InputGroup
              id="email"
              type="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleInputChange('email')}
              disabled={isLoading}
              leftIcon="envelope"
            />
          </FormGroup>

          <FormGroup label="Password" labelFor="password">
            <InputGroup
              id="password"
              type="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleInputChange('password')}
              disabled={isLoading}
              leftIcon="lock"
            />
          </FormGroup>

          <SubmitButton
            type="submit"
            intent={Intent.PRIMARY}
            loading={isLoading}
            text="Sign In"
            fill
            large
          />
        </LoginForm>

        <div
          style={{
            textAlign: 'center',
            marginTop: '1.5rem',
            fontSize: '0.9rem',
            color: '#5c7080',
          }}
        >
          <p>Demo Credentials:</p>
          <p>
            <strong>Admin:</strong> admin@dogbackend.com / admin123
          </p>
        </div>
      </LoginCard>
    </LoginWrapper>
  );
};

export default Login;
