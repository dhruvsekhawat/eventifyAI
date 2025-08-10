'use client';

import { useState } from 'react';
import Link from 'next/link';

// Mock data for UI development
const mockVendors = [
  {
    id: '1',
    name: 'Elite Catering',
    serviceType: 'Catering',
    contactEmail: 'info@elitecatering.com',
    contactPhone: '(555) 123-4567',
    priceRange: '$$$',
    rating: 4.8,
    location: 'San Francisco, CA',
  },
  {
    id: '2',
    name: 'Sound & Vision AV',
    serviceType: 'Audio/Visual',
    contactEmail: 'bookings@soundvisionav.com',
    contactPhone: '(555) 234-5678',
    priceRange: '$$',
    rating: 4.5,
    location: 'Oakland, CA',
  },
  {
    id: '3',
    name: 'Elegant Decor',
    serviceType: 'Decoration',
    contactEmail: 'hello@elegantdecor.com',
    contactPhone: '(555) 345-6789',
    priceRange: '$$',
    rating: 4.7,
    location: 'San Jose, CA',
  },
  {
    id: '4',
    name: 'Premier Venues',
    serviceType: 'Venue',
    contactEmail: 'bookings@premiervenues.com',
    contactPhone: '(555) 456-7890',
    priceRange: '$$$$',
    rating: 4.9,
    location: 'San Francisco, CA',
  },
  {
    id: '5',
    name: 'Spotlight Entertainment',
    serviceType: 'Entertainment',
    contactEmail: 'info@spotlightent.com',
    contactPhone: '(555) 567-8901',
    priceRange: '$$$',
    rating: 4.6,
    location: 'Berkeley, CA',
  },
  {
    id: '6',
    name: 'Capture Moments Photography',
    serviceType: 'Photography',
    contactEmail: 'hello@capturemoments.com',
    contactPhone: '(555) 678-9012',
    priceRange: '$$',
    rating: 4.7,
    location: 'Palo Alto, CA',
  },
];

const serviceTypes = [
  'All',
  'Venue',
  'Catering',
  'Audio/Visual',
  'Decoration',
  'Entertainment',
  'Photography',
  'Transportation',
  'Staffing',
];

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedServiceType, setSelectedServiceType] = useState('All');
  const [selectedPriceRange, setSelectedPriceRange] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState('All');

  const filteredVendors = mockVendors.filter((vendor) => {
    // Filter by search term
    const matchesSearchTerm =
      searchTerm === '' ||
      vendor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.serviceType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      vendor.location.toLowerCase().includes(searchTerm.toLowerCase());

    // Filter by service type
    const matchesServiceType =
      selectedServiceType === 'All' || vendor.serviceType === selectedServiceType;

    // Filter by price range
    const matchesPriceRange =
      selectedPriceRange === 'All' || vendor.priceRange === selectedPriceRange;

    // Filter by location
    const matchesLocation =
      selectedLocation === 'All' || vendor.location.includes(selectedLocation);

    return matchesSearchTerm && matchesServiceType && matchesPriceRange && matchesLocation;
  });

  const locations = ['All', 'San Francisco, CA', 'Oakland, CA', 'San Jose, CA', 'Berkeley, CA', 'Palo Alto, CA'];
  const priceRanges = ['All', '$', '$$', '$$$', '$$$$'];

  const renderRatingStars = (rating: number) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 >= 0.5;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <svg
          key={`full-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    if (hasHalfStar) {
      stars.push(
        <svg
          key="half"
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-yellow-400"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    const emptyStars = 5 - stars.length;
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <svg
          key={`empty-${i}`}
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5 text-gray-300"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      );
    }

    return <div className="flex">{stars}</div>;
  };

  return (
    <div className="container mx-auto py-10 px-4">
      <h1 className="text-3xl font-bold mb-8">Vendor Directory</h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Search
            </label>
            <input
              type="text"
              id="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search vendors..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label htmlFor="serviceType" className="block text-sm font-medium text-gray-700 mb-1">
              Service Type
            </label>
            <select
              id="serviceType"
              value={selectedServiceType}
              onChange={(e) => setSelectedServiceType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {serviceTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="priceRange" className="block text-sm font-medium text-gray-700 mb-1">
              Price Range
            </label>
            <select
              id="priceRange"
              value={selectedPriceRange}
              onChange={(e) => setSelectedPriceRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {priceRanges.map((range) => (
                <option key={range} value={range}>
                  {range}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label htmlFor="location" className="block text-sm font-medium text-gray-700 mb-1">
              Location
            </label>
            <select
              id="location"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {locations.map((location) => (
                <option key={location} value={location}>
                  {location}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredVendors.length > 0 ? (
          filteredVendors.map((vendor) => (
            <div key={vendor.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h2 className="text-xl font-semibold">{vendor.name}</h2>
                  <span className="text-sm font-medium text-gray-600">{vendor.priceRange}</span>
                </div>
                <div className="flex items-center mb-4">
                  {renderRatingStars(vendor.rating)}
                  <span className="ml-2 text-sm text-gray-600">{vendor.rating.toFixed(1)}</span>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <p>
                    <span className="font-medium">Service:</span> {vendor.serviceType}
                  </p>
                  <p>
                    <span className="font-medium">Location:</span> {vendor.location}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {vendor.contactEmail}
                  </p>
                  <p>
                    <span className="font-medium">Phone:</span> {vendor.contactPhone}
                  </p>
                </div>
              </div>
              <div className="bg-gray-50 px-6 py-3 flex justify-between">
                <button className="text-sm text-blue-600 font-medium hover:text-blue-800">
                  View Details
                </button>
                <button className="text-sm text-green-600 font-medium hover:text-green-800">
                  Contact
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">No vendors found</h3>
            <p className="text-gray-600">Try adjusting your search filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
