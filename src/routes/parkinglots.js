import express from 'express';
import validate from 'express-validation';

import * as parkinglotController from '../controllers/parkinglot/parkinglot.controller';
import * as parkingslotController from '../controllers/parkingslot/parkingslot.controller';
import * as userController from '../controllers/user/user.controller';
const router = express.Router();

router.post('/parkinglots', parkinglotController.create);
router.get('/parkinglots/:id', parkinglotController.findOne);
router.put('/parkinglots/:id/park', parkinglotController.park);
router.put('/parkinglots/unpark', parkinglotController.unpark);

router.post('/parkingslots', parkingslotController.create);
router.get('/parkingslots/:id', parkingslotController.findOne);

router.put(
  '/parkingslots/:id/maintenance',
  parkingslotController.setMaintenanceMode
);

router.get('/users', userController.allUsers);
router.post('/users', userController.register);

module.exports = router;
