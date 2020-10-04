import { ParkingLot, ParkingSlot, Sequelize, User } from '../../models';
import {
  successResponse,
  errorResponse,
  calculateParkingFee,
} from '../../helpers';
import { bookSlot, clearSlot } from '../parkingslot/parkingslot.controller';

export const create = async (req, res) => {
  console.log('CREATING');
  try {
    const {
      name,
      address_1,
      address_2,
      city,
      state,
      country,
      postcode,
    } = req.body;

    const payload = {
      name,
      address_1,
      address_2,
      city,
      state,
      country,
      postcode,
    };
    console.log('here');
    const newParkinglot = await ParkingLot.create(payload);
    return successResponse(req, res, { newParkinglot });
  } catch (error) {
    // console.log(error);
    return errorResponse(req, res, error.message);
  }
};

export const findOne = async (req, res) => {
  try {
    console.log('findOne', req.params);
    const { id } = JSON.parse(JSON.stringify(req.params));
    console.log(id);
    const parkingLot = await ParkingLot.findOne({
      where: { id },
      raw: true,
    });

    const slots = await ParkingSlot.findAll({
      where: { parkingLotId: id },
      raw: true,
    });
    console.log(slots);
    const formatted = { ...parkingLot, slots };
    return successResponse(req, res, formatted);
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const update = async (req, res) => {
  try {
    const { id } = req.params.id;
    const parkingLot = await ParkingLot.findOne({ where: { id } });
    if (!parkingLot) {
      throw new Error('Parking lot not found');
    }
    const {
      name,
      address_1,
      address_2,
      city,
      state,
      country,
      postcode,
    } = req.body;

    const payload = {};

    if (name) {
      payload['name'] = name;
    }
    if (address_1) {
      payload['address_1'] = address_1;
    }
    if (address_2) {
      payload['address_2'] = address_2;
    }
    if (city) {
      payload['city'] = city;
    }
    if (state) {
      payload['state'] = state;
    }
    if (country) {
      payload['country'] = country;
    }
    if (postcode) {
      payload['postcode'] = postcode;
    }

    await User.update({ payload }, { where: { id } });

    return successResponse(req, res, { parkingLot });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const park = async (req, res) => {
  try {
    const { id } = JSON.parse(JSON.stringify(req.params));
    const { userId } = req.body;
    const parkingLot = await ParkingLot.findOne({ where: { id }, raw: true });
    console.log(parkingLot);
    if (!parkingLot) {
      throw new Error('Parking lot not found');
    }
    const user = await User.findOne({ where: { id: userId } });
    if (!user) {
      throw new Error('User not found');
    }
    // raw query
    // where parkinglotId = {id} , where isBooked == NULL | false

    const freeParkingSlotRes = await bookSlot(id, userId);

    return successResponse(req, res, { parkingLot: freeParkingSlotRes });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const unpark = async (req, res) => {
  // get all parking slots where user has parked
  // calculate total
  try {
    const { userId } = req.body;
    console.log(userId);
    const parkingSlot = await ParkingSlot.findOne({
      where: { bookedBy: userId },
      raw: true,
    });

    if (!parkingSlot) {
      throw new Error('User has not parked any vehicle.');
    }

    let seconds = Math.round(
      Math.abs(
        new Date().getTime() - new Date(parkingSlot.bookedOn).getTime()
      ) / 1000
    ); // We'll round away millisecond differences.
    const hours = Math.floor(seconds / 3600);

    const totalFee = calculateParkingFee(hours);

    await clearSlot(parkingSlot.id);

    // return totalFee to the user
    return successResponse(req, res, { totalFee });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
