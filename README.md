# Noice Parking Lot API

Develop a parking lot application where we should be able perform following operations:

- Parking manager can create a parking lot with desired parking spaces/slots (Assume there is one parking manager and he will create one parking lot)
- User can park his vehicle in the nearest parking slot available (eg if parking slots are numbered 1,2,3....n, then we still start from 1 and pick the one that is available). There can be different parking strategies in future.
- User can unpark his vehicle
- When user unparks, response should be success along with the parking fee that will be calculated as Rs. 10 _ Number of hours the vehicle has been parked. eg If parked for 1 hour 5 minutes , it will be 10 _ 2 = 20
- Parking manager can put any parking space/slot into maintenance mode and back to working state at any time.

### Run Database

```
> docker run --name some-mysql -e MYSQL_ROOT_PASSWORD=my-secret-pw -e MYSQL_DATABASE=noice -d mysql
```

Todo- convert to docker compose
