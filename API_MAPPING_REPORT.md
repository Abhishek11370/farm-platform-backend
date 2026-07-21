# API Mapping Report

**Flutter Endpoint:** `DELETE /auction/$id` (in `auction_provider.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** DELETE
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `DELETE /auction/$id` (in `auction_service.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** DELETE
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `DELETE /chat/$messageId` (in `chat_provider.dart`)
↓
**Backend Controller:** `chat.controller.ts` (`/chat/messages/:id`)
↓
**HTTP Method:** `DELETE`
↓
**Authentication/Roles:** ADMIN, FARMER, BUYER, DELIVERY
↓
**Status:** ⚠️ Mismatch (Flutter uses `/chat/$messageId`, backend expects `/chat/messages/:id`)
↓
**Fixed / Already Correct:** Fixed in previous step

---

**Flutter Endpoint:** `DELETE /inventory/$id` (in `inventory_provider.dart`)
↓
**Backend Controller:** `inventory.controller.ts` (`/inventory/:id`)
↓
**HTTP Method:** `DELETE`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `DELETE /orders/$orderId` (in `order_service.dart`)
↓
**Backend Controller:** `order.controller.ts` (`/orders/:id`)
↓
**HTTP Method:** `DELETE`
↓
**Authentication/Roles:** BUYER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `DELETE /product/$id` (in `product_provider.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product/:id`)
↓
**HTTP Method:** `DELETE`
↓
**Authentication/Roles:** FARMER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `DELETE /product/$id` (in `product_service.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product/:id`)
↓
**HTTP Method:** `DELETE`
↓
**Authentication/Roles:** FARMER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /admin/cms/pages` (in `admin_service.dart`)
↓
**Backend Controller:** `admin.controller.ts` (`/admin/cms/pages`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /admin/logs` (in `admin_service.dart`)
↓
**Backend Controller:** `admin.controller.ts` (`/admin/logs`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /admin/notifications` (in `admin_service.dart`)
↓
**Backend Controller:** `admin.controller.ts` (`/admin/notifications`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /admin/settings` (in `admin_service.dart`)
↓
**Backend Controller:** `admin.controller.ts` (`/admin/settings`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /admin/tickets` (in `admin_service.dart`)
↓
**Backend Controller:** `admin.controller.ts` (`/admin/tickets`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /admin/users` (in `admin_service.dart`)
↓
**Backend Controller:** `admin.controller.ts` (`/admin/users`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /analytics/dashboard` (in `admin_service.dart`)
↓
**Backend Controller:** `analytics.controller.ts` (`/analytics/dashboard`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** 'ADMIN'
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /analytics/farmer` (in `farmer_service.dart`)
↓
**Backend Controller:** `analytics.controller.ts` (`/analytics/farmer`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /auction` (in `auction_provider.dart`)
↓
**Backend Controller:** `auction.controller.ts` (`/auction`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** ADMIN, FARMER, BUYER, DELIVERY
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /auction/farmer` (in `auction_provider.dart`)
↓
**Backend Controller:** `auction.controller.ts` (`/auction/farmer`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /auction/farmer` (in `auction_service.dart`)
↓
**Backend Controller:** `auction.controller.ts` (`/auction/farmer`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /auth/wallet` (in `finance_provider.dart`)
↓
**Backend Controller:** `auth.controller.ts` (`/auth/me`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** ADMIN, FARMER, BUYER, DELIVERY
↓
**Status:** ⚠️ Mismatch (Flutter uses `/auth/wallet`, backend expects `/auth/me`)
↓
**Fixed / Already Correct:** Fixed in previous step

---

**Flutter Endpoint:** `GET /auth/wallet` (in `wallet_provider.dart`)
↓
**Backend Controller:** `auth.controller.ts` (`/auth/me`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** ADMIN, FARMER, BUYER, DELIVERY
↓
**Status:** ⚠️ Mismatch (Flutter uses `/auth/wallet`, backend expects `/auth/me`)
↓
**Fixed / Already Correct:** Fixed in previous step

---

**Flutter Endpoint:** `GET /chat/$userId` (in `chat_provider.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** GET
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `GET /chat/conversations` (in `chat_provider.dart`)
↓
**Backend Controller:** `chat.controller.ts` (`/chat/conversations`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** ADMIN, FARMER, BUYER, DELIVERY
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /farmer/stats` (in `farmer_service.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** GET
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `GET /inventory` (in `inventory_provider.dart`)
↓
**Backend Controller:** `inventory.controller.ts` (`/inventory`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /notifications` (in `notification_provider.dart`)
↓
**Backend Controller:** `notifications.controller.ts` (`/notifications`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /orders` (in `order_service.dart`)
↓
**Backend Controller:** `order.controller.ts` (`/orders`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** BUYER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /orders/farmer/stats` (in `order_service.dart`)
↓
**Backend Controller:** `order.controller.ts` (`/orders/farmer/stats`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /orders/farmer?$query` (in `order_service.dart`)
↓
**Backend Controller:** `order.controller.ts` (`/orders/farmer`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /orders/myorders` (in `order_service.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** GET
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `GET /payments/farmer` (in `finance_provider.dart`)
↓
**Backend Controller:** `payments.controller.ts` (`/payments/farmer`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /payments/my` (in `finance_provider.dart`)
↓
**Backend Controller:** `payments.controller.ts` (`/payments/my`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /product` (in `product_service.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /product/$id` (in `product_service.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product/:id`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /product/myproducts` (in `product_provider.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product/myproducts`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /product/myproducts` (in `product_service.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product/myproducts`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /product?keyword=$keyword&category=$category` (in `product_provider.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /reviews/admin/all` (in `review_service.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** GET
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `GET /reviews/farmer` (in `review_provider.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** GET
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `GET /reviews/farmer` (in `review_service.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** GET
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `GET /reviews/user` (in `review_provider.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** GET
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `GET /shipments` (in `shipment_provider.dart`)
↓
**Backend Controller:** `shipments.controller.ts` (`/shipments`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `GET /shipments/order/$orderId` (in `shipment_provider.dart`)
↓
**Backend Controller:** `shipments.controller.ts` (`/shipments/order/:orderId`)
↓
**HTTP Method:** `GET`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /auction` (in `auction_provider.dart`)
↓
**Backend Controller:** `auction.controller.ts` (`/auction`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** FARMER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /auction` (in `auction_service.dart`)
↓
**Backend Controller:** `auction.controller.ts` (`/auction`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** FARMER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /auction/$auctionId/accept` (in `auction_provider.dart`)
↓
**Backend Controller:** `auction.controller.ts` (`/auction/:id/accept`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /auction/$auctionId/bid` (in `auction_provider.dart`)
↓
**Backend Controller:** `auction.controller.ts` (`/auction/:id/bid`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** ADMIN, FARMER, BUYER, DELIVERY
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /auth/kyc-upload` (in `auth_provider.dart`)
↓
**Backend Controller:** `auth.controller.ts` (`/auth/kyc-upload`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /auth/login` (in `auth_provider.dart`)
↓
**Backend Controller:** `auth.controller.ts` (`/auth/login`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /auth/register` (in `auth_provider.dart`)
↓
**Backend Controller:** `auth.controller.ts` (`/auth/register`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /auth/wallet/add` (in `finance_provider.dart`)
↓
**Backend Controller:** `auth.controller.ts` (`/auth/wallet/add`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /auth/wallet/add` (in `wallet_provider.dart`)
↓
**Backend Controller:** `auth.controller.ts` (`/auth/wallet/add`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /auth/wallet/deduct` (in `wallet_provider.dart`)
↓
**Backend Controller:** `auth.controller.ts` (`/auth/wallet/deduct`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /chat` (in `chat_provider.dart`)
↓
**Backend Controller:** `chat.controller.ts` (`/chat/messages`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** ADMIN, FARMER, BUYER, DELIVERY
↓
**Status:** ⚠️ Mismatch (Flutter uses `/chat`, backend expects `/chat/messages`)
↓
**Fixed / Already Correct:** Fixed in previous step

---

**Flutter Endpoint:** `POST /inventory` (in `inventory_provider.dart`)
↓
**Backend Controller:** `inventory.controller.ts` (`/inventory`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** FARMER
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /orders` (in `cart_provider.dart`)
↓
**Backend Controller:** `order.controller.ts` (`/orders`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** BUYER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /orders` (in `order_service.dart`)
↓
**Backend Controller:** `order.controller.ts` (`/orders`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** BUYER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /payments` (in `finance_provider.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** POST
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `POST /product` (in `product_provider.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** FARMER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /product` (in `product_service.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** FARMER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /reviews` (in `review_provider.dart`)
↓
**Backend Controller:** `reviews.controller.ts` (`/reviews`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `POST /shipments` (in `shipment_provider.dart`)
↓
**Backend Controller:** `shipments.controller.ts` (`/shipments`)
↓
**HTTP Method:** `POST`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `PUT /admin/$path` (in `admin_service.dart`)
↓
**Backend Controller:** `admin.controller.ts` (`/admin/:path`)
↓
**HTTP Method:** `PUT`
↓
**Authentication/Roles:** ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `PUT /auction/$id/status` (in `auction_provider.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** PUT
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `PUT /auction/$id/status` (in `auction_service.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** PUT
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `PUT /auction/${auction.id}` (in `auction_provider.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** PUT
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `PUT /auth/profile` (in `auth_provider.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** PUT
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `PUT /notifications/$id/read` (in `notification_provider.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** PUT
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `PUT /orders/$orderId/cancel` (in `order_service.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** PUT
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `PUT /orders/$orderId/details` (in `order_service.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** PUT
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `PUT /orders/$orderId/status` (in `order_service.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** PUT
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `PUT /product/$id` (in `product_provider.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product/:id`)
↓
**HTTP Method:** `PUT`
↓
**Authentication/Roles:** FARMER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `PUT /product/$id` (in `product_service.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product/:id`)
↓
**HTTP Method:** `PUT`
↓
**Authentication/Roles:** FARMER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `PUT /product/${product.id}` (in `product_provider.dart`)
↓
**Backend Controller:** `products.controller.ts` (`/product/:id`)
↓
**HTTP Method:** `PUT`
↓
**Authentication/Roles:** FARMER, ADMIN
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

**Flutter Endpoint:** `PUT /reviews/$reviewId/reply` (in `review_service.dart`)
↓
**Backend Controller:** N/A
↓
**HTTP Method:** PUT
↓
**Authentication/Roles:** N/A
↓
**Status:** ❌ Missing Endpoint
↓
**Fixed / Already Correct:** Needs Backend Implementation or Mocking

---

**Flutter Endpoint:** `PUT /shipments/$id` (in `shipment_provider.dart`)
↓
**Backend Controller:** `shipments.controller.ts` (`/shipments/:id`)
↓
**HTTP Method:** `PUT`
↓
**Authentication/Roles:** Public/No Roles
↓
**Status:** ✅ Match
↓
**Fixed / Already Correct:** Already Correct

---

