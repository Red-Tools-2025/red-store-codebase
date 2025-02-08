import { SUPABASE_AUTH_KEY, SUPABASE_AUTH_URL } from "./env";
import { createClient } from "@supabase/supabase-js";

const supabaseAuthUrl = SUPABASE_AUTH_URL;
const supabaseAuthKey = SUPABASE_AUTH_KEY;
const authClient = createClient(supabaseAuthUrl, supabaseAuthKey);

export default authClient;
