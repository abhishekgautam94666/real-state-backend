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

const deleteListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ApiError(404, "listing not fonund");
  }
  if (req.user._id != listing.userRef) {
    throw new ApiError(404, "you can only delete your own listings!");
  }

  try {
    const deleteListing = await Listing.findByIdAndDelete(req.params.id);
    if (!deleteListing) {
      throw new ApiError(404, "something went wrong deleted listing");
    }
    return res
      .status(200)
      .json(
        new ApiResponse(200, deleteListing, "deleted listing successfully")
      );
  } catch (error) {
    throw new ApiError(404, error.message);
  }
});

const updateListing = asyncHandler(async (req, res) => {
  const listing = await Listing.findById(req.params.id);
  if (!listing) {
    throw new ApiError(404, "not found listing");
  }

  if (req.user._id != listing.userRef) {
    throw new ApiError(404, "you can change only own listing");
  }

  try {
    const updatedListing = await Listing.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!updatedListing) {
      throw new ApiError(404, "while erroring updating listing");
    }
    res
      .status(200)
      .json(
        new ApiResponse(200, updatedListing, "Listing updated successfully")
      );
  } catch (error) {
    throw new ApiError(404, error.message);
  }
});

const getListing = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!id) {
    throw new ApiError(404, "not found id");
  }

  const listing = await Listing.findById(id);
  if (!listing) {
    throw new ApiError(404, "not found listing");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, listing, "fech listing successfully"));
});

const getListings = asyncHandler(async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 9;
    const startIndex = parseInt(req.query.startIndex) || 0;
    let offer = req.query.offer;

    if (offer === undefined || offer === "false") {
      offer = { $in: [false, true] };
    }

    let furnished = req.query.furnished;
    if (furnished === undefined || furnished === "false") {
      furnished = { $in: [false, true] };
    }

    let parking = req.query.parking;
    if (parking === undefined || parking === "false") {
      parking = { $in: [false, true] };
    }

    let type = req.query.type;
    if (type === undefined || type === "all") {
      type = { $in: ["sale", "rent"] };
    }

    const searchterm = req.query.searchterm || "";
    const sort = req.query.sort || "createdAt";
    const order = req.query.order || "desc";

    const listings = await Listing.find({
      name: {
        $regex: searchterm,
        $options: "i",
      },
      offer,
      furnished,
      parking,
      type,
    })
      .sort({ [sort]: order })
      .limit(limit)
      .skip(startIndex);

    return res
      .status(200)
      .json(new ApiResponse(200, listings, "successfully feched"));
  } catch (error) {
    throw new ApiError(404, error.message);
  }
});

export {
  createListing,
  getUserListings,
  deleteListing,
  updateListing,
  getListing,
  getListings,
};
