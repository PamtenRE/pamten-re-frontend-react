# 📚 API Documentation - Complete Candidate Workflow

**Date:** October 23, 2025  
**Version:** 1.0  
**Purpose:** Comprehensive specification of all API endpoints needed for the complete candidate application workflow

---

## 📋 Table of Contents

1. [Existing API Endpoints](#existing-api-endpoints)
2. [Candidate Homepage Workflow](#candidate-homepage-workflow)
3. [Applied Jobs & Applications Workflow](#applied-jobs--applications-workflow)
4. [Job Application Workflow](#job-application-workflow)
5. [Candidate Profile Workflow](#candidate-profile-workflow)
6. [Missing Fields Summary](#missing-fields-summary)
7. [Data Models](#data-models)
8. [Authentication & Security](#authentication--security)

---

## 🔗 Existing API Endpoints

These endpoints are currently **WORKING** and being used by the frontend:

### 1. Authentication Endpoints

#### 1.1 User Login
**Endpoint:** `POST /api/auth/v1/login`  
**Status:** ✅ WORKING  
**File:** `src/contexts/AuthContext.tsx`  

**Request Body:**
```json
{
  "userId": "string",
  "password": "string"
}
```

**Expected Response:**
```json
{
  "token": "jwt-token-string",
  "user": {
    "userId": "string",
    "email": "string",
    "name": "string",
    "role": "candidate|recruiter",
    "profileCompleted": "boolean",
    "location": "string"
  }
}
```

**Notes:**
- Returns JWT token for authenticated requests
- User role should be "candidate" for candidate flow
- Profile data is minimal and should be enhanced

---

#### 1.2 User Registration
**Endpoint:** `POST /api/auth/v1/register`  
**Status:** ✅ WORKING  
**File:** `src/contexts/AuthContext.tsx`

**Request Body:**
```json
{
  "fullName": "string",
  "email": "string",
  "password": "string",
  "phone": "string",
  "roleName": "candidate|recruiter"
}
```

**Expected Response:**
```json
{
  "success": true,
  "message": "Registration successful"
}
```

---

### 2. Job Endpoints

#### 2.1 Get All Jobs
**Endpoint:** `GET /api/jobs/v1/all`  
**Status:** ✅ WORKING  
**File:** `src/app/candidate/home/page.tsx:70`  
**File:** `src/app/candidate/jobs/page.tsx:44`

**Query Parameters:** None

**Expected Response:**
```json
{
  "jobs": [
    {
      "jobId": "string|number",
      "title": "string",
      "organizationName": "string",
      "description": "string",
      "city": "string",
      "state": "string",
      "postedDate": "ISO-8601-date",
      "jobType": "Full-time|Part-time|Contract|Remote",
      "requiredSkills": "comma-separated-string",
      "salary": "string (optional)"
    }
  ]
}
```

**Current Usage:**
- Homepage shows first 6 jobs
- Jobs page shows all with search/filter

---

### 3. Applications Endpoints

#### 3.1 Get Candidate's Applications
**Endpoint:** `GET /api/applications/v1/candidate/{userId}`  
**Status:** ✅ WORKING (with error handling for empty)  
**File:** `src/app/candidate/applications/page.tsx:116`  
**File:** `src/components/candidate/AppliedJobsSection.tsx:49`

**URL Parameters:**
- `userId` (string): Candidate's user ID from auth

**Expected Response:**
```json
[
  {
    "id": "string",
    "applicationId": "string|number",
    "jobId": "string",
    "company": "string",
    "position": "string",
    "status": "under_review|interview_scheduled|accepted|rejected|scheduled",
    "appliedDate": "ISO-8601-date",
    "department": "string (optional)",
    "location": "string (optional)",
    "salaryRange": "string (optional)",
    "applicationStages": [
      {
        "stage": "string",
        "completed": "boolean"
      }
    ]
  }
]
```

**Error Handling:**
- When no applications: Returns `BUSINESS_ERROR` - Frontend treats as empty state
- Frontend displays: "No Applications Yet"

**Current Issues:**
- ❌ Missing `applicationStages` field - Needed for progress tracking
- ❌ Missing `coverLetter` field - Should store with application
- ❌ Missing `resumeUsed` field - Track which resume was used
- ❌ Missing application timeline data

---

#### 3.2 Submit Job Application
**Endpoint:** `POST /api/applications/v1/apply`  
**Status:** ✅ WORKING (basic)  
**File:** `src/app/candidate/home/page.tsx:88`

**Request Body:**
```json
{
  "jobId": "string",
  "candidateId": "string"
}
```

**Expected Response:**
```json
{
  "applicationId": "string|number",
  "status": "submitted|success",
  "message": "Application submitted successfully"
}
```

**Current Issues:**
- ❌ Missing `resumeId` field - Should specify which resume to use
- ❌ Missing `coverLetter` field - Should accept cover letter text
- ❌ Missing `notes` field - Should accept additional notes
- ❌ Should return `applicationStages` for progress tracking

**Enhanced Request (Needed):**
```json
{
  "jobId": "string",
  "candidateId": "string",
  "resumeId": "number",
  "coverLetter": "string",
  "notes": "string"
}
```

---

#### 3.3 Withdraw Application
**Endpoint:** `DELETE /api/applications/v1/{applicationId}?candidateId={candidateId}`  
**Status:** ✅ WORKING  
**File:** `src/app/candidate/applications/page.tsx:475`

**URL Parameters:**
- `applicationId` (string): Application ID to withdraw
- `candidateId` (query param): Candidate's user ID

**Expected Response:**
```json
{
  "success": true,
  "message": "Application withdrawn successfully"
}
```

---

## 🏠 Candidate Homepage Workflow

**Page:** `/candidate/home`  
**File:** `src/app/candidate/home/page.tsx`

### Current Data Flow:

1. **Welcome Section** (Lines 103-124)
   - Shows: `user.email`, `user.location`
   - ❌ Missing fields in User object:
     - `firstName` - For personalized greeting
     - `lastName` - For full name display
     - `profileCompletionPercentage` - For progress tracking

2. **Profile Progress Card** (Lines 127-133)
   - Shows: `profileProgress`
   - ❌ What's needed:
     - Clear calculation of profile completion
     - Break down by field (resume, skills, education, etc.)
     - Show which fields are missing

3. **Recommended Jobs Section** (Lines 135-148)
   - Endpoint: `GET /api/jobs/v1/all` (Line 70)
   - Shows: First 6 jobs
   - ❌ Missing fields in Job object:
     - `matchScore` - Show job relevance (0-100%)
     - `isRecommended` - AI-recommended flag
     - `salaryMin` / `salaryMax` - Numeric salary values
     - `benefits` - List of benefits
     - `jobDescription` - Full description

4. **Applied Jobs Section** (Lines 185-188)
   - Component: `AppliedJobsSection`
   - Shows: Recent 3 applications
   - ❌ Missing fields in Application:
     - `applicationStages` - For progress blobs
     - `lastUpdated` - When status last changed
     - `interviewDate` - If interview scheduled
     - `feedback` - Any recruiter feedback

---

## 📊 Applied Jobs & Applications Workflow

**Page:** `/candidate/applications`  
**File:** `src/app/candidate/applications/page.tsx`

### Current Data Display:

1. **Applications List** (Lines 285-602)
   - Endpoint: `GET /api/applications/v1/candidate/{userId}` (Line 116)
   - Shows: All applications with expandable details
   
   **Displayed Fields:**
   - `company` - Company name
   - `position` - Job title
   - `appliedDate` - Application date
   - `status` - Current status
   - `applicationStages` - Progress tracking
   - `department`, `location`, `salaryRange` - In expanded view

   **❌ Missing Fields:**
   - `applicationStages` - Critical for progress blob visualization
   - `coverLetter` - Candidate's cover letter
   - `resumeUsed` - Which resume was used
   - `recruiterNotes` - Any feedback from recruiter
   - `interviewDetails` - If interview is scheduled
   - `offerDetails` - If offer made

2. **Status Filtering** (Lines 207-220)
   - Current statuses supported:
     - ✅ `under_review`
     - ✅ `interview_scheduled`
     - ✅ `scheduled`
     - ✅ `rejected`
     - ✅ `accepted`

3. **Analytics Section** (Lines 606-795)
   - Endpoint needed: `GET /api/applications/v1/timeline?candidateId={userId}&months={1|3|6}`
   - Currently: Calculated client-side from applications
   - ❌ Missing backend endpoint for timeline data

   **Expected Timeline Response:**
   ```json
   [
     {
       "month": "September 2025",
       "applications": 2,
       "interviewed": 1,
       "accepted": 0,
       "rejected": 0
     }
   ]
   ```

---

## 💼 Job Application Workflow

**Component:** `JobApplicationModal`  
**File:** `src/components/candidate/JobApplicationModal.tsx`

### Workflow Steps:

1. **Load Resumes** (Lines 50-62) - COMMENTED
   - Endpoint: `GET /api/candidate/resumes/v1/candidate?email={email}`
   - ❌ Not implemented yet
   - Shows: User's uploaded resumes
   - Missing fields in Resume:
     - `fileUrl` - Azure blob storage URL
     - `fileSize` - Resume file size
     - `fileType` - MIME type

2. **Upload Resume** (Lines 110-131) - COMMENTED
   - Endpoint: `POST /api/candidate/resumes/v1/upload`
   - ❌ Not implemented yet
   - Accepts: PDF, DOCX, DOC (max 5MB)

3. **Submit Application** (Lines 184-198) - COMMENTED
   - Endpoint: `POST /api/applications/v1/apply` (currently working but missing fields)
   - ❌ Need to add:
     - `resumeId` - Selected resume
     - `coverLetter` - Cover letter text
     - These fields need backend support

### Required User Inputs:
- Resume selection
- Cover letter (optional, max 1000 chars)
- Additional notes (optional, max 500 chars)

### Expected Behavior:
1. Fetch user's existing resumes
2. Allow resume upload
3. Show resume selection
4. Accept cover letter
5. Submit application with all details
6. Return `applicationId` for reference

---

## 👤 Candidate Profile Workflow

**Page:** `/candidate/profile`  
**File:** `src/app/candidate/profile/page.tsx`

### Profile Data Structure:

```typescript
{
  firstName: "string",
  lastName: "string",
  dob: "ISO-8601-date",
  gender: "Male|Female|Other",
  email: "string",
  phone: "string",
  location: "string",
  yearsOfExperience: "number",
  github: "URL|string",
  linkedin: "URL|string",
  summary: "string",
  
  resumeFile: "File object (optional)",
  pitchVideoFile: "File object (optional)",
  
  education: [
    {
      school: "string",
      degree: "string",
      field: "string",
      startYear: "number",
      endYear: "number",
      description: "string"
    }
  ],
  
  certifications: [
    {
      name: "string",
      issuer: "string",
      issueDate: "ISO-8601-date",
      expiryDate: "ISO-8601-date",
      credentialId: "string",
      credentialUrl: "URL|string"
    }
  ],
  
  workExperience: [
    {
      company: "string",
      position: "string",
      startDate: "ISO-8601-date",
      endDate: "ISO-8601-date",
      description: "string",
      skillsUsed: "array of strings"
    }
  ],
  
  projects: [
    {
      title: "string",
      description: "string",
      url: "URL|string",
      technologies: "array of strings"
    }
  ],
  
  researchPapers: [
    {
      title: "string",
      link: "URL|string",
      publication: "string",
      year: "number"
    }
  ],
  
  skills: [
    {
      name: "string",
      level: "Beginner|Intermediate|Advanced|Expert",
      endorsements: "number"
    }
  ]
}
```

### Current Status:
- ✅ Data saved to localStorage
- ❌ No backend endpoint to save/load profile
- ❌ Profile data not persisted after logout

### Needed Endpoints:

#### 3.4 Save/Update Candidate Profile
**Endpoint:** `PUT /api/candidate/profile/v1/{userId}`  
**Status:** ❌ NOT IMPLEMENTED  
**Expected File:** Should be in `src/app/candidate/profile/page.tsx`

**Request Body:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "dob": "ISO-8601-date",
  "gender": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "yearsOfExperience": "number",
  "github": "string",
  "linkedin": "string",
  "summary": "string",
  "education": "array",
  "certifications": "array",
  "workExperience": "array",
  "projects": "array",
  "researchPapers": "array",
  "skills": "array"
}
```

**Expected Response:**
```json
{
  "success": true,
  "profileId": "string",
  "message": "Profile updated successfully",
  "profileCompletionPercentage": "number"
}
```

#### 3.5 Get Candidate Profile
**Endpoint:** `GET /api/candidate/profile/v1/{userId}`  
**Status:** ❌ NOT IMPLEMENTED

**Expected Response:**
```json
{
  "firstName": "string",
  "lastName": "string",
  "dob": "ISO-8601-date",
  "gender": "string",
  "email": "string",
  "phone": "string",
  "location": "string",
  "yearsOfExperience": "number",
  "github": "string",
  "linkedin": "string",
  "summary": "string",
  "resumeUrl": "string (Azure URL)",
  "pitchVideoUrl": "string (Azure URL)",
  "education": "array",
  "certifications": "array",
  "workExperience": "array",
  "projects": "array",
  "researchPapers": "array",
  "skills": "array",
  "profileCompletionPercentage": "number"
}
```

---

## 🔴 Missing Fields Summary

### User Object (from `/api/auth/v1/login`)
**Current Fields:**
- ✅ `userId`
- ✅ `email`
- ✅ `name`
- ✅ `role`
- ✅ `profileCompleted`

**❌ Missing Fields:**
| Field | Type | Purpose | Priority |
|-------|------|---------|----------|
| `firstName` | string | Split from `name` | 🔴 High |
| `lastName` | string | Split from `name` | 🔴 High |
| `phone` | string | Contact info | 🟠 Medium |
| `location` | string | Show in homepage | 🟠 Medium |
| `profileCompletionPercentage` | number | Show progress | 🔴 High |
| `profileData` | object | Full profile details | 🟠 Medium |
| `skillsCount` | number | Skills added | 🟡 Low |
| `applicationCount` | number | Total applications | 🟡 Low |

---

### Job Object (from `/api/jobs/v1/all`)
**Current Fields:**
- ✅ `jobId`
- ✅ `title`
- ✅ `organizationName`
- ✅ `description`
- ✅ `city`
- ✅ `state`
- ✅ `postedDate`
- ✅ `jobType`
- ✅ `requiredSkills`

**❌ Missing Fields:**
| Field | Type | Purpose | Priority |
|-------|------|---------|----------|
| `salaryMin` | number | Salary range display | 🟠 Medium |
| `salaryMax` | number | Salary range display | 🟠 Medium |
| `matchScore` | number (0-100) | Show job fit % | 🔴 High |
| `isRecommended` | boolean | Flag AI-recommended jobs | 🟠 Medium |
| `benefits` | array of strings | Show job benefits | 🟠 Medium |
| `jobDescription` | string | Full job details | 🟠 Medium |
| `experienceRequired` | number | Years required | 🟡 Low |
| `applicationDeadline` | ISO-8601-date | When to apply by | 🟡 Low |
| `totalApplications` | number | Show competition | 🟡 Low |
| `isApplied` | boolean | Quick check if applied | 🔴 High |

---

### Application Object (from `/api/applications/v1/candidate/{userId}`)
**Current Fields:**
- ✅ `id`
- ✅ `applicationId`
- ✅ `jobId`
- ✅ `company`
- ✅ `position`
- ✅ `status`
- ✅ `appliedDate`
- ✅ `department` (optional)
- ✅ `location` (optional)
- ✅ `salaryRange` (optional)

**❌ Missing Fields:**
| Field | Type | Purpose | Priority |
|-------|------|---------|----------|
| `applicationStages` | array of objects | Progress blob visualization | 🔴 High |
| `coverLetter` | string | Show candidate's letter | 🟠 Medium |
| `resumeUsed` | object | Show which resume used | 🟠 Medium |
| `recruiterNotes` | string | Feedback from recruiter | 🟠 Medium |
| `interviewScheduled` | boolean | Interview status | 🔴 High |
| `interviewDate` | ISO-8601-date | When interview is | 🟠 Medium |
| `interviewLink` | string | Meeting link if virtual | 🟠 Medium |
| `offerDetails` | object | If offer extended | 🟡 Low |
| `lastUpdated` | ISO-8601-date | Last status change | 🟠 Medium |
| `nextStep` | string | What to expect next | 🟠 Medium |

**Detailed `applicationStages` Structure:**
```typescript
applicationStages: [
  { stage: "Application", completed: true },
  { stage: "Initial Review", completed: true },
  { stage: "Technical Interview", completed: false },
  { stage: "Final Round", completed: false },
  { stage: "Offer", completed: false }
]
```

---

### POST Apply Request (from `/api/applications/v1/apply`)
**Current Request:**
```json
{
  "jobId": "string",
  "candidateId": "string"
}
```

**❌ Missing Fields:**
| Field | Type | Purpose | Priority |
|-------|------|---------|----------|
| `resumeId` | number | Resume to use | 🔴 High |
| `coverLetter` | string | Cover letter text | 🟠 Medium |
| `notes` | string | Additional notes | 🟠 Medium |

---

## 📦 Data Models

### User Model
```typescript
{
  userId: string;
  email: string;
  name: string;               // ⭐ Consider splitting to firstName/lastName
  firstName?: string;         // ❌ MISSING
  lastName?: string;          // ❌ MISSING
  phone?: string;             // ❌ MISSING
  location?: string;          // ❌ MISSING
  role: "candidate" | "recruiter";
  profileCompleted: boolean;
  profileCompletionPercentage?: number;  // ❌ MISSING
  profileData?: object;       // ❌ MISSING
  createdAt: ISO-8601-date;
  updatedAt: ISO-8601-date;
}
```

### Job Model
```typescript
{
  jobId: string;
  title: string;
  organizationName: string;
  description: string;
  city: string;
  state: string;
  postedDate: ISO-8601-date;
  jobType: string;
  requiredSkills: string;     // Comma-separated, consider changing to array
  salary?: string;            // Current format
  salaryMin?: number;         // ❌ MISSING - Better for display
  salaryMax?: number;         // ❌ MISSING - Better for display
  matchScore?: number;        // ❌ MISSING (0-100)
  isRecommended?: boolean;    // ❌ MISSING
  isApplied?: boolean;        // ❌ MISSING
  benefits?: string[];        // ❌ MISSING
  jobDescription?: string;    // ❌ MISSING
  experienceRequired?: number; // ❌ MISSING
  applicationDeadline?: ISO-8601-date;  // ❌ MISSING
  totalApplications?: number; // ❌ MISSING
}
```

### Application Model
```typescript
{
  id: string;
  applicationId: string;
  jobId: string;
  candidateId: string;
  company: string;
  position: string;
  status: "under_review" | "interview_scheduled" | "scheduled" | "rejected" | "accepted";
  appliedDate: ISO-8601-date;
  department?: string;
  location?: string;
  salaryRange?: string;
  applicationStages?: StageObject[];  // ❌ MISSING - CRITICAL
  coverLetter?: string;       // ❌ MISSING
  resumeUsed?: {              // ❌ MISSING
    resumeId: number;
    fileName: string;
    fileUrl: string;
  };
  recruiterNotes?: string;    // ❌ MISSING
  interviewScheduled?: boolean;       // ❌ MISSING
  interviewDate?: ISO-8601-date;      // ❌ MISSING
  interviewLink?: string;     // ❌ MISSING
  offerDetails?: object;      // ❌ MISSING
  lastUpdated?: ISO-8601-date;        // ❌ MISSING
  nextStep?: string;          // ❌ MISSING
}

interface StageObject {
  stage: string;
  completed: boolean;
  completedDate?: ISO-8601-date;
}
```

### Resume Model
```typescript
{
  resumeId: number;
  candidateId: string;
  fileName: string;
  uploadedAt: ISO-8601-date;
  isDefault: boolean;
  fileSize?: number;          // ❌ MISSING
  fileUrl?: string;           // ❌ MISSING - Azure URL
  fileType?: string;          // ❌ MISSING - MIME type
  virusScanStatus?: "pending" | "safe" | "infected";  // ❌ MISSING
}
```

### Candidate Profile Model
```typescript
{
  userId: string;
  firstName: string;
  lastName: string;
  dob: ISO-8601-date;
  gender: string;
  email: string;
  phone: string;
  location: string;
  yearsOfExperience: number;
  github?: string;
  linkedin?: string;
  summary?: string;
  resumeUrl?: string;         // Azure URL
  pitchVideoUrl?: string;     // Azure URL
  education: EducationObject[];
  certifications: CertificationObject[];
  workExperience: WorkExperienceObject[];
  projects: ProjectObject[];
  researchPapers: ResearchPaperObject[];
  skills: SkillObject[];
  profileCompletionPercentage: number;
  lastUpdated: ISO-8601-date;
}

interface EducationObject {
  school: string;
  degree: string;
  field: string;
  startYear: number;
  endYear: number;
  description?: string;
}

interface CertificationObject {
  name: string;
  issuer: string;
  issueDate: ISO-8601-date;
  expiryDate?: ISO-8601-date;
  credentialId?: string;
  credentialUrl?: string;
}

interface WorkExperienceObject {
  company: string;
  position: string;
  startDate: ISO-8601-date;
  endDate?: ISO-8601-date;
  description: string;
  skillsUsed: string[];
}

interface ProjectObject {
  title: string;
  description: string;
  url?: string;
  technologies: string[];
}

interface ResearchPaperObject {
  title: string;
  link: string;
  publication: string;
  year: number;
}

interface SkillObject {
  name: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "Expert";
  endorsements?: number;
}
```

---

## 🔐 Authentication & Security

### Bearer Token Format
All API endpoints require JWT Bearer token in Authorization header:
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### CORS Configuration Required
Endpoints should allow:
- ✅ GET requests from `http://localhost:3001` (dev)
- ✅ POST requests from `http://localhost:3001`
- ✅ DELETE requests from `http://localhost:3001`
- ✅ Preflight OPTIONS requests

### File Upload Security
For resume/video uploads:
- ✅ Validate file type (PDF, DOCX, DOC, MP4, WebM)
- ✅ Validate file size (5MB max)
- ✅ Scan for malware/viruses
- ✅ Store in Azure Blob Storage
- ✅ Return secure URLs

### Data Validation
- ✅ Validate email format
- ✅ Validate phone format (if provided)
- ✅ Validate dates in ISO-8601 format
- ✅ Validate enum values (status, jobType, etc.)
- ✅ User ID should match authenticated user

---

## 📝 Implementation Roadmap

### Phase 1: Critical (MUST HAVE)
- [ ] Add `applicationStages` to Application response
- [ ] Add `resumeId` and `coverLetter` support to apply endpoint
- [ ] Add `firstName`, `lastName` to User response
- [ ] Add `profileCompletionPercentage` to User response
- [ ] Add `isApplied` field to Job response

### Phase 2: Important (SHOULD HAVE)
- [ ] Implement resume management endpoints (get/upload)
- [ ] Add interview scheduling fields to Application
- [ ] Implement candidate profile save/load endpoints
- [ ] Add recruiter notes to Application
- [ ] Add job recommendations/match scoring

### Phase 3: Enhancement (NICE TO HAVE)
- [ ] Add analytics timeline endpoint
- [ ] Add benefits to Job object
- [ ] Add offer details to Application
- [ ] Video pitch upload
- [ ] Profile completion percentage calculation

### Phase 4: Future (FUTURE)
- [ ] ATS resume parsing
- [ ] AI job recommendations
- [ ] Automated interview scheduling
- [ ] Assessment integrations

---

## 📞 Contact & Questions

For clarifications on any endpoint or field:
1. Refer to the corresponding frontend file references above
2. Check the data model section for field definitions
3. Review the code comments in the frontend files
4. All commented API endpoints are in the code ready to be uncommented

---

**End of Document**
