const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

function baseLayout(preheader: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"/>
<meta name="viewport" content="width=device-width,initial-scale=1.0"/>
<meta name="x-apple-disable-message-reformatting"/>
<title>KrynoluxDC</title>
<!--[if mso]><noscript><xml><o:OfficeDocumentSettings><o:PixelsPerInch>96</o:PixelsPerInch></o:OfficeDocumentSettings></xml></noscript><![endif]-->
<style>
  body{margin:0;padding:0;background:#f4f4f7;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;}
  .wrapper{background:#f4f4f7;padding:32px 16px;}
  .card{background:#ffffff;border-radius:12px;max-width:560px;margin:0 auto;overflow:hidden;box-shadow:0 2px 8px rgba(0,0,0,0.08);}
  .header{background:#7B2FFF;padding:28px 32px;text-align:center;}
  .header-logo{color:#ffffff;font-size:22px;font-weight:800;letter-spacing:-0.5px;text-decoration:none;}
  .header-tag{display:inline-block;background:rgba(255,255,255,0.2);color:#ffffff;font-size:11px;font-weight:600;letter-spacing:1px;text-transform:uppercase;padding:3px 10px;border-radius:20px;margin-top:8px;}
  .body{padding:32px 32px 24px;}
  .greeting{font-size:20px;font-weight:700;color:#1a1a2e;margin:0 0 16px;}
  .text{font-size:15px;line-height:1.7;color:#444;margin:0 0 16px;}
  .highlight-box{background:#f8f4ff;border-left:4px solid #7B2FFF;border-radius:0 8px 8px 0;padding:14px 18px;margin:20px 0;}
  .highlight-box .label{font-size:11px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:#7B2FFF;margin-bottom:4px;}
  .highlight-box .value{font-size:16px;font-weight:700;color:#1a1a2e;}
  .cta-btn{display:inline-block;background:#7B2FFF;color:#ffffff;font-size:15px;font-weight:700;text-decoration:none;padding:13px 28px;border-radius:8px;margin:20px 0 8px;}
  .divider{border:none;border-top:1px solid #ebebeb;margin:24px 0;}
  .footer{background:#f9f9fb;padding:20px 32px;text-align:center;}
  .footer-text{font-size:12px;color:#888;line-height:1.6;margin:0;}
  .footer-text a{color:#7B2FFF;text-decoration:none;}
  .status-icon{font-size:40px;margin-bottom:12px;display:block;}
  .reason-box{background:#fff8f0;border:1px solid #ffd28a;border-radius:8px;padding:14px 18px;margin:16px 0;}
  .reason-box .label{font-size:11px;font-weight:600;letter-spacing:0.8px;text-transform:uppercase;color:#e07b00;margin-bottom:6px;}
  .reason-box .value{font-size:14px;color:#555;line-height:1.6;}
  .meta-row{display:flex;gap:8px;margin:6px 0;font-size:13px;color:#555;}
  .meta-label{font-weight:600;color:#333;min-width:60px;}
  .excerpt-box{background:#fafafa;border-radius:8px;padding:16px 18px;margin:16px 0;font-size:14px;color:#555;line-height:1.7;font-style:italic;border:1px solid #ebebeb;}
</style>
</head>
<body>
<span style="display:none;max-height:0;overflow:hidden;">${preheader}</span>
<div class="wrapper">
  <div class="card">
    <div class="header">
      <div class="header-logo">KrynoluxDC</div>
      <div style="color:rgba(255,255,255,0.75);font-size:12px;margin-top:4px;">News by Kids. For the Community.</div>
    </div>
    ${bodyContent}
    <div class="footer">
      <p class="footer-text">
        KrynoluxDC — Youth Journalism in the DMV<br/>
        Fairfax · Loudoun · Washington DC<br/>
        <a href="mailto:contact@krynolux.work">contact@krynolux.work</a> &nbsp;·&nbsp; <a href="https://krynolux.work">krynolux.work</a>
      </p>
    </div>
  </div>
</div>
</body>
</html>`;
}

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

    if (!email && status !== "newsletter") {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) }
      );
    }

    let subject = "";
    let html = "";
    let plainText = "";

    if (status === "approved") {
      subject = "🎉 Your story is live on KrynoluxDC!";
      plainText = `Hi ${name},\n\nGreat news! Your article "${headline}" has been published live on KrynoluxDC.\n\nThank you for contributing to youth journalism in the DMV!\n\nRead it at: https://krynolux.work\n\n— The KrynoluxDC Editorial Team\ncontact@krynolux.work`;
      html = baseLayout(
        `Your article "${headline}" is now live!`,
        `<div class="body">
          <span class="status-icon">🎉</span>
          <p class="greeting">Your story is live, ${name}!</p>
          <p class="text">We're excited to let you know your article has been reviewed and published on KrynoluxDC.</p>
          <div class="highlight-box">
            <div class="label">Published Story</div>
            <div class="value">${headline}</div>
          </div>
          <p class="text">Thank you for contributing to youth journalism in the DMV. Your voice matters — keep the stories coming!</p>
          <a href="https://krynolux.work" class="cta-btn">Read Your Story →</a>
          <hr class="divider"/>
          <p class="text" style="font-size:13px;color:#888;margin:0;">Have another story? <a href="https://krynolux.work" style="color:#7B2FFF;">Submit it here.</a></p>
        </div>`
      );

    } else if (status === "rejected") {
      subject = "Update on your KrynoluxDC submission";
      plainText = `Hi ${name},\n\nThank you for submitting "${headline}" to KrynoluxDC.\n\nAfter careful review, we are unable to publish this article at this time.${reason ? `\n\nReason: ${reason}` : ""}\n\nWe encourage you to revise and resubmit.\n\nQuestions? contact@krynolux.work\n\n— The KrynoluxDC Editorial Team`;
      html = baseLayout(
        `An update on your submission "${headline}"`,
        `<div class="body">
          <span class="status-icon">📋</span>
          <p class="greeting">An update on your submission</p>
          <p class="text">Hi ${name}, thank you for taking the time to submit to KrynoluxDC. After careful editorial review, we are unable to publish <strong>"${headline}"</strong> at this time.</p>
          ${reason ? `<div class="reason-box"><div class="label">Editorial Feedback</div><div class="value">${reason}</div></div>` : ""}
          <p class="text">We encourage you to revise your piece and resubmit — many great stories take a few drafts. Our editors are always happy to help.</p>
          <a href="https://krynolux.work" class="cta-btn">Submit a Revised Story →</a>
          <hr class="divider"/>
          <p class="text" style="font-size:13px;color:#888;margin:0;">Questions about this decision? Reply to this email or reach us at <a href="mailto:contact@krynolux.work" style="color:#7B2FFF;">contact@krynolux.work</a>.</p>
        </div>`
      );

    } else if (status === "received") {
      subject = "We received your story — KrynoluxDC";
      plainText = `Hi ${name},\n\nThank you for submitting "${headline}" to KrynoluxDC!\n\nOur editorial team will review your story within 48 hours. You'll receive another email once a decision has been made.\n\nQuestions? contact@krynolux.work\n\n— The KrynoluxDC Editorial Team`;
      html = baseLayout(
        `We got it! "${headline}" is under review.`,
        `<div class="body">
          <span class="status-icon">📬</span>
          <p class="greeting">We received your story, ${name}!</p>
          <p class="text">Thanks for submitting to KrynoluxDC. Our editorial team has received your article and will review it shortly.</p>
          <div class="highlight-box">
            <div class="label">Story Under Review</div>
            <div class="value">${headline}</div>
          </div>
          <p class="text">You'll hear back from us within <strong>48 hours</strong> with a decision. In the meantime, feel free to reach out if you have any questions.</p>
          <hr class="divider"/>
          <p class="text" style="font-size:13px;color:#888;margin:0;">Questions? <a href="mailto:contact@krynolux.work" style="color:#7B2FFF;">contact@krynolux.work</a></p>
        </div>`
      );

    } else if (status === "subscribed") {
      subject = "You're in! Welcome to KrynoluxDC";
      plainText = `Hi!\n\nThank you for subscribing to KrynoluxDC — the DMV's youth-led news network!\n\nYou'll receive an email whenever a new story is published. We cover local news, schools, sports, events, and more across Fairfax, Loudoun, and Washington DC.\n\nHave a story tip? Submit at: https://krynolux.work\n\nTo unsubscribe, reply to this email with 'unsubscribe'.\n\n— The KrynoluxDC Editorial Team\ncontact@krynolux.work`;
      html = baseLayout(
        "Thanks for subscribing — you'll get new stories straight to your inbox.",
        `<div class="body">
          <span class="status-icon">✅</span>
          <p class="greeting">Welcome to KrynoluxDC!</p>
          <p class="text">You're now subscribed to the DMV's youth-led news network. Every time a new story is published, you'll be the first to know.</p>
          <div class="highlight-box">
            <div class="label">What We Cover</div>
            <div class="value" style="font-size:14px;font-weight:500;line-height:1.6;">Local news · Schools · Sports · Events<br/>Across Fairfax, Loudoun &amp; Washington DC</div>
          </div>
          <p class="text">Have a story to share? We're always looking for young writers and reporters from across the DMV.</p>
          <a href="https://krynolux.work" class="cta-btn">Submit a Story →</a>
          <hr class="divider"/>
          <p class="text" style="font-size:12px;color:#aaa;margin:0;">To unsubscribe at any time, reply to this email with the word <em>unsubscribe</em>.</p>
        </div>`
      );

    } else if (status === "contact") {
      const contactMsg = body.message || "";
      subject = `New Contact Message from ${name}`;
      plainText = `New message via KrynoluxDC contact form.\n\nFrom: ${name}\nEmail: ${email}\n\nMessage:\n${contactMsg}\n\n— KrynoluxDC Contact Form`;
      html = baseLayout(
        `${name} sent a message via the contact form`,
        `<div class="body">
          <span class="status-icon">✉️</span>
          <p class="greeting">New Contact Message</p>
          <p class="text">You received a new message through the KrynoluxDC contact form.</p>
          <div class="highlight-box">
            <div class="label">From</div>
            <div class="value">${name}</div>
          </div>
          <div style="margin:4px 0 16px;">
            <div class="meta-row"><span class="meta-label">Email:</span> <a href="mailto:${email}" style="color:#7B2FFF;">${email}</a></div>
          </div>
          <div class="reason-box" style="background:#f8f4ff;border-color:#c9a8ff;">
            <div class="label" style="color:#7B2FFF;">Message</div>
            <div class="value" style="white-space:pre-wrap;">${contactMsg}</div>
          </div>
          <hr class="divider"/>
          <p class="text" style="font-size:13px;color:#888;margin:0;">Reply directly to <a href="mailto:${email}" style="color:#7B2FFF;">${email}</a> to respond.</p>
        </div>`
      );

    } else if (status === "school_applied") {
      const schoolName = body.school_name || "Your school";
      subject = "We received your school application — KrynoluxDC";
      plainText = `Hi ${name},\n\nThank you for applying to partner with KrynoluxDC!\n\nSchool: ${schoolName}\n\nOur editorial team will review your application within 48 hours. You'll receive another email once a decision has been made.\n\nQuestions? contact@krynolux.work\n\n— The KrynoluxDC Editorial Team`;
      html = baseLayout(
        `Application received for ${schoolName}`,
        `<div class="body">
          <span class="status-icon">📬</span>
          <p class="greeting">Application received, ${name}!</p>
          <p class="text">Thank you for applying to partner with KrynoluxDC. Your school's application is now under editorial review.</p>
          <div class="highlight-box">
            <div class="label">School Applied</div>
            <div class="value">${schoolName}</div>
          </div>
          <p class="text">You'll hear back from us within <strong>48 hours</strong>. Once approved, you'll be able to log in to the School Portal and publish stories directly to KrynoluxDC.</p>
          <hr class="divider"/>
          <p class="text" style="font-size:13px;color:#888;margin:0;">Questions? <a href="mailto:contact@krynolux.work" style="color:#7B2FFF;">contact@krynolux.work</a></p>
        </div>`
      );

    } else if (status === "school_approved") {
      const schoolName = body.school_name || "Your school";
      const subdomainUrl = body.subdomain || "https://krynolux.work";
      subject = "Your school is approved — Welcome to KrynoluxDC!";
      plainText = `Hi ${name},\n\nGreat news! ${schoolName} has been approved as a KrynoluxDC partner school.\n\nYour school's news page is live at: ${subdomainUrl}\n\nLog in to the School Portal at krynolux.work with your registered email and password to start submitting stories.\n\nWelcome aboard!\n\n— The KrynoluxDC Editorial Team\ncontact@krynolux.work`;
      html = baseLayout(
        `${schoolName} is approved!`,
        `<div class="body">
          <span class="status-icon">🎉</span>
          <p class="greeting">You're approved, ${name}!</p>
          <p class="text"><strong>${schoolName}</strong> has been approved as a KrynoluxDC partner school. Your students can now publish their stories on the DMV's youth news network.</p>
          <div class="highlight-box">
            <div class="label">Your School's News Page</div>
            <div class="value"><a href="${subdomainUrl}" style="color:#7B2FFF;">${subdomainUrl}</a></div>
          </div>
          <p class="text">Log in to the School Portal with your registered email and password to start submitting student stories. All submissions are reviewed by our editorial team before going live.</p>
          <a href="${subdomainUrl}" class="cta-btn">View Your School Page →</a>
          <hr class="divider"/>
          <p class="text" style="font-size:13px;color:#888;margin:0;">Questions? <a href="mailto:contact@krynolux.work" style="color:#7B2FFF;">contact@krynolux.work</a></p>
        </div>`
      );

    } else if (status === "school_rejected") {
      const schoolName = body.school_name || "Your school";
      const rejectReason = body.reason || "";
      subject = "Update on your KrynoluxDC school application";
      plainText = `Hi ${name},\n\nThank you for applying to partner with KrynoluxDC.\n\nAfter careful review, we are unable to approve ${schoolName} at this time.${rejectReason ? `\n\nReason: ${rejectReason}` : ""}\n\nYou're welcome to reapply in the future. Questions? contact@krynolux.work\n\n— The KrynoluxDC Editorial Team`;
      html = baseLayout(
        `Update on your application for ${schoolName}`,
        `<div class="body">
          <span class="status-icon">📋</span>
          <p class="greeting">An update on your application</p>
          <p class="text">Hi ${name}, thank you for applying to partner with KrynoluxDC. After careful review, we are unable to approve <strong>${schoolName}</strong> at this time.</p>
          ${rejectReason ? `<div class="reason-box"><div class="label">Reason</div><div class="value">${rejectReason}</div></div>` : ""}
          <p class="text">You are welcome to reapply in the future. We appreciate your interest in youth journalism in the DMV.</p>
          <hr class="divider"/>
          <p class="text" style="font-size:13px;color:#888;margin:0;">Questions? <a href="mailto:contact@krynolux.work" style="color:#7B2FFF;">contact@krynolux.work</a></p>
        </div>`
      );

    } else if (status === "newsletter") {
      const emails: string[] = body.emails || [];
      if (emails.length === 0) {
        return new Response(JSON.stringify({ error: "No subscribers" }), { status: 400, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) });
      }
      const nlHeadline = body.headline || "New story on KrynoluxDC";
      const excerpt    = body.excerpt  || "";
      const author     = body.author   || "KrynoluxDC";
      subject = `New story: ${nlHeadline}`;
      plainText = `A new story has just been published on KrynoluxDC!\n\n${nlHeadline}\nBy ${author}${excerpt ? `\n\n${excerpt}…` : ""}\n\nRead it at: https://krynolux.work\n\n—\nYou're receiving this because you subscribed to KrynoluxDC updates.\nTo unsubscribe reply with 'unsubscribe' to contact@krynolux.work`;
      const nlHtml = baseLayout(
        `New story: ${nlHeadline}`,
        `<div class="body">
          <p class="text" style="font-size:12px;color:#aaa;font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">New Story Published</p>
          <p class="greeting">${nlHeadline}</p>
          <p class="text" style="font-size:13px;color:#7B2FFF;font-weight:600;margin-top:-8px;margin-bottom:16px;">By ${author}</p>
          ${excerpt ? `<div class="excerpt-box">${excerpt}…</div>` : ""}
          <a href="https://krynolux.work" class="cta-btn">Read the Full Story →</a>
          <hr class="divider"/>
          <p class="text" style="font-size:12px;color:#aaa;margin:0;">You're receiving this because you subscribed to KrynoluxDC updates.<br/>To unsubscribe, reply with <em>unsubscribe</em> to <a href="mailto:contact@krynolux.work" style="color:#7B2FFF;">contact@krynolux.work</a>.</p>
        </div>`
      );
      const resendRes2 = await fetch("https://api.resend.com/emails/batch", {
        method: "POST",
        headers: { "Authorization": "Bearer " + Deno.env.get("RESEND_API_KEY"), "Content-Type": "application/json" },
        body: JSON.stringify(emails.map(addr => ({
          from: "KrynoluxDC <noreply@krynolux.work>",
          to: [addr],
          subject,
          html: nlHtml,
          text: plainText,
        }))),
      });
      const batchData = await resendRes2.json();
      if (!resendRes2.ok) {
        return new Response(JSON.stringify({ error: batchData }), { status: 500, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) });
      }
      return new Response(JSON.stringify({ success: true, sent: emails.length }), { status: 200, headers: Object.assign({}, corsHeaders, { "Content-Type": "application/json" }) });

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
        subject,
        html,
        text: plainText,
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
