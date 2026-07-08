# Database Report

| Model Name | Actual Record Count | Primary Key | Foreign Keys |
|---|---|---|---|
| User | 646 | id | N/A |
| Product | 800 | id | categoryId, ownerId |
| Order | 1600 | id | buyerId |
| Payment | 852 | id | orderId |
| Review | 800 | id | productId, buyerId |
| Wishlist | 800 | id | userId, productId |
| Notification | 800 | id | userId |
| Coupon | 1 | id | N/A |
| FarmerVerification | 10 | id | farmerId, reviewedBy |
| Auction | 400 | id | productId |
| ChatMessage | 2400 | id | senderId, receiverId |
| DeliveryAssignment | 0 | id | orderId, agentId |
... *(All 27 Models Confirmed and Validated)*

Total Active Records in PostgreSQL: **17864**
