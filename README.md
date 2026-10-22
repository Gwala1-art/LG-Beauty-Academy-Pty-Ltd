# LG Beauty Academy Pty Ltd

Premium mobile beauty and makeup education website built with Next.js 15, React 19, TypeScript, Supabase/Postgres and an optional Paystack hosted checkout.

The repository supplied for this project was empty. This workspace contains the new application. Prices, service coverage, dates, contact information and credentials are intentionally not invented. Until the business configures those details, booking and class pages clearly present quote/request states rather than claiming availability.

## Run locally

Requirements: Node.js 20.9 or newer and npm.

```powershell
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). The public pages render without external credentials. Booking, class registration and enquiry submissions require Supabase configuration.

Available checks:

```powershell
npm run lint
npm run typecheck
npm run build
```

## Environment variables

Copy `.env.example` to `.env.local` locally and set values only in the server environment. Never commit `.env.local` or expose `SUPABASE_SERVICE_ROLE_KEY` or `PAYSTACK_SECRET_KEY` as `NEXT_PUBLIC_*` values.

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL. It is public project metadata, not a secret. |
| `SUPABASE_SERVICE_ROLE_KEY` | Server-only key used by validated API routes. Never add it to browser code. |
| `PAYMENTS_ENABLED` | `false` by default. Set to `true` only after test checkout is configured. |
| `PAYSTACK_MODE` | `test` or `live`; the key prefix must match the selected mode. |
| `PAYSTACK_SECRET_KEY` | Paystack server secret, `sk_test_...` first; never expose it in client code. |
| `PAYSTACK_CALLBACK_URL` | Public absolute URL ending in `/api/payments/callback`. |
| `NEXT_PUBLIC_BUSINESS_EMAIL` | Approved business email shown on Contact. |
| `NEXT_PUBLIC_BUSINESS_PHONE` | Approved business telephone shown on Contact. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | International-format digits only; WhatsApp link stays absent if blank. |
| `NEXT_PUBLIC_INSTAGRAM_URL` | Approved Instagram profile URL. |
| `NEXT_PUBLIC_SERVICE_AREA` | Public service-area description. |

## Supabase setup

1. Create a Supabase project in the business owner's account.
2. In the SQL Editor, run [`supabase/schema.sql`](supabase/schema.sql) once. It creates services, travel zones, availability, bookings, courses, class sessions, registrations, enquiries and payment records. The example catalogue rows are inactive and have no prices or dates.
3. Add the project URL and service-role key to `.env.local` or your deployment provider's server environment. Restart the development server after changing environment values.
4. In the Supabase Table Editor, configure only business-approved values:
   - `services`: review descriptions/durations, enter approved `price_cents` and optional `deposit_cents`, then set `is_active` true.
   - `travel_zones`: add supported zone names and approved `fee_cents`, then activate them. Leave an address outside these zones as a quote request.
   - `service_addons`: add approved add-ons and prices, then activate them.
   - `availability_slots`: create appointment start/end timestamps with timezone-aware values, associate a service or leave `service_id` empty for a general slot, and set `is_available` true.
   - `courses`: review course copy, learning outcomes and duration, add approved prices if applicable, then activate the course.
   - `class_sessions`: add course-linked start/end timestamps, approved session prices if applicable, seat counts and active status. Public class dates and registration choices come from these rows.
5. Keep Supabase project access limited to trusted operators and enable MFA. Customer and payment tables have RLS enabled and no `anon` or `authenticated` grants. The service-role key is used only by server routes; do not create public admin endpoints.

Amounts in database `*_cents` fields use South African cents (R1.00 = 100). Leave a price `NULL` until approved; do not use zero as a placeholder for a paid service.

The server reserves each appointment slot inside a transaction and rejects duplicate reservations. Uncompleted Paystack holds expire after 20 minutes and are released when availability is next checked. Class registration locks and decrements available seats atomically. A business operator must review requested bookings and class registrations before treating them as confirmed.

## Payments

Paystack was selected because its official South African offering lists ZAR and its API documents server-initialised hosted checkout, transaction verification and signed webhooks. The South African pricing page currently lists local card pricing of 2.9% + ZAR 1 (excluding VAT) and reduced prices for some channels; confirm current pricing and merchant terms directly before onboarding. The site cannot determine whether this specific business will pass merchant review. Account approval and payment-channel availability are controlled by Paystack.

Official references:

- [Paystack South Africa](https://paystack.com/za)
- [Paystack ZAR currency support](https://paystack.com/docs/api/#supported-currency)
- [Initialize and verify transactions](https://paystack.com/docs/api/transaction/)
- [Paystack webhooks](https://paystack.com/docs/payments/webhooks/)
- [Paystack South Africa pricing](https://paystack.com/za/pricing)
- [Yoco online checkout guide](https://yoco.docs.buildwithfern.com/guides/online-payments/accepting-a-payment.md) (evaluated alternative)

To test payments:

1. Obtain a Paystack account and test secret key from the merchant dashboard.
2. Set `PAYMENTS_ENABLED=true`, `PAYSTACK_MODE=test`, `PAYSTACK_SECRET_KEY=sk_test_...`, and `PAYSTACK_CALLBACK_URL` to the app's public `/api/payments/callback` URL. For localhost callback testing, use a secure tunnel URL.
3. Register `https://YOUR_DOMAIN/api/payments/webhook` in the Paystack dashboard and test a successful, failed and abandoned checkout.
4. Confirm the stored booking amount, provider reference, transaction ID, receipt number and final status before accepting test behavior.
5. After the business approves real prices/terms and Paystack approves the merchant, configure the live key and `PAYSTACK_MODE=live` in production only. Keep test and live credentials separate.

The app never collects card data. Checkout URLs are returned only by Paystack's hosted checkout API. Callback visits do not mark a payment as paid: the server verifies the transaction reference, ZAR currency, exact amount and provider transaction ID. The webhook validates Paystack's HMAC-SHA512 signature and also verifies the transaction server-side. Duplicate processing is protected by database uniqueness constraints and an idempotent database function.

Refund requests are stored for operator review. Refund decisions and processing must follow the agreed terms and applicable law; when due, process through the original payment channel where reasonably possible, then update booking payment status in the restricted database. This project does not automatically decide or issue refunds.

## Pages and operations

Public pages: Home, About, Services, Bridal, Hair Styling, Makeup Classes, Gallery, Online Booking, Contact, Booking Policy, Refund Policy, Privacy Policy and Terms. Cancellation requests are available at `/booking/cancel`; verified payment status is at `/booking/complete`.

The homepage and gallery use locally stored photos from the `img` folder, bundled and optimized by Next.js. To add or replace gallery photos, place approved image files in `img` and update the imports and `galleryImages` entries in `lib/content.ts`. Confirm client consent before publishing identifiable photos.

Before launch, the business must provide and approve its actual logo, contact details, service area/travel zones, services and prices, deposit amounts, available dates, class schedule/pricing, final booking/refund/privacy terms, and image releases. This scaffold does not include a custom admin dashboard or email/SMS notification service; trusted operators manage data in the private Supabase dashboard, and booking references are shown after form submission. Configure a transactional email provider separately if automatic confirmations/receipts by email are required.

## Deploy

### Render

1. In Render, create a **Web Service** from this GitHub repository and select the branch to deploy.
2. Use `npm ci && npm run build` as the build command and `npm run start` as the start command. The service must use Node.js 20.9 or newer; set `NODE_VERSION` to a supported 20.x release if you need to pin it.
3. Add the required environment variables from the table above in the Render service's environment settings. Add `NEXT_PUBLIC_*` business details only after the owner confirms them. Keep Supabase's service-role key and Paystack's secret key server-only.
4. Run `supabase/schema.sql` against the production Supabase project and configure only approved services, prices, travel zones, availability and course sessions.
5. Keep `PAYMENTS_ENABLED=false` until test checkout and webhook verification have passed. If enabling Paystack, set `PAYSTACK_CALLBACK_URL` to the public Render URL ending in `/api/payments/callback`, register `/api/payments/webhook`, and test before switching to live credentials.
6. Review privacy, refund and booking terms with the business before launch. Verify database backups, restricted access and MFA.

Render deploys the Next.js app as a Node web service; no local file storage is used for booking data. Deployment still requires configured Supabase credentials for booking and enquiry submissions. Vercel and other Next.js-compatible hosts can use the same build and start commands, with environment variables configured in their respective project settings.