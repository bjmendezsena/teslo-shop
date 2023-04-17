import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../database";
import { Product, User, Order } from "../../../models";

type Data = {
  numberOfOrders: number;
  numberOfClients: number;
  numberOfProducts: number;
  paidOrders: number;
  notPaidOrders: number;
  productsWithNotInventory: number;
  lowInventoryProducts: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  await db.connect();

  const [
    numberOfOrders,
    numberOfClients,
    numberOfProducts,
    paidOrders,
    notPaidOrders,
    productsWithNotInventory,
    lowInventoryProducts,
  ] = await Promise.all([
    Order.countDocuments(),
    User.countDocuments({ role: "client" }),
    Product.countDocuments(),
    Order.countDocuments({ isPaid: true }),
    Order.countDocuments({ isPaid: false }),
    Product.countDocuments({
      inStock: 0,
    }),
    Product.countDocuments({
      inStock: { $lte: 10 },
    }),
  ]);

  await db.disconnect();

  res.status(200).json({
    numberOfOrders,
    numberOfClients,
    numberOfProducts,
    paidOrders,
    notPaidOrders,
    productsWithNotInventory,
    lowInventoryProducts,
  });
}
