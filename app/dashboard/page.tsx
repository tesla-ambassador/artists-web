import React from "react";
import DashboardContent from "./Content";

import { createClient } from "@supabase/supabase-js";

export default async function Dashboard() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL as string;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string;
  const supabase = createClient(supabaseUrl, supabaseKey);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen px-4 sm:px-[50px] py-8">
      <DashboardContent />
    </div>
  );
}
