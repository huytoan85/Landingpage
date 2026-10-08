// In-memory / Vercel KV / Global storage for serverless runtime
let memoryLeads = global._memoryLeads || [
  {
    "id": "reg-1791425263486-08dnt",
    "received_at": "2026-10-08T02:07:43.486Z",
    "full_name": "Lê Minh Quân",
    "phone": "0977889900",
    "email": "quan.le@techcorp.vn",
    "company": "TechCorp Vietnam · Giám đốc Công nghệ",
    "ticket": "VIP",
    "attendees": "1",
    "status": "moi",
    "note": "Khách đăng ký qua landing page",
    "utm_source": "",
    "utm_medium": "",
    "utm_campaign": "",
    "event": "Business Meeting 2026 - 10/10/2026 - Athena Hotel",
    "source": "landing-page"
  }
];
global._memoryLeads = memoryLeads;

export default function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
  }

  try {
    const {
      full_name,
      phone,
      email,
      company,
      ticket,
      attendees,
      event,
      source,
      website,
      utm_source,
      utm_medium,
      utm_campaign
    } = req.body;

    if (website) {
      return res.status(400).json({ ok: false, error: 'Spam detected.' });
    }

    if (!full_name || !phone) {
      return res.status(400).json({ ok: false, error: 'Vui lòng nhập đầy đủ họ tên và số điện thoại.' });
    }

    const newLead = {
      id: `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      received_at: new Date().toISOString(),
      full_name: full_name.trim(),
      phone: phone.trim(),
      email: (email || '').trim(),
      company: (company || '').trim(),
      ticket: ticket || 'STANDARD',
      attendees: attendees || '1',
      status: 'moi',
      note: '',
      utm_source: utm_source || '',
      utm_medium: utm_medium || '',
      utm_campaign: utm_campaign || '',
      event: event || 'Business Meeting 2026 - 10/10/2026 - Athena Hotel',
      source: source || 'landing-page'
    };

    global._memoryLeads.unshift(newLead);

    return res.status(200).json({ ok: true, lead: newLead });
  } catch (err) {
    return res.status(500).json({ ok: false, error: err.message });
  }
}
