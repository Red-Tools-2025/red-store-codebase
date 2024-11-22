export const SUPABASE_URL = assertValue(
  process.env.NEXT_PUBLIC_SUPABASE_URL,
  "Missing environment variable: NEXT_PUBLIC_SUPABASE_URL"
);

export const SUPABASE_KEY = assertValue(
  process.env.NEXT_PUBLIC_SUPABASE_KEY,
  "Missing environment variable: NEXT_PUBLIC_SUPABASE_KEY"
);
function assertValue<T>(v: T | undefined, errorMessage: string): T {
  if (v === undefined) {
    throw new Error(errorMessage);
  }

  return v;
}
