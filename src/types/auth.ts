export interface UserProfile {
  id: string;
  name: string;
  email?: string;
  avatar?: string;
  avatarUrl?: string;
  handle?: string;
  gender?: string;
  birthDate?: string;
  dynastyAffinity?: string;
  rank?: string;
  savedOutfits?: number;
  stylePreferences?: string[];
}

export const DEFAULT_USER: UserProfile = {
  id: 'usr_default',
  name: 'Đông A Lữ Khách',
  email: 'genz@vietphuc.vn',
  handle: '@donga_vietphuc',
  avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
  dynastyAffinity: 'Triều Lý – Trần & Nguyễn',
  rank: 'Nhà Phối Sắc Di Sản',
  savedOutfits: 5,
  gender: 'Không công khai',
  birthDate: '2002-08-15',
  stylePreferences: ['Giao Lĩnh', 'Cung Đình', 'Cách Tân Gen Z', 'Tối Giản'],
};

export const STYLE_TAGS = [
  'Cung Đình',
  'Giao Lĩnh',
  'Viên Lĩnh',
  'Nhật Bình',
  'Ngũ Thân',
  'Áo Tấc',
  'Tứ Thân',
  'Cách Tân Gen Z',
  'Cổ Phong Đương Đại',
  'Tối Giản',
  'Thanh Lịch',
  'Phố Cổ',
];
