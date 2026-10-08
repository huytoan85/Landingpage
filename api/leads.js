const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Duyanh1401';

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
  const pw = req.headers['x-admin-password'] || req.query.pw;
  if (!pw || pw !== ADMIN_PASSWORD) {
    return res.status(401).json({
      ok: false,
      error: 'Mật khẩu quản trị không chính xác hoặc đã hết hạn.'
    });
  }

  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, leads: global._memoryLeads });
  }

  if (req.method === 'PATCH') {
    const { id, status, note } = req.body;
    const idx = global._memoryLeads.findIndex(l => l.id === id);
    if (idx >= 0) {
      if (status !== undefined) global._memoryLeads[idx].status = status;
      if (note !== undefined) global._memoryLeads[idx].note = note;
      return res.status(200).json({ ok: true, lead: global._memoryLeads[idx] });
    }
    return res.status(404).json({ ok: false, error: 'Lead not found' });
  }

  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}
