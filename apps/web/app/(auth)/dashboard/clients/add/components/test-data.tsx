'use client';
import React from 'react';
import { Button } from '@workspace/ui/components/button';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@workspace/ui/components/card';
import { Badge } from '@workspace/ui/components/badge';

// Test UTRs for different scenarios
export const TEST_UTRS = {
    // Valid UTRs for testing
    VALID_UTRS: [
        '1234567890', // Standard test UTR
        '9876543210', // Another test UTR
        '1111111111', // Additional test UTR
    ],

    // Invalid UTRs for validation testing
    INVALID_UTRS: [
        '123456789', // 9 digits - too short
        '12345678901', // 11 digits - too long
        '123456789a', // contains letters
        '123456789 ', // contains spaces
        '123456789.', // contains special characters
    ],

    // Test Agency IDs
    TEST_AGENCY_IDS: [
        'ARN123456', // Standard test ARN
        'ARN789012', // Another test ARN
    ],

    // Invalid Agency IDs
    INVALID_AGENCY_IDS: [
        '123456', // No ARN prefix
        'ARN123', // Too short
        'ARN1234567a', // Contains letters
    ],
};

// Test client data for different scenarios
export const TEST_CLIENT_DATA = {
    // Client with existing relationship
    EXISTING_RELATIONSHIP: {
        title: 'Mr',
        firstName: 'John',
        lastName: 'Smith',
        dob: '1985-05-15',
        nino: 'AB123456C',
        utr: '1234567890',
        email: 'john.smith@example.com',
        phoneNumber: '07123456789',
        addressLine1: '123 Test Street',
        addressLine2: 'Test Area',
        city: 'London',
        county: 'Greater London',
        postcode: 'SW1A 1AA',
        assignedTo: '', // Will be set dynamically
        clientCategory: 'standard',
        notes: 'Test client with existing relationship',
        sendWelcomeEmail: true,
        hmrcAuthorization: false,
    },

    // Client with no existing relationship
    NO_RELATIONSHIP: {
        title: 'Mrs',
        firstName: 'Jane',
        lastName: 'Doe',
        dob: '1990-08-22',
        nino: 'CD789012E',
        utr: '9876543210',
        email: 'jane.doe@example.com',
        phoneNumber: '07987654321',
        addressLine1: '456 New Street',
        addressLine2: 'New Area',
        city: 'Manchester',
        county: 'Greater Manchester',
        postcode: 'M1 1AA',
        assignedTo: '', // Will be set dynamically
        clientCategory: 'premium',
        notes: 'Test client with no existing relationship',
        sendWelcomeEmail: true,
        hmrcAuthorization: false,
    },

    // Client with invalid UTR
    INVALID_UTR: {
        title: 'Dr',
        firstName: 'Test',
        lastName: 'Invalid',
        dob: '1975-12-03',
        nino: 'EF345678G',
        utr: '123456789', // Invalid - too short
        email: 'test.invalid@example.com',
        phoneNumber: '07555123456',
        addressLine1: '789 Invalid Street',
        city: 'Birmingham',
        county: 'West Midlands',
        postcode: 'B1 1AA',
        assignedTo: '', // Will be set dynamically
        clientCategory: 'standard',
        notes: 'Test client with invalid UTR',
        sendWelcomeEmail: false,
        hmrcAuthorization: false,
    },
};

interface TestDataProps {
    onFillForm: (data: any) => void;
    staffUsers?: any[];
}

export default function TestData({ onFillForm, staffUsers }: TestDataProps) {
    const handleFillForm = (data: any) => {
        // Set assignedTo to first available staff user
        if (staffUsers && staffUsers.length > 0) {
            data.assignedTo = staffUsers[0].id;
        }
        onFillForm(data);
    };

    return (
        <Card className="mb-6">
            <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    🧪 Test Data
                    <Badge variant="secondary">Development Only</Badge>
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <div>
                        <h4 className="font-medium text-sm mb-2">
                            Test Scenarios:
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handleFillForm(
                                        TEST_CLIENT_DATA.EXISTING_RELATIONSHIP,
                                    )
                                }
                            >
                                Existing Relationship
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handleFillForm(
                                        TEST_CLIENT_DATA.NO_RELATIONSHIP,
                                    )
                                }
                            >
                                No Relationship
                            </Button>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                    handleFillForm(TEST_CLIENT_DATA.INVALID_UTR)
                                }
                            >
                                Invalid UTR
                            </Button>
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-sm mb-2">Test UTRs:</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                            {TEST_UTRS.VALID_UTRS.map((utr) => (
                                <Badge
                                    key={utr}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {utr}
                                </Badge>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h4 className="font-medium text-sm mb-2">
                            Test Agency IDs:
                        </h4>
                        <div className="grid grid-cols-2 gap-2">
                            {TEST_UTRS.TEST_AGENCY_IDS.map((arn) => (
                                <Badge
                                    key={arn}
                                    variant="outline"
                                    className="text-xs"
                                >
                                    {arn}
                                </Badge>
                            ))}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
