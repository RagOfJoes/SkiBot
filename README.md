# SkiBot

## Summary

A small bot to automatically find and book Ski reservations.

## Usage

1. Clone repo
2. Install dependencies
3. Create a .env file in the root folder
   - Must include: EMAIL, PASSWORD, DESTINATION, ALLOWED_PERSONS, RESERVATION_DATES
   - EMAIL: String,
   - PASSWORD: String,
   - DESTINATION: String,
   - ALLOWED_PERSONS: String[] | Format: [Name 1, Name 2, Name 3, ...]
   - RESERVATION_DATES: String[] | Format: [12-01-2020, 01-01-2021, ...]
4. Run `npm run start`

## Endpoints

- **[PUT]** Login: https://account.ikonpass.com/session
  - email: String
  - password: String
- **[GET]** Get User(s): https://account.ikonpass.com/api/v2/me/group
- **[GET]** Get Destinations: https://account.ikonpass.com/api/v2/resorts
- **[GET]** Check Reservation Availability: https://account.ikonpass.com/api/v2/reservation-availability/:resort_id
  - resort_id: number
- **[POST]** Add Reservation: https://account.ikonpass.com/api/v2/reservations
  - add_friends_and_family: bool
  - date: string(format: "YYYY-MM-DD")
  - profile_product_ids: number[]
  - resort_id: number

## Actions

1. Check if already authenticated
   - If already authenticated then Proceed to Step 2
   - If not then use environment variable to pass email and password to login
2. Navigate to Add Reservations
   - Use params to select proper Destination
3. Figure out if a date in params are inside of reservations availability endpoint payload
   - If it is then proceed to Step 4
   - If not then timeout then refresh page and continue from step 2
4. Add to Reservation Cart then finalize transaction
   - If date params were fulfilled then exit app
   - If not then repeat from Step 2

## Relevant Cookies

- \_itw_iaa_prod_session: Holds Auth information and should be saved when initiating Auth flow
