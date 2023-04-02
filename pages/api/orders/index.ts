import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";
import { db } from "../../../database";
import { IOrder, IOrderItem } from "../../../interfaces/Order";
import { Order, Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IOrder;

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return createOrder(req, res);

    default:
      return res.status(400).json({ message: "Bad request" });
  }
}

const createOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { orderItems = [], total } = req.body as IOrder;

  // verificar que tengamos un usuario logueado
  const session: any = await getSession({ req });

  if (!session) {
    return res.status(401).json({ message: "No estás autorizado para ejecutar esta acción" });
  }

  await db.connect();

  const productsIds = orderItems.map((item) => item._id);

  // verificar que los productos existan
  const dbProducts = await Product.find({ _id: { $in: productsIds } });

  try {
    const subTotal = orderItems.reduce((prev, current) => {
      const currentPrice = dbProducts.find((p) => p.id === current._id)?.price;
      console.log({ currentPrice });
      if (!currentPrice) {
        throw new Error("Producto no encontrado");
      }

      return currentPrice * current.quantity + prev;
    }, 0);
    const taxRate = Number(process.env.NEXT_PUBLIC_TAX_RATE || 0);
    const backendTotal = subTotal * (1 + taxRate);

    if (backendTotal !== total) {
      throw new Error("El total no cuadra con el monto calculado");
    }

    // Todo bien hasta este punto, crear la orden
    const userId = session.user._id;

    const newOrder = new Order({
      ...req.body,
      isPaid: false,
      user: userId,
    });
    await newOrder.save();

    await db.disconnect();

    return res.status(201).json(newOrder);
  } catch (error: any) {
    await db.disconnect();
    console.log(error);

    return res
      .status(400)
      .json({ message: error.message || "Revise logs del servidor" });
  }
};
