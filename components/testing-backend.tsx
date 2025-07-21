import React from "react";
import { supabase } from "@/lib/supabase";

export function TestingBackend() {
  const setNewView = async () => {
    const { data, error } = await supabase.from("views").insert({
      fullName: "Aubrey Graham",
      stageName: "Drake",
      email: "drake@gmail.com",
      phone: "078121212",
      country: "Germany",
      password: "Deez",
      agreeTerms: true,
    });

    if (data) console.log(data);
    if (error) console.log(error);
  };

  setNewView();
  return <div>testing-backend</div>;
}
