Digital Store ULTIMATE++ MAX - FULL
==================================

This repository contains a fully-packaged digital store ready for deployment.
Includes:
- 500 products with images and downloadable ZIPs
- Node.js server with Stripe Checkout, webhook endpoint, and download validation
- Dockerfile and docker-compose for local deployment with Postgres
- .env.example with required environment variables
- Guide_Premium_FULL.pdf with deployment instructions

To deploy quickly:
1. Create a repo on GitHub and upload these files (or upload the extracted files).
2. On Render, create a new Web Service and point to this repository (build: npm install, start: npm start).
3. Set environment variables: STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET, DATABASE_URL, SMTP_*, ADMIN_USER, ADMIN_PASS, BASE_URL
4. Create a Stripe webhook to BASE_URL/webhook (checkout.session.completed)
5. Test with Stripe test keys and card 4242 4242 4242 4242
