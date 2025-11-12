# 🔍 Commented API Endpoints - Quick Reference

## Files with Commented API Endpoints

### 1. JobApplicationModal.tsx
**Location:** `src/components/candidate/JobApplicationModal.tsx`

#### Line 50-62: Fetch Resumes (Commented)
```typescript
// TODO: Uncomment when backend CORS is fixed
// const data = await apiFetch(
//   `/api/candidate/resumes/v1/candidate?email=${user.email}`,
//   {},
//   token
// );
```

#### Line 110-131: Upload Resume (Commented)
```typescript
// TODO: Uncomment when backend CORS is fixed
// const formData = new FormData();
// formData.append("file", file);
// formData.append("email", user.email);
// formData.append("setAsDefault", resumes.length === 0 ? "true" : "false");

// const response = await fetch(
//   `${process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080"}/api/candidate/resumes/v1/upload`,
//   {
//     method: "POST",
//     headers: {
//       Authorization: `Bearer ${token}`,
//     },
//     body: formData,
//   }
// );
```

#### Line 184-198: Apply to Job (Commented)
```typescript
// TODO: Uncomment when backend CORS is fixed
// await apiFetch(
//   "/api/applications/v1/apply",
//   {
//     method: "POST",
//     body: JSON.stringify({
//       jobId: parseInt(job.jobId),
//       candidateId: user.userId,
//       notes: applicationNotes,
//       resumeId: selectedResumeId,        // ⭐ NEW FIELD
//       coverLetter: coverLetter,          // ⭐ NEW FIELD
//     }),
//   },
//   token
// );
```

**Fallback:** Lines 200-206 use localStorage simulation

---

### 2. Jobs Page (candidate/jobs/page.tsx)
**Location:** `src/app/candidate/jobs/page.tsx`

#### Line 61-72: Fetch Applied Jobs (Commented)
```typescript
// TODO: Uncomment when backend CORS is fixed
// const applicationsData = await apiFetch(
//   `/api/applications/v1/candidate/${user.userId}`,
//   {},
//   token
// );
// if (applicationsData && Array.isArray(applicationsData)) {
//   const appliedJobIds = new Set(
//     applicationsData.map((app: any) => String(app.jobId))
//   );
//   setAppliedJobs(appliedJobIds);
// }
```

**Fallback:** Lines 74-84 use localStorage with key `applications_${user.userId}`

---

### 3. Applications Page (candidate/applications/page.tsx)
**Location:** `src/app/candidate/applications/page.tsx`

#### Line 177: Timeline Endpoint (TODO Comment)
```typescript
// TODO: replace when timeline endpoint exists
setTimeline([]);
```

**Note:** No commented code here yet, just a placeholder
**Proposed Endpoint:** `GET /api/applications/v1/timeline?candidateId={userId}&months={months}`
**Fallback:** Currently calculated from applications list client-side

---

## 🔄 Current Data Flow

### Resume Management
```
Frontend (localStorage)
        ↓
    (commented API)
        ↓
Backend (Azure Blob Storage)
```

### Applied Jobs Tracking
```
Frontend (localStorage: applications_{userId})
        ↓
    (commented API)
        ↓
Backend (Database)
```

### Job Applications
```
User fills form → File validation → localStorage simulation
        ↓
   (commented API)
        ↓
Backend: Save to DB + Azure Storage
```

---

## ✅ What's Ready to Uncomment

| Feature | Status | Location |
|---------|--------|----------|
| Fetch Resumes | ✅ Ready | JobApplicationModal.tsx:50-62 |
| Upload Resume | ✅ Ready | JobApplicationModal.tsx:110-131 |
| Apply to Job | ✅ Ready | JobApplicationModal.tsx:184-198 |
| Fetch Applied Jobs | ✅ Ready | Jobs page:61-72 |
| Timeline/Analytics | ⏳ Needs code | Applications page:177 |

---

## 🚀 To Enable an Endpoint

### Example: Enable Fetch Resumes
1. Open `src/components/candidate/JobApplicationModal.tsx`
2. Go to lines 50-62
3. Uncomment the code block
4. Remove the localStorage fallback (lines 64-73)
5. Test in browser

### Example: Enable Apply to Job
1. Open `src/components/candidate/JobApplicationModal.tsx`
2. Go to lines 184-198
3. Uncomment the code block
4. Remove the localStorage simulation (lines 200-206)
5. Test job application flow

---

## 📝 Backend Implementation Order

**Recommended:**
1. ✅ Resume Fetch (`/api/candidate/resumes/v1/candidate?email=`)
2. ✅ Resume Upload (`/api/candidate/resumes/v1/upload`)
3. ✅ Apply with Resume (`POST /api/applications/v1/apply`)
4. ⏳ Timeline Analytics (`GET /api/applications/v1/timeline`)

---

## 🔐 Important Notes

- All endpoints require **Bearer token** in Authorization header
- Resume upload supports: **PDF, DOCX, DOC** (max 5MB)
- Frontend already has **validation** for file types and sizes
- **CORS** must be configured on backend
- All commented code is **production-ready**, just needs backend

---

## 📞 Need More Info?

See `API_ENDPOINTS_TODO.md` for:
- Full request/response examples
- Field descriptions
- Authentication details
- Security requirements
