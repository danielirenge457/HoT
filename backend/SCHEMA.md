# Database Schema Documentation

## Tables

### Users
```sql
id: Integer (Primary Key)
name: String (255)
email: String (255, Unique)
phone: String (20)
password_hash: String (255) - for future authentication
role: String (50) - 'user', 'admin', 'staff'
created_at: Timestamp
updated_at: Timestamp
```

### User Profiles
```sql
id: Integer (Primary Key)
user_id: Integer (Foreign Key → users)
bio: Text
location: String (255)
nationality: String (100)
date_of_birth: Date
address: String (255)
city: String (100)
country: String (100)
skills: Text
profile_photo_url: String (500)
created_at: Timestamp
updated_at: Timestamp
```

### Donations
```sql
id: Integer (Primary Key)
user_id: Integer (Foreign Key → users) [nullable]
donor_name: String (255)
donor_email: String (255)
amount: Decimal (10,2)
currency: String (10) - 'USD', 'UGX', etc.
payment_method: String (100) - 'MTN', 'Airtel', 'Bank', 'Card'
payment_status: String (50) - 'pending', 'completed', 'failed'
transaction_id: String (255)
message: Text
created_at: Timestamp
```

### Job Postings
```sql
id: Integer (Primary Key)
title: String (255)
department: String (100)
description: Text
roles_responsibilities: Text
qualifications_skills: Text
opening_date: Date
deadline_date: Date
status: String (50) - 'open', 'closed'
created_at: Timestamp
updated_at: Timestamp
```

### Job Applications
```sql
id: Integer (Primary Key)
user_id: Integer (Foreign Key → users)
job_id: Integer (Foreign Key → job_postings)
job_title: String (255)
department: String (100)
application_status: String (50) - 'pending', 'reviewed', 'accepted', 'rejected'
cover_letter: Text
cv_url: String (500)
applied_at: Timestamp
updated_at: Timestamp
```

### Volunteer Applications
```sql
id: Integer (Primary Key)
user_id: Integer (Foreign Key → users) [nullable]
full_name: String (255)
email: String (255)
phone: String (20)
date_of_birth: Date
address: String (255)
city: String (100)
country: String (100)
nationality: String (100)
education_level: String (50) - 'Primary', 'Secondary', 'Tertiary'
skills: Text
availability: String (100)
motivation: Text
status: String (50) - 'pending', 'approved', 'rejected'
applied_at: Timestamp
updated_at: Timestamp
```

### Subscriptions
```sql
id: Integer (Primary Key)
name: String (255)
email: String (255, Unique)
subscribed_at: Timestamp
```

## Relationships

- Users → User Profiles (1:1)
- Users → Donations (1:Many)
- Users → Job Applications (1:Many)
- Users → Volunteer Applications (1:Many)
- Job Postings → Job Applications (1:Many)
