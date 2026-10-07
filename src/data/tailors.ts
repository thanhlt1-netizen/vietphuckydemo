export interface TailorShop {
  id: string;
  name: string;
  region: 'Miền Bắc' | 'Miền Trung' | 'Miền Nam';
  address: string;
  phone: string;
  rating: number;
  specialties: string[];
  location: { lat: number; lng: number };
}

export const TAILOR_SHOPS: TailorShop[] = [
  {
    id: 't1',
    name: 'Xưởng May Cổ Phục Thăng Long',
    region: 'Miền Bắc',
    address: '123 Phố Cổ, Hoàn Kiếm, Hà Nội',
    phone: '024-1234-5678',
    rating: 4.9,
    specialties: ['Áo Tấc', 'Áo Giao Lĩnh', 'Áo Nhật Bình'],
    location: { lat: 21.0285, lng: 105.8542 },
  },
  {
    id: 't2',
    name: 'Tiệm May Áo Dài Huế Xưa',
    region: 'Miền Trung',
    address: '45 Đường Lê Lợi, TP. Huế',
    phone: '0234-8765-4321',
    rating: 4.8,
    specialties: ['Áo Dài', 'Áo Nhật Bình', 'Áo Ngũ Thân'],
    location: { lat: 16.4637, lng: 107.5905 },
  },
  {
    id: 't3',
    name: 'Nhà May Sài Gòn Thanh Lịch',
    region: 'Miền Nam',
    address: '78 Đường Đồng Khởi, Quận 1, TP.HCM',
    phone: '028-9999-8888',
    rating: 4.7,
    specialties: ['Áo Dài Cách Tân', 'Áo Bà Ba', 'Vest'],
    location: { lat: 10.7765, lng: 106.7012 },
  },
];
