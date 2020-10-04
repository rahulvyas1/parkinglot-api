import { User } from '../../models';
import { successResponse, errorResponse } from '../../helpers';

export const allUsers = async (req, res) => {
  try {
    const users = await User.findAll({
      raw: true,
    });
    return successResponse(req, res, { users: users });
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};

export const register = async (req, res) => {
  try {
    console.log('register');
    const { carNumber, firstName, lastName } = req.body;
    const user = await User.findOne({ where: { carNumber }, raw: true });

    console.log(user);
    if (user) {
      throw new Error('User already exists with same carNumber');
    }

    const payload = {
      carNumber,
      firstName,
      lastName,
    };

    const newUser = await User.create(payload);
    console.log(newUser);
    return successResponse(req, res, {});
  } catch (error) {
    return errorResponse(req, res, error.message);
  }
};
