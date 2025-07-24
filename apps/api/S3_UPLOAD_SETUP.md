# S3 File Upload Setup

This guide explains how to set up and use the S3 file upload functionality in the API.

## Environment Variables

Add the following environment variables to your `.env` file:

```env
# AWS S3 Configuration
AWS_REGION=us-east-1
AWS_S3_BUCKET=your-s3-bucket-name
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
```

## S3 Bucket Setup

1. Create an S3 bucket in your AWS account
2. Configure the bucket for file uploads:
    - Enable CORS if needed for direct browser uploads
    - Set appropriate permissions
    - Consider enabling versioning for file recovery

## API Endpoints

### Upload Document

```http
POST /api/documents/upload
Content-Type: multipart/form-data
Authorization: Bearer <jwt-token>

Form Data:
- file: <file>
- clientId: <uuid>
- businessId: <uuid> (optional)
- documentType: <string>
- folderId: <uuid> (optional)
```

### Get Download URL

```http
GET /api/documents/{documentId}/download-url?expiresIn=3600
Authorization: Bearer <jwt-token>
```

### Delete Document

```http
DELETE /api/documents/{documentId}
Authorization: Bearer <jwt-token>
```

## Usage Examples

### Frontend Upload Example (JavaScript)

```javascript
const uploadDocument = async (file, clientId, documentType) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('clientId', clientId);
    formData.append('documentType', documentType);

    const response = await fetch('/api/documents/upload', {
        method: 'POST',
        headers: {
            Authorization: `Bearer ${token}`,
        },
        body: formData,
    });

    return response.json();
};
```

### Download File Example

```javascript
const downloadDocument = async (documentId) => {
    const response = await fetch(`/api/documents/${documentId}/download-url`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    const { downloadUrl } = await response.json();

    // Open the presigned URL in a new tab or download
    window.open(downloadUrl, '_blank');
};
```

## File Organization in S3

Files are organized in S3 with the following structure:

```
documents/
├── {userId}/
│   ├── {clientId}/
│   │   ├── {folderId}/
│   │   │   └── {fileId}.{extension}
│   │   └── {fileId}.{extension}
```

## Features

- **Secure Uploads**: Files are uploaded directly to S3 with proper authentication
- **Presigned URLs**: Secure, time-limited URLs for file downloads
- **File Metadata**: Original filename, size, and upload information are preserved
- **Organized Storage**: Files are organized by user and client for easy management
- **Automatic Cleanup**: When documents are deleted, S3 files are also removed

## Error Handling

The API includes comprehensive error handling for:

- Invalid file uploads
- S3 upload failures
- Missing permissions
- File not found errors
- Network timeouts

## Security Considerations

1. **Access Control**: All endpoints require JWT authentication
2. **File Validation**: File types and sizes should be validated on the frontend
3. **Presigned URLs**: Download URLs expire after a configurable time
4. **User Isolation**: Files are organized by user ID to prevent cross-user access
5. **S3 Permissions**: Ensure your S3 bucket has appropriate IAM policies

## Monitoring

The S3 service includes logging for:

- Successful uploads
- Failed uploads
- File deletions
- Presigned URL generation

Check your application logs for S3-related events.
