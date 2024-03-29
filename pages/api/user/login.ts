import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { User } from "../../../models";
import bcrypt from "bcryptjs";
import { signToken } from "../../../utils";

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
      return loginUser(req, res);

    default:
      res.status(400).json({
        message: "Bad request",
      });
  }
}

const loginUser = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { email = "", password = "" } = req.body;

  await db.connect();

  const user = await User.findOne({ email }).lean();

  await db.disconnect();
  if (!user) {
    return res.status(400).json({
      message: "Credenciales incotectas - EMAIL",
    });
  }

  if (!bcrypt.compareSync(password, user.password!)) {
    return res.status(400).json({
      message: "Credenciales incotectas - PASSWORD",
    });
  }

  const { role, name, _id } = user;

  return res.status(200).json({
    token: signToken(_id, email),
    user: {
      role,
      name,
      email,
    },
  });
};
