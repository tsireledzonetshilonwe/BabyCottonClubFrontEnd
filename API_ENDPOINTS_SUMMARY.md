# Frontend API Endpoints Summary

## ✅ Updated Endpoints (src/api/api.js)

### OrderLine Endpoints
All orderline endpoints use the `/api/orderline/*` prefix:

- ✅ **POST** `/api/orderline/create` - Create order line
  - Payload: `{ orderId, productId, quantity, unitPrice, size }`
  - Function: `createOrderLine(orderLineData)`

- ✅ **GET** `/api/orderline/read/{id}` - Get order line by ID
  - Function: `fetchOrderLineDetails(orderLineId)`

- ✅ **GET** `/api/orderline/getall` - Get all order lines
  - Function: `fetchAllOrderLines()`

- ✅ **PUT** `/api/orderline/update` - Update order line
  - Function: `updateOrderLine(orderLineData)`

### Address Endpoints
All address endpoints use the `/address/*` prefix (NO `/api` prefix):

- ✅ **POST** `/address/create` - Create address
  - Function: `createAddress(addressData)`

- ✅ **GET** `/address/read/{id}` - Get address by ID
  - Function: `fetchAddressById(addressId)`

- ✅ **GET** `/address/getall` - Get all addresses
  - Function: `fetchAllAddresses()`

- ✅ **PUT** `/address/update` - Update address
  - Function: `updateAddress(addressData)`

## 🎯 Key Changes Made

1. **OrderLine endpoints** - Already correct, added missing functions:
   - Added `fetchAllOrderLines()` for `/api/orderline/getall`
   - Added `updateOrderLine()` for `/api/orderline/update`
   - Added comment clarifying payload structure for create

2. **Address endpoints** - Already correct (using `/address/*`), added missing functions:
   - Added `fetchAllAddresses()` for `/address/getall`
   - Added `updateAddress()` for `/address/update`

## 📋 How to Use

### Creating an Order Line
```javascript
import { createOrderLine } from '../api/api';

const orderLineData = {
  orderId: 1,
  productId: 10,
  quantity: 2,
  unitPrice: 299.99,
  size: 'M'  // optional
};

const newOrderLine = await createOrderLine(orderLineData);
```

### Creating an Address
```javascript
import { createAddress } from '../api/api';

const addressData = {
  customerId: 1,
  street: '123 Main St',
  city: 'Cape Town',
  postalCode: '8001',
  country: 'South Africa'
};

const newAddress = await createAddress(addressData);
```

## 🔧 Backend Configuration
- Base URL: `http://localhost:8080`
- JWT authentication: Automatically added via axios interceptor
- All endpoints (except `/address/*`) use `/api` prefix

## 📝 Notes
- Address controller has NO `/api` prefix in the backend
- OrderLine controller HAS `/api` prefix in the backend
- All other endpoints follow the `/api/{resource}/*` pattern
