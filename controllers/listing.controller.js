import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
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

export { createListing };
