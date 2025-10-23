import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "npm:@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }

  try {
    const url = new URL(req.url);
    let path = url.pathname;

    // Remove leading slash and any path segments before the actual endpoint
    path = path.replace(/^\//,  '');

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Handle /server endpoint
    if (path === "server" || path.endsWith("/server")) {
      const { data, error } = await supabase
        .from("server_config")
        .select("*")
        .eq("id", 1)
        .single();

      if (error) {
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const serverData = {
        id: data.id,
        registration: data.registration,
        readonly: data.readonly,
        emailEnabled: data.email_enabled,
        openIdEnabled: data.openid_enabled,
        openIdForce: data.openid_force,
        announcement: data.announcement,
        newServer: false,
        attributes: data.attributes || {},
      };

      return new Response(
        JSON.stringify(serverData),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle /session endpoint
    if (path === "session" || path.endsWith("/session")) {
      if (req.method === "GET") {
        // Check for session token
        const token = url.searchParams.get("token");
        
        // For demo purposes, return null (not authenticated)
        return new Response(
          null,
          { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (req.method === "POST") {
        // Handle login
        const formData = await req.formData();
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        // For demo purposes, accept any credentials and create/return a demo user
        let { data: user, error } = await supabase
          .from("users")
          .select("*")
          .eq("email", email)
          .single();

        if (error || !user) {
          // Create demo user
          const { data: newUser, error: insertError } = await supabase
            .from("users")
            .insert({
              name: email.split("@")[0],
              email: email,
              password: "hashed",
              administrator: true,
              attributes: {},
            })
            .select()
            .single();

          if (insertError) {
            return new Response(
              JSON.stringify({ error: insertError.message }),
              { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
            );
          }
          user = newUser;
        }

        const userData = {
          id: user.id,
          name: user.name,
          email: user.email,
          administrator: user.administrator,
          disabled: user.disabled,
          readonly: user.readonly,
          attributes: user.attributes || {},
        };

        return new Response(
          JSON.stringify(userData),
          { headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      if (req.method === "DELETE") {
        // Handle logout
        return new Response(
          null,
          { status: 204, headers: corsHeaders }
        );
      }
    }

    // Handle /devices endpoint
    if (path === "devices" || path.endsWith("/devices")) {
      // Return empty array for now
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Handle /positions endpoint
    if (path === "positions" || path.endsWith("/positions")) {
      // Return empty array for now
      return new Response(
        JSON.stringify([]),
        { headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Default 404 response
    return new Response(
      JSON.stringify({ error: "Not found", path: path }),
      { status: 404, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
    
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});