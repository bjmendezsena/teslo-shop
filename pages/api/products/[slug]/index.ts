import type { NextApiRequest, NextApiResponse } from "next";
import { db } from "../../../../database";
import { Product } from "../../../../models";
import { IProduct } from "../../../../interfaces";

type Data =
  | {
      message: string;
    }
  | IProduct;

export default function handle(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "GET":
      return getProduct(req, res);

    default:
      return res.status(400).json({ message: "El método no existe" });
  }
}

const getProduct = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  const { slug } = req.query;

  await db.connect();

  const entry = await Product.findOne({ slug }).lean();

  await db.disconnect();
  if (!entry) {
    return res.status(404).json({ message: "No existe el producto" });
  }

  res.status(200).json(entry!);
};
