import { createClient } from "@supabase/supabase-js";

import { SUPABASE_KEY, SUPABASE_URL } from "./env";
import { Database } from "./database.types";
const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_KEY);

export default supabase;
