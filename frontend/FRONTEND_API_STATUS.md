# Frontend API Status

This document tracks the status of frontend API service integrations with the frozen backend (v1.0.0).

| Module | Endpoint Category | Status | Notes |
| :--- | :--- | :--- | :--- |
| **Authentication** | `/api/v1/auth/*` | Connected | Basic login working, needs full mapping. |
| **Users** | `/api/v1/users/*` | Connected | Full CRUD operations implemented. |
| **Farmers** | `/api/v1/users/*` (Filtered) | Connected | Managed via User API (role=FARMER). |
| **Products** | `/api/v1/product/*` | Connected | Full product CRUD implemented. |
| **Categories** | `/api/v1/product/categories/*` | Connected | Categories, SubCats, Units, Grades. |
| **Orders** | `/api/v1/orders/*` | Connected | Full Order management working. |
| **Payments** | `/api/v1/payments/*` | Connected | Razorpay and Logs integrated. |
| **Notifications**| `/api/v1/notifications/*`| Connected | Send and view logs implemented. |
| **Wishlist** | `/api/v1/wishlists/*`| Connected | Complete wishlist tracking. |
| **Reviews** | `/api/v1/reviews/*` | Connected | Full review management implemented. |
| **Coupons** | `/api/v1/coupons/*` | Connected | Fully implemented. |
| **Farmer Verification** | `/api/v1/farmer-verification/*` | Connected | KYC review implemented. |
| **Analytics** | `/api/v1/analytics/*`| Connected | Dashboard fully integrated. |
| **Auctions** | `/api/v1/auctions/*` | Connected | Full Auction UI built. |
| **Activity Logs** | `/api/v1/activity/*` | Connected | Recent activity integrated in dashboard. |
| **Delivery** | `/api/v1/delivery/*` | Connected | |
| **Categories** | `/api/v1/categories/*`| Pending | |

*Status will be updated to `Connected` as each module is implemented.*
