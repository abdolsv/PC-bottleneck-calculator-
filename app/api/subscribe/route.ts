// app/api/subscribe/route.ts
// Connects to Mailchimp (free up to 500 contacts)
// Or swap for ConvertKit / Resend / Loops

import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

const MAILCHIMP_API_KEY  = process.env.MAILCHIMP_API_KEY ?? ''
const MAILCHIMP_SERVER   = process.env.MAILCHIMP_SERVER ?? 'us1'  // e.g., us1, us6
const MAILCHIMP_LIST_ID  = process.env.MAILCHIMP_LIST_ID ?? ''

export async function POST(req: NextRequest) {
  const { email } = await req.json()

  // Basic email validation
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: 'Invalid email address' }, { status: 400 })
  }

  try {
    const response = await fetch(
      `https://${MAILCHIMP_SERVER}.api.mailchimp.com/3.0/lists/${MAILCHIMP_LIST_ID}/members`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${MAILCHIMP_API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email_address: email,
          status: 'subscribed',
          tags: ['calculator-user'],
          merge_fields: { SOURCE: 'bottleneck-calculator' },
        }),
      }
    )

    if (response.status === 400) {
      const data = await response.json()
      // Already subscribed is fine
      if (data.title === 'Member Exists') {
        return NextResponse.json({ ok: true, message: 'Already subscribed!' })
      }
      return NextResponse.json({ error: data.detail }, { status: 400 })
    }

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Mailchimp error:', error)
    return NextResponse.json({ error: 'Subscription failed. Please try again.' }, { status: 500 })
  }
}
