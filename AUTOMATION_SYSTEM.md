# Tech-Wize Automation System

## Overview

This document describes the complete automation architecture for the Tech-Wize platform. The system orchestrates workflows from lead capture through project delivery, minimizing manual intervention while maintaining quality control.

## Automation Architecture

### Core Components

1. **Trigger System** - Event-based automation triggers
2. **Workflow Engine** - Status-based state machines
3. **Notification System** - Multi-channel communications
4. **Integration Layer** - External service connections
5. **Logging System** - Audit trail and debugging

## Workflow Definitions

### 1. Lead to Client Conversion

```
New Lead Captured
├─→ Create user account (if not exists)
├─→ Send welcome email
├─→ Send WhatsApp welcome message
├─→ Assign client role
└─→ Redirect to dashboard
```

**Triggers:**
- Form submission (website)
- WhatsApp initial contact
- Email inquiry

**Actions:**
- Auto-create profile with client role
- Send branded welcome email
- WhatsApp auto-response with service menu
- Create notification record

**Manual Checkpoints:**
- None (fully automated)

### 2. Order Creation to Payment

```
Client Creates Project
├─→ Validate project data
├─→ Calculate total amount
├─→ Set status: pending_payment
├─→ Create payment record
├─→ Send payment instructions
└─→ Initiate M-Pesa STK push (if selected)
```

**Triggers:**
- Project form submission
- Package selection

**Actions:**
- Insert project record
- Create payment entry
- Send email with payment details
- WhatsApp payment link (optional)
- Log automation event

**Manual Checkpoints:**
- None

### 3. Payment Confirmation

```
Payment Received
├─→ Verify payment amount
├─→ Update payment status: completed
├─→ Update project status: queued
├─→ Send payment receipt
├─→ Notify client (order confirmed)
├─→ Notify admin team
├─→ Auto-assign to editor (if rules met)
└─→ Create project timeline entry
```

**Triggers:**
- M-Pesa callback webhook
- Manual payment confirmation (admin)

**Actions:**
- Update payment.status = 'completed'
- Update project.status = 'queued'
- Update project.payment_status = 'paid'
- Send receipt email
- WhatsApp confirmation
- Create notification
- Log to automation_logs
- Create timeline entry
- Optional: Auto-assign based on workload

**Manual Checkpoints:**
- Admin can manually verify payments

### 4. Project Assignment

```
Project in Queue
├─→ Check editor availability
├─→ Calculate workload distribution
├─→ Assign to available editor
├─→ Update status: queued
├─→ Notify assigned editor
└─→ Set expected completion date
```

**Triggers:**
- Payment confirmation
- Manual assignment override

**Actions:**
- Update project.assigned_to
- Update project.deadline_date
- Send editor notification
- Update timeline

**Manual Checkpoints:**
- Admin can manually reassign

### 5. Production Workflow

```
Editor Starts Work
├─→ Update status: in_production
├─→ Log start time
├─→ Notify client (work started)
└─→ Set internal alerts

Editor Uploads Draft
├─→ Update status: in_review
├─→ Notify QA team
└─→ Internal review process

QA Approves
├─→ Update status: awaiting_approval
├─→ Upload to client portal
├─→ Notify client (ready for review)
└─→ Set review deadline
```

**Triggers:**
- Status changes by editor
- File uploads

**Actions:**
- Status updates
- Notifications sent
- Timeline logged
- Assets linked

**Manual Checkpoints:**
- Editor starts/completes work
- QA approval
- Client review

### 6. Client Review & Revision

```
Client Reviews Video
├─→ [Option A] Approve
│   ├─→ Update status: completed
│   ├─→ Mark project as delivered
│   ├─→ Send final files
│   ├─→ Request testimonial (wait 24h)
│   └─→ Archive project
│
└─→ [Option B] Request Revision
    ├─→ Check revision count
    ├─→ If within limit:
    │   ├─→ Create revision record
    │   ├─→ Update status: in_revision
    │   ├─→ Notify editor
    │   └─→ Return to production
    └─→ If exceeded:
        ├─→ Notify admin
        └─→ Require manual approval
```

**Triggers:**
- Client approval button
- Revision request submission

**Actions:**
- Status updates
- Revision counter increment
- Notifications
- Timeline logging

**Manual Checkpoints:**
- Client decision
- Admin approval for extra revisions

### 7. Project Completion

```
Project Approved
├─→ Update status: completed
├─→ Set completed_at timestamp
├─→ Send delivery email with files
├─→ Update analytics
├─→ Log success event
├─→ Wait 24 hours
├─→ Send testimonial request
├─→ Wait 7 days
└─→ Send repeat order discount offer
```

**Triggers:**
- Client approval
- Admin marks complete

**Actions:**
- Final status update
- Send deliverables
- Request review/testimonial
- Schedule follow-up
- Update stats

**Manual Checkpoints:**
- None

### 8. Follow-up & Upsell

```
Post-Completion Flow
├─→ Day 1: Testimonial request
├─→ Day 7: Repeat discount offer
├─→ Day 30: Re-engagement campaign
└─→ Day 90: Seasonal offer
```

**Triggers:**
- Time-based (scheduled jobs)

**Actions:**
- Send targeted emails
- WhatsApp marketing messages
- Special offers
- New service announcements

**Manual Checkpoints:**
- Admin can customize campaigns

## Notification System

### Channels

1. **Email** - All important updates
2. **WhatsApp** - Time-sensitive updates (optional)
3. **In-app** - Dashboard notifications

### Notification Types

| Event | Email | WhatsApp | Dashboard |
|-------|-------|----------|-----------|
| Order Confirmation | ✓ | ✓ | ✓ |
| Payment Received | ✓ | ✓ | ✓ |
| Work Started | ✓ | - | ✓ |
| Ready for Review | ✓ | ✓ | ✓ |
| Revision Requested | ✓ | - | ✓ |
| Project Completed | ✓ | ✓ | ✓ |
| Testimonial Request | ✓ | - | - |

## Integration Points

### M-Pesa Integration

**Webhook Endpoint:** `/api/webhooks/mpesa`

**Flow:**
1. Client initiates payment
2. System sends STK push
3. Client enters PIN
4. M-Pesa sends callback
5. System verifies payment
6. Updates database
7. Triggers automation

**Security:**
- Verify callback signature
- Check transaction ID uniqueness
- Validate amount
- Log all attempts

### WhatsApp Business API

**Use Cases:**
- Welcome messages
- Payment confirmations
- Status updates
- Marketing campaigns

**Rate Limits:**
- Respect 24-hour window
- Template-based messages only
- No spam

### Email Service (SMTP/SendGrid)

**Templates:**
- Welcome email
- Order confirmation
- Payment receipt
- Delivery notification
- Revision request
- Testimonial request

## Monitoring & Logging

### Automation Logs Table

Every automation action is logged:

```sql
INSERT INTO automation_logs (
  trigger_type,
  project_id,
  action_taken,
  status,
  error_message,
  metadata
)
```

### Metrics to Track

- Automation success rate
- Average processing time
- Error rate by type
- Payment confirmation speed
- Notification delivery rate

### Alerts

**Admin Notifications for:**
- Failed payments
- Exceeded revision requests
- Missed deadlines
- System errors
- High-value orders

## Manual Override System

Admins can:
- Manually change any status
- Override automation rules
- Reassign projects
- Approve extra revisions
- Refund payments
- Cancel automations

All overrides are logged in project_timeline.

## Error Handling

### Payment Failures

1. Log error in automation_logs
2. Notify admin immediately
3. Keep project in pending_payment
4. Send client troubleshooting guide
5. Provide manual payment option

### Notification Failures

1. Retry 3 times with exponential backoff
2. Fall back to alternative channel
3. Log failure
4. Notify admin if critical

### API Timeouts

1. Queue for retry
2. Log timeout
3. Continue workflow if non-blocking
4. Alert admin if blocking

## Scalability Plan

### Current Capacity (Phase 1)

- 50 projects/month
- Manual assignment
- Basic automation

### Phase 2 (50-200 projects/month)

- Auto-assignment algorithm
- Advanced queue management
- Predictive scheduling
- A/B tested notifications

### Phase 3 (200+ projects/month)

- Multi-editor orchestration
- Real-time capacity planning
- AI-powered prioritization
- Automated quality checks

## Implementation Status

### ✅ Implemented
- Database triggers
- Basic email notifications
- Manual workflows
- Admin overrides

### 🚧 In Progress
- M-Pesa integration
- WhatsApp automation
- Auto-assignment logic

### 📋 Planned
- Advanced analytics
- Predictive scheduling
- AI quality checks
- Smart upselling

## Testing Automation

### Test Scenarios

1. **Happy Path**
   - Create order → Pay → Produce → Deliver
   - Verify all notifications sent
   - Check timeline accuracy

2. **Revision Flow**
   - Client requests revision
   - Editor resubmits
   - Client approves
   - Check counter

3. **Payment Failure**
   - Simulate failed payment
   - Check error handling
   - Verify fallback

4. **Edge Cases**
   - Exceeded revisions
   - Missed deadline
   - Duplicate payment
   - API timeout

## Support & Maintenance

### Daily Monitoring

- Check automation_logs for errors
- Review payment confirmations
- Monitor notification delivery
- Track project status changes

### Weekly Review

- Analyze automation success rate
- Review failed automations
- Update rules as needed
- Client feedback integration

### Monthly Optimization

- A/B test notification timing
- Optimize assignment algorithm
- Review and update templates
- Performance tuning

---

**Document Version:** 1.0
**Last Updated:** 2024-12-14
**Owner:** Tech-Wize Operations Team
