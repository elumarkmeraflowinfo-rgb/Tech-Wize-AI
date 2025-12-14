export type UserRole = 'client' | 'admin' | 'editor'

export type ProjectStatus =
  | 'pending_payment'
  | 'queued'
  | 'in_production'
  | 'in_review'
  | 'awaiting_approval'
  | 'in_revision'
  | 'completed'
  | 'cancelled'

export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'

export type PaymentMethod = 'mpesa' | 'card' | 'bank_transfer' | 'cash'

export type ProjectPriority = 'low' | 'normal' | 'high' | 'urgent'

export type AssetType =
  | 'logo'
  | 'image'
  | 'video'
  | 'document'
  | 'final_output'
  | 'work_in_progress'

export type NotificationType =
  | 'order_confirmation'
  | 'status_update'
  | 'payment_received'
  | 'delivery_ready'
  | 'revision_requested'
  | 'system'

export type VideoDuration = '15s' | '30s' | '60s' | '90s'

export type TargetPlatform =
  | 'tiktok'
  | 'instagram'
  | 'youtube'
  | 'whatsapp'
  | 'facebook'
  | 'multiple'

export type TemplateStyle =
  | 'minimal'
  | 'bold'
  | 'corporate'
  | 'creative'
  | 'energetic'
  | 'elegant'

export interface Profile {
  id: string
  full_name: string
  phone_number?: string
  whatsapp_number?: string
  company_name?: string
  role: UserRole
  avatar_url?: string
  bio?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface ServiceCategory {
  id: string
  name: string
  slug: string
  description: string
  icon?: string
  display_order: number
  is_active: boolean
  created_at: string
}

export interface ServicePackage {
  id: string
  category_id: string
  name: string
  slug: string
  description: string
  price_kes: number
  delivery_days: number
  features: string[]
  includes_voiceover: boolean
  includes_music: boolean
  includes_script: boolean
  revision_count: number
  max_duration: VideoDuration
  is_popular: boolean
  is_active: boolean
  display_order: number
  created_at: string
  updated_at: string
  category?: ServiceCategory
}

export interface Project {
  id: string
  client_id: string
  package_id?: string
  assigned_to?: string
  status: ProjectStatus
  priority: ProjectPriority
  title: string
  description: string
  target_platform: TargetPlatform
  video_duration: VideoDuration
  script_provided: boolean
  custom_script?: string
  brand_colors?: string[]
  cta_text?: string
  cta_url?: string
  total_amount: number
  payment_status: PaymentStatus
  revision_count_used: number
  max_revisions: number
  deadline_date?: string
  started_at?: string
  completed_at?: string
  client_notes?: string
  internal_notes?: string
  created_at: string
  updated_at: string
  client?: Profile
  package?: ServicePackage
  assigned_editor?: Profile
}

export interface ProjectAsset {
  id: string
  project_id: string
  asset_type: AssetType
  file_name: string
  file_url: string
  file_size?: number
  mime_type?: string
  uploaded_by: string
  is_approved: boolean
  notes?: string
  created_at: string
  uploader?: Profile
}

export interface ProjectRevision {
  id: string
  project_id: string
  revision_number: number
  requested_by: string
  description: string
  status: ProjectStatus
  resolved_at?: string
  created_at: string
  requester?: Profile
}

export interface Payment {
  id: string
  project_id: string
  client_id: string
  amount: number
  currency: string
  payment_method: PaymentMethod
  transaction_ref?: string
  mpesa_receipt_number?: string
  phone_number?: string
  status: PaymentStatus
  payment_date?: string
  metadata?: Record<string, any>
  created_at: string
}

export interface Notification {
  id: string
  user_id: string
  type: NotificationType
  title: string
  message: string
  link?: string
  is_read: boolean
  sent_via: string[]
  metadata?: Record<string, any>
  created_at: string
}

export interface VideoTemplate {
  id: string
  category_id?: string
  name: string
  slug: string
  description?: string
  thumbnail_url?: string
  preview_url?: string
  duration: VideoDuration
  style: TemplateStyle
  is_active: boolean
  usage_count: number
  tags: string[]
  created_at: string
  updated_at: string
}

export interface AIPrompt {
  id: string
  prompt_type: string
  name: string
  template_text: string
  variables: string[]
  category?: string
  usage_count: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface DashboardStats {
  totalProjects: number
  activeProjects: number
  completedProjects: number
  totalRevenue: number
  pendingPayments: number
  averageDeliveryTime: number
  clientSatisfaction: number
}
