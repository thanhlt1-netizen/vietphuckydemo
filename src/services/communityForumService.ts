import { CommunityPost, OutfitCustomization } from '../types/customization';

const FORUM_STORAGE_KEY = 'vietphuc_community_posts';

const PRESET_COMMUNITY_POSTS: CommunityPost[] = [
  {
    id: 'post_1',
    title: 'Nhật Bình Cung Đình x Y2K Streetwear',
    authorName: 'Hà My (Hanoi GenZ)',
    authorAvatar: '🌸',
    customization: {
      costumeId: 'nhat-binh',
      costumeName: 'Áo Nhật Bình',
      gender: 'female',
      parts: {
        primaryRobeColor: '#BA3424',
        innerCollarColor: '#D4A043',
        bottomColor: '#221C18',
        sashColor: '#58734D',
      },
      pattern: 'lotus',
      accessories: ['headphones', 'sunglasses', 'folding_fan'],
      lastUpdated: Date.now() - 3600000 * 4,
    },
    likesCount: 142,
    isLiked: false,
    rating: 4.9,
    ratingCount: 38,
    culturalBadge: 'Phù hợp văn hóa',
    tags: ['#NhatBinh', '#Y2K', '#PhoCo', '#GenZ'],
    createdAt: 'Hôm nay lúc 14:20',
    description: 'Bản phối giữa nẹp ngũ hành hoàng tộc và tai nghe Y2K dạo phố Hoàng thành.',
    reviews: [
      { id: 'rev_1_1', author: 'Thùy Chi', comment: 'Hòa sắc đỏ chu sa với nẹp vàng rất tôn da, đeo tai nghe nhìn cực kỳ trendy!', stars: 5, date: '1 giờ trước' },
      { id: 'rev_1_2', author: 'Hoàng Long', comment: 'Rất ưng ý cách giữ nguyên cổ nhật bình mà vẫn mang phong thái hiện đại.', stars: 5, date: '3 giờ trước' }
    ]
  },
  {
    id: 'post_2',
    title: 'Áo Tấc Xanh Thiên Thanh Dạ Hội',
    authorName: 'Đức Anh (Saigon Stylist)',
    authorAvatar: '🎋',
    customization: {
      costumeId: 'ao-tac',
      costumeName: 'Áo Tấc Hoàng Triều',
      gender: 'male',
      parts: {
        primaryRobeColor: '#4A7F9D',
        innerCollarColor: '#F0E7D8',
        bottomColor: '#F0E7D8',
        sashColor: '#BA3424',
      },
      pattern: 'clouds',
      accessories: ['folding_fan', 'pearl_necklace'],
      lastUpdated: Date.now() - 3600000 * 12,
    },
    likesCount: 98,
    isLiked: false,
    rating: 4.8,
    ratingCount: 24,
    culturalBadge: 'Chuẩn mực di sản',
    tags: ['#AoTac', '#DaHoi', '#XanhThienThanh'],
    createdAt: 'Hôm qua lúc 19:45',
    description: 'Tông màu thiên thanh nhẹ nhàng, tay thụng rộng bề thế kết hợp chuỗi ngọc thanh tân.',
    reviews: [
      { id: 'rev_2_1', author: 'Văn Hiến', comment: 'Tay thụng rộng bề thế chuẩn lễ phục, phối thêm quạt dát vàng rất nho nhã.', stars: 5, date: 'Hôm qua' }
    ]
  },
  {
    id: 'post_3',
    title: 'Tứ Thân Đất Nung x Nón Bucket Thổ Cẩm',
    authorName: 'Khánh Linh (Bắc Ninh)',
    authorAvatar: '🪷',
    customization: {
      costumeId: 'tu-than',
      costumeName: 'Áo Tứ Thân Kinh Bắc',
      gender: 'female',
      parts: {
        primaryRobeColor: '#875638',
        innerCollarColor: '#C46D7D',
        bottomColor: '#221C18',
        sashColor: '#58734D',
      },
      pattern: 'plum_blossom',
      accessories: ['bucket_hat', 'baguette_bag', 'sneakers'],
      lastUpdated: Date.now() - 3600000 * 28,
    },
    likesCount: 215,
    isLiked: false,
    rating: 4.95,
    ratingCount: 52,
    culturalBadge: 'Cách tân duyên dáng',
    tags: ['#TuThan', '#ThoCam', '#Streetwear'],
    createdAt: '2 ngày trước',
    description: 'Mang yếm đào Kinh Bắc ra ngoài phố kết hợp cùng sneaker và nón bucket cực chất!',
    reviews: [
      { id: 'rev_3_1', author: 'Bảo Ngọc', comment: 'Yếm đào với thắt lưng xanh lục giữ trọn nét Kinh Bắc mà đi sneaker năng động thật sự.', stars: 5, date: '1 ngày trước' }
    ]
  },
  {
    id: 'post_4',
    title: 'Áo Dài Trống Đồng Đông Sơn Huyền Bí',
    authorName: 'Minh Quân (Huế)',
    authorAvatar: '🦅',
    customization: {
      costumeId: 'ao-dai',
      costumeName: 'Áo Dài Cách Tân',
      gender: 'female',
      parts: {
        primaryRobeColor: '#221C18',
        innerCollarColor: '#D4A043',
        bottomColor: '#D4A043',
        sashColor: '#BA3424',
      },
      pattern: 'dong_son',
      accessories: ['sunglasses', 'chunky_boots'],
      lastUpdated: Date.now() - 3600000 * 40,
    },
    likesCount: 178,
    isLiked: false,
    rating: 4.7,
    ratingCount: 31,
    culturalBadge: 'Cá tính đương đại',
    tags: ['#DongSon', '#AoDai', '#AllBlack'],
    createdAt: '3 ngày trước',
    description: 'Họa tiết chim Lạc Đông Sơn in chìm trên nền the thâm huyền bí, phối cùng bốt chunky.',
    reviews: [
      { id: 'rev_4_1', author: 'Thành Nam', comment: 'Màu đen the thâm với vàng kim rất quyền quý. Rất hợp đi biểu diễn hoặc dự festival!', stars: 5, date: '2 ngày trước' }
    ]
  },
];

export class CommunityForumService {
  static getCommunityPosts(): CommunityPost[] {
    try {
      const data = localStorage.getItem(FORUM_STORAGE_KEY);
      if (!data) {
        localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(PRESET_COMMUNITY_POSTS));
        return PRESET_COMMUNITY_POSTS;
      }
      return JSON.parse(data);
    } catch {
      return PRESET_COMMUNITY_POSTS;
    }
  }

  static publishPost(
    title: string,
    authorName: string,
    customization: OutfitCustomization,
    tags: string[] = ['#CachTanGenZ', '#VietPhuc'],
    description = ''
  ): CommunityPost {
    const posts = this.getCommunityPosts();
    const newPost: CommunityPost = {
      id: `post_${Date.now()}`,
      title: title || `${customization.costumeName} Cách Tân`,
      authorName: authorName || 'Bạn (Nhà thiết kế)',
      authorAvatar: '✨',
      customization,
      likesCount: 1,
      isLiked: true,
      rating: 5.0,
      ratingCount: 1,
      culturalBadge: 'Thiết kế cá nhân',
      tags,
      createdAt: 'Vừa xong',
      description,
      isMyDesign: true,
      reviews: [],
    };

    const updated = [newPost, ...posts];
    try {
      localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Lỗi khi lưu diễn đàn:', e);
    }
    return newPost;
  }

  static toggleLikePost(postId: string): CommunityPost[] {
    const posts = this.getCommunityPosts();
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const isLiked = !p.isLiked;
        return {
          ...p,
          isLiked,
          likesCount: isLiked ? p.likesCount + 1 : Math.max(0, p.likesCount - 1),
        };
      }
      return p;
    });

    try {
      localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Lỗi khi cập nhật like:', e);
    }
    return updated;
  }

  static addReviewToPost(postId: string, author: string, comment: string, stars = 5): CommunityPost[] {
    const posts = this.getCommunityPosts();
    const updated = posts.map((p) => {
      if (p.id === postId) {
        const currentReviews = p.reviews || [];
        const newReview = {
          id: `rev_${Date.now()}`,
          author: author || 'Bạn',
          comment,
          stars,
          date: 'Vừa xong',
        };
        const updatedReviews = [newReview, ...currentReviews];
        const newCount = (p.ratingCount || 0) + 1;
        const currentSum = (p.rating || 5) * (p.ratingCount || 1);
        const newRating = Math.round(((currentSum + stars) / (newCount + 1)) * 10) / 10;

        return {
          ...p,
          reviews: updatedReviews,
          rating: newRating,
          ratingCount: newCount,
        };
      }
      return p;
    });

    try {
      localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Lỗi khi lưu bình luận:', e);
    }
    return updated;
  }

  static deletePost(postId: string): CommunityPost[] {
    const posts = this.getCommunityPosts();
    const updated = posts.filter((p) => p.id !== postId);
    try {
      localStorage.setItem(FORUM_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.warn('Lỗi khi xóa bài:', e);
    }
    return updated;
  }
}
