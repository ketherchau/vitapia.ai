# Dynamic Pro Capabilities Implementation Plan

> **For Gemini:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Enforce dynamic limits based on the user's pricing plan (Free vs Pro) when launching a simulation.

**Architecture:** 
- **Frontend (`/dashboard/new`):** Fetch the current user profile. Use the `plan` property to dynamically disable demographic drop-downs (forcing "All" for Free), restrict maximum questions to 3 (unlimited for Pro), and add an "AI Draft" button locked behind the Pro tier.
- **Backend (`/api/simulations`):** Add server-side validation. If the user is on the "Free" plan, reject API requests that contain specific demographic filters or more than 3 questions.
- **Stripe Checkout (`/api/stripe/checkout`):** Ensure the mock checkout endpoint upgrades the user's `plan` field to "Pro" when the professional plan is purchased.

**Tech Stack:** Next.js App Router, React, TailwindCSS.

---

### Task 1: Update Stripe Checkout Mock to Upgrade Plan

**Files:**
- Modify: `src/app/api/stripe/checkout/route.ts`

**Step 1: Upgrade User Plan**
Update the mock endpoint to not only add `credits` but also `await User.updateOne({ user_id: "admin_hikari" }, { $set: { plan: body.priceId === "price_mock_pro" ? "Pro" : "Free" } });` or similar logic. Ensure purchasing Pro actually updates the `plan` property on the User model.

---

### Task 2: Fetch User Plan on New Pulse Check Page

**Files:**
- Modify: `src/app/dashboard/new/page.tsx`

**Step 1: Add User State**
Add `const [userPlan, setUserPlan] = useState<string>("Free");` and fetch it via `/api/user` inside a `useEffect()`.

---

### Task 3: Restrict Target Audience Focus Group

**Files:**
- Modify: `src/app/dashboard/new/page.tsx`

**Step 1: Disable Custom Selectors**
For Age, Gender, District, Income, and Housing `<select>` elements, conditionally disable them: `disabled={userPlan !== "Pro"}`.
**Step 2: Add Pro Badges**
Add a small "PRO" badge next to the "Target Audience Focus Group" section header to indicate it's a premium feature.

---

### Task 4: Restrict Unlimited Survey Questions

**Files:**
- Modify: `src/app/dashboard/new/page.tsx`

**Step 1: Update `addQuestion` Logic**
In `handleAddQuestion` (or `addQuestion`), check if `userPlan !== "Pro" && questions.length >= 3`. If so, call `showNotification("Upgrade Required", "Free plans are limited to 3 questions. Upgrade to Pro for unlimited questions.", "error")` and `return`.

---

### Task 5: Add Survey AI Draft Button

**Files:**
- Modify: `src/app/dashboard/new/page.tsx`

**Step 1: Create Magic Button**
Add a button near the "Background Scenario Prompt" or Questions area labeled "✨ AI Draft (PRO)".
**Step 2: Handle Click**
If clicked and `userPlan !== "Pro"`, show the upgrade notification. If Pro, just fill in some dummy mock data or show a "Drafting..." notification for now.

---

### Task 6: Server-Side Validation

**Files:**
- Modify: `src/app/api/simulations/route.ts`

**Step 1: Enforce Limits**
Before creating the simulation, check `if (user.plan !== "Pro")`.
If they have > 3 questions, return a 403 error.
If they have any `filters` values other than `"All"` or `null`/undefined, return a 403 error.
