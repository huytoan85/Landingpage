const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Duyanh1401';

let memoryLeads = global._memoryLeads || [];

export default function handler(req, res) {
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

  const csvContent = '\uFEFF' + [headers.join(','), ...rows].join('\r\n');

  res.setHeader('Content-Type', 'text/csv; charset=utf-8');
  res.setHeader('Content-Disposition', 'attachment; filename="danh-sach-dang-ky-business-meeting-2026.csv"');
  return res.status(200).send(csvContent);
}
