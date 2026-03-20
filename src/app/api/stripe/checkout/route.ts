import { NextResponse } from "next/server";
import Stripe from "stripe";
import dbConnect from "@/lib/mongodb";
import User from "@/lib/models/User";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "sk_test_mock", {
  apiVersion: "2024-12-18.acacia" as Stripe.StripeConfig["apiVersion"],
});

export async function POST(request: Request) {
  try {
    const { priceId, planName, creditsToAdd } = await request.json();
    await dbConnect();
    
    const user_id = "admin_hikari";
    const user = await User.findOne({ user_id });
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // In a real flow, you create a Stripe Checkout Session
    // For MVP Pitch, we'll mock the success transaction to instantly add credits 
    // unless they actually provided a real STRIPE_SECRET_KEY.

    if (!process.env.STRIPE_SECRET_KEY || process.env.STRIPE_SECRET_KEY.startsWith("sk_test_mock")) {
      // Mock checkout flow for pitch demo
      user.plan = planName;
      user.credits += creditsToAdd;
      await user.save();
      return NextResponse.json({ success: true, mock: true, url: "/dashboard/billing?success=true" });
    }

    // Real Stripe Flow
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId, // Actual Stripe Price ID from dashboard
          quantity: 1,
        },
      ],
      mode: "subscription",
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005"}/dashboard/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3005"}/dashboard/billing?canceled=true`,
      client_reference_id: user_id,
      metadata: {
        plan: planName,
        credits: creditsToAdd.toString(),
      },
    });

    return NextResponse.json({ success: true, url: session.url });
  } catch (error: unknown) {
    console.error("Stripe Checkout Error:", error);
    const errMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json({ error: errMessage }, { status: 500 });
  }
}
