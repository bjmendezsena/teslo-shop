import type { NextApiRequest, NextApiResponse } from "next";
import { db, seedDatabase } from "../../database";
import { Order, Product, User } from "../../models";

type Data = {
  message: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  if (process.env.NODE_ENV === "production") {
    return res.status(400).json({
      message: "No tiene acceso a este servicio",
    });
  }

  await db.connect();
  await Product.deleteMany();
  await Product.insertMany(seedDatabase.initialData.products);
  await User.deleteMany();
  await User.insertMany(seedDatabase.initialData.users);

  await Order.deleteMany();
  await db.disconnect();

  res.status(200).json({
    message: "Proceso realizado correctamente",
  });
}
