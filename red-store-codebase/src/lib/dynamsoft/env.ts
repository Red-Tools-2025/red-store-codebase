export const DBR_LICENSE = assertValue(
  process.env.NEXT_PUBLIC_DBR_LICENSE,
  "Missing environment variable: NEXT_PUBLIC_DBR_LICENSE"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
