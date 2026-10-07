export type Language = 'vi' | 'en';

export interface Translations {
  [key: string]: {
    vi: string;
    en: string;
  };
}

export const TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  // Brand & Slogan
  'brand.name': {
    vi: 'Việt Phục Ký',
    en: 'Việt Phục Ký',
  },
  'brand.slogan': {
    vi: 'Ngàn Năm Di Sản · Khởi Sắc Đương Đại',
    en: 'Thousand Years of Heritage · Blossoming in Modern Times',
  },
  'brand.subtitle': {
    vi: 'Cổ Phục & Đương Đại',
    en: 'Heritage & Modernity',
  },

  // Navigation
  'nav.home': {
    vi: 'Màn hình chính',
    en: 'Main Gate',
  },
  'nav.resonance': {
    vi: 'Bối Cảnh',
    en: 'Context & Season',
  },
  'nav.sanctuary': {
    vi: 'Phục Trang',
    en: 'Việt Phục Wardrobe',
  },
  'nav.museum': {
    vi: 'Bảo Tàng Số',
    en: 'Digital Museum',
  },
  'nav.atelier': {
    vi: 'Tùy Biến',
    en: 'Design Atelier',
  },
  'nav.oracle': {
    vi: 'Kiểm Duyệt Văn Hóa',
    en: 'AI Cultural Guardian',
  },
  'nav.tryon': {
    vi: 'Thử Đồ Ảo',
    en: 'Virtual Try-On',
  },
  'nav.forum': {
    vi: 'Diễn Đàn',
    en: 'Community Forum',
  },
  'nav.chronicle': {
    vi: 'Lookbook',
    en: 'Lookbook Chronicle',
  },
  'nav.tailor': {
    vi: 'Đặt May',
    en: 'Artisan Tailors',
  },
  'nav.profile': {
    vi: 'Tài khoản & Hồ sơ',
    en: 'Profile & Scholar Pass',
  },
  'nav.about': {
    vi: 'Giới Thiệu',
    en: 'About Project',
  },
  'nav.logout': {
    vi: 'Đăng xuất',
    en: 'Sign Out',
  },

  // Common UI Buttons & Actions
  'btn.continue': {
    vi: 'Tiếp Tục',
    en: 'Continue',
  },
  'btn.back': {
    vi: 'Quay Lại',
    en: 'Back',
  },
  'btn.explore': {
    vi: 'Khám Phá Ngay',
    en: 'Explore Now',
  },
  'btn.begin_journey': {
    vi: 'Bắt Đầu Hành Trình',
    en: 'Begin Journey',
  },
  'btn.save': {
    vi: 'Lưu Lại',
    en: 'Save',
  },
  'btn.save_lookbook': {
    vi: 'Lưu vào Lookbook',
    en: 'Save to Lookbook',
  },
  'btn.share': {
    vi: 'Chia Sẻ',
    en: 'Share',
  },
  'btn.download': {
    vi: 'Tải Xuống',
    en: 'Download Image',
  },
  'btn.customize': {
    vi: 'Tùy Biến Thêm',
    en: 'Customize Further',
  },
  'btn.try_on': {
    vi: 'Thử Đồ Ảo',
    en: 'Virtual Try-On',
  },
  'btn.ai_review': {
    vi: 'Gửi AI Duyệt Văn Hóa',
    en: 'Submit for Cultural AI Review',
  },
  'btn.close': {
    vi: 'Đóng',
    en: 'Close',
  },
  'btn.cancel': {
    vi: 'Hủy',
    en: 'Cancel',
  },
  'btn.confirm': {
    vi: 'Xác Nhận',
    en: 'Confirm',
  },
  'btn.select': {
    vi: 'Chọn',
    en: 'Select',
  },
  'btn.selected': {
    vi: 'Đã Chọn',
    en: 'Selected',
  },
  'btn.apply': {
    vi: 'Áp Dụng',
    en: 'Apply',
  },
  'btn.reset': {
    vi: 'Đặt Lại',
    en: 'Reset Defaults',
  },
  'btn.upload_photo': {
    vi: 'Tải Ảnh Lên',
    en: 'Upload Photo',
  },
  'btn.generate': {
    vi: 'Bắt Đầu Tạo',
    en: 'Start Generation',
  },
  'btn.save_changes': {
    vi: 'Lưu Thay Đổi',
    en: 'Save Changes',
  },
  'btn.edit': {
    vi: 'Chỉnh Sửa',
    en: 'Edit',
  },
  'btn.delete': {
    vi: 'Xóa',
    en: 'Delete',
  },

  // Soundscape
  'sound.title': {
    vi: 'Nhã Nhạc Cung Đình & Âm Cảnh Cổ Phong',
    en: 'Traditional Vietnamese Ambient Soundscape',
  },
  'sound.subtitle': {
    vi: 'Đàn Tranh, Đàn Bầu, Sáo Trúc & Thiên Nhiên Hoàng Cung',
    en: 'Đàn Tranh, Đàn Bầu, Bamboo Flute & Imperial Courtyard',
  },
  'sound.play': {
    vi: 'Phát nhạc',
    en: 'Play Soundscape',
  },
  'sound.pause': {
    vi: 'Tạm dừng',
    en: 'Pause Soundscape',
  },
  'sound.mute': {
    vi: 'Tắt tiếng',
    en: 'Mute Audio',
  },
  'sound.unmute': {
    vi: 'Bật tiếng',
    en: 'Unmute Audio',
  },
  'sound.volume': {
    vi: 'Âm lượng tổng',
    en: 'Master Volume',
  },
  'sound.track': {
    vi: 'Khúc Nhạc Cổ',
    en: 'Instrumental Melody',
  },
  'sound.atmosphere': {
    vi: 'Hòa Âm Bối Cảnh',
    en: 'Atmospheric Layers',
  },
  'sound.wind': {
    vi: 'Gió Thoảng Hoàng Thành',
    en: 'Imperial Palace Breeze',
  },
  'sound.birds': {
    vi: 'Tiếng Chim Hót Sương Mai',
    en: 'Morning Courtyard Birds',
  },
  'sound.stream': {
    vi: 'Suối Reo Thôn Dã',
    en: 'Flowing Mountain Stream',
  },
  'sound.chimes': {
    vi: 'Chuông Gió Trúc & Chuông Khánh',
    en: 'Bamboo Wind Chimes & Imperial Bell',
  },
  'sound.tip': {
    vi: 'Âm nhạc truyền thống phát liên tục không ngắt quãng giữa các không gian',
    en: 'Traditional music plays seamlessly across all realms',
  },

  // Login Realm
  'login.welcome': {
    vi: 'Chào Mừng Đến Với',
    en: 'Welcome to',
  },
  'login.tagline': {
    vi: 'Khởi hành hành trình thẩm mỹ di sản ngàn năm',
    en: 'Embark on a journey through thousand-year aesthetic heritage',
  },
  'login.quick_enter': {
    vi: 'Trải nghiệm nhanh với tư cách Lữ Khách',
    en: 'Quick Guest Experience as Visiting Scholar',
  },
  'login.username_label': {
    vi: 'Danh xưng / Tên của bạn',
    en: 'Your Name or Scholar Title',
  },
  'login.username_placeholder': {
    vi: 'Ví dụ: Hoàng Mai, Minh Triết...',
    en: 'e.g., Hoàng Mai, Minh Triết...',
  },
  'login.password_label': {
    vi: 'Mật mã triều môn',
    en: 'Gate Passcode',
  },
  'login.submit_btn': {
    vi: 'Đăng nhập hành trình',
    en: 'Enter Heritage Realm',
  },
  'login.or': {
    vi: 'hoặc',
    en: 'or',
  },
  'login.security_guarantee': {
    vi: 'Bảo chứng chuẩn mực văn hóa Đại Việt',
    en: 'Authenticated with Đại Việt cultural standards',
  },

  // Gate Realm
  'gate.title': {
    vi: 'Bước vào thế giới Việt Phục',
    en: 'Enter the Realm of Việt Phục',
  },
  'gate.subtitle': {
    vi: 'Khám phá, phối và cách tân trang phục truyền thống theo hơi thở Gen Z',
    en: 'Discover, coordinate, and modernize authentic Việt Phục for Gen Z',
  },
  'gate.cta': {
    vi: 'Khám phá Việt Phục',
    en: 'Explore Việt Phục',
  },
  'gate.footer': {
    vi: 'Việt Phục Ký · Dự án văn hóa di sản đương đại 2026',
    en: 'Việt Phục Ký · Contemporary Vietnamese Heritage Project 2026',
  },

  // Home Realm
  'home.heading': {
    vi: 'Chọn hành trình khám phá và sáng tạo Việt Phục',
    en: 'Choose your journey of discovery and creativity in Việt Phục',
  },
  'home.item.resonance.title': {
    vi: 'Gợi Ý Bối Cảnh',
    en: 'Context & Occasion',
  },
  'home.item.resonance.desc': {
    vi: 'Chọn bối cảnh, sự kiện & nhận gợi ý phù hợp',
    en: 'Select event, season & get curated attire recommendations',
  },
  'home.item.sanctuary.title': {
    vi: 'Kho Phục Trang',
    en: 'Việt Phục Wardrobe',
  },
  'home.item.sanctuary.desc': {
    vi: 'Khám phá 9 bộ Việt Phục chuẩn mực di sản',
    en: 'Explore 9 historically authentic Việt Phục styles',
  },
  'home.item.atelier.title': {
    vi: 'Tùy Biến Thiết Kế',
    en: 'Design Atelier',
  },
  'home.item.atelier.desc': {
    vi: 'Phối màu truyền thống, hoa văn & phụ kiện Gen Z',
    en: 'Customize textiles, heritage palettes & Gen Z accents',
  },
  'home.item.oracle.title': {
    vi: 'AI Duyệt Văn Hóa',
    en: 'AI Cultural Guardian',
  },
  'home.item.oracle.desc': {
    vi: 'Chấm điểm điển chế, đánh giá & góp ý chuẩn xác',
    en: 'Heritage accuracy scoring, cultural analysis & guidance',
  },
  'home.item.tryon.title': {
    vi: 'Thử Đồ Ảo AI',
    en: 'AI Virtual Try-On',
  },
  'home.item.tryon.desc': {
    vi: 'Ướm Việt Phục lên chân dung thực tế sắc nét',
    en: 'Fit customized Việt Phục seamlessly onto your portrait',
  },
  'home.item.forum.title': {
    vi: 'Diễn Đàn Gen Z',
    en: 'Gen Z Community',
  },
  'home.item.forum.desc': {
    vi: 'Cộng đồng chia sẻ và giao lưu bản phối',
    en: 'Share styling looks, discuss culture and get feedback',
  },
  'home.item.chronicle.title': {
    vi: 'Lookbook',
    en: 'Lookbook Chronicle',
  },
  'home.item.chronicle.desc': {
    vi: 'Bộ sưu tập trang phục và diện mạo đã lưu',
    en: 'Archived creations, snapshots and saved styling cards',
  },
  'home.item.tailor.title': {
    vi: 'Đặt May Nghệ Nhân',
    en: 'Artisan Tailors',
  },
  'home.item.tailor.desc': {
    vi: 'Kết nối nhà may & thợ thủ công cổ phục uy tín',
    en: 'Connect with master craftsmen & renowned tailoring houses',
  },
  'home.item.profile.title': {
    vi: 'Hồ Sơ Cá Nhân',
    en: 'Scholar Profile',
  },
  'home.item.profile.desc': {
    vi: 'Quản lý tài khoản, tủ đồ và phong cách',
    en: 'Manage your scholar pass, saved outfits & preferences',
  },
  'home.item.about.title': {
    vi: 'Giới Thiệu Di Sản',
    en: 'About Project',
  },
  'home.item.about.desc': {
    vi: 'Ý nghĩa văn hóa & sứ mệnh dự án Việt Phục',
    en: 'Cultural mission & legacy of the Việt Phục initiative',
  },

  // Resonance Realm (Bối Cảnh)
  'resonance.badge': {
    vi: 'Cộng Hưởng Bối Cảnh',
    en: 'Context Resonance',
  },
  'resonance.heading': {
    vi: 'Chọn Không Gian & Dịp Mặc',
    en: 'Select Atmosphere & Occasion',
  },
  'resonance.subheading': {
    vi: 'Chọn mùa, khu vực và sự kiện để nhận gợi ý Việt Phục phù hợp nhất',
    en: 'Select season, cultural region, and event for curated Việt Phục recommendations',
  },
  'resonance.step1': {
    vi: '1. Mùa',
    en: '1. Season',
  },
  'resonance.step2': {
    vi: '2. Khu vực',
    en: '2. Cultural Region',
  },
  'resonance.step3': {
    vi: '3. Sự kiện',
    en: '3. Occasion / Event',
  },
  'resonance.cta': {
    vi: 'Khám phá trang phục tương hợp',
    en: 'Discover Recommended Attire',
  },

  // Costumes Realm
  'costumes.badge': {
    vi: 'Kho Phục Trang Cổ Truyền',
    en: 'Heritage Attire Archive',
  },
  'costumes.heading': {
    vi: 'Tuyển Tập 9 Bộ Việt Phục Chuẩn Mực',
    en: 'Treasury of 9 Authentic Việt Phục Styles',
  },
  'costumes.subheading': {
    vi: 'Định hình chuẩn mực phục dựng theo tư liệu lịch sử Đại Việt và triều Nguyễn',
    en: 'Faithfully reconstructed following historical records of Đại Việt and the Nguyễn Dynasty',
  },
  'costumes.tab.recommended': {
    vi: 'Gợi Ý Phù Hợp Bối Cảnh',
    en: 'Recommended for Your Context',
  },
  'costumes.tab.all': {
    vi: 'Tất Cả 9 Bộ Phục Trang',
    en: 'All 9 Attire Collections',
  },
  'costumes.detail.origin': {
    vi: 'Nguồn gốc & Lịch sử hình thành:',
    en: 'Heritage & Historical Origins:',
  },
  'costumes.detail.features': {
    vi: 'Đặc trưng thiết kế & Cắt may:',
    en: 'Tailoring & Design Features:',
  },
  'costumes.detail.meaning': {
    vi: 'Ý nghĩa văn hóa & Triết lý:',
    en: 'Cultural Significance & Philosophy:',
  },
  'costumes.detail.colors': {
    vi: 'Màu sắc chủ đạo:',
    en: 'Traditional Color Palette:',
  },
  'costumes.detail.occasions': {
    vi: 'Dịp mặc phù hợp:',
    en: 'Suitable Occasions:',
  },
  'costumes.detail.cultural_note': {
    vi: 'Ghi chú văn hóa & Điển chế:',
    en: 'Cultural Code & Etiquette:',
  },
  'costumes.btn.customize_now': {
    vi: 'Tùy Biến Thiết Kế Bộ Này',
    en: 'Customize This Outfit',
  },

  // Atelier Realm (Xưởng Tùy Biến)
  'atelier.badge': {
    vi: 'Xưởng Tùy Biến Cổ Phục',
    en: 'Heritage Tailoring Atelier',
  },
  'atelier.title': {
    vi: 'Xưởng Thiết Kế & Phối Sắc Việt Phục',
    en: 'Việt Phục Styling & Custom Atelier',
  },
  'atelier.subtitle': {
    vi: 'Tự do chọn chất liệu dệt cổ truyền, phối hòa sắc ngũ hành và thêm phụ kiện Gen Z',
    en: 'Freely select heritage textiles, blend five-element colors, and style modern Gen Z accents',
  },
  'atelier.gender.female': {
    vi: 'Nữ Thục',
    en: 'Feminine',
  },
  'atelier.gender.male': {
    vi: 'Nam Nhân',
    en: 'Masculine',
  },
  'atelier.tab.colors': {
    vi: 'Chất Liệu Vải & Phối Màu',
    en: 'Textiles & Color Harmony',
  },
  'atelier.tab.accessories': {
    vi: 'Phụ Kiện Gen Z',
    en: 'Gen Z Accessories',
  },
  'atelier.part.primary': {
    vi: 'Thân Áo Ngoài',
    en: 'Outer Robe',
  },
  'atelier.part.inner': {
    vi: 'Viền Cổ / Yếm',
    en: 'Inner Collar / Yếm',
  },
  'atelier.part.sash': {
    vi: 'Thắt Lưng Đai',
    en: 'Waist Sash',
  },
  'atelier.part.bottom': {
    vi: 'Quần / Váy',
    en: 'Trousers / Skirt',
  },
  'atelier.apply.part': {
    vi: 'Áp dụng cho vị trí đang chọn',
    en: 'Apply to Selected Part',
  },
  'atelier.apply.full': {
    vi: 'Áp dụng phối màu chuẩn nguyên bộ',
    en: 'Apply Complete Palette Preset',
  },
  'atelier.btn.anime_star': {
    vi: 'Phác Họa 2D Anime',
    en: 'Render 2D Anime Star',
  },
  'atelier.btn.ai_review': {
    vi: 'Gửi Hội Đồng AI Duyệt Điển Chế',
    en: 'Submit for Cultural AI Review',
  },
  'atelier.btn.direct_tryon': {
    vi: 'Ướm Thử Đồ Ảo',
    en: 'Proceed to Virtual Try-On',
  },

  // Oracle Realm (Kiểm Duyệt Văn Hóa)
  'oracle.badge': {
    vi: 'Hội Đồng Thẩm Định Văn Hóa AI',
    en: 'AI Cultural Guardian Review',
  },
  'oracle.heading': {
    vi: 'Kết Quả Thẩm Định Chuẩn Mực Di Sản',
    en: 'Heritage Authenticity Evaluation',
  },
  'oracle.score_title': {
    vi: 'Điểm Chuẩn Mực Điển Chế',
    en: 'Cultural Authenticity Score',
  },
  'oracle.analysis_title': {
    vi: 'Phân Tích Chi Tiết Của AI Cố Vấn Văn Hóa',
    en: 'Cultural Advisor Detailed Analysis',
  },
  'oracle.advice_title': {
    vi: 'Gợi Ý Tinh Chỉnh & Hoàn Thiện',
    en: 'Recommendations & Cultural Advice',
  },
  'oracle.btn.edit_design': {
    vi: 'Chỉnh Sửa Thiết Kế',
    en: 'Edit Design',
  },
  'oracle.btn.proceed_tryon': {
    vi: 'Tiến Hành Thử Đồ Ảo',
    en: 'Proceed to Virtual Try-On',
  },

  // Virtual Try-On Realm
  'tryon.badge': {
    vi: 'Phòng Thử Đồ Ảo AI',
    en: 'AI Virtual Try-On Studio',
  },
  'tryon.heading': {
    vi: 'Ướm Thử Việt Phục Lên Chân Dung',
    en: 'Fit Authentic Việt Phục on Your Portrait',
  },
  'tryon.step1.title': {
    vi: '1. Ảnh chân dung của bạn:',
    en: '1. Your Portrait Photo:',
  },
  'tryon.step1.upload_btn': {
    vi: 'Tải ảnh từ máy',
    en: 'Upload Photo',
  },
  'tryon.step1.change_btn': {
    vi: 'Thay ảnh chân dung',
    en: 'Change Portrait',
  },
  'tryon.step1.preset_hint': {
    vi: 'Hoặc chọn người mẫu mẫu thử nghiệm:',
    en: 'Or choose a preset East Asian model:',
  },
  'tryon.step2.title': {
    vi: '2. Chọn trang phục để ướm thử:',
    en: '2. Choose Attire to Fit:',
  },
  'tryon.step2.custom_option': {
    vi: 'Bản thiết kế tùy biến riêng từ Xưởng',
    en: 'Customized Design from Atelier',
  },
  'tryon.step2.catalog_hint': {
    vi: 'Hoặc chọn trực tiếp 1 trong 9 bộ cổ phục chuẩn:',
    en: 'Or pick directly from 9 authentic collections:',
  },
  'tryon.generate_btn': {
    vi: 'Bắt Đầu Hóa Thân Việt Phục Bằng AI',
    en: 'Generate AI Traditional Portrait',
  },
  'tryon.view_after': {
    vi: 'Sau khi ướm đồ',
    en: 'With Việt Phục',
  },
  'tryon.view_before': {
    vi: 'Chân dung gốc',
    en: 'Original Portrait',
  },

  // Tailor Realm
  'tailor.badge': {
    vi: 'Mạng Lưới Nghệ Nhân Cổ Phục',
    en: 'Artisan Tailors & Guilds',
  },
  'tailor.heading': {
    vi: 'Đặt May Đo Nghệ Nhân & Nhà May Cổ Phục Uy Tín',
    en: 'Bespoke Craftsmanship & Renowned Tailoring Houses',
  },
  'tailor.subheading': {
    vi: 'Kết nối với các nhà may truyền thống uy tín tại Hà Nội, Huế, TP. Hồ Chí Minh',
    en: 'Connect with esteemed traditional tailors across Hanoi, Huế, and Ho Chi Minh City',
  },
  'tailor.btn.contact': {
    vi: 'Liên hệ tư vấn may',
    en: 'Contact Tailor',
  },
  'tailor.btn.send_spec': {
    vi: 'Gửi bản thiết kế may đo',
    en: 'Send Design Spec',
  },

  // Chronicle / Lookbook
  'chronicle.badge': {
    vi: 'Bộ Sưu Tập Ký Sự',
    en: 'Lookbook Chronicle',
  },
  'chronicle.heading': {
    vi: 'Lookbook & Nhật Ký Phối Đồ Việt Phục',
    en: 'Lookbook & Styling Chronicle',
  },
  'chronicle.btn.new_album': {
    vi: 'Tạo Album Mới',
    en: 'Create New Album',
  },
  'chronicle.btn.quick_tryon': {
    vi: 'Thử Đồ Nhanh',
    en: 'Quick Try-On',
  },
  'chronicle.empty_title': {
    vi: 'Chưa có tác phẩm nào trong album này',
    en: 'No creations saved in this album yet',
  },
  'chronicle.empty_desc': {
    vi: 'Hãy tùy biến trang phục hoặc thử đồ ảo AI để lưu lại những khoảnh khắc tuyệt đẹp!',
    en: 'Customize an attire in Atelier or generate virtual try-ons to save your looks!',
  },

  // Community Forum
  'forum.badge': {
    vi: 'Diễn Đàn Cộng Đồng Gen Z',
    en: 'Gen Z Heritage Community',
  },
  'forum.heading': {
    vi: 'Giao Lưu, Chia Sẻ & Bình Phẩm Việt Phục',
    en: 'Share, Discuss & Inspire Việt Phục Styles',
  },
  'forum.btn.new_post': {
    vi: 'Đăng Bản Phối Của Bạn',
    en: 'Share Your Styling Look',
  },
  'forum.btn.apply_outfit': {
    vi: 'Mặc thử bản phối này',
    en: 'Try This Style',
  },

  // Profile Realm
  'profile.badge': {
    vi: 'Thẻ Danh Xưng Học Giả',
    en: 'Scholar Identity Card',
  },
  'profile.heading': {
    vi: 'Hồ Sơ Danh Tánh & Thành Tựu Di Sản',
    en: 'Heritage Profile & Scholar Achievements',
  },
  'profile.saved_outfits': {
    vi: 'Tác Phẩm Đã Lưu',
    en: 'Saved Creations',
  },
  'profile.dynasty_affinity': {
    vi: 'Triều Đại Tương Hợp',
    en: 'Dynasty Affinity',
  },
  'profile.scholar_rank': {
    vi: 'Học Vị Cổ Phục',
    en: 'Scholar Honor Rank',
  },

  // About Realm
  'about.badge': {
    vi: 'Về Dự Án Việt Phục Ký',
    en: 'About Việt Phục Ký Project',
  },
  'about.heading': {
    vi: 'Sứ Mệnh Di Sản Ngàn Năm & Thẩm Mỹ Đương Đại',
    en: 'Thousand-Year Heritage & Modern Aesthetics',
  },
  'about.intro': {
    vi: 'Việt Phục Ký là cầu nối đưa văn hóa cổ phục ngàn đời của dân tộc Việt Nam đến gần hơn với thế hệ trẻ Gen Z một cách trang trọng, chuẩn xác và đầy cảm hứng.',
    en: 'Việt Phục Ký bridges millennia of Vietnamese attire heritage with Gen Z in a respectful, historically accurate, and inspiring digital experience.',
  },

  // Seasons translations
  'season.xuan': { vi: 'Mùa Xuân', en: 'Spring' },
  'season.ha': { vi: 'Mùa Hạ', en: 'Summer' },
  'season.thu': { vi: 'Mùa Thu', en: 'Autumn' },
  'season.dong': { vi: 'Mùa Đông', en: 'Winter' },

  // Regions translations
  'region.bac': { vi: 'Miền Bắc (Thăng Long - Kinh Bắc)', en: 'Northern Vietnam (Thăng Long - Kinh Bắc)' },
  'region.trung': { vi: 'Miền Trung (Cố Đô Huế - Quảng Nam)', en: 'Central Vietnam (Imperial Huế - Quảng Nam)' },
  'region.nam': { vi: 'Miền Nam (Gia Định - Sông Nước Nam Bộ)', en: 'Southern Vietnam (Gia Định - Mekong Delta)' },

  // Occasions translations
  'occasion.cuoi': { vi: 'Đám Cưới & Đại Hỷ', en: 'Traditional Wedding & Nuptials' },
  'occasion.ky-yeu': { vi: 'Kỷ Yếu Tốt Nghiệp', en: 'Graduation Ceremony & Yearbook' },
  'occasion.le-hoi': { vi: 'Lễ Hội & Điển Lễ', en: 'Heritage Festivals & Ceremonies' },
  'occasion.quoc-khanh': { vi: 'Quốc Khánh & Đại Lễ', en: 'National Celebrations' },
  'occasion.tet': { vi: 'Tết Cổ Truyền', en: 'Lunar New Year (Tết)' },
  'occasion.sinh-nhat': { vi: 'Sinh Nhật & Tiệc Họp Mặt', en: 'Birthday & Gatherings' },
  'occasion.di-choi': { vi: 'Dạo Phố & Chụp Ảnh', en: 'Casual Stroll & Photo Shoots' },

  // Language Switcher
  'lang.switch_title': {
    vi: 'Ngôn ngữ hiển thị',
    en: 'Display Language',
  },
};

// Helper translation dictionaries for Dynasties
export const DYNASTY_TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  'Thời Hiện Đại (Tiền thân Nguyễn)': { vi: 'Thời Hiện Đại (Tiền thân Nguyễn)', en: 'Modern Era (Nguyễn Roots)' },
  'Triều Nguyễn': { vi: 'Triều Nguyễn', en: 'Nguyễn Dynasty' },
  'Thời Lý – Trần – Lê – Nguyễn': { vi: 'Thời Lý – Trần – Lê – Nguyễn', en: 'Lý – Trần – Lê – Nguyễn Eras' },
  'Thời Nguyễn – Đương đại': { vi: 'Thời Nguyễn – Đương đại', en: 'Nguyễn Dynasty – Modern' },
  'Thời Lý – Trần – Lê': { vi: 'Thời Lý – Trần – Lê', en: 'Lý – Trần – Lê Eras' },
  'Thời Lý – Trần – Lê Sơ': { vi: 'Thời Lý – Trần – Lê Sơ', en: 'Lý – Trần – Early Lê Eras' },
  'Mọi thời kỳ (Lý đến Nguyễn)': { vi: 'Mọi thời kỳ (Lý đến Nguyễn)', en: 'All Eras (Lý to Nguyễn)' },
};

// Helper translation dictionaries for Motifs & Patterns
export const MOTIF_TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  plain: { vi: 'Lụa Trơn Dệt Mộc', en: 'Plain Silk' },
  lotus: { vi: 'Hoa Sen Quốc Hoa', en: 'Lotus National Flower' },
  clouds: { vi: 'Vân Mây Cung Đình', en: 'Imperial Auspicious Clouds' },
  waves: { vi: 'Thủy Ba Sóng Nước', en: 'Thủy Ba Cascading Waves' },
  crane: { vi: 'Hạc Trắng Phiêu Diêu', en: 'Ethereal White Crane' },
  plum_blossom: { vi: 'Hoa Mai Ngũ Phúc', en: 'Five-Blessing Plum Blossom' },
  bamboo: { vi: 'Trúc Quân Tử', en: 'Noble Green Bamboo' },
  dragon_phoenix: { vi: 'Long Phụng Hoàng Gia', en: 'Imperial Dragon & Phoenix' },
  dong_son: { vi: 'Trống Đồng Đông Sơn', en: 'Đông Sơn Bronze Motif' },
};

// Helper translation dictionaries for Accessories
export const ACCESSORY_TRANSLATIONS: Record<string, { vi: string; en: string }> = {
  sunglasses: { vi: 'Kính Râm Retro Vintage', en: 'Vintage Retro Sunglasses' },
  folding_fan: { vi: 'Quạt Xếp Nan Trúc', en: 'Bamboo Folding Fan' },
  tote_bag: { vi: 'Túi Tote Thổ Cẩm', en: 'Brocade Tote Bag' },
  sneakers: { vi: 'Sneakers Trắng Tối Giản', en: 'Minimalist White Sneakers' },
  pearl_necklace: { vi: 'Chuỗi Ngọc Trai', en: 'Pearl Necklace' },
  hair_flower: { vi: 'Đóa Sen Cài Tóc', en: 'Lotus Hair Blossom' },
  headphones: { vi: 'Tai Nghe Chụp Tai Y2K', en: 'Y2K Over-Ear Headphones' },
  baguette_bag: { vi: 'Túi Kẹp Nách Da Nâu', en: 'Leather Baguette Bag' },
  beaded_bracelet: { vi: 'Chuỗi Hạt Ngọc Phong Thủy', en: 'Beaded Feng Shui Bracelet' },
  bucket_hat: { vi: 'Nón Bucket Thổ Cẩm', en: 'Brocade Bucket Hat' },
  chunky_boots: { vi: 'Bốt Chunky Hiện Đại', en: 'Modern Chunky Boots' },
};
