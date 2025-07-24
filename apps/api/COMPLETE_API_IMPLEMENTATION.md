# Complete API Implementation for Document Upload Dialog

This document outlines the complete API implementation for the document upload dialog and client documents management system.

## Overview

The implementation includes:

- Document upload with S3 storage
- AI-powered transaction extraction
- Bulk transaction management
- Document processing status tracking
- Export functionality
- Real-time status updates

## API Endpoints

### Document Management

#### Upload Document

```http
POST /api/documents/upload
Content-Type: multipart/form-data

{
  "file": <file>,
  "clientId": "uuid",
  "businessId": "uuid", // optional
  "documentType": "receipt|invoice|statement|tax",
  "folderId": "uuid" // optional
}
```

#### Get Documents

```http
GET /api/documents?clientId=uuid&businessId=uuid&documentType=receipt&status=processed&search=invoice
```

#### Get Document by ID

```http
GET /api/documents/{documentId}
```

#### Delete Document

```http
DELETE /api/documents/{documentId}
```

#### Get Document Download URL

```http
GET /api/documents/{documentId}/download-url?expiresIn=3600
```

### Transaction Management

#### Get Document Transactions

```http
GET /api/documents/{documentId}/transactions
```

#### Create Single Transaction

```http
POST /api/documents/transactions
{
  "documentId": "uuid",
  "clientId": "uuid",
  "businessId": "uuid", // optional
  "transactionDate": "2026-04-15",
  "description": "Client Payment",
  "category": "SALES_INCOME",
  "amount": 5000.00,
  "currency": "GBP", // optional
  "isAIGenerated": false, // optional
  "aiConfidence": 0.95, // optional
  "notes": "Payment for project" // optional
}
```

#### Create Bulk Transactions

```http
POST /api/documents/transactions/bulk
{
  "documentId": "uuid",
  "transactions": [
    {
      "transactionDate": "2026-04-15",
      "description": "Client Payment",
      "category": "SALES_INCOME",
      "amount": 5000.00,
      "currency": "GBP",
      "isAIGenerated": true,
      "aiConfidence": 0.95,
      "notes": "Payment for project"
    }
  ]
}
```

#### Update Bulk Transactions

```http
PUT /api/documents/transactions/bulk
{
  "transactions": [
    {
      "id": "uuid",
      "transactionDate": "2026-04-15",
      "description": "Updated description",
      "category": "SALES_INCOME",
      "amount": 5000.00,
      "status": "approved"
    }
  ]
}
```

#### Delete Bulk Transactions

```http
DELETE /api/documents/transactions/bulk
{
  "transactionIds": ["uuid1", "uuid2", "uuid3"]
}
```

#### Approve Transaction

```http
POST /api/documents/transactions/{transactionId}/approve
```

#### Reject Transaction

```http
POST /api/documents/transactions/{transactionId}/reject
{
  "reason": "Invalid transaction"
}
```

### Document Processing

#### Process Document

```http
POST /api/documents/{documentId}/process
```

#### Get Processing Status

```http
GET /api/documents/{documentId}/processing-status
```

#### Approve All Transactions

```http
POST /api/documents/{documentId}/approve-all
```

### Export Functionality

#### Export Document Transactions

```http
POST /api/documents/{documentId}/export
{
  "format": "csv|excel|pdf",
  "includeMetadata": true // optional
}
```

### Categories and Metadata

#### Get Transaction Categories

```http
GET /api/documents/categories
```

#### Get Document Statistics

```http
GET /api/documents/stats?clientId=uuid
```

## Frontend Integration

### Upload Dialog Component

The `UploadDialog` component provides:

- Drag and drop file upload
- Real-time upload progress
- AI processing status tracking
- Transaction management interface
- Bulk operations support

### Client Documents Component

The `ClientDocuments` component provides:

- Document listing with filters
- Search functionality
- Download and delete operations
- Statistics display
- Integration with upload dialog

## Database Schema

### Documents Table

```sql
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  userId UUID NOT NULL REFERENCES users(id),
  clientId UUID NOT NULL REFERENCES clients(id),
  businessId TEXT,
  fileName TEXT NOT NULL,
  originalFileName TEXT NOT NULL,
  fileSize INTEGER NOT NULL,
  fileType TEXT NOT NULL,
  mimeType TEXT NOT NULL,
  filePath TEXT NOT NULL,
  documentType TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'uploaded',
  processingStatus TEXT NOT NULL DEFAULT 'pending',
  aiExtractedTransactions INTEGER DEFAULT 0,
  aiAccuracy DECIMAL(3,2) DEFAULT 0.00,
  uploadedAt TIMESTAMP NOT NULL DEFAULT NOW(),
  processedAt TIMESTAMP,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);
```

### Document Transactions Table

```sql
CREATE TABLE document_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  documentId UUID NOT NULL REFERENCES documents(id) ON DELETE CASCADE,
  userId UUID NOT NULL REFERENCES users(id),
  clientId UUID NOT NULL REFERENCES clients(id),
  businessId TEXT,
  transactionDate DATE NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  amount DECIMAL(10,2) NOT NULL,
  currency TEXT NOT NULL DEFAULT 'GBP',
  status TEXT NOT NULL DEFAULT 'pending',
  isAIGenerated BOOLEAN NOT NULL DEFAULT false,
  aiConfidence DECIMAL(3,2) DEFAULT 0.00,
  notes TEXT,
  createdAt TIMESTAMP NOT NULL DEFAULT NOW(),
  updatedAt TIMESTAMP NOT NULL DEFAULT NOW()
);
```

## S3 Integration

### File Organization

```
documents/
├── {userId}/
│   ├── {clientId}/
│   │   ├── {folderId}/
│   │   │   └── {filename}
│   │   └── {filename}
│   └── {clientId}/
│       └── {filename}
```

### Security Features

- Presigned URLs for secure access
- User-based file isolation
- Automatic cleanup on deletion
- CORS configuration for browser uploads

## AI Processing Pipeline

### Processing Steps

1. **Upload**: File uploaded to S3
2. **Processing**: AI extracts transactions
3. **Categorization**: Automatic category assignment
4. **Verification**: User review and approval
5. **Export**: Data export for HMRC submission

### Transaction Categories

- **Income**: Sales, Consulting, Property, Interest, Other
- **Expenses**: Office, Software, Travel, Utilities, Professional Fees, etc.

## Error Handling

### Common Error Scenarios

- File upload failures
- S3 access issues
- AI processing errors
- Database constraint violations
- Invalid file formats

### Error Responses

```json
{
    "error": "Upload failed",
    "message": "File size exceeds limit",
    "code": "FILE_TOO_LARGE",
    "details": {
        "maxSize": "10MB",
        "actualSize": "15MB"
    }
}
```

## Security Considerations

### Authentication

- JWT token required for all endpoints
- User-based access control
- Client-specific document isolation

### File Security

- S3 bucket policies
- Presigned URL expiration
- File type validation
- Size limits enforcement

### Data Protection

- GDPR compliance
- Data retention policies
- Secure deletion procedures

## Monitoring and Logging

### Application Logs

- Upload success/failure
- Processing status changes
- Error tracking
- Performance metrics

### S3 Monitoring

- Storage usage
- Access patterns
- Cost optimization
- Security events

## Performance Optimization

### Caching Strategy

- Document metadata caching
- Category list caching
- Processing status caching
- Query result caching

### Database Optimization

- Indexed queries
- Connection pooling
- Query optimization
- Partitioning for large datasets

## Testing

### Unit Tests

- Service layer testing
- API endpoint testing
- Error handling validation
- Data transformation testing

### Integration Tests

- S3 upload/download
- Database operations
- AI processing pipeline
- End-to-end workflows

### Load Testing

- Concurrent uploads
- Large file handling
- Database performance
- S3 throughput

## Deployment

### Environment Variables

```bash
# S3 Configuration
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_REGION=us-east-1
S3_BUCKET_NAME=your_bucket_name

# Database
DATABASE_URL=postgresql://user:pass@host:port/db

# AI Processing
AI_SERVICE_URL=https://ai-service.example.com
AI_API_KEY=your_ai_api_key

# Security
JWT_SECRET=your_jwt_secret
CORS_ORIGIN=https://your-frontend.com
```

### Docker Configuration

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

## Future Enhancements

### Planned Features

- Real-time processing updates via WebSocket
- Advanced AI categorization
- Batch processing capabilities
- Integration with HMRC APIs
- Mobile app support
- Advanced reporting and analytics

### Scalability Improvements

- Microservices architecture
- Event-driven processing
- Horizontal scaling
- Global CDN integration
- Advanced caching strategies

## Support and Maintenance

### Documentation

- API documentation with Swagger
- Integration guides
- Troubleshooting guides
- Best practices documentation

### Monitoring

- Application performance monitoring
- Error tracking and alerting
- Usage analytics
- Cost monitoring

### Maintenance

- Regular security updates
- Database maintenance
- S3 lifecycle policies
- Performance optimization

This implementation provides a complete, production-ready solution for document upload and transaction management with AI-powered processing capabilities.
