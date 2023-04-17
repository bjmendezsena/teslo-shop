import axios from "axios";
import type { NextApiRequest, NextApiResponse } from "next";
import * as IPaypal from "../../../interfaces/paypal";
import { db } from "../../../database";
import { Order } from "../../../models";

type Data = {
  message: String;
};

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  switch (req.method) {
    case "POST":
      return payOrder(req, res);
    default:
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

const getPaypalBearerToken = async (): Promise<String | null> => {
  const paypalClient = process.env.NEXT_PUBLIC_PAYPAL_CLIENT;
  const paypalSecret = process.env.PAYPAL_SECRET;

  const base64Token = Buffer.from(
    `${paypalClient}:${paypalSecret}`,
    "utf-8"
  ).toString("base64");

  const body = new URLSearchParams("grant_type=client_credentials");

  try {
    const { data } = await axios.post(
      process.env.PAYPAL_OAUTH_URL || "",
      body,
      {
        headers: {
          Authorization: `Basic ${base64Token}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    return data.access_token;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    return null;
  }
};

const payOrder = async (req: NextApiRequest, res: NextApiResponse<Data>) => {
  //TODO: Validar sesión del usuario
  //TODO: Validar mongoID
  const paypalBearerToken = await getPaypalBearerToken();

  if (!paypalBearerToken) {
    return res.status(500).json({ message: "Error getting paypal token" });
  }

  const { transactionId = "", orderId = "" } = req.body;

  try {
    const { data } = await axios.get<IPaypal.PaypalOrderStatusResponse>(
      `${process.env.PAYPAL_ORDERS_URL}/${transactionId}`,
      {
        headers: {
          Authorization: `Bearer ${paypalBearerToken}`,
        },
      }
    );
    if (data.status !== "COMPLETED") {
      return res.status(401).json({ message: "Order not recognized" });
    }

    await db.connect();

    const dbOrder = await Order.findById(orderId);

    if (!dbOrder) {
      await db.disconnect();
      return res.status(400).json({ message: "Order not exists" });
    }

    if (dbOrder.isPaid) {
      await db.disconnect();
      return res.status(400).json({ message: "Order already paid" });
    }

    const amountValue = Number(data.purchase_units[0].amount.value);

    if (dbOrder.total !== amountValue) {
      await db.disconnect();
      return res.status(400).json({ message: "Amounts not match" });
    }

    dbOrder.transaccionId = transactionId;
    dbOrder.isPaid = true;
    dbOrder.paidAt = new Date().toISOString();

    await dbOrder.save();

    await db.disconnect();

    res.status(200).json({ message: "Order paid" });
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.log(error.response?.data);
    } else {
      console.log(error);
    }
    res.status(500).json({ message: "Error paying order" });
  }
};
