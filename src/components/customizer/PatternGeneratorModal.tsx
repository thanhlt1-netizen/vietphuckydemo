import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Sparkles, 
  X, 
  Check, 
  RotateCcw, 
  Download, 
  Palette, 
  Sliders, 
  Layers, 
  Eye, 
  Grid3X3, 
  Maximize2,
  Brush,
  Compass
} from 'lucide-react';
import { useLanguage } from '../../contexts/LanguageContext';
import { OutfitCustomization, PatternType } from '../../types/customization';

export interface MotifDefinition {
  id: string;
  nameVi: string;
  nameEn: string;
  categoryVi: string;
  categoryEn: string;
  descriptionVi: string;
  descriptionEn: string;
  symbolismVi: string;
  symbolismEn: string;
  draw: (ctx: CanvasRenderingContext2D, size: number, color: string, goldFoil: boolean) => void;
}

// Preset Heritage Colors
export const HERITAGE_BASE_COLORS = [
  { nameVi: 'Đỏ Son Hoàng Thành', nameEn: 'Imperial Vermilion', hex: '#A82B1C' },
  { nameVi: 'Đen Then Cung Đình', nameEn: 'Imperial Charcoal Silk', hex: '#1C140E' },
  { nameVi: 'Trắng Ngà Tơ Tằm', nameEn: 'Silk Ivory White', hex: '#F7F3EB' },
  { nameVi: 'Xanh Lưu Ly Đại Nội', nameEn: 'Imperial Cyan Lapis', hex: '#204E5F' },
  { nameVi: 'Vàng Hoàng Yến', nameEn: 'Royal Golden Yellow', hex: '#D4A043' },
  { nameVi: 'Hồng Cánh Sen', nameEn: 'Lotus Petal Pink', hex: '#B85D75' },
  { nameVi: 'Tím Cung Đình Huế', nameEn: 'Imperial Hue Purple', hex: '#58364F' },
  { nameVi: 'Xanh Lục Bích', nameEn: 'Jade Green Silk', hex: '#3E5E4A' },
  { nameVi: 'Nâu Trầm Đất Việt', nameEn: 'Terracotta Earth Brown', hex: '#5C3E2D' },
];

export const MOTIF_LINE_COLORS = [
  { nameVi: 'Dát Vàng Kim Tuyến', nameEn: 'Gold Foil Accent', hex: '#F3C96B', isGold: true },
  { nameVi: 'Tơ Tằm Trắng Ngọc', nameEn: 'Pearl White Silk', hex: '#FFFFFF', isGold: false },
  { nameVi: 'Sơn Son Chu Sa', nameEn: 'Cinnabar Crimson', hex: '#BA3424', isGold: false },
  { nameVi: 'Ngọc Bích Thanh Tao', nameEn: 'Jade Green', hex: '#78976A', isGold: false },
  { nameVi: 'The Thâm Huyền Bí', nameEn: 'Deep Charcoal', hex: '#2A1E17', isGold: false },
  { nameVi: 'Bạc Ánh Trăng', nameEn: 'Moonlight Silver', hex: '#E2E8F0', isGold: false },
];

export const TRADITIONAL_MOTIFS: MotifDefinition[] = [
  {
    id: 'hoa-sen',
    nameVi: 'Hoa Sen Hoàng Triều',
    nameEn: 'Imperial Royal Lotus',
    categoryVi: 'Hoa Cỏ Tứ Quý',
    categoryEn: 'Flora & Botanicals',
    descriptionVi: 'Quốc hoa Việt Nam thanh khiết, tượng trưng cho phẩm hạnh thanh cao và cốt cách người Việt.',
    descriptionEn: 'National flower of Vietnam symbolizing pure virtue and noble spirit.',
    symbolismVi: 'Thanh khiết • Tinh tế • Cốt cách',
    symbolismEn: 'Purity • Elegance • Noble Spirit',
    draw: (ctx, s, color, gold) => {
      const half = s / 2;
      ctx.save();
      ctx.translate(half, half);
      
      // Vẽ cánh sen chính ở giữa
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.38);
      ctx.bezierCurveTo(s * 0.18, -s * 0.18, s * 0.18, s * 0.15, 0, s * 0.28);
      ctx.bezierCurveTo(-s * 0.18, s * 0.15, -s * 0.18, -s * 0.18, 0, -s * 0.38);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.4, s * 0.04);
      ctx.stroke();

      // Cánh sen hai bên
      ctx.beginPath();
      ctx.moveTo(0, s * 0.28);
      ctx.bezierCurveTo(s * 0.28, s * 0.12, s * 0.38, -s * 0.08, s * 0.22, -s * 0.26);
      ctx.bezierCurveTo(s * 0.15, -s * 0.12, s * 0.12, 0.05, 0, s * 0.28);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, s * 0.28);
      ctx.bezierCurveTo(-s * 0.28, s * 0.12, -s * 0.38, -s * 0.08, -s * 0.22, -s * 0.26);
      ctx.bezierCurveTo(-s * 0.15, -s * 0.12, -s * 0.12, 0.05, 0, s * 0.28);
      ctx.stroke();

      // Nụ sen & đài sen
      ctx.beginPath();
      ctx.arc(0, s * 0.02, s * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      // Gân cánh mềm mại
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.3);
      ctx.lineTo(0, s * 0.18);
      ctx.lineWidth = Math.max(1, s * 0.02);
      ctx.stroke();

      if (gold) {
        ctx.beginPath();
        ctx.arc(0, -s * 0.38, s * 0.03, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE57F';
        ctx.fill();
      }

      ctx.restore();
    },
  },
  {
    id: 'van-may',
    nameVi: 'Vân Mây Cung Đình',
    nameEn: 'Imperial Cloud Swirls',
    categoryVi: 'Văn Mây Trời',
    categoryEn: 'Celestial Clouds',
    descriptionVi: 'Họa tiết tường vân uốn lượn mang lại vượng khí, điềm lành và sự hanh thông.',
    descriptionEn: 'Flowing imperial cloud spirals representing auspicious omens and fortune.',
    symbolismVi: 'Tường vân • An lành • Bổng lộc',
    symbolismEn: 'Fortune • Serenity • Harmony',
    draw: (ctx, s, color, gold) => {
      const half = s / 2;
      ctx.save();
      ctx.translate(half, half);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.4, s * 0.04);
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      // Xoáy mây bên trái
      ctx.beginPath();
      ctx.arc(-s * 0.12, -s * 0.02, s * 0.16, 0.2 * Math.PI, 1.8 * Math.PI);
      ctx.bezierCurveTo(-s * 0.08, -s * 0.28, s * 0.16, -s * 0.28, s * 0.18, -s * 0.04);
      ctx.bezierCurveTo(s * 0.35, -s * 0.04, s * 0.38, s * 0.18, s * 0.2, s * 0.22);
      ctx.bezierCurveTo(s * 0.05, s * 0.25, -s * 0.25, s * 0.25, -s * 0.32, s * 0.08);
      ctx.stroke();

      // Đuôi mây cuộn tròn bên trong
      ctx.beginPath();
      ctx.arc(-s * 0.1, -s * 0.02, s * 0.08, 0.4 * Math.PI, 1.6 * Math.PI);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(s * 0.12, 0, s * 0.08, 0, 1.2 * Math.PI);
      ctx.stroke();

      if (gold) {
        ctx.beginPath();
        ctx.arc(-s * 0.1, -s * 0.02, s * 0.025, 0, Math.PI * 2);
        ctx.arc(s * 0.12, 0, s * 0.025, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE57F';
        ctx.fill();
      }

      ctx.restore();
    },
  },
  {
    id: 'hoa-cuc',
    nameVi: 'Hoa Cúc Tứ Quý',
    nameEn: 'Imperial Chrysanthemum',
    categoryVi: 'Hoa Cỏ Tứ Quý',
    categoryEn: 'Flora & Botanicals',
    descriptionVi: 'Biểu tượng của sự trường thọ, bền bỉ và cốt cách thanh cao của bậc quân tử.',
    descriptionEn: 'Symbol of longevity, steadfastness, and noble scholar essence.',
    symbolismVi: 'Trường thọ • Khí tiết • Tĩnh lặng',
    symbolismEn: 'Longevity • Integrity • Peace',
    draw: (ctx, s, color, gold) => {
      const half = s / 2;
      ctx.save();
      ctx.translate(half, half);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.2, s * 0.035);

      const petals = 12;
      for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, s * 0.08);
        ctx.bezierCurveTo(s * 0.05, s * 0.2, s * 0.04, s * 0.35, 0, s * 0.4);
        ctx.bezierCurveTo(-s * 0.04, s * 0.35, -s * 0.05, s * 0.2, 0, s * 0.08);
        ctx.stroke();
        ctx.restore();
      }

      // Nhụy hoa tầng trong
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.08, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, s * 0.04, 0, Math.PI * 2);
      ctx.fillStyle = gold ? '#FFE57F' : color;
      ctx.fill();

      ctx.restore();
    },
  },
  {
    id: 'hoa-mai',
    nameVi: 'Hoa Mai Ngũ Phúc',
    nameEn: 'Five-Blessing Apricot Blossom',
    categoryVi: 'Hoa Cỏ Tứ Quý',
    categoryEn: 'Flora & Botanicals',
    descriptionVi: 'Năm cánh hoa mai tượng trưng cho Ngũ Phúc: Phú, Quý, Thọ, Khang, Ninh.',
    descriptionEn: 'Five petals representing the five traditional blessings of spring.',
    symbolismVi: 'Ngũ phúc • Khởi sắc • Đón xuân',
    symbolismEn: 'Prosperity • Renewal • Spring Joy',
    draw: (ctx, s, color, gold) => {
      const half = s / 2;
      ctx.save();
      ctx.translate(half, half);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.4, s * 0.038);

      const petals = 5;
      for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals - Math.PI / 2;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.bezierCurveTo(s * 0.15, s * 0.12, s * 0.18, s * 0.32, 0, s * 0.38);
        ctx.bezierCurveTo(-s * 0.18, s * 0.32, -s * 0.15, s * 0.12, 0, 0);
        ctx.stroke();
        ctx.restore();
      }

      // Nhụy hoa 5 tia
      for (let i = 0; i < petals; i++) {
        const angle = (i * Math.PI * 2) / petals - Math.PI / 2 + Math.PI / petals;
        ctx.save();
        ctx.rotate(angle);
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(0, s * 0.14);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(0, s * 0.16, s * 0.02, 0, Math.PI * 2);
        ctx.fillStyle = gold ? '#FFE57F' : color;
        ctx.fill();
        ctx.restore();
      }

      ctx.beginPath();
      ctx.arc(0, 0, s * 0.05, 0, Math.PI * 2);
      ctx.fillStyle = color;
      ctx.fill();

      ctx.restore();
    },
  },
  {
    id: 'thuy-ba',
    nameVi: 'Thủy Ba Triều Dâng',
    nameEn: 'Imperial Water Waves',
    categoryVi: 'Thủy Văn & Sóng Biển',
    categoryEn: 'Water Waves & Sea',
    descriptionVi: 'Họa tiết sóng nước tầng tầng lớp lớp uyển chuyển, đặc trưng dưới gấu áo thời Nguyễn.',
    descriptionEn: 'Rhythmic layered ocean waves iconic on hem borders of Nguyen dynasty robes.',
    symbolismVi: 'Dồi dào • Uyển chuyển • Phúc lộc',
    symbolismEn: 'Abundance • Grace • Everlasting',
    draw: (ctx, s, color, gold) => {
      const half = s / 2;
      ctx.save();
      ctx.translate(half, half);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.3, s * 0.038);
      ctx.lineCap = 'round';

      // 3 lớp sóng nước lượn sóng
      for (let layer = -1; layer <= 1; layer++) {
        const yOff = layer * s * 0.18;
        ctx.beginPath();
        ctx.moveTo(-s * 0.45, yOff);
        ctx.bezierCurveTo(-s * 0.25, yOff - s * 0.14, -s * 0.1, yOff + s * 0.14, 0, yOff);
        ctx.bezierCurveTo(s * 0.1, yOff - s * 0.14, s * 0.25, yOff + s * 0.14, s * 0.45, yOff);
        ctx.stroke();

        // Xoáy bọt sóng nhỏ
        ctx.beginPath();
        ctx.arc(-s * 0.25, yOff - s * 0.04, s * 0.04, 0, Math.PI);
        ctx.arc(s * 0.1, yOff - s * 0.04, s * 0.04, 0, Math.PI);
        ctx.stroke();
      }

      if (gold) {
        ctx.fillStyle = '#FFE57F';
        ctx.beginPath();
        ctx.arc(0, 0, s * 0.03, 0, Math.PI * 2);
        ctx.fill();
      }

      ctx.restore();
    },
  },
  {
    id: 'chim-hac',
    nameVi: 'Hạc Tiên Phiêu Diêu',
    nameEn: 'Celestial Crane',
    categoryVi: 'Linh Điểu & Thần Thú',
    categoryEn: 'Auspicious Birds',
    descriptionVi: 'Chim Hạc là biểu trưng của sự trường tồn, thanh cao, sải cánh tự do giữa ngút ngàn mây trời.',
    descriptionEn: 'Divine crane symbolizing soaring freedom, longevity, and royal grace.',
    symbolismVi: 'Trường tồn • Tự do • Siêu phàm',
    symbolismEn: 'Longevity • Freedom • Transcendence',
    draw: (ctx, s, color, gold) => {
      const half = s / 2;
      ctx.save();
      ctx.translate(half, half);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.3, s * 0.038);

      // Thân hạc
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.3);
      ctx.lineTo(s * 0.08, -s * 0.18);
      ctx.lineTo(0, s * 0.22);
      ctx.lineTo(-s * 0.08, -s * 0.18);
      ctx.closePath();
      ctx.stroke();

      // Đôi cánh sải rộng
      ctx.beginPath();
      ctx.moveTo(-s * 0.38, -s * 0.08);
      ctx.quadraticCurveTo(-s * 0.18, -s * 0.18, 0, -s * 0.12);
      ctx.quadraticCurveTo(s * 0.18, -s * 0.18, s * 0.38, -s * 0.08);
      ctx.stroke();

      // Lông vũ cánh
      ctx.beginPath();
      ctx.moveTo(-s * 0.32, -s * 0.04);
      ctx.lineTo(-s * 0.08, 0.02);
      ctx.moveTo(s * 0.32, -s * 0.04);
      ctx.lineTo(s * 0.08, 0.02);
      ctx.stroke();

      // Đuôi hạc
      ctx.beginPath();
      ctx.moveTo(0, s * 0.22);
      ctx.lineTo(-s * 0.08, s * 0.38);
      ctx.moveTo(0, s * 0.22);
      ctx.lineTo(s * 0.08, s * 0.38);
      ctx.stroke();

      if (gold) {
        ctx.beginPath();
        ctx.arc(0, -s * 0.3, s * 0.035, 0, Math.PI * 2);
        ctx.fillStyle = '#FFE57F';
        ctx.fill();
      }

      ctx.restore();
    },
  },
  {
    id: 'trong-dong',
    nameVi: 'Trống Đồng Đông Sơn',
    nameEn: 'Đông Sơn Sacred Bronze Star',
    categoryVi: 'Di Sản Thần Thoại',
    categoryEn: 'Heritage Mythology',
    descriptionVi: 'Mặt trời 14 tia sáng rạng ngời cùng vành họa tiết chim Lạc linh thiêng của nền văn minh lúa nước.',
    descriptionEn: 'Sacred sunburst star and Lac bird rings from ancient Dong Son bronze culture.',
    symbolismVi: 'Cội nguồn • Hào khí • Bất diệt',
    symbolismEn: 'Ancestry • Sacred Energy • Eternity',
    draw: (ctx, s, color, gold) => {
      const half = s / 2;
      ctx.save();
      ctx.translate(half, half);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.2, s * 0.035);

      // Vòng tròn đồng tâm
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.42, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, s * 0.32, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(0, 0, s * 0.16, 0, Math.PI * 2);
      ctx.stroke();

      // Mặt trời 12 cánh ở tâm
      const rays = 12;
      ctx.beginPath();
      for (let i = 0; i < rays; i++) {
        const angle = (i * Math.PI * 2) / rays;
        const x1 = Math.cos(angle) * (s * 0.15);
        const y1 = Math.sin(angle) * (s * 0.15);
        const nextAngle = ((i + 0.5) * Math.PI * 2) / rays;
        const x2 = Math.cos(nextAngle) * (s * 0.06);
        const y2 = Math.sin(nextAngle) * (s * 0.06);
        if (i === 0) ctx.moveTo(x1, y1);
        else ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
      }
      ctx.closePath();
      ctx.stroke();

      // Tâm phát sáng
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.04, 0, Math.PI * 2);
      ctx.fillStyle = gold ? '#FFE57F' : color;
      ctx.fill();

      ctx.restore();
    },
  },
  {
    id: 'mau-don',
    nameVi: 'Hoa Mẫu Đơn Vương Giả',
    nameEn: 'Royal Peony Blossom',
    categoryVi: 'Hoa Cỏ Tứ Quý',
    categoryEn: 'Flora & Botanicals',
    descriptionVi: 'Vua của các loài hoa trong cung đình, biểu trưng cho sự vương giả, phú quý và lộng lẫy.',
    descriptionEn: 'King of flowers symbolizing royalty, wealth, and aristocratic charm.',
    symbolismVi: 'Vương giả • Phú quý • Kiêu sa',
    symbolismEn: 'Royalty • Prosperity • Magnificence',
    draw: (ctx, s, color, gold) => {
      const half = s / 2;
      ctx.save();
      ctx.translate(half, half);
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.max(1.3, s * 0.038);

      // Cánh hoa mẫu đơn xếp tầng lớp
      const layers = [
        { count: 8, r1: s * 0.18, r2: s * 0.38 },
        { count: 6, r1: s * 0.08, r2: s * 0.22 },
      ];

      layers.forEach(({ count, r1, r2 }) => {
        for (let i = 0; i < count; i++) {
          const angle = (i * Math.PI * 2) / count;
          ctx.save();
          ctx.rotate(angle);
          ctx.beginPath();
          ctx.moveTo(-s * 0.06, r1);
          ctx.bezierCurveTo(-s * 0.12, (r1 + r2) / 2, -s * 0.08, r2, 0, r2);
          ctx.bezierCurveTo(s * 0.08, r2, s * 0.12, (r1 + r2) / 2, s * 0.06, r1);
          ctx.stroke();
          ctx.restore();
        }
      });

      // Nhụy vàng mẫu đơn
      ctx.beginPath();
      ctx.arc(0, 0, s * 0.06, 0, Math.PI * 2);
      ctx.fillStyle = gold ? '#FFE57F' : color;
      ctx.fill();

      ctx.restore();
    },
  },
];

interface PatternGeneratorModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCustomization: OutfitCustomization;
  onApplyPattern: (result: {
    patternType: PatternType;
    baseColor: string;
    motifColor: string;
    patternName: string;
    canvasDataUrl: string;
  }) => void;
  onToast?: (message: string) => void;
}

export const PatternGeneratorModal: React.FC<PatternGeneratorModalProps> = ({
  isOpen,
  onClose,
  currentCustomization,
  onApplyPattern,
  onToast,
}) => {
  const { language, t } = useLanguage();
  const isVi = language === 'vi';

  // State tùy chỉnh Canvas Pattern
  const [selectedMotifId, setSelectedMotifId] = useState<string>('hoa-sen');
  const [baseColor, setBaseColor] = useState<string>(currentCustomization.parts.primaryRobeColor || '#BA3424');
  const [motifColor, setMotifColor] = useState<string>('#F3C96B');
  const [isGoldFoil, setIsGoldFoil] = useState<boolean>(true);
  const [patternScale, setPatternScale] = useState<number>(56); // Kích thước họa tiết pixel
  const [density, setDensity] = useState<'sparse' | 'normal' | 'dense'>('normal');
  const [layoutFlow, setLayoutFlow] = useState<'grid' | 'diagonal' | 'organic'>('diagonal');
  const [opacity, setOpacity] = useState<number>(85); // 15 - 100%
  const [showFabricFolds, setShowFabricFolds] = useState<boolean>(true);

  // References
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const previewSwatchRef = useRef<HTMLCanvasElement | null>(null);

  const selectedMotif = TRADITIONAL_MOTIFS.find((m) => m.id === selectedMotifId) || TRADITIONAL_MOTIFS[0];

  // Render Canvas Pattern
  const renderPattern = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = 512;
    const height = 512;
    canvas.width = width;
    canvas.height = height;

    // 1. Tô màu nền vải (Base Color)
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    // 2. Vân vải tơ tằm / gấm chìm vi tế (Subtle weave texture)
    const imgData = ctx.getImageData(0, 0, width, height);
    const data = imgData.data;
    for (let i = 0; i < data.length; i += 4) {
      const noise = (Math.random() - 0.5) * 12;
      data[i] = Math.max(0, Math.min(255, data[i] + noise));
      data[i + 1] = Math.max(0, Math.min(255, data[i + 1] + noise));
      data[i + 2] = Math.max(0, Math.min(255, data[i + 2] + noise));
    }
    ctx.putImageData(imgData, 0, 0);

    // 3. Tính toán khoảng cách ô lặp theo Density & Scale
    let spacingMultiplier = 1.6;
    if (density === 'sparse') spacingMultiplier = 2.4;
    if (density === 'dense') spacingMultiplier = 1.15;

    const stepX = patternScale * spacingMultiplier;
    const stepY = patternScale * spacingMultiplier;

    // Thiết lập độ mờ hoa văn
    ctx.globalAlpha = opacity / 100;

    // 4. Vẽ lưới họa tiết theo bố cục (Grid, Diagonal so le, Organic lượn sóng)
    const cols = Math.ceil(width / stepX) + 2;
    const rows = Math.ceil(height / stepY) + 2;

    for (let r = -1; r < rows; r++) {
      for (let c = -1; c < cols; c++) {
        let x = c * stepX;
        let y = r * stepY;

        if (layoutFlow === 'diagonal' && r % 2 !== 0) {
          x += stepX * 0.5;
        }

        if (layoutFlow === 'organic') {
          x += Math.sin(r * 0.8) * (stepX * 0.2);
          y += Math.cos(c * 0.8) * (stepY * 0.15);
        }

        ctx.save();
        ctx.translate(x, y);

        if (layoutFlow === 'organic') {
          ctx.rotate((c + r) * 0.12);
        }

        // Vẽ họa tiết truyền thống
        selectedMotif.draw(ctx, patternScale, motifColor, isGoldFoil);

        ctx.restore();
      }
    }

    ctx.globalAlpha = 1.0;

    // 5. Cập nhật Fabric Swatch Preview với hiệu ứng rủ bóng 3D
    const swatchCanvas = previewSwatchRef.current;
    if (swatchCanvas) {
      const sCtx = swatchCanvas.getContext('2d');
      if (sCtx) {
        swatchCanvas.width = 400;
        swatchCanvas.height = 400;
        
        // Vẽ lại từ canvas chính
        sCtx.drawImage(canvas, 0, 0, 400, 400);

        // Đổ bóng sóng vải lụa (Cloth fold gradient)
        if (showFabricFolds) {
          const foldGrad = sCtx.createLinearGradient(0, 0, 400, 400);
          foldGrad.addColorStop(0, 'rgba(255, 255, 255, 0.22)');
          foldGrad.addColorStop(0.25, 'rgba(0, 0, 0, 0.25)');
          foldGrad.addColorStop(0.5, 'rgba(255, 255, 255, 0.3)');
          foldGrad.addColorStop(0.75, 'rgba(0, 0, 0, 0.3)');
          foldGrad.addColorStop(1, 'rgba(255, 255, 255, 0.15)');

          sCtx.fillStyle = foldGrad;
          sCtx.fillRect(0, 0, 400, 400);
        }
      }
    }
  }, [baseColor, motifColor, isGoldFoil, patternScale, density, layoutFlow, opacity, showFabricFolds, selectedMotif]);

  useEffect(() => {
    if (isOpen) {
      // Delay nhỏ để DOM render canvas
      const timer = setTimeout(() => {
        renderPattern();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen, renderPattern]);

  if (!isOpen) return null;

  const handleApply = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    const patternName = isVi 
      ? `Họa tiết ${selectedMotif.nameVi} (${isGoldFoil ? 'Dát Vàng' : 'Đương Đại'})`
      : `${selectedMotif.nameEn} Custom Motif`;

    onApplyPattern({
      patternType: 'custom_canvas',
      baseColor,
      motifColor,
      patternName,
      canvasDataUrl: dataUrl,
    });

    if (onToast) {
      onToast(isVi ? `Đã dệt thành công "${patternName}" lên phục trang!` : `Successfully tailored "${patternName}" onto costume!`);
    }

    onClose();
  };

  const handleDownloadSwatch = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const link = document.createElement('a');
    link.download = `vietphuc_pattern_${selectedMotif.id}_${Date.now()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
    if (onToast) {
      onToast(isVi ? 'Đã tải mẫu vải dệt xuống máy!' : 'Fabric swatch downloaded!');
    }
  };

  const handleResetToTraditional = () => {
    setBaseColor(currentCustomization.parts.primaryRobeColor || '#BA3424');
    setMotifColor('#F3C96B');
    setIsGoldFoil(true);
    setPatternScale(56);
    setDensity('normal');
    setLayoutFlow('diagonal');
    setOpacity(85);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-5xl rounded-3xl bg-[#1C140E] border border-[#D4A043]/40 shadow-[0_20px_60px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[92vh]"
      >
        {/* Header */}
        <div className="px-5 sm:px-7 py-4 border-b border-[#3E2C1E] flex items-center justify-between bg-gradient-to-r from-[#241A13] via-[#1C140E] to-[#20150E]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-[#2C1D13] border border-[#D4A043]/50 flex items-center justify-center text-[#D4A043] shadow-md">
              <Brush className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-serif font-bold text-[#F5EFE6] flex items-center gap-2">
                <span>{isVi ? 'Xưởng Dệt Họa Tiết Cổ Phong (Canvas Pattern Generator)' : 'Heritage Canvas Pattern Generator'}</span>
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-[#D4A043]/20 text-[#F3C96B] font-mono font-semibold border border-[#D4A043]/30">
                  AI Canvas 2.0
                </span>
              </h3>
              <p className="text-[11px] text-[#BAA796]">
                {isVi ? 'Tự do phối màu nền, vẽ hoa sen, mây cung đình, hoa cúc... và dệt trực tiếp lên phục trang' : 'Customize base color, motifs (lotus, clouds, flora), and seamlessly overlay onto your costume'}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#2A1D14] hover:bg-[#38281C] border border-[#423023] text-[#BAA796] hover:text-[#F5EFE6] flex items-center justify-center transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Live Canvas Preview Swatch (5 cols) */}
          <div className="lg:col-span-5 flex flex-col items-center justify-between gap-4 bg-[#140D08]/80 p-4 rounded-2xl border border-[#3E2C1E]">
            <div className="w-full flex items-center justify-between">
              <span className="text-xs font-serif font-bold text-[#F3C96B] flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>{isVi ? 'Mẫu Vải Gấm Dệt Thực Tế' : 'Live Woven Swatch Preview'}</span>
              </span>
              <button
                type="button"
                onClick={() => setShowFabricFolds(!showFabricFolds)}
                className={`text-[10px] px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  showFabricFolds 
                    ? 'bg-[#536B49] text-white border-[#78976A]' 
                    : 'bg-[#1C140E] text-[#8E7B6C] border-[#3E2C1E]'
                }`}
              >
                {isVi ? 'Hiệu ứng nếp vải 3D' : '3D Cloth Folds'}
              </button>
            </div>

            {/* Hidden High-Res Pattern Source Canvas */}
            <canvas ref={canvasRef} className="hidden" />

            {/* Interactive Visible Swatch */}
            <div className="relative w-full aspect-square max-w-[320px] rounded-2xl overflow-hidden border-2 border-[#D4A043]/50 shadow-[0_10px_30px_rgba(0,0,0,0.6)] group">
              <canvas
                ref={previewSwatchRef}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              
              {/* Corner Badge */}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-sm border border-white/15 text-[10px] text-[#F5EFE6] font-sans">
                <span className="text-[#F3C96B] font-bold">{selectedMotif.nameVi}</span> • {isGoldFoil ? (isVi ? 'Dát Vàng' : 'Gold Foil') : (isVi ? 'Sắc Tơ' : 'Silk Accent')}
              </div>
            </div>

            {/* Symbolism & Cultural meaning card */}
            <div className="w-full p-3 rounded-xl bg-[#241A13]/90 border border-[#423023] space-y-1 text-left">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-serif font-bold text-[#F5EFE6]">{isVi ? selectedMotif.nameVi : selectedMotif.nameEn}</h4>
                <span className="text-[10px] text-[#D4A043] font-mono">{isVi ? selectedMotif.symbolismVi : selectedMotif.symbolismEn}</span>
              </div>
              <p className="text-[11px] text-[#BAA796] leading-relaxed">
                {isVi ? selectedMotif.descriptionVi : selectedMotif.descriptionEn}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="w-full flex items-center gap-2">
              <button
                type="button"
                onClick={handleDownloadSwatch}
                className="flex-1 py-2 rounded-xl bg-[#241A13] hover:bg-[#322319] border border-[#423023] text-[#D8CCC0] hover:text-white text-xs font-medium flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                title={isVi ? 'Lưu ảnh mẫu vải gấm xuống máy' : 'Download swatch PNG'}
              >
                <Download className="w-3.5 h-3.5 text-[#D4A043]" />
                <span>{isVi ? 'Tải Ảnh Mẫu' : 'Download PNG'}</span>
              </button>
              <button
                type="button"
                onClick={handleResetToTraditional}
                className="p-2 rounded-xl bg-[#241A13] hover:bg-[#322319] border border-[#423023] text-[#8E7B6C] hover:text-[#D8CCC0] text-xs transition-all cursor-pointer"
                title={isVi ? 'Đặt lại thông số ban đầu' : 'Reset parameters'}
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Customization Controls (7 cols) */}
          <div className="lg:col-span-7 space-y-5 text-left">
            {/* 1. Chọn Họa Tiết Cổ Phong (Motif Selector) */}
            <div className="space-y-2">
              <label className="text-xs font-sans font-bold text-[#F3C96B] uppercase tracking-wider flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5" />
                <span>{isVi ? '1. Chọn Hoa Văn Di Sản:' : '1. Select Traditional Motif:'}</span>
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 max-h-[160px] overflow-y-auto pr-1">
                {TRADITIONAL_MOTIFS.map((motif) => {
                  const isSelected = motif.id === selectedMotifId;
                  return (
                    <button
                      key={motif.id}
                      type="button"
                      onClick={() => setSelectedMotifId(motif.id)}
                      className={`p-2.5 rounded-xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-1 ${
                        isSelected
                          ? 'bg-[#2A1E14] border-[#D4A043] ring-1 ring-[#D4A043] shadow-md'
                          : 'bg-[#140D08]/60 border-[#3E2C1E] hover:border-[#594232]'
                      }`}
                    >
                      <span className="text-xs font-serif font-bold text-[#F5EFE6] line-clamp-1">
                        {isVi ? motif.nameVi : motif.nameEn}
                      </span>
                      <span className="text-[9.5px] text-[#8E7B6C] line-clamp-1">
                        {isVi ? motif.categoryVi : motif.categoryEn}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* 2. Chọn Màu Nền Vải (Base Color) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans font-bold text-[#F3C96B] uppercase tracking-wider flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5" />
                  <span>{isVi ? '2. Màu Nền Vải Lụa / Gấm:' : '2. Base Fabric Color:'}</span>
                </label>
                <div className="flex items-center gap-1.5">
                  <span className="text-[11px] font-mono text-[#BAA796]">{baseColor.toUpperCase()}</span>
                  <input
                    type="color"
                    value={baseColor}
                    onChange={(e) => setBaseColor(e.target.value)}
                    className="w-5 h-5 rounded-md border-0 p-0 cursor-pointer bg-transparent"
                    title={isVi ? 'Chọn mã màu tùy biến' : 'Pick custom HEX'}
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                {HERITAGE_BASE_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => setBaseColor(c.hex)}
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full border border-white/20 transition-all cursor-pointer flex items-center justify-center shadow-md relative ${
                      baseColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'ring-2 ring-[#D4A043] scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={isVi ? c.nameVi : c.nameEn}
                  >
                    {baseColor.toLowerCase() === c.hex.toLowerCase() && (
                      <Check className={`w-3.5 h-3.5 ${c.hex === '#F7F3EB' ? 'text-black' : 'text-white'}`} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Màu Nét Hoa Văn & Hiệu Ứng Dát Vàng (Motif Color & Shimmer) */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-xs font-sans font-bold text-[#F3C96B] uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isVi ? '3. Sắc Nét Hoa Văn & Ánh Kim Tuyến:' : '3. Motif Line Accent & Shimmer:'}</span>
                </label>
                <label className="flex items-center gap-1.5 text-xs text-[#E8D5B5] cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isGoldFoil}
                    onChange={(e) => setIsGoldFoil(e.target.checked)}
                    className="rounded accent-[#D4A043]"
                  />
                  <span>{isVi ? 'Dát vàng kim tuyến' : 'Gold Foil Shimmer'}</span>
                </label>
              </div>

              <div className="flex flex-wrap gap-2">
                {MOTIF_LINE_COLORS.map((c) => (
                  <button
                    key={c.hex}
                    type="button"
                    onClick={() => {
                      setMotifColor(c.hex);
                      if (c.isGold) setIsGoldFoil(true);
                    }}
                    className={`px-3 py-1.5 rounded-xl border text-xs font-medium flex items-center gap-2 transition-all cursor-pointer ${
                      motifColor.toLowerCase() === c.hex.toLowerCase()
                        ? 'bg-[#2A1E14] border-[#D4A043] text-white shadow-md'
                        : 'bg-[#140D08]/60 border-[#3E2C1E] text-[#BAA796] hover:text-white'
                    }`}
                  >
                    <span className="w-3.5 h-3.5 rounded-full border border-white/20 shadow-sm" style={{ backgroundColor: c.hex }} />
                    <span>{isVi ? c.nameVi : c.nameEn}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 4. Tinh Chỉnh Tham Số Canvas (Scale, Density, Flow, Opacity) */}
            <div className="p-3.5 rounded-2xl bg-[#140D08]/60 border border-[#3E2C1E] space-y-3.5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-serif font-bold text-[#F5EFE6] flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#D4A043]" />
                  <span>{isVi ? 'Thông Số Dệt Vải (Canvas Procedural Controls)' : 'Procedural Parameters'}</span>
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                {/* Scale */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#BAA796]">
                    <span>{isVi ? 'Kích thước họa tiết:' : 'Motif Scale:'}</span>
                    <span className="font-mono text-[#F3C96B]">{patternScale}px</span>
                  </div>
                  <input
                    type="range"
                    min="32"
                    max="96"
                    step="4"
                    value={patternScale}
                    onChange={(e) => setPatternScale(Number(e.target.value))}
                    className="w-full accent-[#D4A043]"
                  />
                </div>

                {/* Opacity */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[#BAA796]">
                    <span>{isVi ? 'Độ rõ nét / Độ chìm:' : 'Motif Opacity:'}</span>
                    <span className="font-mono text-[#F3C96B]">{opacity}%</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="100"
                    step="5"
                    value={opacity}
                    onChange={(e) => setOpacity(Number(e.target.value))}
                    className="w-full accent-[#D4A043]"
                  />
                </div>

                {/* Density */}
                <div className="space-y-1.5">
                  <span className="text-[#BAA796]">{isVi ? 'Mật độ hoa văn:' : 'Pattern Density:'}</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['sparse', 'normal', 'dense'] as const).map((d) => (
                      <button
                        key={d}
                        type="button"
                        onClick={() => setDensity(d)}
                        className={`py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                          density === d
                            ? 'bg-[#536B49] text-white border-[#78976A]'
                            : 'bg-[#1C140E] text-[#8E7B6C] border-[#3E2C1E]'
                        }`}
                      >
                        {d === 'sparse' ? (isVi ? 'Thưa' : 'Sparse') : d === 'normal' ? (isVi ? 'Vừa' : 'Normal') : (isVi ? 'Dày' : 'Dense')}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layout Flow */}
                <div className="space-y-1.5">
                  <span className="text-[#BAA796]">{isVi ? 'Bố cục sắp xếp:' : 'Arrangement Flow:'}</span>
                  <div className="grid grid-cols-3 gap-1.5">
                    {(['grid', 'diagonal', 'organic'] as const).map((flow) => (
                      <button
                        key={flow}
                        type="button"
                        onClick={() => setLayoutFlow(flow)}
                        className={`py-1 rounded-lg border text-[11px] font-medium transition-all cursor-pointer ${
                          layoutFlow === flow
                            ? 'bg-[#536B49] text-white border-[#78976A]'
                            : 'bg-[#1C140E] text-[#8E7B6C] border-[#3E2C1E]'
                        }`}
                      >
                        {flow === 'grid' ? (isVi ? 'Thẳng' : 'Grid') : flow === 'diagonal' ? (isVi ? 'So Le' : 'Staggered') : (isVi ? 'Lượn Sóng' : 'Organic')}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Apply Button */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-full bg-[#1C140E] hover:bg-[#2A1D14] border border-[#423023] text-xs font-sans text-[#BAA796] hover:text-white transition-all cursor-pointer"
              >
                {isVi ? 'Hủy Bỏ' : 'Cancel'}
              </button>

              <button
                type="button"
                onClick={handleApply}
                className="px-6 py-2.5 rounded-full bg-gradient-to-r from-[#D4A043] via-[#BA8A30] to-[#8E6319] hover:from-[#E2B155] hover:to-[#A37320] text-[#140D08] text-xs sm:text-sm font-serif font-bold shadow-lg shadow-[#D4A043]/30 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center gap-2"
              >
                <Sparkles className="w-4 h-4 fill-[#140D08]" />
                <span>{isVi ? 'Áp Dụng Lên Phục Trang' : 'Apply Pattern to Costume'}</span>
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
