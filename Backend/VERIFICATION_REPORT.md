# Farm-To-Platform Verification Report

## 1. Database Summary & Sample Records

### Table: User
- **Total Records:** 351
- **Sample Records (First 10):**
```json
[
  {
    "id": "0010ba3f-6ac8-4ff0-82f0-9024292001f7",
    "name": "Kristie Labadie",
    "email": "kristie.labadie@example.com",
    "phone": "402-979-2768",
    "password": "Hjy_lrJY70jq",
    "role": "ADMIN",
    "isBlocked": false,
    "createdAt": "2026-07-03T12:19:36.531Z",
    "updatedAt": "2026-07-03T12:19:36.531Z"
  },
  {
    "id": "0146ce05-7751-485f-95a4-3e88116fc97c",
    "name": "Jenny Bartell",
    "email": "jenny.bartell@example.com",
    "phone": "1-259-823-6870 x5865",
    "password": "bEDG1g2NgaZ2",
    "role": "ADMIN",
    "isBlocked": false,
    "createdAt": "2026-06-04T16:45:00.127Z",
    "updatedAt": "2026-06-04T16:45:00.127Z"
  },
  {
    "id": "01e8c0b4-f4e7-4c43-97d3-c0e01ac083b1",
    "name": "Miss Jaime Hegmann",
    "email": "miss.jaime.hegmann@example.com",
    "phone": "1-507-607-9811 x21469",
    "password": "ojJB7YQG4Ij5",
    "role": "ADMIN",
    "isBlocked": false,
    "createdAt": "2026-07-03T12:18:41.621Z",
    "updatedAt": "2026-07-03T12:18:41.621Z"
  },
  {
    "id": "03cb697c-5132-47d7-8432-0560db0622c0",
    "name": "Jenny Schmidt",
    "email": "jenny.schmidt@example.com",
    "phone": "(877) 706-2338 x3082",
    "password": "yyMTqhJCGyon",
    "role": "ADMIN",
    "isBlocked": false,
    "createdAt": "2026-07-04T14:46:30.892Z",
    "updatedAt": "2026-07-04T14:46:30.892Z"
  },
  {
    "id": "0477ceb2-5be8-4fa5-8e06-064c1c7d473a",
    "name": "Regina Muller",
    "email": "regina.muller@example.com",
    "phone": "996-443-1925",
    "password": "U9pyjxURPQ3_",
    "role": "ADMIN",
    "isBlocked": false,
    "createdAt": "2026-06-04T16:45:15.082Z",
    "updatedAt": "2026-06-04T16:45:15.082Z"
  },
  {
    "id": "05880de6-dae1-4f0c-9693-c92657105118",
    "name": "Daryl Gottlieb",
    "email": "daryl.gottlieb@example.com",
    "phone": "235-874-0496",
    "password": "kkfXsYKcIqQ3",
    "role": "ADMIN",
    "isBlocked": false,
    "createdAt": "2026-07-04T16:44:23.933Z",
    "updatedAt": "2026-07-04T16:44:23.933Z"
  },
  {
    "id": "06948bd8-9d44-43aa-b401-a8a3f105fe1f",
    "name": "Peggy Parker",
    "email": "peggy.parker@example.com",
    "phone": "443.588.3307",
    "password": "TSV7tSvwRTWE",
    "role": "ADMIN",
    "isBlocked": false,
    "createdAt": "2026-07-04T16:44:23.933Z",
    "updatedAt": "2026-07-04T16:44:23.933Z"
  },
  {
    "id": "08224beb-717c-408b-ac14-299ff91205e5",
    "name": "Miss Elizabeth Runolfsson",
    "email": "miss.elizabeth.runolfsson@example.com",
    "phone": "(480) 701-4226 x0087",
    "password": "dQdRw2frECsG",
    "role": "ADMIN",
    "isBlocked": false,
    "createdAt": "2026-06-04T16:45:00.128Z",
    "updatedAt": "2026-06-04T16:45:00.128Z"
  },
  {
    "id": "0b666b18-01f2-4ced-aa73-11914e84c83a",
    "name": "Leon Jerde",
    "email": "leon.jerde@example.com",
    "phone": "1-374-826-5216 x25127",
    "password": "xYtc5QJC3JJn",
    "role": "ADMIN",
    "isBlocked": false,
    "createdAt": "2026-07-04T16:44:23.934Z",
    "updatedAt": "2026-07-04T16:44:23.934Z"
  },
  {
    "id": "0b714d2b-1651-4abf-a4f4-eaf5cf3dcef7",
    "name": "Floyd Simonis",
    "email": "floyd.simonis@example.com",
    "phone": "1-998-642-2617",
    "password": "1f7Xz9pNTYDx",
    "role": "ADMIN",
    "isBlocked": false,
    "createdAt": "2026-06-04T16:45:15.083Z",
    "updatedAt": "2026-06-04T16:45:15.083Z"
  }
]
```

### Table: Address
- **Total Records:** 0
- *No records found.*

### Table: Category
- **Total Records:** 1
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzbt6000uxctc3mbaujs1",
    "name": "General Agriculture"
  }
]
```

### Table: SubCategory
- **Total Records:** 1
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzbta000wxctcc3m8hb1q",
    "name": "Fresh Produce",
    "categoryId": "cmrngzbt6000uxctc3mbaujs1"
  }
]
```

### Table: Unit
- **Total Records:** 1
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzbtd000xxctcm6oktpz9",
    "name": "KG"
  }
]
```

### Table: Grade
- **Total Records:** 1
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzbtf000yxctcus8s8ent",
    "name": "Grade A"
  }
]
```

### Table: Product
- **Total Records:** 30
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzbtk0010xctc89137rs7",
    "title": "Rice",
    "description": "High quality fresh Rice. Directly from the farm.",
    "price": 301.52,
    "quantity": 86,
    "latitude": null,
    "longitude": null,
    "createdAt": "2026-07-16T12:12:57.368Z",
    "updatedAt": "2026-07-16T12:12:57.368Z",
    "ownerId": "cmrngzbqk0000xctcqn8ez7qt",
    "unitId": "cmrngzbtd000xxctcm6oktpz9",
    "gradeId": "cmrngzbtf000yxctcus8s8ent",
    "subCategoryId": "cmrngzbta000wxctcc3m8hb1q"
  },
  {
    "id": "cmrngzbtw0013xctc8quebdjg",
    "title": "Wheat",
    "description": "High quality fresh Wheat. Directly from the farm.",
    "price": 261.22,
    "quantity": 92,
    "latitude": null,
    "longitude": null,
    "createdAt": "2026-07-16T12:12:57.381Z",
    "updatedAt": "2026-07-16T12:12:57.381Z",
    "ownerId": "cmrngzbr10001xctcd40hz7my",
    "unitId": "cmrngzbtd000xxctcm6oktpz9",
    "gradeId": "cmrngzbtf000yxctcus8s8ent",
    "subCategoryId": "cmrngzbta000wxctcc3m8hb1q"
  },
  {
    "id": "cmrngzbu10016xctczxeappgm",
    "title": "Tomato",
    "description": "High quality fresh Tomato. Directly from the farm.",
    "price": 424.75,
    "quantity": 84,
    "latitude": null,
    "longitude": null,
    "createdAt": "2026-07-16T12:12:57.385Z",
    "updatedAt": "2026-07-16T12:12:57.385Z",
    "ownerId": "cmrngzbr40002xctcnznj47s3",
    "unitId": "cmrngzbtd000xxctcm6oktpz9",
    "gradeId": "cmrngzbtf000yxctcus8s8ent",
    "subCategoryId": "cmrngzbta000wxctcc3m8hb1q"
  },
  {
    "id": "cmrngzbu70019xctcz3w0lr60",
    "title": "Potato",
    "description": "High quality fresh Potato. Directly from the farm.",
    "price": 186.61,
    "quantity": 91,
    "latitude": null,
    "longitude": null,
    "createdAt": "2026-07-16T12:12:57.391Z",
    "updatedAt": "2026-07-16T12:12:57.391Z",
    "ownerId": "cmrngzbr80003xctc7hajps53",
    "unitId": "cmrngzbtd000xxctcm6oktpz9",
    "gradeId": "cmrngzbtf000yxctcus8s8ent",
    "subCategoryId": "cmrngzbta000wxctcc3m8hb1q"
  },
  {
    "id": "cmrngzbud001cxctcq3wag369",
    "title": "Onion",
    "description": "High quality fresh Onion. Directly from the farm.",
    "price": 318.54,
    "quantity": 100,
    "latitude": null,
    "longitude": null,
    "createdAt": "2026-07-16T12:12:57.397Z",
    "updatedAt": "2026-07-16T12:12:57.397Z",
    "ownerId": "cmrngzbrb0004xctc1yn9o010",
    "unitId": "cmrngzbtd000xxctcm6oktpz9",
    "gradeId": "cmrngzbtf000yxctcus8s8ent",
    "subCategoryId": "cmrngzbta000wxctcc3m8hb1q"
  },
  {
    "id": "cmrngzbuh001fxctcqg1q08mp",
    "title": "Carrot",
    "description": "High quality fresh Carrot. Directly from the farm.",
    "price": 144.33,
    "quantity": 66,
    "latitude": null,
    "longitude": null,
    "createdAt": "2026-07-16T12:12:57.401Z",
    "updatedAt": "2026-07-16T12:12:57.401Z",
    "ownerId": "cmrngzbrf0005xctcf6rtbral",
    "unitId": "cmrngzbtd000xxctcm6oktpz9",
    "gradeId": "cmrngzbtf000yxctcus8s8ent",
    "subCategoryId": "cmrngzbta000wxctcc3m8hb1q"
  },
  {
    "id": "cmrngzbum001ixctc3k012fnl",
    "title": "Garlic",
    "description": "High quality fresh Garlic. Directly from the farm.",
    "price": 388.43,
    "quantity": 40,
    "latitude": null,
    "longitude": null,
    "createdAt": "2026-07-16T12:12:57.407Z",
    "updatedAt": "2026-07-16T12:12:57.407Z",
    "ownerId": "cmrngzbrh0006xctc2435g3r5",
    "unitId": "cmrngzbtd000xxctcm6oktpz9",
    "gradeId": "cmrngzbtf000yxctcus8s8ent",
    "subCategoryId": "cmrngzbta000wxctcc3m8hb1q"
  },
  {
    "id": "cmrngzbup001lxctcs5f18ezc",
    "title": "Ginger",
    "description": "High quality fresh Ginger. Directly from the farm.",
    "price": 427.62,
    "quantity": 61,
    "latitude": null,
    "longitude": null,
    "createdAt": "2026-07-16T12:12:57.409Z",
    "updatedAt": "2026-07-16T12:12:57.409Z",
    "ownerId": "cmrngzbrk0007xctcj3uw45mf",
    "unitId": "cmrngzbtd000xxctcm6oktpz9",
    "gradeId": "cmrngzbtf000yxctcus8s8ent",
    "subCategoryId": "cmrngzbta000wxctcc3m8hb1q"
  },
  {
    "id": "cmrngzbut001oxctcu50m1q3a",
    "title": "Corn",
    "description": "High quality fresh Corn. Directly from the farm.",
    "price": 51.21,
    "quantity": 74,
    "latitude": null,
    "longitude": null,
    "createdAt": "2026-07-16T12:12:57.414Z",
    "updatedAt": "2026-07-16T12:12:57.414Z",
    "ownerId": "cmrngzbrm0008xctccmbi83xh",
    "unitId": "cmrngzbtd000xxctcm6oktpz9",
    "gradeId": "cmrngzbtf000yxctcus8s8ent",
    "subCategoryId": "cmrngzbta000wxctcc3m8hb1q"
  },
  {
    "id": "cmrngzbv0001rxctcvyqh1nna",
    "title": "Maize",
    "description": "High quality fresh Maize. Directly from the farm.",
    "price": 282.81,
    "quantity": 63,
    "latitude": null,
    "longitude": null,
    "createdAt": "2026-07-16T12:12:57.420Z",
    "updatedAt": "2026-07-16T12:12:57.420Z",
    "ownerId": "cmrngzbrp0009xctc8zw1einc",
    "unitId": "cmrngzbtd000xxctcm6oktpz9",
    "gradeId": "cmrngzbtf000yxctcus8s8ent",
    "subCategoryId": "cmrngzbta000wxctcc3m8hb1q"
  }
]
```

### Table: ProductImage
- **Total Records:** 30
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzbtl0011xctco3d2o5q7",
    "productId": "cmrngzbtk0010xctc89137rs7",
    "imageUrl": "https://loremflickr.com/400/400/rice",
    "isPrimary": true,
    "createdAt": "2026-07-16T12:12:57.368Z"
  },
  {
    "id": "cmrngzbtw0014xctcrjb6s8t1",
    "productId": "cmrngzbtw0013xctc8quebdjg",
    "imageUrl": "https://loremflickr.com/400/400/wheat",
    "isPrimary": true,
    "createdAt": "2026-07-16T12:12:57.381Z"
  },
  {
    "id": "cmrngzbu10017xctcjbs9z8ag",
    "productId": "cmrngzbu10016xctczxeappgm",
    "imageUrl": "https://loremflickr.com/400/400/tomato",
    "isPrimary": true,
    "createdAt": "2026-07-16T12:12:57.385Z"
  },
  {
    "id": "cmrngzbu7001axctch2vnlm2l",
    "productId": "cmrngzbu70019xctcz3w0lr60",
    "imageUrl": "https://loremflickr.com/400/400/potato",
    "isPrimary": true,
    "createdAt": "2026-07-16T12:12:57.391Z"
  },
  {
    "id": "cmrngzbud001dxctcxycjb8l0",
    "productId": "cmrngzbud001cxctcq3wag369",
    "imageUrl": "https://loremflickr.com/400/400/onion",
    "isPrimary": true,
    "createdAt": "2026-07-16T12:12:57.397Z"
  },
  {
    "id": "cmrngzbuh001gxctcydqw9eyu",
    "productId": "cmrngzbuh001fxctcqg1q08mp",
    "imageUrl": "https://loremflickr.com/400/400/carrot",
    "isPrimary": true,
    "createdAt": "2026-07-16T12:12:57.401Z"
  },
  {
    "id": "cmrngzbum001jxctch2el7l5m",
    "productId": "cmrngzbum001ixctc3k012fnl",
    "imageUrl": "https://loremflickr.com/400/400/garlic",
    "isPrimary": true,
    "createdAt": "2026-07-16T12:12:57.407Z"
  },
  {
    "id": "cmrngzbup001mxctcezws8yia",
    "productId": "cmrngzbup001lxctcs5f18ezc",
    "imageUrl": "https://loremflickr.com/400/400/ginger",
    "isPrimary": true,
    "createdAt": "2026-07-16T12:12:57.409Z"
  },
  {
    "id": "cmrngzbut001pxctc2svr618u",
    "productId": "cmrngzbut001oxctcu50m1q3a",
    "imageUrl": "https://loremflickr.com/400/400/corn",
    "isPrimary": true,
    "createdAt": "2026-07-16T12:12:57.414Z"
  },
  {
    "id": "cmrngzbv0001sxctc36ber9cs",
    "productId": "cmrngzbv0001rxctcvyqh1nna",
    "imageUrl": "https://loremflickr.com/400/400/maize",
    "isPrimary": true,
    "createdAt": "2026-07-16T12:12:57.420Z"
  }
]
```

### Table: Auction
- **Total Records:** 50
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzcs500y7xctcm9zy51bq",
    "productId": "cmrngzbuh001fxctcqg1q08mp",
    "startTime": "2026-07-12T22:49:17.388Z",
    "endTime": "2026-07-23T06:38:12.076Z",
    "basePrice": 115.464,
    "status": "LIVE",
    "createdAt": "2026-07-16T12:12:58.614Z",
    "updatedAt": "2026-07-16T12:12:58.614Z"
  },
  {
    "id": "cmrngzcsp00yjxctcer0ahh6i",
    "productId": "cmrngzbtk0010xctc89137rs7",
    "startTime": "2026-07-15T15:03:02.266Z",
    "endTime": "2026-07-17T18:41:30.533Z",
    "basePrice": 241.216,
    "status": "DRAFT",
    "createdAt": "2026-07-16T12:12:58.633Z",
    "updatedAt": "2026-07-16T12:12:58.633Z"
  },
  {
    "id": "cmrngzcsr00ylxctcc564eodw",
    "productId": "cmrngzbx40039xctc1ydu2cp5",
    "startTime": "2026-07-13T02:24:12.045Z",
    "endTime": "2026-07-24T03:20:56.666Z",
    "basePrice": 193.352,
    "status": "LIVE",
    "createdAt": "2026-07-16T12:12:58.635Z",
    "updatedAt": "2026-07-16T12:12:58.635Z"
  },
  {
    "id": "cmrngzcsx00ytxctccyb03r06",
    "productId": "cmrngzbtk0010xctc89137rs7",
    "startTime": "2026-07-12T01:26:41.494Z",
    "endTime": "2026-07-19T12:30:21.065Z",
    "basePrice": 241.216,
    "status": "CLOSED",
    "createdAt": "2026-07-16T12:12:58.641Z",
    "updatedAt": "2026-07-16T12:12:58.641Z"
  },
  {
    "id": "cmrngzcsz00yxxctcovad746q",
    "productId": "cmrngzbvd0020xctch0auwrui",
    "startTime": "2026-07-11T15:34:43.878Z",
    "endTime": "2026-07-22T03:29:36.886Z",
    "basePrice": 288.792,
    "status": "CANCELLED",
    "createdAt": "2026-07-16T12:12:58.644Z",
    "updatedAt": "2026-07-16T12:12:58.644Z"
  },
  {
    "id": "cmrngzct100yzxctcrq41xpwo",
    "productId": "cmrngzbx9003cxctcogu0on52",
    "startTime": "2026-07-13T19:05:53.136Z",
    "endTime": "2026-07-21T14:16:33.537Z",
    "basePrice": 119.48,
    "status": "DRAFT",
    "createdAt": "2026-07-16T12:12:58.645Z",
    "updatedAt": "2026-07-16T12:12:58.645Z"
  },
  {
    "id": "cmrngzct300z1xctcq7crvspa",
    "productId": "cmrngzbu10016xctczxeappgm",
    "startTime": "2026-07-15T11:56:38.207Z",
    "endTime": "2026-07-26T01:11:29.396Z",
    "basePrice": 339.8,
    "status": "CANCELLED",
    "createdAt": "2026-07-16T12:12:58.648Z",
    "updatedAt": "2026-07-16T12:12:58.648Z"
  },
  {
    "id": "cmrngzct500z3xctctsb0mvnp",
    "productId": "cmrngzbvx0029xctc37elx4be",
    "startTime": "2026-07-12T04:50:21.699Z",
    "endTime": "2026-07-19T05:54:29.190Z",
    "basePrice": 248.28,
    "status": "CANCELLED",
    "createdAt": "2026-07-16T12:12:58.650Z",
    "updatedAt": "2026-07-16T12:12:58.650Z"
  },
  {
    "id": "cmrngzct700z5xctct5xwqtlk",
    "productId": "cmrngzbw7002fxctceygrb2c3",
    "startTime": "2026-07-14T09:22:33.030Z",
    "endTime": "2026-07-19T23:38:03.068Z",
    "basePrice": 399.992,
    "status": "CANCELLED",
    "createdAt": "2026-07-16T12:12:58.651Z",
    "updatedAt": "2026-07-16T12:12:58.651Z"
  },
  {
    "id": "cmrngzct900z7xctcdhenwpjo",
    "productId": "cmrngzbx9003cxctcogu0on52",
    "startTime": "2026-07-16T05:59:04.383Z",
    "endTime": "2026-07-22T03:09:25.363Z",
    "basePrice": 119.48,
    "status": "CANCELLED",
    "createdAt": "2026-07-16T12:12:58.653Z",
    "updatedAt": "2026-07-16T12:12:58.653Z"
  }
]
```

### Table: Bid
- **Total Records:** 77
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzcsa00y9xctc0yxlb0qf",
    "auctionId": "cmrngzcs500y7xctcm9zy51bq",
    "bidderId": "cmrngzbsi000lxctcu0mvz8gv",
    "amount": 120.9395984479561,
    "createdAt": "2026-07-16T12:12:58.619Z"
  },
  {
    "id": "cmrngzcsf00ybxctcjzmut9sb",
    "auctionId": "cmrngzcs500y7xctcm9zy51bq",
    "bidderId": "cmrngzbsm000nxctc69itu9n2",
    "amount": 127.6760860102586,
    "createdAt": "2026-07-16T12:12:58.623Z"
  },
  {
    "id": "cmrngzcsh00ydxctc9vlrcuyu",
    "auctionId": "cmrngzcs500y7xctcm9zy51bq",
    "bidderId": "cmrngzbsy000sxctcss594a8o",
    "amount": 142.5428196846843,
    "createdAt": "2026-07-16T12:12:58.625Z"
  },
  {
    "id": "cmrngzcsk00yfxctccyyn6vce",
    "auctionId": "cmrngzcs500y7xctcm9zy51bq",
    "bidderId": "cmrngzbsr000pxctc5aaaxy54",
    "amount": 160.1023639937267,
    "createdAt": "2026-07-16T12:12:58.628Z"
  },
  {
    "id": "cmrngzcsn00yhxctc3o094f4s",
    "auctionId": "cmrngzcs500y7xctcm9zy51bq",
    "bidderId": "cmrngzbsr000pxctc5aaaxy54",
    "amount": 176.6941647372078,
    "createdAt": "2026-07-16T12:12:58.631Z"
  },
  {
    "id": "cmrngzcst00ynxctcm5ecthi8",
    "auctionId": "cmrngzcsr00ylxctcc564eodw",
    "bidderId": "cmrngzbsy000sxctcss594a8o",
    "amount": 205.3856860674433,
    "createdAt": "2026-07-16T12:12:58.637Z"
  },
  {
    "id": "cmrngzcsu00ypxctckgf6zv71",
    "auctionId": "cmrngzcsr00ylxctcc564eodw",
    "bidderId": "cmrngzbst000qxctcgdtrta8a",
    "amount": 211.0001162826531,
    "createdAt": "2026-07-16T12:12:58.639Z"
  },
  {
    "id": "cmrngzcsv00yrxctcdbstz313",
    "auctionId": "cmrngzcsr00ylxctcc564eodw",
    "bidderId": "cmrngzbs9000hxctceqdsas2y",
    "amount": 219.2181214564927,
    "createdAt": "2026-07-16T12:12:58.640Z"
  },
  {
    "id": "cmrngzcsy00yvxctcqr94afx0",
    "auctionId": "cmrngzcsx00ytxctccyb03r06",
    "bidderId": "cmrngzbsp000oxctcmte2ziwy",
    "amount": 247.2392980723959,
    "createdAt": "2026-07-16T12:12:58.642Z"
  },
  {
    "id": "cmrngzctd00zbxctc78y56ew7",
    "auctionId": "cmrngzctb00z9xctcqdtopwve",
    "bidderId": "cmrngzbsk000mxctcogp5nby2",
    "amount": 248.4431756075453,
    "createdAt": "2026-07-16T12:12:58.657Z"
  }
]
```

### Table: Order
- **Total Records:** 150
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzbxh003ixctcq36gz7p1",
    "buyerId": "cmrngzbs5000fxctczojnpar2",
    "status": "DELIVERED",
    "totalAmount": 2214.31,
    "couponCode": null,
    "createdAt": "2026-07-16T12:12:57.509Z",
    "updatedAt": "2026-07-16T12:12:57.509Z"
  },
  {
    "id": "cmrngzbxr003qxctc6stqc3bq",
    "buyerId": "cmrngzbsy000sxctcss594a8o",
    "status": "SHIPPED",
    "totalAmount": 776.86,
    "couponCode": null,
    "createdAt": "2026-07-16T12:12:57.519Z",
    "updatedAt": "2026-07-16T12:12:57.519Z"
  },
  {
    "id": "cmrngzbxx003wxctcuph0pfpw",
    "buyerId": "cmrngzbsk000mxctcogp5nby2",
    "status": "DELIVERED",
    "totalAmount": 2357.09,
    "couponCode": null,
    "createdAt": "2026-07-16T12:12:57.525Z",
    "updatedAt": "2026-07-16T12:12:57.525Z"
  },
  {
    "id": "cmrngzby50043xctcb8umku9x",
    "buyerId": "cmrngzbsp000oxctcmte2ziwy",
    "status": "PLACED",
    "totalAmount": 415.05,
    "couponCode": null,
    "createdAt": "2026-07-16T12:12:57.533Z",
    "updatedAt": "2026-07-16T12:12:57.533Z"
  },
  {
    "id": "cmrngzbyd0049xctc5z3girj5",
    "buyerId": "cmrngzbsp000oxctcmte2ziwy",
    "status": "PLACED",
    "totalAmount": 1128.54,
    "couponCode": null,
    "createdAt": "2026-07-16T12:12:57.541Z",
    "updatedAt": "2026-07-16T12:12:57.541Z"
  },
  {
    "id": "cmrngzbyj004hxctckds4jkrz",
    "buyerId": "cmrngzbst000qxctcgdtrta8a",
    "status": "PAID",
    "totalAmount": 2208.92,
    "couponCode": null,
    "createdAt": "2026-07-16T12:12:57.547Z",
    "updatedAt": "2026-07-16T12:12:57.547Z"
  },
  {
    "id": "cmrngzbyr004oxctc493ei0uc",
    "buyerId": "cmrngzbsw000rxctchve4az0x",
    "status": "DELIVERED",
    "totalAmount": 2397.31,
    "couponCode": null,
    "createdAt": "2026-07-16T12:12:57.555Z",
    "updatedAt": "2026-07-16T12:12:57.555Z"
  },
  {
    "id": "cmrngzbyx004wxctcugewugwe",
    "buyerId": "cmrngzbsb000ixctcppb48h9j",
    "status": "CONFIRMED",
    "totalAmount": 1323.43,
    "couponCode": null,
    "createdAt": "2026-07-16T12:12:57.561Z",
    "updatedAt": "2026-07-16T12:12:57.561Z"
  },
  {
    "id": "cmrngzbz30054xctcyduc6hvf",
    "buyerId": "cmrngzbsp000oxctcmte2ziwy",
    "status": "PAID",
    "totalAmount": 1877.2,
    "couponCode": null,
    "createdAt": "2026-07-16T12:12:57.567Z",
    "updatedAt": "2026-07-16T12:12:57.567Z"
  },
  {
    "id": "cmrngzbz7005bxctcmy9r4fdx",
    "buyerId": "cmrngzbsi000lxctcu0mvz8gv",
    "status": "PLACED",
    "totalAmount": 1553,
    "couponCode": null,
    "createdAt": "2026-07-16T12:12:57.571Z",
    "updatedAt": "2026-07-16T12:12:57.571Z"
  }
]
```

### Table: OrderItem
- **Total Records:** 293
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzbxh003kxctc6q2q0acf",
    "orderId": "cmrngzbxh003ixctcq36gz7p1",
    "productId": "cmrngzbw7002fxctceygrb2c3",
    "qty": 4,
    "price": 499.99
  },
  {
    "id": "cmrngzbxh003lxctc3scpkovc",
    "orderId": "cmrngzbxh003ixctcq36gz7p1",
    "productId": "cmrngzbww0030xctcwcd9cq3v",
    "qty": 3,
    "price": 16.11
  },
  {
    "id": "cmrngzbxh003mxctc6rllrtot",
    "orderId": "cmrngzbxh003ixctcq36gz7p1",
    "productId": "cmrngzbv9001xxctckmu81vq2",
    "qty": 2,
    "price": 83.01
  },
  {
    "id": "cmrngzbxr003sxctc0x83wu2m",
    "orderId": "cmrngzbxr003qxctc6stqc3bq",
    "productId": "cmrngzbum001ixctc3k012fnl",
    "qty": 2,
    "price": 388.43
  },
  {
    "id": "cmrngzbxx003yxctcq2ef5xkn",
    "orderId": "cmrngzbxx003wxctcuph0pfpw",
    "productId": "cmrngzbxd003fxctctdh088ky",
    "qty": 3,
    "price": 474.68
  },
  {
    "id": "cmrngzbxx003zxctcdzgyvs26",
    "orderId": "cmrngzbxx003wxctcuph0pfpw",
    "productId": "cmrngzbu70019xctcz3w0lr60",
    "qty": 5,
    "price": 186.61
  },
  {
    "id": "cmrngzby60045xctcso38rbwd",
    "orderId": "cmrngzby50043xctcb8umku9x",
    "productId": "cmrngzbv9001xxctckmu81vq2",
    "qty": 5,
    "price": 83.01
  },
  {
    "id": "cmrngzbyd004bxctcrogn93ja",
    "orderId": "cmrngzbyd0049xctc5z3girj5",
    "productId": "cmrngzbwb002ixctca6dtckt7",
    "qty": 5,
    "price": 107.24
  },
  {
    "id": "cmrngzbyd004cxctcvs3me5tp",
    "orderId": "cmrngzbyd0049xctc5z3girj5",
    "productId": "cmrngzbv4001uxctcbhqpqil7",
    "qty": 2,
    "price": 109.56
  },
  {
    "id": "cmrngzbyd004dxctcv42pdvul",
    "orderId": "cmrngzbyd0049xctc5z3girj5",
    "productId": "cmrngzbu70019xctcz3w0lr60",
    "qty": 2,
    "price": 186.61
  }
]
```

### Table: Cart
- **Total Records:** 0
- *No records found.*

### Table: CartItem
- **Total Records:** 0
- *No records found.*

### Table: Payment
- **Total Records:** 150
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzbxp003oxctci1dl3q5h",
    "orderId": "cmrngzbxh003ixctcq36gz7p1",
    "razorpayOrderId": "order_rcpt_cmrngzbx",
    "razorpayPaymentId": null,
    "status": "PAID",
    "amount": 2214.31,
    "createdAt": "2026-07-16T12:12:57.517Z",
    "updatedAt": "2026-07-16T12:12:57.517Z"
  },
  {
    "id": "cmrngzbxv003uxctchj7w3pu6",
    "orderId": "cmrngzbxr003qxctc6stqc3bq",
    "razorpayOrderId": "order_rcpt_cmrngzbx",
    "razorpayPaymentId": null,
    "status": "PAID",
    "amount": 776.86,
    "createdAt": "2026-07-16T12:12:57.523Z",
    "updatedAt": "2026-07-16T12:12:57.523Z"
  },
  {
    "id": "cmrngzby20041xctc6sy3u4hc",
    "orderId": "cmrngzbxx003wxctcuph0pfpw",
    "razorpayOrderId": "order_rcpt_cmrngzbx",
    "razorpayPaymentId": null,
    "status": "PAID",
    "amount": 2357.09,
    "createdAt": "2026-07-16T12:12:57.530Z",
    "updatedAt": "2026-07-16T12:12:57.530Z"
  },
  {
    "id": "cmrngzbya0047xctcprdbo2r9",
    "orderId": "cmrngzby50043xctcb8umku9x",
    "razorpayOrderId": "order_rcpt_cmrngzby",
    "razorpayPaymentId": null,
    "status": "FAILED",
    "amount": 415.05,
    "createdAt": "2026-07-16T12:12:57.538Z",
    "updatedAt": "2026-07-16T12:12:57.538Z"
  },
  {
    "id": "cmrngzbyh004fxctcm2q8r87f",
    "orderId": "cmrngzbyd0049xctc5z3girj5",
    "razorpayOrderId": "order_rcpt_cmrngzby",
    "razorpayPaymentId": null,
    "status": "FAILED",
    "amount": 1128.54,
    "createdAt": "2026-07-16T12:12:57.545Z",
    "updatedAt": "2026-07-16T12:12:57.545Z"
  },
  {
    "id": "cmrngzbyp004mxctc2tfiun7h",
    "orderId": "cmrngzbyj004hxctckds4jkrz",
    "razorpayOrderId": "order_rcpt_cmrngzby",
    "razorpayPaymentId": null,
    "status": "PAID",
    "amount": 2208.92,
    "createdAt": "2026-07-16T12:12:57.553Z",
    "updatedAt": "2026-07-16T12:12:57.553Z"
  },
  {
    "id": "cmrngzbyv004uxctcx4bqijyw",
    "orderId": "cmrngzbyr004oxctc493ei0uc",
    "razorpayOrderId": "order_rcpt_cmrngzby",
    "razorpayPaymentId": null,
    "status": "PAID",
    "amount": 2397.31,
    "createdAt": "2026-07-16T12:12:57.560Z",
    "updatedAt": "2026-07-16T12:12:57.560Z"
  },
  {
    "id": "cmrngzbz10052xctcoa8yb37b",
    "orderId": "cmrngzbyx004wxctcugewugwe",
    "razorpayOrderId": "order_rcpt_cmrngzby",
    "razorpayPaymentId": null,
    "status": "PAID",
    "amount": 1323.43,
    "createdAt": "2026-07-16T12:12:57.565Z",
    "updatedAt": "2026-07-16T12:12:57.565Z"
  },
  {
    "id": "cmrngzbz60059xctcd5rif5o3",
    "orderId": "cmrngzbz30054xctcyduc6hvf",
    "razorpayOrderId": "order_rcpt_cmrngzbz",
    "razorpayPaymentId": null,
    "status": "PAID",
    "amount": 1877.2,
    "createdAt": "2026-07-16T12:12:57.570Z",
    "updatedAt": "2026-07-16T12:12:57.570Z"
  },
  {
    "id": "cmrngzbza005fxctc0aj68jn9",
    "orderId": "cmrngzbz7005bxctcmy9r4fdx",
    "razorpayOrderId": "order_rcpt_cmrngzbz",
    "razorpayPaymentId": null,
    "status": "FAILED",
    "amount": 1553,
    "createdAt": "2026-07-16T12:12:57.574Z",
    "updatedAt": "2026-07-16T12:12:57.574Z"
  }
]
```

### Table: TransactionLog
- **Total Records:** 0
- *No records found.*

### Table: DeliveryAssignment
- **Total Records:** 0
- *No records found.*

### Table: DeliveryEarning
- **Total Records:** 0
- *No records found.*

### Table: ChatMessage
- **Total Records:** 0
- *No records found.*

### Table: Notification
- **Total Records:** 30
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzd0u0189xctc7meacrqu",
    "userId": "cmrngzbrk0007xctcj3uw45mf",
    "title": "arcus bonus colo",
    "message": "Sollers aequitas abeo bellum decerno id.",
    "type": "DELIVERY",
    "isRead": false,
    "createdAt": "2026-07-16T12:12:58.926Z"
  },
  {
    "id": "cmrngzd0y018bxctcxhwmo6lg",
    "userId": "cmrngzbqk0000xctcqn8ez7qt",
    "title": "vulgivagus deinde nemo",
    "message": "Compono depulso contigo curatio avaritia casso vigilo armarium alii ante.",
    "type": "PAYMENT",
    "isRead": false,
    "createdAt": "2026-07-16T12:12:58.930Z"
  },
  {
    "id": "cmrngzd10018dxctc5dyr201n",
    "userId": "cmrngzbsd000jxctclbe2gyn6",
    "title": "ustilo cinis decimus",
    "message": "Soleo adflicto curvo verto.",
    "type": "ADMIN",
    "isRead": false,
    "createdAt": "2026-07-16T12:12:58.932Z"
  },
  {
    "id": "cmrngzd11018fxctcr8svyxp1",
    "userId": "cmrngzbs5000fxctczojnpar2",
    "title": "ante deficio officia",
    "message": "Texo ab valens.",
    "type": "ADMIN",
    "isRead": false,
    "createdAt": "2026-07-16T12:12:58.933Z"
  },
  {
    "id": "cmrngzd12018hxctcf18wap87",
    "userId": "cmrngzbs9000hxctceqdsas2y",
    "title": "absum sonitus cultura",
    "message": "Suppellex cometes sint ver terror.",
    "type": "ORDER",
    "isRead": false,
    "createdAt": "2026-07-16T12:12:58.935Z"
  },
  {
    "id": "cmrngzd14018jxctcb7f86c16",
    "userId": "cmrngzbsi000lxctcu0mvz8gv",
    "title": "aeger reprehenderit antepono",
    "message": "Taceo amaritudo abduco cattus cogito sopor.",
    "type": "AUCTION",
    "isRead": false,
    "createdAt": "2026-07-16T12:12:58.936Z"
  },
  {
    "id": "cmrngzd15018lxctc1vpv5fcj",
    "userId": "cmrngzbs1000dxctctf2q2yph",
    "title": "tempus velut calco",
    "message": "Corporis thema colligo conculco caries ea deputo.",
    "type": "PAYMENT",
    "isRead": false,
    "createdAt": "2026-07-16T12:12:58.937Z"
  },
  {
    "id": "cmrngzd16018nxctc5ongo665",
    "userId": "cmrngzbsm000nxctc69itu9n2",
    "title": "reiciendis itaque vestigium",
    "message": "Alter illum tricesimus curis creptio urbs aer temperantia decipio decretum.",
    "type": "ADMIN",
    "isRead": false,
    "createdAt": "2026-07-16T12:12:58.939Z"
  },
  {
    "id": "cmrngzd17018pxctcrkght8r9",
    "userId": "cmrngzbsy000sxctcss594a8o",
    "title": "clibanus stips veritas",
    "message": "Quae et cito delibero tardus.",
    "type": "ADMIN",
    "isRead": false,
    "createdAt": "2026-07-16T12:12:58.940Z"
  },
  {
    "id": "cmrngzd18018rxctcyah8kae3",
    "userId": "cmrngzbr80003xctc7hajps53",
    "title": "turbo admoveo cuppedia",
    "message": "Cunabula assentator possimus acquiro caritas.",
    "type": "ADMIN",
    "isRead": false,
    "createdAt": "2026-07-16T12:12:58.941Z"
  }
]
```

### Table: Wishlist
- **Total Records:** 54
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzcyh0159xctclpjumzrz",
    "userId": "cmrngzbs5000fxctczojnpar2",
    "productId": "cmrngzbu10016xctczxeappgm",
    "createdAt": "2026-07-16T12:12:58.842Z"
  },
  {
    "id": "cmrngzcyl015bxctck53gv5wy",
    "userId": "cmrngzbs5000fxctczojnpar2",
    "productId": "cmrngzbv9001xxctckmu81vq2",
    "createdAt": "2026-07-16T12:12:58.845Z"
  },
  {
    "id": "cmrngzcyn015dxctcsnbxgwix",
    "userId": "cmrngzbs5000fxctczojnpar2",
    "productId": "cmrngzbv0001rxctcvyqh1nna",
    "createdAt": "2026-07-16T12:12:58.847Z"
  },
  {
    "id": "cmrngzcyp015fxctc2lbz2ssl",
    "userId": "cmrngzbs5000fxctczojnpar2",
    "productId": "cmrngzbvr0026xctcw6s1uumo",
    "createdAt": "2026-07-16T12:12:58.849Z"
  },
  {
    "id": "cmrngzcyr015hxctcjssobvoy",
    "userId": "cmrngzbs7000gxctcr4cfik3f",
    "productId": "cmrngzbv9001xxctckmu81vq2",
    "createdAt": "2026-07-16T12:12:58.851Z"
  },
  {
    "id": "cmrngzcyu015jxctcq6dr45qf",
    "userId": "cmrngzbs7000gxctcr4cfik3f",
    "productId": "cmrngzbvx0029xctc37elx4be",
    "createdAt": "2026-07-16T12:12:58.854Z"
  },
  {
    "id": "cmrngzcyw015lxctcaot5a07h",
    "userId": "cmrngzbs7000gxctcr4cfik3f",
    "productId": "cmrngzbwb002ixctca6dtckt7",
    "createdAt": "2026-07-16T12:12:58.856Z"
  },
  {
    "id": "cmrngzcyx015nxctcf67ghr86",
    "userId": "cmrngzbs7000gxctcr4cfik3f",
    "productId": "cmrngzbut001oxctcu50m1q3a",
    "createdAt": "2026-07-16T12:12:58.858Z"
  },
  {
    "id": "cmrngzcyz015pxctcwjbs5a7b",
    "userId": "cmrngzbs7000gxctcr4cfik3f",
    "productId": "cmrngzbx9003cxctcogu0on52",
    "createdAt": "2026-07-16T12:12:58.860Z"
  },
  {
    "id": "cmrngzcz1015rxctc1mxe6kly",
    "userId": "cmrngzbs9000hxctceqdsas2y",
    "productId": "cmrngzbww0030xctcwcd9cq3v",
    "createdAt": "2026-07-16T12:12:58.861Z"
  }
]
```

### Table: SearchHistory
- **Total Records:** 0
- *No records found.*

### Table: Activity
- **Total Records:** 0
- *No records found.*

### Table: Review
- **Total Records:** 31
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzcoy00whxctc0u9exxrh",
    "productId": "cmrngzbv9001xxctckmu81vq2",
    "buyerId": "cmrngzbs5000fxctczojnpar2",
    "rating": 4,
    "comment": "Conspergo velut adulescens magni quae.",
    "createdAt": "2026-07-16T12:12:58.498Z"
  },
  {
    "id": "cmrngzcp400wjxctc6j2l455u",
    "productId": "cmrngzbxd003fxctctdh088ky",
    "buyerId": "cmrngzbsk000mxctcogp5nby2",
    "rating": 5,
    "comment": "Curatio titulus aliquam inflammatio quis.",
    "createdAt": "2026-07-16T12:12:58.505Z"
  },
  {
    "id": "cmrngzcp700wlxctcqehpr1g4",
    "productId": "cmrngzbu70019xctcz3w0lr60",
    "buyerId": "cmrngzbsk000mxctcogp5nby2",
    "rating": 4,
    "comment": "Bellum ultio paulatim desipio alioqui coma.",
    "createdAt": "2026-07-16T12:12:58.507Z"
  },
  {
    "id": "cmrngzcp900wnxctcci998bfq",
    "productId": "cmrngzbxd003fxctctdh088ky",
    "buyerId": "cmrngzbsw000rxctchve4az0x",
    "rating": 3,
    "comment": "Compono traho trans aspicio teres adfero quidem.",
    "createdAt": "2026-07-16T12:12:58.510Z"
  },
  {
    "id": "cmrngzcpc00wpxctc7a51qv4d",
    "productId": "cmrngzbu10016xctczxeappgm",
    "buyerId": "cmrngzbsw000rxctchve4az0x",
    "rating": 5,
    "comment": "Arca volutabrum bellum totus utor universe avarus tumultus cui.",
    "createdAt": "2026-07-16T12:12:58.512Z"
  },
  {
    "id": "cmrngzcph00wrxctck064k74l",
    "productId": "cmrngzbv0001rxctcvyqh1nna",
    "buyerId": "cmrngzbs9000hxctceqdsas2y",
    "rating": 5,
    "comment": "Substantia clamo stipes vomito pauper.",
    "createdAt": "2026-07-16T12:12:58.517Z"
  },
  {
    "id": "cmrngzcpn00wtxctcgjwzy1ei",
    "productId": "cmrngzbv4001uxctcbhqpqil7",
    "buyerId": "cmrngzbsy000sxctcss594a8o",
    "rating": 3,
    "comment": "Comedo quia concido explicabo adsuesco verbera agnitio thymbra aggredior.",
    "createdAt": "2026-07-16T12:12:58.524Z"
  },
  {
    "id": "cmrngzcpr00wvxctca7t0mzk1",
    "productId": "cmrngzbv0001rxctcvyqh1nna",
    "buyerId": "cmrngzbsy000sxctcss594a8o",
    "rating": 4,
    "comment": "Sperno barba damno.",
    "createdAt": "2026-07-16T12:12:58.528Z"
  },
  {
    "id": "cmrngzcpt00wxxctchwfmfcwo",
    "productId": "cmrngzbww0030xctcwcd9cq3v",
    "buyerId": "cmrngzbsy000sxctcss594a8o",
    "rating": 4,
    "comment": "Decens artificiose desipio.",
    "createdAt": "2026-07-16T12:12:58.529Z"
  },
  {
    "id": "cmrngzcpz00wzxctcwnf10x92",
    "productId": "cmrngzbud001cxctcq3wag369",
    "buyerId": "cmrngzbsy000sxctcss594a8o",
    "rating": 3,
    "comment": "Vivo argentum veniam sub comis audio quam.",
    "createdAt": "2026-07-16T12:12:58.535Z"
  }
]
```

### Table: FarmerVerification
- **Total Records:** 0
- *No records found.*

### Table: Coupon
- **Total Records:** 30
- **Sample Records (First 10):**
```json
[
  {
    "id": "cmrngzd2g019wxctc7z7r6e9z",
    "code": "COUPON_TMJ7K6",
    "discountType": "FIXED",
    "discountValue": 20,
    "expiryDate": "2027-01-07T08:06:20.789Z",
    "isActive": false,
    "createdAt": "2026-07-16T12:12:58.985Z"
  },
  {
    "id": "cmrngzd2k019xxctcj1g9l0ex",
    "code": "COUPON_OJVBDH",
    "discountType": "FIXED",
    "discountValue": 24,
    "expiryDate": "2027-05-12T00:43:56.255Z",
    "isActive": false,
    "createdAt": "2026-07-16T12:12:58.988Z"
  },
  {
    "id": "cmrngzd2m019yxctcptk51wb9",
    "code": "COUPON_XA1XAU",
    "discountType": "FIXED",
    "discountValue": 26,
    "expiryDate": "2027-04-28T19:57:55.857Z",
    "isActive": false,
    "createdAt": "2026-07-16T12:12:58.991Z"
  },
  {
    "id": "cmrngzd2o019zxctc3f946zr8",
    "code": "COUPON_TU1WSU",
    "discountType": "PERCENTAGE",
    "discountValue": 39,
    "expiryDate": "2026-10-05T16:49:35.403Z",
    "isActive": true,
    "createdAt": "2026-07-16T12:12:58.993Z"
  },
  {
    "id": "cmrngzd2r01a0xctcbjrswkad",
    "code": "COUPON_WKF9JV",
    "discountType": "FIXED",
    "discountValue": 14,
    "expiryDate": "2027-05-11T20:25:35.006Z",
    "isActive": false,
    "createdAt": "2026-07-16T12:12:58.995Z"
  },
  {
    "id": "cmrngzd2t01a1xctc31tsdw7y",
    "code": "COUPON_82BCQ1",
    "discountType": "FIXED",
    "discountValue": 30,
    "expiryDate": "2027-02-02T06:13:49.707Z",
    "isActive": false,
    "createdAt": "2026-07-16T12:12:58.998Z"
  },
  {
    "id": "cmrngzd2v01a2xctcz7mit064",
    "code": "COUPON_9KJ5RJ",
    "discountType": "PERCENTAGE",
    "discountValue": 30,
    "expiryDate": "2027-05-12T14:25:01.393Z",
    "isActive": true,
    "createdAt": "2026-07-16T12:12:58.999Z"
  },
  {
    "id": "cmrngzd2w01a3xctc4h09pqdu",
    "code": "COUPON_9PVPSB",
    "discountType": "PERCENTAGE",
    "discountValue": 38,
    "expiryDate": "2026-07-29T03:37:45.895Z",
    "isActive": true,
    "createdAt": "2026-07-16T12:12:59.001Z"
  },
  {
    "id": "cmrngzd2z01a4xctcoeot4pi1",
    "code": "COUPON_VWJIAQ",
    "discountType": "FIXED",
    "discountValue": 22,
    "expiryDate": "2027-01-01T12:00:51.568Z",
    "isActive": false,
    "createdAt": "2026-07-16T12:12:59.004Z"
  },
  {
    "id": "cmrngzd3201a5xctc2yxh75ua",
    "code": "COUPON_QYJ0JA",
    "discountType": "PERCENTAGE",
    "discountValue": 29,
    "expiryDate": "2027-03-28T09:10:13.958Z",
    "isActive": true,
    "createdAt": "2026-07-16T12:12:59.006Z"
  }
]
```

### Table: AuditLog
- **Total Records:** 0
- *No records found.*

## 2. Relationship & Constraint Validation

- **Orders -> User Validation**: 0 orphaned orders detected.
- **Products -> User (Farmer) Validation**: 0 orphaned products detected.
- **Inventory Check**: 0 products are currently out of stock (quantity <= 0).
- **Auctions -> Product Validation**: 0 orphaned auctions detected.
- **Payments -> Order Validation**: 0 orphaned payments detected.

## 3. API Validation

(API validation skipped in this static script, but all endpoints were tested during the build phase.)

## 4. Conclusion

**All relational constraints are intact. No orphaned records found. The database integrity is verified.**
