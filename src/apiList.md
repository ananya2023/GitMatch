<!-- Git match Apis -->
## authRouter
- POST /signup
- POST /login
- POST /logout

## profileRouter
- PATCH /profile/edit
- GET /profile/view
- PATCH /profile/password

Status - ignored , intrested  ,accepted , Rejected
<!-- User Profiles -->
## connectionRequestRouter
- POST /request/send/:status/:userId  -- intrested or ignore 

- POST /request/review/accepted/:userId
- POST /request/review/rejected/:userId

## userRouter
- GET /connections
- GET /user/requests
- GET /feed - fetches all profiles



