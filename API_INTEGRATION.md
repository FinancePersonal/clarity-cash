# Java API Integration Guide

## Configuration

The frontend is now configured to work with a Java API backend. Update the `.env` file with your Java API URL:

```env
VITE_API_URL=http://localhost:8080/api
```

## API Endpoints Structure

The following endpoints are expected to be implemented in the Java API:

### Authentication
- `POST /auth/login` - User login
- `POST /auth/register` - User registration  
- `POST /auth/logout` - User logout

### User Management
- `GET /user/profile` - Get user profile
- `PUT /user/profile` - Update user profile
- `GET /user/finance-data` - Get user's finance data
- `PUT /user/finance-data` - Update user's finance data

### Finance Management
- `GET /finance/expenses` - Get expenses
- `POST /finance/expenses` - Create expense
- `PUT /finance/expenses/{id}` - Update expense
- `DELETE /finance/expenses/{id}` - Delete expense

- `GET /finance/incomes` - Get incomes
- `POST /finance/incomes` - Create income
- `PUT /finance/incomes/{id}` - Update income
- `DELETE /finance/incomes/{id}` - Delete income

- `GET /finance/credit-cards` - Get credit cards
- `POST /finance/credit-cards` - Create credit card
- `PUT /finance/credit-cards/{id}` - Update credit card
- `DELETE /finance/credit-cards/{id}` - Delete credit card

- `GET /finance/goals` - Get goals
- `POST /finance/goals` - Create goal
- `PUT /finance/goals/{id}` - Update goal
- `DELETE /finance/goals/{id}` - Delete goal

## Current State

- ✅ All API calls removed from frontend
- ✅ Authentication system disabled
- ✅ Data persistence using localStorage only
- ✅ API configuration structure ready
- ⏳ Java API implementation pending

## Next Steps

1. Implement the Java API with the endpoints above
2. Update the service files in `src/lib/` to make actual API calls
3. Re-enable authentication system
4. Test integration between frontend and Java backend

## Service Files to Update

When the Java API is ready, update these files:

- `src/lib/authService.ts` - Implement authentication methods
- `src/lib/financeService.ts` - Implement finance data sync
- `src/lib/userService.ts` - Implement user management
- `src/App.tsx` - Re-enable authentication flow