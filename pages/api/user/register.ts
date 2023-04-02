import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils";
import { isValidEmail } from "../../../utils/validations";

type Data =
  | {
      message: string;
    }
  | {
      token: string;
      user: {
        role: string;
        name: string;
        email: string;
      };
    };

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return registerUser(req, res);

    default:
      res.status(400).json({
        message: "Bad request",
      });
  }
}

const registerUser = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  
  const { email = "", password = "", name = "" } = req.body;
  
  if (password.length < 6) {
    await db.disconnect();
    return res.status(400).json({
      message: "La contraseña debe de ser de al menos 6 caracteres",
    });
  }
  if (name.length < 3) {
    await db.disconnect();
    return res.status(400).json({
      message: "El nombre debe de ser de al menos 3 caracteres",
    });
  }

  await db.connect();

  const user = await User.findOne({ email }).lean();

  if (user) {
    await db.disconnect();
    return res.status(400).json({
      message: "Usuario ya existe",
    });
  }

  if (!isValidEmail(email)) {
    await db.disconnect();
    return res.status(400).json({
      message: "El correo no parece ser válido",
    });
  }

  const newUser = new User({
    email: email.toLowerCase(),
    password: bcrypt.hashSync(password),
    name,
    role: "client",
  });

  try {
    await newUser.save({
      validateBeforeSave: true,
    });
  } catch (error) {
    console.log(error);
    await db.disconnect();
    return res.status(500).json({
      message: "revisar logs de servidor",
    });
  }

  await db.disconnect();

  const { role, _id } = newUser;

  return res.status(200).json({
    token: signToken(_id, email),
    user: {
      role,
      name,
      email,
    },
  });
};
