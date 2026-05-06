const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  let body;
  try {
    const text = await req.text();
    if (!text || text.trim() === "") {
      return new Response(
        JSON.stringify({ error: "Empty request body" }),
        { status: 400, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) }
      );
    }
    body = JSON.parse(text);
  } catch (err) {
    return new Response(
      JSON.stringify({ error: "Invalid JSON: " + err.message }),
      { status: 400, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) }
    );
  }

  try {
    const email = body.email;
    const name = body.name || "Writer";
    const headline = body.headline || "Your article";
    const status = body.status;
    const reason = body.reason || "";

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) }
      );
    }

    let subject = "";
    let message = "";

    if (status === "approved") {
      subject = "Your story is live on KrynoluxDC!";
      message = "Hi " + name + ",\n\nGreat news! Your article \"" + headline + "\" has been published live on KrynoluxDC.\n\nThank you for contributing to youth journalism in the DMV!\n\nVisit your article at: krynolux.work\n\n— The KrynoluxDC Editorial Team\ncontact@krynolux.work";
    } else if (status === "rejected") {
      subject = "Update on your KrynoluxDC submission";
      message = "Hi " + name + ",\n\nThank you for submitting \"" + headline + "\" to KrynoluxDC.\n\nAfter careful review we are unable to publish this article at this time." + (reason ? "\n\nReason: " + reason : "") + "\n\nWe encourage you to revise and resubmit. Questions? contact@krynolux.work\n\n— The KrynoluxDC Editorial Team";
    } else if (status === "received") {
      subject = "We received your story — KrynoluxDC";
      message = "Hi " + name + ",\n\nThank you for submitting \"" + headline + "\" to KrynoluxDC!\n\nOur editorial team will review your story within 48 hours. You will receive another email once a decision has been made.\n\nQuestions? contact@krynolux.work\n\n— The KrynoluxDC Editorial Team";
    } else if (status === "contact") {
      const contactMsg = body.message || "";
      subject = "New Contact Message from " + name;
      message = "You have a new message via KrynoluxDC.\n\nFrom: " + name + "\nEmail: " + email + "\n\nMessage:\n" + contactMsg + "\n\n— KrynoluxDC Contact Form";
    } else {
      return new Response(
        JSON.stringify({ error: "Unknown status: " + status }),
        { status: 400, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) }
      );
    }

    const sendTo = status === "contact" ? ["contact@krynolux.work"] : [email];

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Authorization": "Bearer " + Deno.env.get("RESEND_API_KEY"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: "KrynoluxDC <noreply@krynolux.work>",
        to: sendTo,
        subject: subject,
        text: message,
      }),
    });

    const data = await resendRes.json();

    if (!resendRes.ok) {
      console.error("Resend error:", JSON.stringify(data));
      return new Response(
        JSON.stringify({ error: data }),
        { status: 500, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) }
      );
    }

    console.log("Email sent successfully to:", email, "status:", status);
    return new Response(
      JSON.stringify({ success: true, id: data.id }),
      { status: 200, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) }
    );

  } catch (err) {
    console.error("Function error:", err.message);
    return new Response(
      JSON.stringify({ error: err.message }),
      { status: 500, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) }
    );
  }
});