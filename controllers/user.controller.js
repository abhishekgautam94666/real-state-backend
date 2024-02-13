import { User } from "../model/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import bcrypt from "bcrypt";

const updateUser = asyncHandler(async (req, res) => {
  const { username, email, password, avatar } = req.body;

  const updates = {};
  if (username) {
    updates.username = username;
  }
  if (email) {
    updates.email = email;
  }
  if (password) {
    const hashPassword = await bcrypt.hash(password, 10);
    updates.password = hashPassword;
  }
  if (avatar) {
    updates.avatar = avatar;
  }

  if (req.user.id !== req.params.id) {
    throw new ApiError(400, "you can ionly update owr account");
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: updates,
      },
      { new: true }
    );
    if (!updateUser) {
      throw new ApiError(401, "some problem update user");
    }
    return res
      .status(200)
      .json(new ApiResponse(200, updateUser, "update User successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

const deleteUser = asyncHandler(async (req, res) => {
  if (req.user.id !== req.params.id) {
    throw new ApiError(400, "you only delete is our account");
  }

  try {
    await User.findByIdAndDelete(req.params.id);
    res.clearCookie("access_token");
    res.status(200).json(new ApiResponse(200, "User is delete Successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

const getUser = asyncHandler(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      throw new ApiError(404, "User not found");
    }

    return res
      .status(200)
      .json(new ApiResponse(200, user, "user feched succefully"));
  } catch (error) {
    throw new ApiError(404, error.message);
  }
});

export { updateUser, deleteUser, getUser };
