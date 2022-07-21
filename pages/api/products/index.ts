import type { NextApiRequest, NextApiResponse } from "next";
import { db, SHOP_CONSTANTS } from "../../../database";
import { IProduct } from "../../../interfaces/products";
import { Product } from "../../../models";

type Data =
  | {
      message: string;
    }
  | IProduct[]
  | IProduct;
export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProducts(req, res);
    default:
      return res.status(400).json({ message: "Endpoint no existe" });
  }
}

const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { gender = "all" } = req.query;
  let condition = {};
  if (gender !== "all" && SHOP_CONSTANTS.validGenders.includes(`${gender}`)) {
    condition = {
      gender,
    };
  }
  await db.connect();
  const products = await Product.find(condition)
    // * Solo mostrar los campos que quiero
    // * El signo menos es para que no muestre el campo id
    .select("title images price inStock slug -_id")
    .sort({ createdAt: "ascending" });
  await db.disconnect();

  res.status(200).json(products);
};
