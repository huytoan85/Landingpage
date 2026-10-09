import fs from 'fs';
import path from 'path';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Duyanh1401';
const CACHE_FILE = path.join('/tmp', 'crm_leads_cache.json');
const DATA_FILE = path.join(process.cwd(), 'data', 'leads.json');
const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json');

const DEFAULT_LEADS = [
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
    "event": "AI Thực Chiến Cùng Toàn Lê",
    "source": "landing-page"
  }
];

export function getWebhookUrl() {
  if (process.env.CRM_WEBHOOK_URL) return process.env.CRM_WEBHOOK_URL;
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const c = JSON.parse(fs.readFileSync(CONTENT_FILE, 'utf8'));
      if (c && c.crm && c.crm.webhook_url) return c.crm.webhook_url;
    }
  } catch (e) {}
  return null;
}

export function readLeads() {
  // 1. In-memory state (fastest, keeps state while container is warm)
  if (Array.isArray(global._memoryLeads) && global._memoryLeads.length > 0) {
    return global._memoryLeads;
  }

  // 2. /tmp cache
  try {
    if (fs.existsSync(CACHE_FILE)) {
      const d = JSON.parse(fs.readFileSync(CACHE_FILE, 'utf8'));
      if (Array.isArray(d) && d.length > 0) {
        global._memoryLeads = d;
        return d;
      }
    }
  } catch (e) {}

  // 3. Local bundled data/leads.json
  try {
    if (fs.existsSync(DATA_FILE)) {
      const d = JSON.parse(fs.readFileSync(DATA_FILE, 'utf8'));
      if (Array.isArray(d) && d.length > 0) {
        global._memoryLeads = d;
        return d;
      }
    }
  } catch (e) {}

  global._memoryLeads = DEFAULT_LEADS;
  return DEFAULT_LEADS;
}

export function saveLeads(leads) {
  global._memoryLeads = leads;
  try {
    fs.writeFileSync(CACHE_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (e) {}

  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), 'utf8');
  } catch (e) {}
}

const TICKET_MAP = {
  MODUL_WORK: 'Module 1: AI For Work (999k)',
  MODUL_MEDIA: 'Module 2: AI For Media (1.490k)',
  COMBO_2_MODUL: 'Combo Toàn Năng: Work & Media (2.190k)',
  AI_SALES: 'Khóa AI Sales & Văn Phòng',
  MASTER_VIDEO_999K: 'Khóa Master Video AI (999k)',
  THUONG: 'STANDARD',
  VIP: 'VIP',
  VVIP: 'SUPERVIP'
};

const STATUS_MAP = {
  moi: 'Mới',
  da_goi: 'Đã gọi',
  quan_tam: 'Quan tâm',
  da_chot: 'Đã chốt',
  huy: 'Hủy'
};

function handleCsvExport(res, leads) {
  const escapeCsv = (str) => {
    const s = String(str || '').replace(/"/g, '""');
    return `"${s}"`;
  };

  const headers = [
    'STT',
    'Thời Gian Đăng Ký',
    'Họ Và Tên',
    'Số Điện Thoại',
    'Email',
    'Doanh Nghiệp / Chức Vụ',
    'Hạng Vé / Khóa Học',
    'Số Lượng',
    'Trạng Thái CRM',
    'Ghi Chú Chăm Sóc',
    'Nguồn'
  ];

  const rows = leads.map((l, i) => {
    const timeStr = l.received_at
      ? new Date(l.received_at).toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh', hour12: false })
      : '';
    const ticket = TICKET_MAP[l.ticket] || l.ticket || 'STANDARD';
    const status = STATUS_MAP[l.status] || l.status || 'Mới';
    const src = [l.utm_source, l.utm_medium, l.utm_campaign].filter(Boolean).join(' / ') || (l.source || 'Trực tiếp');

    return [
      i + 1,
      escapeCsv(timeStr),
      escapeCsv(l.full_name),
      escapeCsv(l.phone),
      escapeCsv(l.email),
      escapeCsv(l.company),
      escapeCsv(ticket),
      escapeCsv(l.attendees || '1'),
      escapeCsv(status),
      escapeCsv(l.note),
      escapeCsv(src)
    ].join(',');
  });

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');
  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="danh-sach-dang-ky-ai-thuc-chien-2026.csv"');
  return res.status(200).send(csvContent);
}

export default async function handler(req, res) {
  const url = req.url || '';
  const method = req.method || 'GET';
  const body = req.body || {};

  // ================= 1. CUSTOMER REGISTRATION =================
  const isRegister = 
    url.includes('/register') || 
    (method === 'POST' && body.full_name && body.phone && !req.headers['x-admin-password'] && body.action !== 'sync-all' && body.action !== 'sync-deleted');

  if (isRegister) {
    if (method !== 'POST') {
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
      } = body;

      // Anti-spam honeypot
      if (website) {
        return res.status(400).json({ ok: false, error: 'Spam detected.' });
      }

      if (!full_name || !phone) {
        return res.status(400).json({ ok: false, error: 'Vui lòng nhập đầy đủ họ tên và số điện thoại.' });
      }

      const leads = readLeads();
      const newLead = {
        id: body.id || `reg-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
        received_at: body.received_at || new Date().toISOString(),
        full_name: String(full_name).trim(),
        phone: String(phone).trim(),
        email: String(email || '').trim(),
        company: String(company || '').trim(),
        ticket: ticket || 'MODUL_WORK',
        attendees: attendees || '1',
        status: 'moi',
        note: '',
        utm_source: utm_source || '',
        utm_medium: utm_medium || '',
        utm_campaign: utm_campaign || '',
        event: event || 'AI Thực Chiến Cùng Toàn Lê',
        source: source || 'landing-page'
      };

      // Deduplicate fast accidental double-submissions (same phone within 3 minutes)
      const isDup = leads.some(l => 
        l.phone === newLead.phone && 
        l.full_name === newLead.full_name && 
        Math.abs(new Date(l.received_at) - new Date(newLead.received_at)) < 180000
      );

      if (!isDup) {
        leads.unshift(newLead);
        saveLeads(leads);
      }

      // Forward to Webhook (Google Sheets, Lark Base, etc.)
      const webhookUrl = getWebhookUrl();
      if (webhookUrl) {
        try {
          fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newLead)
          }).catch(err => console.warn('Webhook post error:', err));
        } catch (whErr) {
          console.warn('Webhook call error:', whErr);
        }
      }

      return res.status(200).json({ ok: true, lead: newLead });
    } catch (err) {
      console.error('CRM register error:', err);
      return res.status(500).json({ ok: false, error: err.message });
    }
  }

  // ================= 2. ADMIN AUTHENTICATION CHECK =================
  const pw = req.headers['x-admin-password'] || req.query.pw;
  if (!pw || pw !== ADMIN_PASSWORD) {
    return res.status(401).json({
      ok: false,
      error: 'Mật khẩu quản trị không chính xác hoặc đã hết hạn.'
    });
  }

  // ================= 3. CSV EXPORT =================
  if (url.includes('/export-csv')) {
    return handleCsvExport(res, readLeads());
  }

  // ================= 4. GET ALL LEADS =================
  if (method === 'GET') {
    return res.status(200).json({ ok: true, leads: readLeads() });
  }

  // ================= 5. SYNC OPERATIONS (POST) =================
  if (method === 'POST') {
    const { action, leads: clientLeads, ids } = body;

    // Sync deleted IDs (tombstones)
    if (action === 'sync-deleted' || (Array.isArray(ids) && !clientLeads)) {
      const deleteSet = new Set((ids || []).map(String));
      let leads = readLeads().filter(l => !deleteSet.has(String(l.id)));
      saveLeads(leads);
      return res.status(200).json({ ok: true, leads });
    }

    // Sync all leads from client browser
    if (action === 'sync-all' || Array.isArray(clientLeads)) {
      const current = readLeads();
      const map = new Map();
      current.forEach(l => map.set(String(l.id), l));

      (clientLeads || []).forEach(l => {
        const idKey = String(l.id);
        if (!map.has(idKey)) {
          map.set(idKey, l);
        } else {
          map.set(idKey, Object.assign({}, map.get(idKey), l));
        }
      });

      const merged = Array.from(map.values());
      merged.sort((a, b) => new Date(b.received_at || 0) - new Date(a.received_at || 0));
      saveLeads(merged);
      return res.status(200).json({ ok: true, leads: merged });
    }

    return res.status(400).json({ ok: false, error: 'Hành động không hợp lệ' });
  }

  // ================= 6. UPDATE LEAD (PATCH) =================
  if (method === 'PATCH') {
    const { id, status, note } = body;
    if (!id) return res.status(400).json({ ok: false, error: 'Thiếu ID khách.' });

    const leads = readLeads();
    const idx = leads.findIndex(l => String(l.id) === String(id));
    if (idx >= 0) {
      if (status !== undefined) leads[idx].status = status;
      if (note !== undefined) leads[idx].note = note;
      saveLeads(leads);
      return res.status(200).json({ ok: true, lead: leads[idx] });
    }
    return res.status(404).json({ ok: false, error: 'Không tìm thấy khách đăng ký.' });
  }

  // ================= 7. DELETE LEAD =================
  if (method === 'DELETE') {
    const id = req.query.id || body.id;
    if (!id) return res.status(400).json({ ok: false, error: 'Thiếu ID khách để xóa.' });

    let leads = readLeads().filter(l => String(l.id) !== String(id));
    saveLeads(leads);
    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}
