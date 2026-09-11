# Staff roles and subscriptions

This application operates one shared storefront. Admin accounts manage the same products, orders, content and delivery team. These roles do not create separate stores or tenant-isolated databases.

| Role | Dashboard | Permissions |
| --- | --- | --- |
| `super_admin` | `/super-admin` | Create/edit admins, reset admin passwords, enable/disable accounts, set manual subscription plan/status/expiry, view access-change history. No store administration access. |
| `admin` | `/admin` | Existing store operations: orders, products, delivery accounts/assignments, customers, content, images, enquiries, subscribers and settings. Requires active subscription and account. |
| `delivery_boy` | `/delivery` | Only assigned deliveries; pickup, location/status updates, OTP completion and COD collection confirmation. |

Customers keep their existing shopping accounts. Public signup cannot create staff accounts. Login sends each staff role to its own dashboard.

## Create the first Super Admin

Set these values in `backend/.env` locally (use a separate email from your existing admin):

```dotenv
SUPER_ADMIN_NAME=Super Admin
SUPER_ADMIN_EMAIL=your-owner-email@example.com
SUPER_ADMIN_PHONE=your-10-digit-phone
SUPER_ADMIN_PASSWORD=your-unique-12-to-72-character-password
```

Then, from `backend`, run `npm run create-super-admin`. This command creates only the first Super Admin, does not seed products or content, does not promote existing users, and does not print the password. Sign in through `/login`; you will arrive at `/super-admin`. Keep `.env` private. Restart the backend for the new API routes and deploy/build the updated frontend.

## Subscription workflow

1. Super Admin creates an admin, entering the plan name, expiry date and subscription status.
2. Share the admin's email/password directly. The admin signs in at `/login`.
3. Admin creates delivery accounts and shares `/delivery` with their login credentials.
4. Admin confirms/packs orders and assigns a partner. Partner picks up and updates the delivery; customer OTP completes it.
5. Renew through **Edit / renew** by setting a future expiry and Active status. Re-enable the account too if it was disabled.

Expiry is at 23:59:59.999 India time on the chosen date. Paused/expired/disabled admins cannot use store admin APIs, even with an existing token. Their linked delivery accounts also lose operational access until renewal. Orders and public storefront data are retained. Subscriptions are manual access controls, with no billing, payment collection or automatic charging.

Existing admins retain legacy access without an expiry until the Super Admin sets a plan/expiry. Existing `isAdmin`/`isDriver` accounts are recognized; their explicit role is saved on the next account update. Old delivery accounts without `managedBy` are linked to the admin on their next edit or order assignment; until then they retain their existing active/paused behavior. Newly created accounts are linked automatically. During rollout, edit/save existing delivery accounts to link them before enforcing subscriptions. Existing admin sessions should sign out/in to refresh role details.

For verification, run `node --test src/tests/roles.test.js src/tests/delivery.test.js` from `backend`. Tests use uniquely named temporary databases and clean up only those databases.
