import { ParkingSlot, ParkingLot, User } from '../../models';
import UserType from '../../config/UserType';
import { successResponse, errorResponse } from '../../helpers';

export const create = async (req, res) => {
  console.log('CREATING PARKING SLOT');
  const userId = '1';
  try {
    const {
      floor,
      underMaintenance,
      isBooked,
      bookedOn,
      parkingLotId,
      userId,
    } = req.body;

    // check if parkingLotId exists in Db
    const parkingLot = await ParkingLot.findOne({
      where: { id: parkingLotId },
    });
    if (!parkingLot) {
      throw new Error('Parking lot not found');
    }

    const payload = {
      floor,
      underMaintenance,
      isBooked,
      bookedOn,
      parkingLotId,
      userId,
    };

    console.log(payload);
    const newParkingSlot = await ParkingSlot.create(payload);
    return successResponse(req, res, { parkingSlot: newParkingSlot });
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
    const parkingLot = await ParkingSlot.findOne({ where: { id } });
    return successResponse(req, res, { parkingLot });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const bookSlot = async (parkingLotId, userId) => {
  try {
    console.log('hh', parkingLotId);
    const freeParkingSlot = await ParkingSlot.findAll({
      limit: 1,
      where: {
        parkingLotId,
        isBooked: false,
        underMaintenance: false,
      },
      order: [['createdAt', 'ASC']],
      raw: true,
    });
    console.log(freeParkingSlot);

    // check if free
    if (freeParkingSlot.length == 0) {
      throw new Error('Parking lot is full');
    }

    // book
    await ParkingSlot.update(
      { isBooked: true, bookedBy: userId, bookedOn: new Date().toISOString() },
      { where: { id: freeParkingSlot[0].id } }
    );

    return ParkingSlot;
  } catch (error) {
    throw new Error('Parking lot is full');
  }
};
export const clearSlot = async (id) => {
  try {
    console.log('clearing slot...');
    await ParkingSlot.update(
      { isBooked: false, bookedBy: null, bookedOn: null },
      { where: { id } }
    );
    return ParkingSlot;
  } catch (error) {
    throw new Error('Parking lot is full');
  }
};

export const setMaintenanceMode = async (req, res) => {
  const { id } = JSON.parse(JSON.stringify(req.params));
  const { maintenanceMode } = req.body;

  try {
    console.log('setting maintenance mode to', maintenanceMode);
    await ParkingSlot.update({ maintenanceMode }, { where: { id } });
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
