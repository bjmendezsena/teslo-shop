import type { NextApiRequest, NextApiResponse } from "next";
import { v2 as cloudinary } from "cloudinary";
import { IProduct } from "../../../interfaces";
import { Product } from "../../../models";
import { db } from "../../../database";
import { isValidObjectId } from "mongoose";

cloudinary.config((process.env.CLOUDINARY_URL as string) || "");

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
  console.log("handler");
  console.log(req.method);
  switch (req.method) {
    case "GET":
      return getProducts(req, res);

    case "PUT":
      return updateProduct(req, res);

    case "POST":
      return createProduct(req, res);

    case "DELETE":
      return deleteProduct(req, res);

    default:
      return res.status(404).json({ message: "Bad request" });
  }
}
const getProducts = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  await db.connect();

  const products = await Product.find().sort({ title: "asc" }).lean();

  await db.disconnect();

  const updatedProduct = products.map((product) => {
    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}/products/${image}`;
    });

    return product;
  });

  res.status(200).json(updatedProduct);
};

const updateProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { _id = "", images = [] } = req.body as IProduct;

  if (!isValidObjectId(_id)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  if (images.length < 2) {
    return res.status(400).json({ message: "Min 2 images" });
  }

  try {
    await db.connect();

    const product = await Product.findById(_id);

    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: "Product not found" });
    }

    product.images.forEach(async (image) => {
      if (!images.includes(image)) {
        const [fileId, extension] = image
          .substring(image.lastIndexOf("/") + 1)
          .split(".");
        console.log({
          fileId,
          extension,
        });
        await cloudinary.uploader.destroy(fileId);
      }
    });

    await product.update(req.body);

    await db.disconnect();

    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}/products/${image}`;
    });

    return res.status(200).json(product);
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: "Something went wrong" });
  }
};
const createProduct = async (
  req: NextApiRequest,
  res: NextApiResponse<Data>
) => {
  const { images = [] } = req.body as IProduct;

  if (images.length < 2) {
    return res.status(400).json({ message: "Min 2 images" });
  }

  try {
    await db.connect();

    const productInDb = await Product.findOne({ slug: req.body.slug });
    if (productInDb) {
      await db.disconnect();
      return res
        .status(400)
        .json({ message: "Product already exists with this slug" });
    }

    const product = new Product(req.body);

    await product.save();

    await db.disconnect();

    product.images = product.images.map((image) => {
      return image.includes("http")
        ? image
        : `${process.env.HOST_NAME}/products/${image}`;
    });

    return res.status(200).json(product);
  } catch (error) {
    console.log(error);
    await db.disconnect();
    res.status(500).json({ message: "Something went wrong" });
  }
};
async function deleteProduct(req: NextApiRequest, res: NextApiResponse<Data>) {
  console.log("delete");
  const { id } = req.query;

  if (!isValidObjectId(id as string)) {
    return res.status(400).json({ message: "Invalid product id" });
  }

  try {
    await db.connect();

    const product = await Product.findById(id);

    if (!product) {
      await db.disconnect();
      return res.status(400).json({ message: "Product not found" });
    }

    product.images.forEach(async (image) => {
      const [fileId, extension] = image
        .substring(image.lastIndexOf("/") + 1)
        .split(".");
      if (fileId) {
        await cloudinary.uploader.destroy(fileId);
      }
    });

    await product.remove();

    res.status(200).json({ message: "Product deleted" });
  } catch (error) {
    await db.disconnect();
    res.status(500).json({ message: "Something went wrong" });
  }
}
