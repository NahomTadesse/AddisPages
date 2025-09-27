
"use client";

import { useState, useEffect } from 'react';
import { TextInput, Button, LoadingOverlay, FileInput, Box, Notification, Container, Title, Alert, Select } from '@mantine/core';
import { authenticatedFetch, BOOKS_API_BASE_URL, setNavigation } from '../services/baseApiService';
import { useRouter } from 'next/navigation';
import { IconUser, IconMail, IconHome, IconUpload } from '@tabler/icons-react';

// Function to sanitize input to prevent script injection and HTML tags
const sanitizeInput = (input) => {
  if (!input) return input;
  return input
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/&[^;]+;/g, '') // Remove HTML entities
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+="[^"]*"/gi, ''); // Remove event attributes
};

// Function to validate if input contains HTML or JavaScript
const containsHtmlOrJs = (input) => {
  if (!input) return false;
  const htmlJsRegex = /<|>|\bon\w+=|javascript:/i;
  return htmlJsRegex.test(input);
};

export default function PublisherForm() {
  const [name, setName] = useState('');
  const [street, setStreet] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [country, setCountry] = useState('');
  const [region, setRegion] = useState('');
  const [zone, setZone] = useState('');
  const [woreda, setWoreda] = useState('');
  const [kebele, setKebele] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');
  const [district, setDistrict] = useState('');
  const [houseNumber, setHouseNumber] = useState('');
  const [subcity, setSubcity] = useState('');
  const [addressType, setAddressType] = useState('');
  const [error, setError] = useState('');
  const [notification, setNotification] = useState({ message: '', type: '' });
  const [profilePicture, setProfilePicture] = useState(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Set up navigation for the auth service
  useEffect(() => {
   
    setNavigation((path) => {
    
      router.push(path);
    });
  }, [router]);

  const addressTypes = [
    { value: 'EMERGENCY_CONTACT', label: 'Emergency Contact' },
    { value: 'CUSTOMER_ADDRESS', label: 'Customer Address' },
    { value: 'BUSINESS_ADDRESS', label: 'Business Address' },
  ];

  const validateForm = () => {
    if (!name.trim()) {
      setError('Publisher name is required.');
      return false;
    }
    if (name.length > 100) {
      setError('Publisher name must be 100 characters or less.');
      return false;
    }
    if (containsHtmlOrJs(name)) {
      setError('Publisher name cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!street.trim()) {
      setError('Street is required.');
      return false;
    }
    if (street.length > 100) {
      setError('Street must be 100 characters or less.');
      return false;
    }
    if (containsHtmlOrJs(street)) {
      setError('Street cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!city.trim()) {
      setError('City is required.');
      return false;
    }
    if (city.length > 50) {
      setError('City must be 50 characters or less.');
      return false;
    }
    if (containsHtmlOrJs(city)) {
      setError('City cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!country.trim()) {
      setError('Country is required.');
      return false;
    }
    if (country.length > 50) {
      setError('Country must be 50 characters or less.');
      return false;
    }
    if (containsHtmlOrJs(country)) {
      setError('Country cannot contain HTML or JavaScript code.');
      return false;
    }
    if (!addressType) {
      setError('Address type is required.');
      return false;
    }
    if (!profilePicture) {
      setError('Please upload a profile picture.');
      return false;
    }
    // Optional field validations
    if (state && state.length > 50) {
      setError('State must be 50 characters or less.');
      return false;
    }
    if (state && containsHtmlOrJs(state)) {
      setError('State cannot contain HTML or JavaScript code.');
      return false;
    }
    if (zipCode && !/^\d{5}(-\d{4})?$/.test(zipCode)) {
      setError('Please enter a valid zip code (e.g., 12345 or 12345-6789).');
      return false;
    }
    if (zipCode && containsHtmlOrJs(zipCode)) {
      setError('Zip code cannot contain HTML or JavaScript code.');
      return false;
    }
    if (region && region.length > 50) {
      setError('Region must be 50 characters or less.');
      return false;
    }
    if (region && containsHtmlOrJs(region)) {
      setError('Region cannot contain HTML or JavaScript code.');
      return false;
    }
    if (zone && zone.length > 50) {
      setError('Zone must be 50 characters or less.');
      return false;
    }
    if (zone && containsHtmlOrJs(zone)) {
      setError('Zone cannot contain HTML or JavaScript code.');
      return false;
    }
    if (woreda && woreda.length > 50) {
      setError('Woreda must be 50 characters or less.');
      return false;
    }
    if (woreda && containsHtmlOrJs(woreda)) {
      setError('Woreda cannot contain HTML or JavaScript code.');
      return false;
    }
    if (kebele && kebele.length > 50) {
      setError('Kebele must be 50 characters or less.');
      return false;
    }
    if (kebele && containsHtmlOrJs(kebele)) {
      setError('Kebele cannot contain HTML or JavaScript code.');
      return false;
    }
    if (additionalInfo && additionalInfo.length > 500) {
      setError('Additional info must be 500 characters or less.');
      return false;
    }
    if (additionalInfo && containsHtmlOrJs(additionalInfo)) {
      setError('Additional info cannot contain HTML or JavaScript code.');
      return false;
    }
    if (district && district.length > 50) {
      setError('District must be 50 characters or less.');
      return false;
    }
    if (district && containsHtmlOrJs(district)) {
      setError('District cannot contain HTML or JavaScript code.');
      return false;
    }
    if (houseNumber && houseNumber.length > 20) {
      setError('House number must be 20 characters or less.');
      return false;
    }
    if (houseNumber && containsHtmlOrJs(houseNumber)) {
      setError('House number cannot contain HTML or JavaScript code.');
      return false;
    }
    if (subcity && subcity.length > 50) {
      setError('Subcity must be 50 characters or less.');
      return false;
    }
    if (subcity && containsHtmlOrJs(subcity)) {
      setError('Subcity cannot contain HTML or JavaScript code.');
      return false;
    }

    setError('');
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  

    if (!validateForm()) {

      return;
    }

    setLoading(true);
 

    const formData = new FormData();
    const publisherData = {
      name: sanitizeInput(name.trim()),
      address: {
        street: sanitizeInput(street.trim()),
        city: sanitizeInput(city.trim()),
        state: sanitizeInput(state.trim()) || null,
        zipCode: sanitizeInput(zipCode.trim()) || null,
        country: sanitizeInput(country.trim()),
        region: sanitizeInput(region.trim()) || null,
        zone: sanitizeInput(zone.trim()) || null,
        woreda: sanitizeInput(woreda.trim()) || null,
        kebele: sanitizeInput(kebele.trim()) || null,
        additionalInfo: sanitizeInput(additionalInfo.trim()) || null,
        district: sanitizeInput(district.trim()) || null,
        houseNumber: sanitizeInput(houseNumber.trim()) || null,
        subcity: sanitizeInput(subcity.trim()) || null,
        addressType: addressType,
      },
    };

   

    const publisherBlob = new Blob([JSON.stringify(publisherData)], {
      type: "application/json",
    });

    formData.append("publisher", publisherBlob, "publisher.json");

    if (profilePicture) {
      formData.append("photos", profilePicture);
     
    }

    try {
   
      const response = await authenticatedFetch(`${BOOKS_API_BASE_URL}/publisher`, {
        method: 'POST',
        body: formData,
      });

    

      if (!response.ok) {
        const errorText = await response.text();
      
        throw new Error(`Failed to create publisher: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      
      setNotification({
        message: `Publisher "${sanitizeInput(name)}" created successfully!`,
        type: 'success',
      });

     
      setName('');
      setStreet('');
      setCity('');
      setState('');
      setZipCode('');
      setCountry('');
      setRegion('');
      setZone('');
      setWoreda('');
      setKebele('');
      setAdditionalInfo('');
      setDistrict('');
      setHouseNumber('');
      setSubcity('');
      setAddressType('');
      setProfilePicture(null);
      setError('');

      // Optionally navigate to publishers list
      // router.push('/publishers');

    } catch (error) {
    
      setNotification({
        message: `Error creating publisher: ${error.message}`,
        type: 'error',
      });

      if (error.message.includes('token') || error.message.includes('auth')) {
      
        return;
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push('/publishers');
  };

  return (
    <Box pos="relative">
      <LoadingOverlay
        visible={loading}
        zIndex={1000}
        overlayProps={{ radius: 'sm', blur: 2 }}
        loaderProps={{ color: 'blue', type: 'bars' }}
      />

      <div style={{ marginLeft: 10, marginTop: 45 }}>
        <Container size={1000} my={0}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <Title ta="left">🏢 ADD NEW PUBLISHER</Title>
            <Button
              variant="outline"
              onClick={handleCancel}
              size="sm"
              disabled={loading}
            >
              Cancel
            </Button>
          </div>

          {error && (
            <Alert
              icon="🚨"
              color="red"
              title="Validation Error"
              mb="md"
              onClose={() => setError('')}
            >
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <TextInput
              label="Publisher Name"
              value={name}
              required
              onChange={(event) => setName(event.currentTarget.value)}
              placeholder="Enter publisher name"
              rightSection={<IconUser size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('name') ? error : ''}
              disabled={loading}
              maxLength={100}
            />

            <TextInput
              label="Street"
              value={street}
              required
              onChange={(event) => setStreet(event.currentTarget.value)}
              placeholder="Enter street address"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('street') ? error : ''}
              disabled={loading}
              maxLength={100}
            />

            <TextInput
              label="City"
              value={city}
              required
              onChange={(event) => setCity(event.currentTarget.value)}
              placeholder="Enter city"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('city') ? error : ''}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="State"
              value={state}
              onChange={(event) => setState(event.currentTarget.value)}
              placeholder="Enter state (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="Zip Code"
              value={zipCode}
              onChange={(event) => setZipCode(event.currentTarget.value)}
              placeholder="Enter zip code (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('zip') ? error : ''}
              disabled={loading}
              maxLength={10}
            />

            <TextInput
              label="Country"
              value={country}
              required
              onChange={(event) => setCountry(event.currentTarget.value)}
              placeholder="Enter country"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('country') ? error : ''}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="Region"
              value={region}
              onChange={(event) => setRegion(event.currentTarget.value)}
              placeholder="Enter region (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="Zone"
              value={zone}
              onChange={(event) => setZone(event.currentTarget.value)}
              placeholder="Enter zone (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="Woreda"
              value={woreda}
              onChange={(event) => setWoreda(event.currentTarget.value)}
              placeholder="Enter woreda (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="Kebele"
              value={kebele}
              onChange={(event) => setKebele(event.currentTarget.value)}
              placeholder="Enter kebele (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="Additional Info"
              value={additionalInfo}
              onChange={(event) => setAdditionalInfo(event.currentTarget.value)}
              placeholder="Enter additional info (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
              maxLength={500}
            />

            <TextInput
              label="District"
              value={district}
              onChange={(event) => setDistrict(event.currentTarget.value)}
              placeholder="Enter district (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
              maxLength={50}
            />

            <TextInput
              label="House Number"
              value={houseNumber}
              onChange={(event) => setHouseNumber(event.currentTarget.value)}
              placeholder="Enter house number (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
              maxLength={20}
            />

            <TextInput
              label="Subcity"
              value={subcity}
              onChange={(event) => setSubcity(event.currentTarget.value)}
              placeholder="Enter subcity (optional)"
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              disabled={loading}
              maxLength={50}
            />

            <Select
              label="Address Type"
              value={addressType}
              required
              onChange={setAddressType}
              placeholder="Select address type"
              data={addressTypes}
              rightSection={<IconHome size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('address type') ? error : ''}
              disabled={loading}
            />

            <FileInput
              label="Profile Picture"
              placeholder="Upload publisher logo (JPG, PNG)"
              accept="image/jpeg,image/png"
              onChange={setProfilePicture}
              value={profilePicture}
              required
              rightSection={<IconUpload size={20} />}
              style={{ maxWidth: 400, marginTop: 10 }}
              error={error.includes('picture') ? error : ''}
              disabled={loading}
            />

            <div style={{ gridColumn: 'span 2', display: 'flex', justifyContent: 'center', gap: '10px', marginTop: 20 }}>
              <Button
                type="submit"
                size="lg"
                leftSection={<IconUser size={20} />}
                loading={loading}
                disabled={loading}
                style={{ minWidth: 150 }}
              >
                {loading ? 'Creating...' : 'Create Publisher'}
              </Button>
              <Button
                variant="outline"
                onClick={handleCancel}
                size="lg"
                disabled={loading}
                style={{ minWidth: 150 }}
              >
                Cancel
              </Button>
            </div>
          </form>

          {/* Success/Error Notification */}
          {notification.message && (
            <Notification
              color={notification.type === 'success' ? 'green' : 'red'}
              title={notification.type === 'success' ? 'Success' : 'Error'}
              onClose={() => setNotification({ message: '', type: '' })}
              style={{
                position: 'fixed',
                bottom: 20,
                right: 20,
                zIndex: 1000,
                maxWidth: 400,
              }}
              withCloseButton
              withBorder
            >
              {notification.message}
            </Notification>
          )}
        </Container>
      </div>
    </Box>
  );
}