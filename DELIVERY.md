# In-house delivery

Open `/admin?tab=delivery` with an administrator account to create delivery partners (name, email, phone, password and service area), pause their access, filter orders by city/PIN code, and assign or reassign an order. Existing customer accounts are not converted into driver accounts.

1. Admin confirms and packs the order in **Orders** and assigns a partner in **Delivery team**.
2. Partner signs in at `/delivery` using the credentials supplied by the admin.
3. Partner enters a current area/landmark and marks the packed order **Picked up order**, then **Out for Delivery**.
4. Partner posts area/landmark updates and optional notes. **Attach current GPS** captures browser location; **Share update** publishes it. Location permission and HTTPS (or localhost) are needed for GPS. Manual location entry also works.
5. Customer signs into the account used to place the order, opens `/orders/:id`, and selects **Get delivery OTP** after the order is out for delivery.
6. After handing over the package, the partner enters the customer's six-digit code, confirms collection for an unpaid COD order, and selects **Verify OTP & mark delivered**.

The customer, driver and admin screens refresh from the API every 20 seconds. The timeline preserves driver status and named location updates with timestamps; the map link shows the latest explicitly shared GPS point and its timestamp. This is manual location sharing, not continuous background GPS or a native mobile app. Customer history uses saved events rather than generated demonstration timestamps.

Codes expire after 10 minutes and lock after five incorrect attempts. After expiry the customer can request a fresh code. Reassignment invalidates the existing code, clears the old GPS point and removes the former driver's access. Admin cannot bypass OTP completion for an assigned order. Delivered/cancelled orders reject further driver updates. Order details and codes require the owning customer account (admins can read order details); drivers access only their assigned deliveries.

OTP delivery is through the authenticated customer tracking screen. SMS/WhatsApp sending is not configured. The code and its attempt/expiry fields are excluded from ordinary order API responses, including driver and admin lists.

## Checks

- `cd frontend` then `npm run build`
- `cd frontend` then `npx eslint src/delivery src/admin/DeliveryPanel.jsx src/App.jsx src/admin/AdminShell.jsx`
- `cd backend` then `node src/tests/delivery.test.js`
- For the UI smoke check, start Vite on `127.0.0.1:5174`, then run `node scripts/check-delivery-ui.mjs` from the repository root. This uses headless Chrome at its standard Windows install path and fixture API responses; screenshots go to `.artifacts/`.

API integration tests require `MONGO_URI` in the backend environment. They create and clean up a uniquely named, isolated test database. UI fixtures are separate from the database integration checks.
