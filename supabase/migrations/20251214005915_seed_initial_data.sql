/*
  # Seed Initial Data for Tech-Wize Platform
  
  ## What this migration does
  Seeds the database with initial service categories, packages, templates, and AI prompts
  to make the platform ready for launch.
  
  ## Data Added
  1. Service Categories (3): Property Marketing, Product Promo, Creator Branding
  2. Service Packages (9): 3 tiers for each category
  3. Video Templates (6): Sample templates
  4. AI Prompts (4): Script generation prompts
*/

-- Insert service categories
INSERT INTO service_categories (id, name, slug, description, icon, display_order, is_active) VALUES
  (gen_random_uuid(), 'Property Marketing', 'property-marketing', 'Showcase properties with stunning video tours perfect for real estate agents and property sellers', 'building', 1, true),
  (gen_random_uuid(), 'Product Promo', 'product-promo', 'Launch products with high-converting video ads for e-commerce and digital products', 'shopping-bag', 2, true),
  (gen_random_uuid(), 'Creator Branding', 'creator-branding', 'Build your personal brand with professional content creator videos', 'users', 3, true)
ON CONFLICT (slug) DO NOTHING;

-- Get category IDs for package insertion
DO $$
DECLARE
  property_cat_id uuid;
  product_cat_id uuid;
  creator_cat_id uuid;
BEGIN
  SELECT id INTO property_cat_id FROM service_categories WHERE slug = 'property-marketing';
  SELECT id INTO product_cat_id FROM service_categories WHERE slug = 'product-promo';
  SELECT id INTO creator_cat_id FROM service_categories WHERE slug = 'creator-branding';

  -- Property Marketing Packages
  INSERT INTO service_packages (
    category_id, name, slug, description, price_kes, delivery_days,
    features, includes_voiceover, includes_music, includes_script,
    revision_count, max_duration, is_popular, display_order
  ) VALUES
  (
    property_cat_id,
    'Basic Property Video',
    'property-basic',
    'Perfect for quick property listings',
    1500,
    2,
    '["5-8 photos/clips", "Background music", "Text overlays", "1 revision", "Vertical (9:16) format"]'::jsonb,
    false,
    true,
    false,
    1,
    '30s'::video_duration,
    false,
    1
  ),
  (
    property_cat_id,
    'Standard Property Tour',
    'property-standard',
    'Most popular for serious sellers',
    3000,
    3,
    '["10-15 photos/clips", "Professional voice-over", "Background music", "Property highlights", "2 revisions", "Vertical + Horizontal formats"]'::jsonb,
    true,
    true,
    true,
    2,
    '60s'::video_duration,
    true,
    2
  ),
  (
    property_cat_id,
    'Premium Property Showcase',
    'property-premium',
    'Premium package for high-end properties',
    5000,
    4,
    '["15-20 photos/clips", "Premium voice-over", "Cinematic music", "Location highlights", "3 revisions", "All formats", "Drone footage integration"]'::jsonb,
    true,
    true,
    true,
    3,
    '90s'::video_duration,
    false,
    3
  ),
  
  -- Product Promo Packages
  (
    product_cat_id,
    'Basic Product Video',
    'product-basic',
    'Quick product showcase',
    1200,
    2,
    '["3-5 product shots", "Upbeat music", "Text overlays", "Price/CTA", "1 revision"]'::jsonb,
    false,
    true,
    false,
    1,
    '15s'::video_duration,
    false,
    1
  ),
  (
    product_cat_id,
    'Standard Product Promo',
    'product-standard',
    'Best for e-commerce brands',
    2500,
    3,
    '["5-10 product shots", "Hook + benefits", "Background music", "Strong CTA", "2 revisions", "Multiple platforms"]'::jsonb,
    false,
    true,
    true,
    2,
    '30s'::video_duration,
    true,
    2
  ),
  (
    product_cat_id,
    'Premium Product Ad',
    'product-premium',
    'High-converting ad campaigns',
    4500,
    4,
    '["10-15 shots", "Professional voice-over", "Scripted storytelling", "Multiple CTAs", "3 revisions", "A/B test versions"]'::jsonb,
    true,
    true,
    true,
    3,
    '60s'::video_duration,
    false,
    3
  ),
  
  -- Creator Branding Packages
  (
    creator_cat_id,
    'Basic Creator Video',
    'creator-basic',
    'Simple intro or promo',
    1000,
    2,
    '["Personal intro", "Social links", "Background music", "1 revision"]'::jsonb,
    false,
    true,
    false,
    1,
    '15s'::video_duration,
    false,
    1
  ),
  (
    creator_cat_id,
    'Standard Creator Package',
    'creator-standard',
    'Professional brand video',
    2000,
    3,
    '["Bio + value prop", "Content samples", "Call-to-action", "2 revisions", "Optimized for all platforms"]'::jsonb,
    false,
    true,
    true,
    2,
    '30s'::video_duration,
    true,
    2
  ),
  (
    creator_cat_id,
    'Premium Creator Brand',
    'creator-premium',
    'Complete brand identity video',
    4000,
    4,
    '["Full brand story", "Voice-over", "Multiple segments", "Portfolio showcase", "3 revisions", "Thumbnail design included"]'::jsonb,
    true,
    true,
    true,
    3,
    '60s'::video_duration,
    false,
    3
  )
  ON CONFLICT (slug) DO NOTHING;

  -- Insert video templates
  INSERT INTO video_templates (
    category_id, name, slug, description, duration, style, tags
  ) VALUES
  (
    property_cat_id,
    'Modern Property Tour',
    'modern-property-tour',
    'Clean, modern template with smooth transitions',
    '60s'::video_duration,
    'minimal'::template_style,
    ARRAY['real-estate', 'modern', 'clean']
  ),
  (
    property_cat_id,
    'Luxury Estate Showcase',
    'luxury-estate-showcase',
    'Premium template for high-end properties',
    '90s'::video_duration,
    'elegant'::template_style,
    ARRAY['luxury', 'high-end', 'elegant']
  ),
  (
    product_cat_id,
    'Product Launch Energy',
    'product-launch-energy',
    'High-energy template for product launches',
    '30s'::video_duration,
    'energetic'::template_style,
    ARRAY['product', 'launch', 'energetic']
  ),
  (
    product_cat_id,
    'E-commerce Minimalist',
    'ecommerce-minimalist',
    'Clean product showcase',
    '15s'::video_duration,
    'minimal'::template_style,
    ARRAY['ecommerce', 'minimal', 'clean']
  ),
  (
    creator_cat_id,
    'Creator Intro Bold',
    'creator-intro-bold',
    'Bold, attention-grabbing intro',
    '15s'::video_duration,
    'bold'::template_style,
    ARRAY['creator', 'intro', 'bold']
  ),
  (
    creator_cat_id,
    'Professional Bio',
    'professional-bio',
    'Corporate-friendly creator bio',
    '30s'::video_duration,
    'corporate'::template_style,
    ARRAY['creator', 'professional', 'bio']
  )
  ON CONFLICT (slug) DO NOTHING;

  -- Insert AI prompts
  INSERT INTO ai_prompts (
    prompt_type, name, template_text, variables, category
  ) VALUES
  (
    'script',
    'Property Video Script',
    'Write a compelling {duration} second video script for a property listing. Property details: {property_details}. Highlight: {key_features}. Target audience: {audience}. Tone: {tone}. Include a strong call-to-action.',
    '["duration", "property_details", "key_features", "audience", "tone"]'::jsonb,
    'property-marketing'
  ),
  (
    'hook',
    'Product Hook Generator',
    'Generate 5 attention-grabbing hooks for a product video. Product: {product_name}. Main benefit: {main_benefit}. Target platform: {platform}. Each hook should be under 5 seconds when spoken.',
    '["product_name", "main_benefit", "platform"]'::jsonb,
    'product-promo'
  ),
  (
    'cta',
    'Call-to-Action Generator',
    'Create 3 compelling CTAs for a {video_type} video. Goal: {goal}. Platform: {platform}. Keep each CTA concise and action-oriented.',
    '["video_type", "goal", "platform"]'::jsonb,
    'general'
  ),
  (
    'script',
    'Creator Brand Script',
    'Write a {duration} second creator introduction script. Creator name: {name}. Niche: {niche}. Unique value: {value_prop}. Personality: {personality}. Include what viewers can expect from their content.',
    '["duration", "name", "niche", "value_prop", "personality"]'::jsonb,
    'creator-branding'
  );
END $$;
