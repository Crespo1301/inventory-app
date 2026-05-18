# Privacy Policy

**Effective date:** [Effective date]

This Privacy Policy explains how **[Company name]** ("we", "us", or "our")
collects, uses, and protects information when you use the **Inventory App**
mobile application ("the App"). Please read it carefully. By using the App, you
agree to the practices described here.

---

## 1. What Information We Collect

We collect only the information necessary to run the App.

### Information you provide directly

- **Account information** — your name and email address, collected when you
  create an account or accept an invitation.
- **Business and restaurant data** — the locations, service areas, item
  catalogs, par levels, vendor names, low-stock flags, and order records that
  you or your team enter while using the App.

### Information we do not collect

- We do not collect payment information (there is no in-app purchase at this
  time).
- We do not collect precise device location.
- We do not collect contacts, photos, camera, or microphone data.
- We do not collect information about how you use other apps on your device.

---

## 2. How We Use Your Information

We use the information we collect only to operate and improve the App:

- **Authentication** — your email address is used to sign you in and to send
  account-related notices (password reset, invitation emails).
- **App functionality** — your business data is used to display inventory
  status, generate order suggestions, and keep your team's devices in sync.
- **Troubleshooting** — if you contact us about a problem, we may use your
  account information to investigate and respond.

We do not use your data for advertising, profiling, or any purpose unrelated
to operating the App.

---

## 3. Data Storage and Security

Your data is stored in a **Supabase**-hosted PostgreSQL database (see
Section 6 for more on Supabase as a processor). We protect your data through:

- **Row-level security (RLS)** — enforced at the database layer so that each
  user can only read and write data belonging to their own company. No
  application-level misconfiguration can expose another company's data.
- **Role-based access** — admins, managers, and team members each have
  narrowly scoped permissions enforced in the database, not just the UI.
- **HTTPS in transit** — all communication between the App and our backend is
  encrypted in transit.
- **Supabase Auth** — passwords are never stored in plain text; authentication
  is handled by Supabase's managed authentication service.

No security system is perfect. We encourage you to use a strong, unique
password and to contact us immediately if you suspect unauthorized access to
your account.

---

## 4. Data Retention

We retain your account and business data for as long as your account is
active.

If you delete your account (see Section 5), we delete your profile and
associated data. Certain records may be retained for a brief period for backup
or legal reasons, after which they are permanently removed.

---

## 5. Account Deletion

You can delete your account at any time from inside the App:

**Account → Delete Account**

Deleting your account removes your profile and the business data associated
with it. If you are an **Admin** who owns a company, deleting your account
will also remove the company and all of its locations, items, inventory
records, and order history. This action is permanent and cannot be undone.

If you are a **Manager** or **Team Member**, your profile and your
contributions to that company's data are removed; the company record itself
continues for other users.

You may also request account deletion by contacting us at the address in
Section 9.

---

## 6. Third-Party Services

We use one third-party infrastructure provider:

| Provider | Role | Privacy information |
|----------|------|---------------------|
| **Supabase** (Supabase Inc.) | Database, authentication, and realtime infrastructure processor | [supabase.com/privacy](https://supabase.com/privacy) |

Supabase processes data on our behalf and under our instructions. Your data is
not shared with Supabase for their own marketing or analytics purposes.

We do not use:

- Advertising networks or ad SDKs.
- Third-party analytics SDKs (e.g., Firebase Analytics, Mixpanel, Amplitude).
- Social media SDKs or pixels.
- Cross-app tracking technologies.

---

## 7. Children's Privacy

The App is not directed at children under 13 years of age, and we do not
knowingly collect personal information from children under 13. If you believe
a child has provided us with personal information, please contact us and we
will delete it promptly.

---

## 8. Changes to This Policy

We may update this Privacy Policy from time to time. When we do, we will
update the **Effective date** at the top of this document. If a change is
material, we will notify you through the App or by email before it takes
effect.

Continued use of the App after a change takes effect constitutes acceptance of
the updated policy.

---

## 9. Contact

If you have questions about this Privacy Policy or want to exercise your data
rights (access, correction, or deletion), please contact us:

**[Company name]**
[support email]

---

*This policy covers the Inventory App mobile application only.*
