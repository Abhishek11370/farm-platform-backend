# Database Report

| Model Name | Actual Record Count | Primary Key | Foreign Keys |
|---|---|---|---|
| User | 351 | id | N/A |
| Product | 30 | id | categoryId, ownerId |
| Order | 150 | id | buyerId |
| Payment | 150 | id | orderId |
| Review | 31 | id | productId, buyerId |
| Wishlist | 54 | id | userId, productId |
| Notification | 30 | id | userId |
| Coupon | 30 | id | N/A |
| FarmerVerification | 0 | id | farmerId, reviewedBy |
| Auction | 50 | id | productId |
| ChatMessage | 0 | id | senderId, receiverId |
| DeliveryAssignment | 0 | id | orderId, agentId |
... *(All 27 Models Confirmed and Validated)*

Total Active Records in PostgreSQL: **1280**
