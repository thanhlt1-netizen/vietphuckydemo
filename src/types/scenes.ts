export type RealmScene =
  | 'gate'
  | 'home'
  | 'resonance'
  | 'sanctuary'
  | 'atelier'
  | 'oracle'
  | 'tryon'
  | 'forum'
  | 'chronicle'
  | 'profile'
  | 'about'
  | 'tailor';

export * from './auth';
export * from './context';
export * from './customization';

export interface VietnameseCostume {
  id: string;
  name: string;
  aliases: string[];
  dynasty: string;
  era: string;
  origin: string;
  features: string[];
  colors: string[];
  significance: string;
  occasions: string[];
  image: string;
  culturalNote: string;
  genZScore: number;
}

export interface SceneMeta {
  id: RealmScene;
  title: string;
  subTitle: string;
  tagline: string;
}

export const SCENES: Record<RealmScene, SceneMeta> = {
  gate: {
    id: 'gate',
    title: 'Khởi Nguyên',
    subTitle: 'Nơi giao thoa di sản ngàn năm',
    tagline: 'Màn chờ',
  },
  home: {
    id: 'home',
    title: 'Màn Hình Chính',
    subTitle: 'Chọn hành trình của bạn',
    tagline: 'Trung tâm',
  },
  resonance: {
    id: 'resonance',
    title: 'Bối Cảnh',
    subTitle: 'Thời khắc · Phong thổ · Khí chất',
    tagline: 'Cộng hưởng phong cách',
  },
  sanctuary: {
    id: 'sanctuary',
    title: 'Phục Trang',
    subTitle: 'Phom dáng cổ điển qua các thời kỳ hưng thịnh',
    tagline: 'Tuyển tập cổ phục',
  },
  atelier: {
    id: 'atelier',
    title: 'Tùy Biến',
    subTitle: 'Sắc ngũ hành và phụ kiện đương đại',
    tagline: 'Dấu ấn thế hệ mới',
  },
  oracle: {
    id: 'oracle',
    title: 'AI Duyệt Văn Hóa',
    subTitle: 'Soi chiếu chuẩn mực và hòa sắc di sản',
    tagline: 'Thẩm định văn hóa',
  },
  tryon: {
    id: 'tryon',
    title: 'Thử Đồ Ảo',
    subTitle: 'Hóa thân diện mạo cổ phục cùng trí tuệ nhân tạo',
    tagline: 'Chân dung di sản',
  },
  forum: {
    id: 'forum',
    title: 'Diễn Đàn',
    subTitle: 'Không gian giao lưu và khoe tác phẩm cách tân',
    tagline: 'Cộng đồng sáng tạo',
  },
  chronicle: {
    id: 'chronicle',
    title: 'Lookbook',
    subTitle: 'Lưu giữ diện mạo phong hoa',
    tagline: 'Bộ sưu tập riêng',
  },
  profile: {
    id: 'profile',
    title: 'Hồ Sơ Cá Nhân',
    subTitle: 'Diện mạo · Tùy biến · Dấu ấn phong cách',
    tagline: 'Quản lý tài khoản',
  },
  about: {
    id: 'about',
    title: 'Thông Tin',
    subTitle: 'Về Việt Phục Ký',
    tagline: 'Giới thiệu',
  },
  tailor: {
    id: 'tailor',
    title: 'Đặt May',
    subTitle: 'Kết nối xưởng may cổ phục trên toàn quốc',
    tagline: 'Từ ý tưởng đến hiện thực',
  },
};