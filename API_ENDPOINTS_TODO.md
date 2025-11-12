# 📋 Frontend API Endpoints - Todo List

This document outlines all API endpoints that are commented in the frontend and need backend implementation. The frontend currently uses localStorage as a fallback for testing purposes.

---

## 🔧 Endpoints to Implement

### 1. **Resume Management Endpoints**

#### 1.1 Fetch User's Resumes
**File:** `src/components/candidate/JobApplicationModal.tsx` (Lines 50-62)
**Status:** ❌ COMMENTED - TODO: Uncomment when backend CORS is fixed
**Endpoint:** 
```
GET /api/candidate/resumes/v1/candidate?email={email}
```
**Query Parameters:**
- `email` (string): User's email address

**Expected Response:**
```json
[
  {
    "resumeId": 1,
    "fileName": "John_Doe_Resume.pdf",
    "uploadedAt": "2025-10-22T10:30:00Z",
    "isDefault": true,
    "fileSize": 245000,
    "fileUrl": "https://blob-storage-url/resume-1.pdf",
    "fileType": "application/pdf",
    "candidateId": "user123"
  }
]
```

**Authentication:** ✅ Bearer Token required

---

#### 1.2 Upload Resume
**File:** `src/components/candidate/JobApplicationModal.tsx` (Lines 110-131)
**Status:** ❌ COMMENTED - TODO: Uncomment when backend CORS is fixed
**Endpoint:**
```
POST /api/candidate/resumes/v1/upload
```

**Request Format:** FormData
```
- file: File (PDF, DOC, DOCX)
- email: string
- setAsDefault: boolean
```

**Expected Response:**
```json
{
  "resumeId": 1,
  "fileName": "John_Doe_Resume.pdf",
  "uploadedAt": "2025-10-22T10:30:00Z",
  "isDefault": true,
  "fileUrl": "https://blob-storage-url/resume-1.pdf",
  "fileSize": 245000
}
```

**Authentication:** ✅ Bearer Token required
**Validation:**
- File types: PDF, DOCX, DOC
- Max file size: 5MB

---

### 2. **Application Endpoints**

#### 2.1 Apply to Job (Enhanced)
**File:** `src/components/candidate/JobApplicationModal.tsx` (Lines 184-198)
**Status:** ❌ COMMENTED - TODO: Uncomment when backend CORS is fixed
**Endpoint:**
```
POST /api/applications/v1/apply
```

**Request Body:**
```json
{
  "jobId": 123,
  "candidateId": "user123",
  "notes": "string",
  "resumeId": 1,
  "coverLetter": "string"
}
```

**Expected Response:**
```json
{
  "applicationId": 456,
  "jobId": 123,
  "candidateId": "user123",
  "status": "submitted",
  "appliedDate": "2025-10-22T10:30:00Z"
}
```

**Authentication:** ✅ Bearer Token required
**New Fields Added:** 
- ⭐ `resumeId` - Reference to uploaded resume
- ⭐ `coverLetter` - Additional cover letter text

---

#### 2.2 Fetch Applied Jobs
**File:** `src/app/candidate/jobs/page.tsx` (Lines 61-72)
**Status:** ❌ COMMENTED - TODO: Uncomment when backend CORS is fixed
**Endpoint:**
```
GET /api/applications/v1/candidate/{userId}
```

**URL Parameters:**
- `userId` (string): Candidate's user ID

**Expected Response:**
```json
[
  {
    "applicationId": 456,
    "jobId": 123,
    "candidateId": "user123",
    "appliedDate": "2025-10-22T10:30:00Z",
    "status": "under_review",
    "resumeId": 1,
    "coverLetter": "Optional cover letter text"
  }
]
```

**Authentication:** ✅ Bearer Token required
**Currently Working:** ✅ YES - Using live backend
**Note:** When no applications exist, backend returns BUSINESS_ERROR, which frontend now treats as empty state

---

### 3. **Analytics Endpoints**

#### 3.1 Application Timeline/Analytics
**File:** `src/app/candidate/applications/page.tsx` (Line 177)
**Status:** ❌ COMMENTED - TODO: Replace when timeline endpoint exists
**Endpoint:**
```
GET /api/applications/v1/timeline?candidateId={userId}&months={months}
```

**Query Parameters:**
- `candidateId` (string): User ID
- `months` (number): Number of months to retrieve (1, 3, 6)

**Expected Response:**
```json
[
  {
    "month": "September 2025",
    "applications": 2,
    "interviewed": 1,
    "accepted": 0
  },
  {
    "month": "October 2025",
    "applications": 5,
    "interviewed": 2,
    "accepted": 1
  }
]
```

**Authentication:** ✅ Bearer Token required
**Current Status:** Currently calculated client-side from applications list

---

## 📊 Summary Table

| Endpoint | Method | File | Status | Priority |
|----------|--------|------|--------|----------|
| `/api/candidate/resumes/v1/candidate?email=` | GET | JobApplicationModal.tsx | ❌ Commented | 🔴 High |
| `/api/candidate/resumes/v1/upload` | POST | JobApplicationModal.tsx | ❌ Commented | 🔴 High |
| `/api/applications/v1/apply` | POST | JobApplicationModal.tsx | ❌ Commented | 🔴 High |
| `/api/applications/v1/candidate/{userId}` | GET | Jobs page | ❌ Commented | 🟠 Medium |
| `/api/applications/v1/timeline` | GET | Applications page | ❌ Commented | 🟡 Low |

---

## 🔄 Current Workarounds

### Resume Management
- ✅ Using localStorage with key: `resumes_{userId}`
- ✅ Resume data persists across sessions in browser

### Applied Jobs Tracking
- ✅ Using localStorage with key: `applications_{userId}` and `applied_jobs_{userId}`
- ✅ Allows users to track applications locally

### Saved Jobs
- ✅ Using localStorage with key: `saved_jobs_{userId}`
- ✅ Users can save/unsave jobs for later

### Timeline/Analytics
- ✅ Currently calculated from applications list
- ✅ No need to wait for backend endpoint initially

---

## 🚀 Implementation Checklist

### Phase 1: Resume Management (Must Have)
- [ ] Implement GET `/api/candidate/resumes/v1/candidate?email={email}`
- [ ] Implement POST `/api/candidate/resumes/v1/upload` with Azure Blob Storage
- [ ] Uncomment code in JobApplicationModal.tsx
- [ ] Test resume upload and listing

### Phase 2: Application Enhancements (Must Have)
- [ ] Add `resumeId` field to application submission
- [ ] Add `coverLetter` field to application submission
- [ ] Uncomment code in JobApplicationModal.tsx
- [ ] Test job application with resume and cover letter

### Phase 3: Analytics (Nice to Have)
- [ ] Implement GET `/api/applications/v1/timeline`
- [ ] Uncomment code in applications page
- [ ] Replace client-side calculation with backend data

### Phase 4: CORS Configuration (Important)
- [ ] Configure CORS headers for resume upload endpoint
- [ ] Allow file multipart/form-data uploads
- [ ] Ensure Bearer token authentication works

---

## 🔐 Security Notes

All endpoints require:
- ✅ JWT Bearer token in Authorization header
- ✅ User ID validation on backend
- ✅ CORS headers properly configured
- ✅ File upload validation (type, size)
- ✅ Malware/virus scanning for uploads

---

## 📝 How to Use This Document

1. **For Backend Team:**
   - Use this as a specification for API implementation
   - Follow the request/response formats exactly
   - Ensure all fields are included

2. **For Frontend Team:**
   - When backend is ready, simply uncomment the TODO code
   - No changes to frontend logic needed
   - Swap localStorage fallback with real API calls

3. **For Project Manager:**
   - Track implementation against this checklist
   - Prioritize Phase 1 and Phase 2 first
   - Phase 3 and 4 can be done later

---

## 📞 Questions?

If you need clarification on any endpoint:
1. Check the commented code in the respective file
2. See the request/response JSON examples above
3. Refer to the comprehensive API review document
