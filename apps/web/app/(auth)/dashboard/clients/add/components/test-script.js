// UTR Relationship Feature - API Test Script
// Run this in browser console or Node.js environment

const API_BASE_URL = 'http://localhost:3000/api';
const JWT_TOKEN = 'YOUR_JWT_TOKEN_HERE'; // Replace with actual token

// Test data
const TEST_DATA = {
    validUtr: '1234567890',
    noRelationshipUtr: '9876543210',
    invalidUtr: '123456789',
    agencyId: 'ARN123456',
    knownFact: 'SW1A 1AA',
};

// Helper function to make API calls
async function makeApiCall(endpoint, method = 'GET', data = null) {
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${JWT_TOKEN}`,
        },
    };

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
        const result = await response.json();

        console.log(`✅ ${method} ${endpoint}:`, result);
        return result;
    } catch (error) {
        console.error(`❌ ${method} ${endpoint}:`, error);
        throw error;
    }
}

// Test 1: Check existing relationship
async function testExistingRelationship() {
    console.log('🧪 Test 1: Check Existing Relationship');
    return await makeApiCall('/hmrc/check-agency-relationship', 'POST', {
        utr: TEST_DATA.validUtr,
        agencyId: TEST_DATA.agencyId,
    });
}

// Test 2: Check no relationship
async function testNoRelationship() {
    console.log('🧪 Test 2: Check No Relationship');
    return await makeApiCall('/hmrc/check-agency-relationship', 'POST', {
        utr: TEST_DATA.noRelationshipUtr,
        agencyId: TEST_DATA.agencyId,
    });
}

// Test 3: Request relationship
async function testRequestRelationship() {
    console.log('🧪 Test 3: Request Relationship');
    return await makeApiCall('/hmrc/request-agency-relationship', 'POST', {
        utr: TEST_DATA.noRelationshipUtr,
        agencyId: TEST_DATA.agencyId,
        knownFact: TEST_DATA.knownFact,
    });
}

// Test 4: Get pending invitations
async function testPendingInvitations() {
    console.log('🧪 Test 4: Get Pending Invitations');
    return await makeApiCall(
        `/hmrc/pending-invitations?agencyId=${TEST_DATA.agencyId}`,
    );
}

// Test 5: Invalid UTR validation
async function testInvalidUtr() {
    console.log('🧪 Test 5: Invalid UTR Validation');
    try {
        await makeApiCall('/hmrc/check-agency-relationship', 'POST', {
            utr: TEST_DATA.invalidUtr,
            agencyId: TEST_DATA.agencyId,
        });
    } catch (error) {
        console.log('✅ Expected error for invalid UTR:', error.message);
    }
}

// Test 6: Invalid Agency ID validation
async function testInvalidAgencyId() {
    console.log('🧪 Test 6: Invalid Agency ID Validation');
    try {
        await makeApiCall('/hmrc/check-agency-relationship', 'POST', {
            utr: TEST_DATA.validUtr,
            agencyId: 'INVALID123',
        });
    } catch (error) {
        console.log('✅ Expected error for invalid Agency ID:', error.message);
    }
}

// Run all tests
async function runAllTests() {
    console.log('🚀 Starting UTR Relationship Feature Tests...\n');

    try {
        await testExistingRelationship();
        console.log('');

        await testNoRelationship();
        console.log('');

        await testRequestRelationship();
        console.log('');

        await testPendingInvitations();
        console.log('');

        await testInvalidUtr();
        console.log('');

        await testInvalidAgencyId();
        console.log('');

        console.log('✅ All tests completed!');
    } catch (error) {
        console.error('❌ Test suite failed:', error);
    }
}

// Individual test functions for manual testing
window.testUTRFeature = {
    testExistingRelationship,
    testNoRelationship,
    testRequestRelationship,
    testPendingInvitations,
    testInvalidUtr,
    testInvalidAgencyId,
    runAllTests,
};

// Auto-run tests if in browser console
if (typeof window !== 'undefined') {
    console.log('🧪 UTR Relationship Feature Test Script Loaded');
    console.log('Run window.testUTRFeature.runAllTests() to execute all tests');
    console.log(
        'Or run individual tests like window.testUTRFeature.testExistingRelationship()',
    );
}

// Export for Node.js
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        testExistingRelationship,
        testNoRelationship,
        testRequestRelationship,
        testPendingInvitations,
        testInvalidUtr,
        testInvalidAgencyId,
        runAllTests,
    };
}
