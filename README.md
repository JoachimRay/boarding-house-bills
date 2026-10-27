# Boarding House Bills

A React Native and Expo client for the boarding house customer ledger. Expo SDK 57 is used.

## Run locally

1. Install packages with `npm install`.
2. Set `EXPO_PUBLIC_SUPABASE_URL`, `EXPO_PUBLIC_SUPABASE_KEY`, and `EXPO_PUBLIC_API_URL` in `.env`.
3. Start with `npm start`.

The `EXPO_PUBLIC_` values are bundled into the client. Use only the Supabase publishable/anon key here; never put a service-role key or database password in this app.

## API contract v1

Every API request includes `Authorization: Bearer <Supabase access token>`. A missing, invalid, or expired token returns `401`. The API must derive the profile and role from the verified token/database, never from a client-supplied role.

| Method and path | Access | Success | Other responses |
| --- | --- | --- | --- |
| `GET /api/me` | Signed in | `200` profile `{ id, email, role }` | `401` |
| `GET /api/customers` | Signed in | `200` customer array | `401` |
| `GET /api/customers/:id` | Signed in | `200` customer | `401`, `404` |
| `POST /api/customers` | Admin | `201` created customer; JSON `{ name, balance }` | `400`, `401`, `403` |
| `GET /api/customers/:id/entries` | Signed in | `200` entry array, newest first | `401`, `404` |
| `POST /api/customers/:id/entries` | Admin | `201` created entry; JSON `{ kind: "due" | "payment", amount }` | `400`, `401`, `403`, `404` |

Customers have `{ id, name, balance, lastPaid }`. Entries have `{ id, customerId, kind, amount, createdAt }`, where `kind` is `due` or `payment` and `amount` is a positive number. A due increases the customer's balance; a payment decreases it and updates `lastPaid`. The API must reject invalid/non-positive amounts and payments greater than the current balance. Saving an entry and updating the balance must happen in one database transaction so a partial write cannot corrupt the ledger. Role checks and validation must run on the server for every write; hiding the mobile form is only a UI affordance.

## Expo reference

Use the [Expo SDK 57 documentation](https://docs.expo.dev/versions/v57.0.0/) for APIs and configuration in this project.
