# Admin images and Cloudinary

- Products: choose **Add product** or edit a product, then **Add image** / **Choose image** to upload or pick from the media library. Save the product. New active products appear in the shop.
- Website content > Brand Logo & Identity: upload/select the logo and save. Header, footer and homepage use this logo.
- Website content > Homepage: replace the hero and existing page banners, then save.
- Website content > Homepage Posters: add up to 20 posters, choose images, enter alt text and a store link (for example `/shop`), and save. Disable or remove entries to hide them.
- Website content > Website Background Images: change the shared contact, journey and policy backgrounds.
- Other website pages: expand a section and choose an image beside its image field.
- Media uploads accept images up to 10 MB. Failed Cloudinary uploads show an error; they are not saved to ephemeral server storage.

Configure `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` and `MONGO_URI` in `backend/.env` or deployment environment variables. Never put secrets in frontend variables or example files.

From `backend`, run `npm run migrate-cloudinary` to resume migration. It uploads public images and legacy backend uploads, checkpoints `scripts/cloudinary-url-map.json`, updates product and website-content records without replacing other fields, and rewrites source defaults/CSS to Cloudinary URLs. Existing local files are retained. Restart the backend and rebuild/deploy the frontend after migration. Startup seeding only inserts missing records, preserving admin changes.

Validation: `node backend/src/tests/media.test.js`; from `backend`, `node --test-name-pattern="bootstrap preserves|admin can save posters|media library lists" src/tests/store.test.js` uses an isolated temporary test database. Frontend: `npm run build`.
