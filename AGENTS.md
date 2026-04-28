<!-- BEGIN:nextjs-agent-rules -->
# Next.js 16 & React 19 Standards
- **Breaking Changes**: This project uses Next.js 16. APIs and conventions differ from previous versions. Always reference `node_modules/next/dist/docs/` before implementing new features.
- **React 19**: Leverage React 19 features (e.g., `use` hook, improved `Actions`, and metadata APIs) where appropriate.
- **Server Components**: Default to Server Components for data fetching. Use `'use client'` only when necessary for interactivity.

# Premium Design & Aesthetics
- **Philosophy**: "Super Menu" must feel like a premium, luxury SaaS. Avoid generic UI.
- **Visuals**: Use glassmorphism (`backdrop-filter: blur()`), subtle gradients, and custom animations (refer to `globals.css`).
- **Theming**: Implement dynamic branding. Support `primary_color` and `secondary_color` stored in the database. Use inline styles or CSS variables for dynamic theme application.
- **Typography**: Use modern, clean fonts. Default to "Inter" or "Outfit" for English and high-quality Arabic typefaces.

# Arabic (RTL) Localization
- **RTL Support**: Always ensure `dir="rtl"` is applied where appropriate.
- **Layouts**: Design with RTL in mind—flip arrows, icons, and spacing logic.
- **Arabic Copy**: When writing UI text, use professional, high-quality Arabic (Modern Standard Arabic).

# Supabase & Multi-Tenancy
- **RLS**: Respect Row Level Security. Every query must be scoped to the `restaurant_id` or the authenticated user.
- **Multi-Tenancy**: The application is a SaaS. Ensure data isolation between different restaurants.
- **Client vs. Server**: Use `@/utils/supabase/server` for RSC/Actions and `@/utils/supabase/client` for client-side interactions.

# Mobile UI & Client Experience
- **Mobile-First Comfort**: Prioritize thumb-friendly design. Place primary actions and navigation (bottom bars, sheets) within easy reach.
- **Touch & Interaction**: Ensure a minimum 44x44px touch target for all buttons and icons with adequate spacing. Provide immediate visual feedback on tap (e.g., scale to 0.95, subtle ripple) instead of relying on hover states.
- **Safe Areas & Layout**: Strictly respect iOS/Android safe areas (notches, home indicators). Ensure fixed elements never obscure scrollable content.
- **Smooth Gestures**: Modals, drawers, and bottom sheets should support native-feeling drag and swipe-to-dismiss gestures.

# Coding Best Practices
- **Performance**: Use `useMemo` and `useCallback` for expensive operations in client components.
- **Consistency**: Follow the patterns in `DashboardClient.tsx` for administrative features.
- **SEO**: Maintain the established SEO patterns (Title tags, Meta descriptions, Semantic HTML).
<!-- END:nextjs-agent-rules -->

