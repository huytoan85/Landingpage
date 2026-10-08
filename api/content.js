import fs from 'fs';
import path from 'path';

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'Duyanh1401';
const CONTENT_FILE = path.join(process.cwd(), 'data', 'content.json');

const DEFAULT_CONTENT = {
  hero: {
    pill: "Dành cho người mới bắt đầu",
    title: "AI Không Khó!",
    theme: "Học dễ hiểu – Làm được ngay – Ứng dụng thực tế",
    lead: "Đồng hành cùng bạn làm chủ ChatGPT/Gemini và các công cụ AI để sáng tạo nội dung, hình ảnh, video, xây dựng thương hiệu cá nhân và phát triển kinh doanh.",
    cta_btn: "Khám phá khóa học"
  },
  gift: {
    badge: "QUÀ TẶNG",
    title: "Tặng bạn 100 mã code tạo ảnh/video siêu đẹp miễn phí",
    desc: "Quét mã QR vào nhóm Zalo — link tải 100 mã code sẽ hiện ngay sau khi bạn vào nhóm. Muốn đi xa hơn? Bộ 2000 mã code và các quyền lợi đồng hành đang chờ ở bên dưới.",
    cta_btn: "NHẬN QUÀ",
    zalo_link: "https://mjp2c90dzeo7.jp.larksuite.com/wiki/K8aWwxLGfiY74JkmdOej0TIupDe?from=from_copylink"
  },
  brand: {
    title: "AI Thực Chiến",
    subtitle: "CÙNG TOÀN LÊ"
  },
  contact: {
    hotline: "0933.750.577",
    zalo: "https://zalo.me/0933750577",
    facebook: "https://facebook.com",
    youtube: "https://youtube.com"
  },
  event: {
    name: "AI Thực Chiến Cùng Toàn Lê",
    date: "Thứ Bảy, 10/10/2026",
    time: "08:00 – 17:30",
    venue: "Khách sạn Athena Hotel, 280 Tô Hiến Thành, Phường 15, Quận 10, TP. Hồ Chí Minh"
  },
  speaker: {
    name: "Lê Huy Toàn",
    role: "CHUYÊN GIA AI THỰC CHIẾN | GIẢNG VIÊN ĐÀO TẠO ỨNG DỤNG AI TRONG CÔNG VIỆC VÀ KINH DOANH",
    headline: "✨ AI không khó – Quan trọng là học đúng cách!",
    bio: "Xin chào! Tôi là Lê Huy Toàn, người đồng hành cùng bạn trên hành trình khám phá và làm chủ trí tuệ nhân tạo (AI).\n\nVới hơn 18 năm kinh nghiệm trong kinh doanh, quản lý và phát triển thị trường, cùng hơn 5 năm kinh nghiệm đào tạo và phát triển đội ngũ, tôi hiểu rằng công nghệ chỉ thực sự có giá trị khi giúp chúng ta giải quyết được những vấn đề trong công việc và cuộc sống.\n\nTừng đảm nhiệm các vị trí quản lý cấp cao trong lĩnh vực Ngân hàng, Bảo hiểm và phát triển hệ thống kinh doanh, tôi có cơ hội trực tiếp đào tạo, huấn luyện và đồng hành cùng nhiều đội ngũ bán hàng.\n\nNgày hôm nay, tôi lựa chọn chia sẻ kiến thức và kinh nghiệm của mình thông qua chương trình “AI Thực Chiến Cùng Toàn Lê”, với mong muốn giúp mọi người tiếp cận AI một cách đơn giản, thực tế và hiệu quả.",
    learnings: "Ứng dụng ChatGPT và các công cụ AI vào công việc hằng ngày.\nTạo hình ảnh, video và nội dung bằng AI phục vụ kinh doanh, marketing.\nXây dựng thương hiệu cá nhân trên Facebook, TikTok và YouTube.\nỨng dụng AI vào bán hàng, sáng tạo nội dung và chăm sóc khách hàng.\nTối ưu thời gian làm việc, nâng cao năng suất và phát triển kỹ năng số.",
    method_banner: "⚡ Không lý thuyết dài dòng – Không cần giỏi công nghệ – Học đến đâu, thực hành đến đó.",
    method_desc: "Tôi luôn hướng đến việc biến những công cụ AI tưởng chừng phức tạp thành những kỹ năng đơn giản mà bất kỳ ai cũng có thể tiếp cận, kể cả người chưa từng sử dụng AI.",
    quote: "“Tôi không chỉ muốn bạn biết AI là gì. Tôi muốn bạn tự tin sử dụng AI để làm việc tốt hơn, sáng tạo hơn và tạo ra những giá trị thực tế.”",
    slogan: "🚀 TOÀN LÊ – ĐỒNG HÀNH CÙNG BẠN LÀM CHỦ AI!"
  },
  banking: {
    bank_name: "Vietcombank - Ngân hàng TMCP Ngoại Thương Việt Nam",
    account_number: "9917722256",
    account_holder: "LÊ HUY TOÀN"
  },
  tickets: {
    standard_price: "339.000đ",
    vip_price: "699.000đ",
    supervip_price: "1.299.000đ"
  },
  pillars: {
    col1_lbl: "Đồng Hành Cùng Toàn Lê",
    col1_title: "Chuyên Gia AI Thực Chiến",
    col1_desc1: "Công nghệ đang thay đổi cách chúng ta làm việc, kinh doanh và kết nối. Điều quan trọng là biết lựa chọn những công cụ và cơ hội phù hợp để phát triển năng lực, xây dựng cộng đồng và tạo thêm giá trị.",
    col1_callout: "Bạn muốn dùng AI để viết nội dung, tạo hình ảnh, lên kịch bản video hoặc hỗ trợ công việc, nhưng chưa biết bắt đầu từ đâu?",
    col1_desc2: "Khóa học giúp bạn tiếp cận AI bằng những tình huống quen thuộc, hướng dẫn dễ hiểu và bài tập thực hành trên chính thiết bị của mình. Mỗi phần học gắn với một việc cụ thể để bạn từng bước tự tin sử dụng công nghệ.",
    col2_lbl: "Chương Trình Đào Tạo Thực Chiến",
    col2_title: "Nội Dung Bài Giảng",
    col2_lessons: "Hiểu AI và sử dụng đúng cách: Nhận biết khả năng, giới hạn của AI và cách kiểm tra kết quả trước khi sử dụng.\nViết câu lệnh rõ ràng: Thực hành giao nhiệm vụ cho AI bằng mục tiêu, thông tin đầu vào và yêu cầu đầu ra cụ thể.\nSáng tạo nội dung phục vụ công việc: Ứng dụng AI để viết bài đăng, nội dung giới thiệu sản phẩm và kịch bản video ngắn.\nThực hành tạo hình ảnh: Học cách mô tả chủ thể, bối cảnh, phong cách và bố cục để tạo hình ảnh phù hợp với mục đích sử dụng.\nXây dựng kế hoạch ứng dụng cá nhân: Chọn một công việc đang làm để thử áp dụng AI sau khóa học.\nĐặc quyền đào tạo: Học 1:1 cùng Toàn đến khi thành thạo AI."
  }
};

let memoryContent = global._memoryContent || DEFAULT_CONTENT;
global._memoryContent = memoryContent;

function getContent() {
  try {
    if (fs.existsSync(CONTENT_FILE)) {
      const raw = fs.readFileSync(CONTENT_FILE, 'utf8');
      return JSON.parse(raw);
    }
  } catch (e) {
    console.error('Error reading content file:', e);
  }
  return global._memoryContent || DEFAULT_CONTENT;
}

export default function handler(req, res) {
  if (req.method === 'GET') {
    return res.status(200).json({ ok: true, content: getContent() });
  }

  if (req.method === 'POST') {
    const pw = req.headers['x-admin-password'] || req.body.password;
    if (!pw || pw !== ADMIN_PASSWORD) {
      return res.status(401).json({ ok: false, error: 'Mật khẩu quản trị không chính xác.' });
    }

    const newContent = req.body.content || req.body;
    if (!newContent || typeof newContent !== 'object') {
      return res.status(400).json({ ok: false, error: 'Dữ liệu không hợp lệ.' });
    }

    // Merge with current content
    const merged = { ...getContent(), ...newContent };
    global._memoryContent = merged;

    try {
      fs.mkdirSync(path.dirname(CONTENT_FILE), { recursive: true });
      fs.writeFileSync(CONTENT_FILE, JSON.stringify(merged, null, 2), 'utf8');
    } catch (e) {
      console.warn('Could not persist to file system (read-only environment):', e);
    }

    return res.status(200).json({ ok: true, content: merged });
  }

  return res.status(405).json({ ok: false, error: 'Method Not Allowed' });
}
