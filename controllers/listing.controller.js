import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";

import { Listing } from "../model/listing.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
//import jwt from "jsonwebtoken";

const createListing = asyncHandler(async (req, res) => {
  try {
    const listing = await Listing.create(req.body);
    return res
      .status(201)
      .json(new ApiResponse(201, listing, "create listing successfully"));
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

const getUserListings = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(400, "Not valid id");
  }

  if (!req.user._id) {
    throw new ApiError(400, "not found user");
  }
  try {
    if (req.user._id == id) {
      const userList = await Listing.find({ userRef: id });
      if (!userList) {
        throw new ApiError(400, "Not Found user listing");
      }
      console.log(userList);
      return res
        .status(200)
        .json(new ApiResponse(200, userList, "userListing fech successfully"));
    } else {
      throw new ApiError(400, "you can only own listing");
    }
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

export { createListing, getUserListings };
