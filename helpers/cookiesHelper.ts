import Cookies from "js-cookie";
import { ShippingAddress } from "../interfaces";
import { countries } from "../utils";

export const getAddressFromCookies = (): ShippingAddress | undefined => {
  if (Cookies.get("firstName")) {
    return {
      firstName: Cookies.get("firstName") || "",
      lastName: Cookies.get("lastName") || "",
      address: Cookies.get("address") || "",
      address2: Cookies.get("address2") || "",
      zip: Cookies.get("zip") || "",
      city: Cookies.get("city") || "",
      country: Cookies.get("country") || countries[0].code,
      phone: Cookies.get("phone") || "",
    };
  }
};

export const saveAddressToCookies = (address: ShippingAddress) => {
  Cookies.set("firstName", address.firstName);
  Cookies.set("lastName", address.lastName);
  Cookies.set("address", address.address);
  Cookies.set("address2", address.address2 || "");
  Cookies.set("zip", address.zip);
  Cookies.set("city", address.city);
  Cookies.set("country", address.country);
  Cookies.set("phone", address.phone);
};

export const removeAddressFromCookies = () => {
  Cookies.remove("firstName");
  Cookies.remove("lastName");
  Cookies.remove("address");
  Cookies.remove("address2");
  Cookies.remove("zip");
  Cookies.remove("city");
  Cookies.remove("country");
  Cookies.remove("phone");
};
