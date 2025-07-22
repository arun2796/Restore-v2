import type { FieldValues, Path, UseFormSetError } from "react-hook-form";
import type { PaymentSummary, ShippingAddress } from "../../app/models/Orders";

export function Currency(amount: number) {
  return "₹" + (amount / 10).toFixed(2);
}

export function FilterValueEmpty(values: object) {
  return Object.fromEntries(
    Object.entries(values).filter(
      ([, values]) =>
        values !== "" &&
        values !== null &&
        values !== undefined &&
        values.length !== 0
    )
  );
}

export const formatAddressString = (address: ShippingAddress) => {
  return `${address?.name}, ${address?.line1}, ${address?.city}, ${address?.state}, ${address?.postal_code}, ${address?.country}`;
};
export const formatPaymentString = (card: PaymentSummary) => {
  return `${card?.brand?.toUpperCase()} **** **** **** ${
    card?.last4
  } (Expires ${card?.exp_month}/${card?.exp_year})`;
};

export function handelApiError<T extends FieldValues>(
  error: unknown,
  setError: UseFormSetError<T>,
  filedNames: Path<T>[]
) {
  const apiError = (error as { message: string }) || {};

  if (apiError.message && typeof apiError.message === "string") {
    const errorArray = apiError.message.split(",");
    errorArray.forEach((er) => {
      const Filedmatch = filedNames.find((filedName) =>
        er.toLowerCase().includes(filedName.toString().toLowerCase())
      );
      if (Filedmatch) setError(Filedmatch, { message: er.trim() });
    });
  }
}
