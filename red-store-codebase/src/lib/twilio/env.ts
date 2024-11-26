export const TWILIO_ACCOUNT_SID = assertValue(
  process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_SID,
  "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"
);

export const TWILIO_ACCOUNT_AUTH_TOKEN = assertValue(
  process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_AUTH_TOKEN,
  "Missing environment variable: NEXT_PUBLIC_SUPABASE_KEY"
);

export const TWILIO_ACCOUNT_PHONENUMBER = assertValue(
  process.env.NEXT_PUBLIC_TWILIO_ACCOUNT_PHONENUMBER,
  "Missing environment variable: NEXT_PUBLIC_SUPABASE_KEY"
);

function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
