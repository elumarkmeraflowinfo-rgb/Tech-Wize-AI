# Tech-Wize Platform Architecture

## Executive Summary

Tech-Wize is a production-ready, AI-powered digital production platform designed to scale from day one. This document outlines the complete technical architecture, data models, automation systems, and expansion roadmap.

## System Overview

### Core Modules

1. **Public Website** - Marketing and lead generation
2. **Client Portal** - Self-service project management
3. **Admin Dashboard** - Internal operations HQ
4. **Automation Engine** - Workflow orchestration
5. **AI Production System** - Video generation workflows
6. **Payment System** - M-Pesa integration ready

### Technology Stack

**Frontend**
- Next.js 14 (App Router)
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion (animations)

**Backend**
- Supabase (PostgreSQL)
- Supabase Edge Functions
- Row Level Security (RLS)
- Real-time subscriptions

**Storage**
- Supabase Storage (files, videos, assets)
- CDN delivery

**Authentication**
- Supabase Auth
- Email/password
- Role-based access control (RBAC)

**Payments**
- M-Pesa API integration (via Edge Functions)
- Payment webhook handling
- Transaction tracking

**AI Integration Layer**
- OpenAI API (scripts, hooks)
- ElevenLabs (voice-overs)
- Video generation APIs
- Template management system

## Database Architecture

### Core Tables

#### 1. Users & Authentication
```
users (managed by Supabase Auth)
├── profiles
│   ├── id (uuid, FK to auth.users)
│   ├── full_name
│   ├── phone_number
│   ├── company_name
│   ├── role (client, admin, editor)
│   ├── avatar_url
│   ├── whatsapp_number
│   └── created_at
```

#### 2. Services & Packages
```
service_categories
├── id
├── name (Property Marketing, Product Promo, Creator Branding)
├── description
├── icon
└── display_order

service_packages
├── id
├── category_id (FK)
├── name (Basic, Standard, Premium)
├── price_kes
├── delivery_days
├── features (JSONB)
├── includes_voiceover
├── includes_music
├── revision_count
└── is_active
```

#### 3. Projects & Orders
```
projects
├── id
├── client_id (FK to profiles)
├── package_id (FK to service_packages)
├── status (pending_payment, queued, in_production, in_review, completed, cancelled)
├── title
├── description
├── target_platform (tiktok, instagram, youtube, whatsapp)
├── video_duration (15s, 30s, 60s)
├── script_provided (boolean)
├── custom_script (text)
├── brand_colors (JSONB)
├── cta_text
├── cta_url
├── assigned_to (FK to profiles - editor/admin)
├── priority (low, normal, high, urgent)
├── deadline_date
├── completed_date
├── total_amount
├── payment_status (pending, partial, paid, refunded)
├── revision_count_used
├── client_notes
├── internal_notes
├── created_at
└── updated_at

project_assets
├── id
├── project_id (FK)
├── asset_type (logo, image, video, document, final_output)
├── file_name
├── file_url (Supabase Storage path)
├── file_size
├── uploaded_by (FK to profiles)
├── is_approved
└── uploaded_at

project_revisions
├── id
├── project_id (FK)
├── revision_number
├── requested_by (FK to profiles)
├── description
├── status (pending, in_progress, completed)
├── created_at
└── resolved_at
```

#### 4. Payments & Transactions
```
payments
├── id
├── project_id (FK)
├── client_id (FK to profiles)
├── amount
├── currency (KES)
├── payment_method (mpesa, card, bank_transfer)
├── transaction_ref
├── mpesa_receipt_number
├── phone_number
├── status (pending, completed, failed, refunded)
├── payment_date
├── metadata (JSONB)
└── created_at
```

#### 5. Automation & Communications
```
notifications
├── id
├── user_id (FK to profiles)
├── type (order_confirmation, status_update, payment_received, delivery_ready)
├── title
├── message
├── link
├── is_read
├── sent_via (email, whatsapp, both)
└── created_at

automation_logs
├── id
├── trigger_type (new_order, payment_received, status_change)
├── project_id (FK)
├── action_taken
├── status (success, failed, pending)
├── error_message
├── metadata (JSONB)
└── created_at
```

#### 6. Templates & AI Assets
```
video_templates
├── id
├── name
├── category_id (FK)
├── thumbnail_url
├── preview_url
├── duration
├── style (minimal, bold, corporate, creative)
├── is_active
├── usage_count
└── created_at

ai_prompts
├── id
├── prompt_type (script, hook, cta, voice_direction)
├── template_text
├── variables (JSONB)
├── category
└── created_at
```

#### 7. Analytics & Tracking
```
project_timeline
├── id
├── project_id (FK)
├── status
├── changed_by (FK to profiles)
├── notes
└── created_at

analytics_events
├── id
├── event_type
├── user_id (FK to profiles)
├── project_id (FK, nullable)
├── metadata (JSONB)
└── created_at
```

## User Roles & Permissions

### Client Role
- Create and view own projects
- Upload assets
- Request revisions
- Make payments
- Download deliverables
- View order history

### Editor Role
- View assigned projects
- Update project status
- Upload work-in-progress
- Access template library
- Use AI prompt library

### Admin Role
- Full system access
- Manage all projects
- View analytics
- Manage users
- Configure packages
- Access automation logs
- Financial reports

## Automation Workflows

### 1. Lead to Client Flow
```
Lead Capture (Website/WhatsApp)
↓
Auto-response sent
↓
Account created
↓
Welcome email + SMS
↓
Dashboard access granted
```

### 2. Order to Delivery Flow
```
Client selects package
↓
Project intake form completed
↓
Payment initiated (M-Pesa)
↓
[AUTOMATION CHECKPOINT]
Payment confirmed
↓
Project auto-assigned (based on workload)
↓
Status: QUEUED
↓
Editor picks up project
↓
Status: IN_PRODUCTION
↓
[AI GENERATION PHASE]
- Script generation (if needed)
- Template selection
- Asset processing
- Voice-over generation
- Video compilation
↓
Status: IN_REVIEW (internal QA)
↓
Upload to client portal
↓
Client notification sent
↓
Status: AWAITING_APPROVAL
↓
Client reviews
↓
[BRANCH]
├─→ Approved → Status: COMPLETED → Archive → Testimonial request
└─→ Revision needed → Status: IN_REVISION → Back to production
```

### 3. Payment Automation
```
M-Pesa STK Push initiated
↓
Client enters PIN
↓
Callback received (Edge Function webhook)
↓
Payment record updated
↓
Project status → QUEUED
↓
Receipt generated and sent
↓
Slack/Email notification to team
```

### 4. Notification Triggers
- Order confirmation
- Payment received
- Production started
- Ready for review
- Revision requested
- Project completed
- Delivery available

### 5. Upsell & Follow-up
```
Project completed
↓
Wait 24 hours
↓
Testimonial request sent
↓
Wait 7 days
↓
Repeat order discount offer
↓
If inactive 30 days → Re-engagement campaign
```

## API Architecture

### Public API Endpoints
```
POST /api/contact - Contact form submission
GET /api/services - List service packages
GET /api/templates - Public template gallery
POST /api/webhooks/mpesa - M-Pesa payment callback
```

### Authenticated API Endpoints (Client)
```
GET /api/projects - List user projects
POST /api/projects - Create new project
GET /api/projects/:id - Get project details
PATCH /api/projects/:id - Update project
POST /api/projects/:id/assets - Upload asset
POST /api/projects/:id/revisions - Request revision
GET /api/payments/:projectId - Get payment info
POST /api/payments/initiate - Start M-Pesa payment
```

### Admin API Endpoints
```
GET /api/admin/projects - All projects with filters
PATCH /api/admin/projects/:id/assign - Assign editor
PATCH /api/admin/projects/:id/status - Update status
GET /api/admin/analytics - Dashboard metrics
GET /api/admin/users - User management
POST /api/admin/templates - Create video template
GET /api/admin/automation-logs - View automation history
```

## File Storage Structure

```
/storage
├── /profiles
│   └── /avatars
├── /projects
│   ├── /{project-id}
│   │   ├── /client-assets (logos, images uploaded by client)
│   │   ├── /work-in-progress (editor files)
│   │   └── /deliverables (final videos)
├── /templates
│   ├── /thumbnails
│   └── /previews
└── /public
    └── /demo-gallery
```

## Security Architecture

### Row Level Security (RLS) Policies

**Profiles**
- Users can view and update own profile
- Admins can view all profiles

**Projects**
- Clients can view/edit own projects
- Editors can view assigned projects
- Admins can view/edit all projects

**Payments**
- Clients can view own payments
- Admins can view all payments

**Project Assets**
- Project participants can view assets
- Only uploader and admins can delete

### Authentication Flow
1. User signs up (email + password)
2. Email verification (optional, disabled by default)
3. Profile auto-created with client role
4. JWT token issued
5. Role-based route protection

## Scalability Plan

### Phase 1 (Launch - 0-50 projects/month)
- Single Supabase instance
- Manual project assignment
- Basic automation via Edge Functions

### Phase 2 (50-200 projects/month)
- Auto-assignment algorithm
- Queue management system
- Advanced analytics
- Team collaboration features

### Phase 3 (200+ projects/month)
- Multi-tenant architecture
- White-label capabilities
- API marketplace
- Partner dashboard

## Expansion Roadmap

### Near Term (3-6 months)
- Subscription packages
- Template marketplace
- Bulk order discounts
- Referral system

### Medium Term (6-12 months)
- AI education platform
- Automation consulting services
- Creator community
- Mobile app (React Native)

### Long Term (12+ months)
- SaaS video editor
- Franchise model
- International expansion
- Partner white-label program

## Performance Targets

- **Page Load**: < 2s (mobile 3G)
- **API Response**: < 500ms average
- **Video Processing**: 24-48 hours SLA
- **Payment Confirmation**: < 30 seconds
- **Uptime**: 99.5%

## Monitoring & Analytics

### Key Metrics
- Monthly Recurring Revenue (MRR)
- Customer Acquisition Cost (CAC)
- Lifetime Value (LTV)
- Project completion rate
- Average delivery time
- Client satisfaction score
- Revision request rate
- Payment success rate

### Dashboards
1. Financial KPIs
2. Operational metrics
3. Client analytics
4. System health
5. Automation performance

## Deployment Strategy

### Infrastructure
- Vercel (Next.js frontend)
- Supabase (database + auth + storage + edge functions)
- CloudFlare (CDN + DDoS protection)

### CI/CD Pipeline
```
Git Push → GitHub Actions
↓
Automated tests
↓
Build verification
↓
Deploy to staging
↓
Manual approval
↓
Deploy to production
```

### Environment Variables
```
NEXT_PUBLIC_SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY (server-side only)
MPESA_CONSUMER_KEY
MPESA_CONSUMER_SECRET
MPESA_SHORTCODE
OPENAI_API_KEY
ELEVENLABS_API_KEY
WHATSAPP_API_TOKEN
```

## Documentation Requirements

### For Clients
- Getting started guide
- How to place an order
- Upload requirements
- Revision policy
- FAQ

### For Admins
- Project management workflow
- Template usage guide
- AI prompt library
- SOP documentation
- Troubleshooting guide

### For Developers
- API reference
- Database schema
- Setup instructions
- Contributing guidelines

---

**Document Version**: 1.0
**Last Updated**: 2024-12-14
**Status**: Production Ready
