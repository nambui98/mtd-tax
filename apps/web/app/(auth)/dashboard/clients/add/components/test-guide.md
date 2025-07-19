# UTR Relationship Feature - Test Guide

## 🧪 Test Scenarios

### 1. **Create Client with Existing Relationship**

**Steps:**

1. Navigate to `/dashboard/clients/add`
2. Click "Existing Relationship" test button (in development mode)
3. Verify form is filled with test data:
    - UTR: `1234567890`
    - Name: John Smith
    - Email: john.smith@example.com
4. Click "Add Client"
5. **Expected Result:**
    - Client created successfully
    - Relationship popup shows "Connection Established"
    - Green checkmark icon
    - Shows relationship details (status: active, services: MTD-IT, MTD-VAT)
    - "Close" button only

**API Test:**

```bash
curl -X POST http://localhost:3000/api/hmrc/check-agency-relationship \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "utr": "1234567890",
    "agencyId": "ARN123456"
  }'
```

**Expected Response:**

```json
{
    "hasRelationship": true,
    "relationshipData": {
        "service": ["MTD-IT", "MTD-VAT"],
        "status": "active",
        "arn": "ARN123456",
        "clientId": "1234567890",
        "clientIdType": "utr",
        "checkedAt": "2024-01-01T00:00:00Z"
    }
}
```

### 2. **Create Client with No Existing Relationship**

**Steps:**

1. Navigate to `/dashboard/clients/add`
2. Click "No Relationship" test button
3. Verify form is filled with test data:
    - UTR: `9876543210`
    - Name: Jane Doe
    - Email: jane.doe@example.com
4. Click "Add Client"
5. **Expected Result:**
    - Client created successfully
    - Relationship popup shows "Request Agency Connection"
    - Orange alert icon
    - Shows "No existing relationship found"
    - "Request Relationship" and "Cancel" buttons
6. Click "Request Relationship"
7. **Expected Result:**
    - Loading state on button
    - Success message: "Relationship invitation sent successfully"
    - Navigation to clients list

**API Test:**

```bash
curl -X POST http://localhost:3000/api/hmrc/request-agency-relationship \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "utr": "9876543210",
    "agencyId": "ARN123456",
    "knownFact": "M1 1AA"
  }'
```

**Expected Response:**

```json
{
    "success": true,
    "invitationId": "inv-123456",
    "message": "Relationship invitation sent successfully. The client will receive a notification to authorize the relationship.",
    "status": "pending"
}
```

### 3. **Create Client with Invalid UTR**

**Steps:**

1. Navigate to `/dashboard/clients/add`
2. Click "Invalid UTR" test button
3. Verify form is filled with invalid UTR: `123456789` (9 digits)
4. Click "Add Client"
5. **Expected Result:**
    - Form validation error: "Invalid UTR format. UTR must be exactly 10 digits."
    - Client creation should fail

**API Test:**

```bash
curl -X POST http://localhost:3000/api/hmrc/check-agency-relationship \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "utr": "123456789",
    "agencyId": "ARN123456"
  }'
```

**Expected Response:**

```json
{
    "statusCode": 400,
    "message": "Invalid UTR format. UTR must be exactly 10 digits.",
    "error": "Bad Request"
}
```

### 4. **Test Pending Invitations**

**Steps:**

1. After requesting a relationship, check pending invitations
2. Navigate to a page where you can view pending invitations
3. **Expected Result:**
    - Shows list of pending invitations
    - Each invitation shows UTR, status, services, and created date
    - Status badges: Pending (yellow), Accepted (green), Rejected (red)

**API Test:**

```bash
curl -X GET "http://localhost:3000/api/hmrc/pending-invitations?agencyId=ARN123456" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN"
```

**Expected Response:**

```json
{
    "invitations": [
        {
            "invitationId": "inv-123456",
            "clientId": "9876543210",
            "clientIdType": "utr",
            "service": ["MTD-IT", "MTD-VAT"],
            "status": "pending",
            "createdDate": "2024-01-01T00:00:00Z"
        }
    ]
}
```

## 🔍 Manual Testing Checklist

### Form Validation Tests:

- [ ] Valid UTR (10 digits) - should pass
- [ ] Invalid UTR (9 digits) - should show error
- [ ] Invalid UTR (11 digits) - should show error
- [ ] Invalid UTR (contains letters) - should show error
- [ ] Valid Agency ID (ARN format) - should pass
- [ ] Invalid Agency ID (no ARN prefix) - should show error

### Relationship Check Tests:

- [ ] Existing relationship - shows green popup
- [ ] No relationship - shows orange popup
- [ ] API error - shows error message
- [ ] Network error - shows fallback message

### Relationship Request Tests:

- [ ] Valid request - shows success message
- [ ] Duplicate request - shows error message
- [ ] Invalid client - shows error message
- [ ] Network error - shows error message

### UI/UX Tests:

- [ ] Loading states during API calls
- [ ] Proper error messages
- [ ] Success messages
- [ ] Navigation after completion
- [ ] Form validation messages
- [ ] Responsive design

## 🐛 Common Issues & Debugging

### Issue: "Failed to check agency relationship"

**Debug Steps:**

1. Check browser console for error details
2. Verify JWT token is valid
3. Check HMRC API connectivity
4. Verify UTR format is correct

### Issue: "Invalid UTR format"

**Debug Steps:**

1. Ensure UTR is exactly 10 digits
2. Remove any spaces or special characters
3. Check form validation rules

### Issue: "Agent not authorized"

**Debug Steps:**

1. Verify user has proper HMRC agent permissions
2. Check agency ID format (must start with ARN)
3. Ensure HMRC OAuth token is valid

### Issue: "Client not found in HMRC records"

**Debug Steps:**

1. Verify UTR exists in HMRC system
2. Check if client is registered with HMRC
3. Try with different test UTR

## 📊 Test Data Reference

### Valid Test UTRs:

- `1234567890` - Existing relationship
- `9876543210` - No relationship
- `1111111111` - Additional test

### Test Agency IDs:

- `ARN123456` - Standard test ARN
- `ARN789012` - Additional test ARN

### Test Client Data:

- **Existing Relationship**: John Smith (john.smith@example.com)
- **No Relationship**: Jane Doe (jane.doe@example.com)
- **Invalid UTR**: Test Invalid (test.invalid@example.com)

## 🚀 Performance Testing

### Load Testing:

- Test with multiple concurrent relationship checks
- Verify API response times
- Check memory usage during bulk operations

### Error Handling:

- Test with network interruptions
- Test with invalid API responses
- Test with rate limiting scenarios

## ✅ Success Criteria

The feature is working correctly when:

1. ✅ Client creation succeeds with valid data
2. ✅ Relationship check works for both scenarios
3. ✅ Relationship request sends invitation via HMRC
4. ✅ Error handling works for all edge cases
5. ✅ UI shows appropriate loading and success states
6. ✅ Form validation prevents invalid submissions
7. ✅ Navigation works correctly after completion
