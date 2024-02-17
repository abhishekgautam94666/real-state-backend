import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { User } from "../model/user.model.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";

const root = asyncHandler(async (_, res) => {
  return res.send("server is running");
});

const SignUp = asyncHandler(async (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    throw new ApiError(404, "Alll field are required");
  }

  const exitUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (exitUser) {
    throw new ApiError(409, "User are already exit");
  }

  const userCreated = await User.create({
    email,
    password,
    username: username.toLowerCase(),
  });

  if (!userCreated) {
    throw new ApiError(500, "something wrong register User");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, userCreated, "User register Successfully"));
});

const signIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ApiError(400, "both email and password are required");
  }

  const userfind = await User.findOne({ email });
  if (!userfind) {
    throw new ApiError(400, "pleas enter correct email user not found");
  }

  const checkCorrectPassword = userfind.isPasswordCorrect(password);
  if (!checkCorrectPassword) {
    throw new ApiError(400, "incorect password wrong credential");
  }

  const access_token = jwt.sign(
    { id: userfind._id },
    process.env.ACCESS_TOKEN_SECRET
  );

  const logedInUser = await User.findById(userfind._id).select("-password");

  const option = {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 24 * 60 * 60 * 1000,
    sameSite: "strict",
  };

  return res
    .status(200)
    .cookie("access_token", access_token, option)
    .json(new ApiResponse(200, logedInUser, "user logged in successfully"));
});

const signOut = asyncHandler(async (req, res) => {
  try {
    res
      .status(200)
      .clearCookie("access_token", {
        secure: true,
        sameSite: "strict",
      })
      .json(new ApiResponse(200, "User loggeOut successfully"));
  } catch (error) {
    throw new ApiError(400, "some problem loggeOut");
  }
});

const google = asyncHandler(async (req, res) => {
  const { email, username, photoUrl } = req.body;
  if (!email || !username) {
    throw new ApiError(400, "All fields are required email password ");
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ id: user._id }, process.env.ACCESS_TOKEN_SECRET);

      const newUser = await User.findById(user._id).select("-password");

      return res
        .status(200)
        .cookie("access_token", token, {
          httpOnly: true,
          secure: true,
          maxAge: 24 * 24 * 60 * 60 * 1000,
          sameSite: "strict",
        })
        .json(new ApiResponse(200, newUser, "google login success"));
    } else {
      const generatedPassword =
        Math.random().toString(36).slice(-8) +
        Math.random().toString(36).slice(-8);

      const createUser = await User.create({
        username,
        email,
        password: generatedPassword,
        avatar: photoUrl ? photoUrl : "",
      });

      if (!createUser) {
        throw new ApiError(400, "some problem creating user");
      }

      const token = jwt.sign(
        { id: createUser._id },
        process.env.ACCESS_TOKEN_SECRET
      );

      if (!token) {
        throw new ApiError(400, "token not generate");
      }

      const newUser = await User.findById(createUser._id).select("-password");

      const option = {
        httpOnly: true,
        secure: true,
        maxAge: 24 * 24 * 60 * 60 * 1000,
        sameSite: "strict",
      };

      res
        .status(200)
        .cookie("access_token", token, option)
        .json(new ApiResponse(200, newUser, "user login successfully"));
    }
  } catch (error) {
    throw new ApiError(400, error.message);
  }
});

const checkCookie = asyncHandler(async (req, res) => {
  const token = req.cookies?.access_token;
  if (!token) {
    return res.status(200).json(new ApiResponse(200, "tokenNotExit"));
  }
  return res.status(200).json(new ApiResponse(200, "tokenExit"));
});

export { SignUp, signIn, signOut, google, checkCookie, root };
