const express = require('express');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Duyanh1401';

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Path to data files
const DATA_FILE = path.join(__dirname, 'data', 'leads.json');
const CONTENT_FILE = path.join(__dirname, 'data', 'content.json');

// Helper to ensure data file exists
function readLeads() {
  try {
    if (!fs.existsSync(DATA_FILE)) {
      fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
      fs.writeFileSync(DATA_FILE, '[]', 'utf8');
      return [];
    }
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data || '[]');
  } catch (err) {
    console.error('Error reading leads:', err);
    return [];
  }
}

function writeLeads(leads) {
  try {
    fs.mkdirSync(path.dirname(DATA_FILE), { recursive: true });
    fs.writeFileSync(DATA_FILE, JSON.stringify(leads, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing leads:', err);
    return false;
  }
}

function readContent() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const data = fs.readFileSync(CONTENT_FILE, 'utf8');
      return JSON.parse(data || '{}');
    }
  } catch (err) {
    console.error('Error reading content:', err);
  }
  return {};
}

function writeContent(content) {
  try {
    fs.mkdirSync(path.dirname(CONTENT_FILE), { recursive: true });
    fs.writeFileSync(CONTENT_FILE, JSON.stringify(content, null, 2), 'utf8');
    return true;
  } catch (err) {
    console.error('Error writing content:', err);
    return false;
  }
}

// Check admin auth helper
function checkAdminAuth(req, res, next) {
  const pw = req.headers['x-admin-password'] || req.query.pw;
  if (!pw || pw !== ADMIN_PASSWORD) {
    return res.status(401).json({
      ok: false,
      error: 'Mật khẩu quản trị không chính xác hoặc đã hết hạn.'
    });
  }
  next();
}

// 1. API: Register Lead
app.post('/api/register', (req, res) => {
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
      consent,
      website,
      utm_source,
      utm_medium,
      utm_campaign
    } = req.body;

    // Anti-spam honeypot
    if (website) {
      return res.status(400).json({ ok: false, error: 'Spam detected.' });
    }

    if (!full_name || !phone) {
      return res.status(400).json({ ok: false, error: 'Vui lòng nhập đầy đủ họ tên và số điện thoại.' });
    }

    const leads = readLeads();
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

    leads.unshift(newLead);
    writeLeads(leads);

    res.json({ ok: true, lead: newLead });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ ok: false, error: 'Lỗi hệ thống khi lưu đăng ký.' });
  }
});

// 2. API: Get Leads (Admin)
app.get('/api/leads', checkAdminAuth, (req, res) => {
  const leads = readLeads();
  res.json({ ok: true, leads });
});

// 3. API: Update Lead (Admin)
app.patch('/api/leads', checkAdminAuth, (req, res) => {
  try {
    const { id, status, note } = req.body;
    if (!id) return res.status(400).json({ ok: false, error: 'Thiếu ID khách.' });

    const leads = readLeads();
    const idx = leads.findIndex(l => l.id === id);
    if (idx === -1) {
      return res.status(404).json({ ok: false, error: 'Không tìm thấy khách đăng ký.' });
    }

    if (status !== undefined) leads[idx].status = status;
    if (note !== undefined) leads[idx].note = note;

    writeLeads(leads);
    res.json({ ok: true, lead: leads[idx] });
  } catch (err) {
    console.error('Update lead error:', err);
    res.status(500).json({ ok: false, error: 'Lỗi cập nhật khách.' });
  }
});

// 4. API: Delete Lead (Admin)
app.delete('/api/leads/:id', checkAdminAuth, (req, res) => {
  try {
    const { id } = req.params;
    let leads = readLeads();
    leads = leads.filter(l => l.id !== id);
    writeLeads(leads);
    res.json({ ok: true });
  } catch (err) {
    console.error('Delete lead error:', err);
    res.status(500).json({ ok: false, error: 'Lỗi xóa khách.' });
  }
});

// 5. API: Sync Deleted (Admin)
app.post('/api/leads/sync-deleted', checkAdminAuth, (req, res) => {
  try {
    const { ids } = req.body;
    if (Array.isArray(ids) && ids.length > 0) {
      const deleteSet = new Set(ids.map(String));
      let leads = readLeads();
      leads = leads.filter(l => !deleteSet.has(String(l.id)));
      writeLeads(leads);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Sync deleted error:', err);
    res.status(500).json({ ok: false, error: 'Lỗi đồng bộ xóa.' });
  }
});

// 6. API: Sync All (Admin)
app.post('/api/leads/sync-all', checkAdminAuth, (req, res) => {
  try {
    const { leads: clientLeads } = req.body;
    if (Array.isArray(clientLeads)) {
      const currentLeads = readLeads();
      const map = new Map();
      currentLeads.forEach(l => map.set(l.id, l));
      clientLeads.forEach(l => {
        if (!map.has(l.id)) {
          map.set(l.id, l);
        }
      });
      const merged = Array.from(map.values());
      merged.sort((a, b) => new Date(b.received_at || 0) - new Date(a.received_at || 0));
      writeLeads(merged);
    }
    res.json({ ok: true });
  } catch (err) {
    console.error('Sync all error:', err);
    res.status(500).json({ ok: false, error: 'Lỗi đồng bộ dữ liệu.' });
  }
});

// 7. API: Export Excel / CSV
app.get('/api/export-csv', (req, res) => {
  const pw = req.query.pw;
  if (!pw || pw !== ADMIN_PASSWORD) {
    return res.status(401).send('Mật khẩu quản trị không hợp lệ.');
  }

  const TICKET_MAP = {
    MODUL_WORK: 'Modul 1: AI For Work',
    MODUL_MEDIA: 'Modul 2: AI For Media',
    COMBO_2_MODUL: 'Combo 2 Modul (Work + Media)',
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
    'Hạng Vé',
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

  // UTF-8 BOM so Excel opens Vietnamese characters cleanly
  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="danh-sach-dang-ky-business-meeting-2026.csv"');
  res.send(csvContent);
});

// 8. API: Get Content (CMS)
app.get('/api/content', (req, res) => {
  const content = readContent();
  res.json({ ok: true, content });
});

// 9. API: Update Content (CMS Admin)
app.post('/api/content', checkAdminAuth, (req, res) => {
  try {
    const { content } = req.body;
    if (!content || typeof content !== 'object') {
      return res.status(400).json({ ok: false, error: 'Dữ liệu nội dung không hợp lệ.' });
    }
    const current = readContent();
    const merged = { ...current, ...content };
    writeContent(merged);
    res.json({ ok: true, content: merged });
  } catch (err) {
    console.error('Update content error:', err);
    res.status(500).json({ ok: false, error: 'Lỗi lưu nội dung website.' });
  }
});

// Static assets (images)
app.use('/images', express.static(path.join(__dirname, 'images')));

// Pretty page routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/thiep-moi', (req, res) => {
  res.sendFile(path.join(__dirname, 'thiep-moi.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Also serve static files in root if requested directly
app.use(express.static(__dirname));

// Fallback to index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(PORT, () => {
  console.log(`====================================================`);
  console.log(`🚀 OHANA BUSINESS MEETING 2026 SERVER IS RUNNING`);
  console.log(`🌐 Trang chủ:        http://localhost:${PORT}`);
  console.log(`🎫 Tạo thiệp VIP:   http://localhost:${PORT}/thiep-moi`);
  console.log(`📊 Quản trị CRM:    http://localhost:${PORT}/admin`);
  console.log(`🔑 Mật khẩu CRM:    ${ADMIN_PASSWORD}`);
  console.log(`====================================================`);
});
