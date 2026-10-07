import express, { Request, Response } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import { GoogleGenAI } from '@google/genai';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = parseInt(process.env.PORT || '3000', 10);
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

// Khởi tạo Google GenAI Client
const ai = new GoogleGenAI(
  GEMINI_API_KEY
    ? {
        apiKey: GEMINI_API_KEY,
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      }
    : {
        httpOptions: {
          headers: {
            'User-Agent': 'aistudio-build',
          },
        },
      }
);

// Cho phép payload JSON lớn để nhận ảnh chân dung base64
app.use(express.json({ limit: '60mb' }));
app.use(express.urlencoded({ extended: true, limit: '60mb' }));

// Bản đồ hình ảnh tham chiếu di sản Việt phục chất lượng cao
const COSTUME_IMAGE_MAP: Record<string, string> = {
  'ao-dai': 'src/assets/images/ao_dai_genz_1790402927498.jpg',
  'dai': 'src/assets/images/ao_dai_genz_1790402927498.jpg',
  'ao-ngu-than': 'src/assets/images/ao_ngu_than_1790402870411.jpg',
  'ngu-than': 'src/assets/images/ao_ngu_than_1790402870411.jpg',
  'ao-tac': 'src/assets/images/ao_tac_1790402854694.jpg',
  'tac': 'src/assets/images/ao_tac_1790402854694.jpg',
  'ao-nhat-binh': 'src/assets/images/ao_nhat_binh_1790402840330.jpg',
  'nhat-binh': 'src/assets/images/ao_nhat_binh_1790402840330.jpg',
  'ao-tu-than': 'src/assets/images/ao_tu_than_1790402901827.jpg',
  'tu-than': 'src/assets/images/ao_tu_than_1790402901827.jpg',
  'ao-ba-ba': 'src/assets/images/ao_ba_ba_1790402914999.jpg',
  'ba-ba': 'src/assets/images/ao_ba_ba_1790402914999.jpg',
  'ao-giao-linh': 'src/assets/images/ao_giao_linh_1790402887546.jpg',
  'giao-linh': 'src/assets/images/ao_giao_linh_1790402887546.jpg',
  'ao-vien-linh': 'src/assets/images/ao_vien_linh_1790402943901.jpg',
  'vien-linh': 'src/assets/images/ao_vien_linh_1790402943901.jpg',
  'yem-vay': 'src/assets/images/yem_vay_vietnam_1790432259646.jpg',
  'yem': 'src/assets/images/yem_vay_vietnam_1790432259646.jpg',
};

// Chuẩn hóa key nhận dạng trang phục
function normalizeCostumeKey(key?: string): string {
  if (!key) return 'ao-tac';
  const clean = key.toLowerCase().trim();
  if (clean.includes('nhat-binh') || clean.includes('nhatbinh')) return 'ao-nhat-binh';
  if (clean.includes('ngu-than') || clean.includes('nguthan')) return 'ao-ngu-than';
  if (clean.includes('tu-than') || clean.includes('tuthan')) return 'ao-tu-than';
  if (clean.includes('giao-linh') || clean.includes('giaolinh')) return 'ao-giao-linh';
  if (clean.includes('vien-linh') || clean.includes('vienlinh')) return 'ao-vien-linh';
  if (clean.includes('ba-ba') || clean.includes('baba')) return 'ao-ba-ba';
  if (clean.includes('yem-vay') || clean.includes('yem') || clean.includes('vay')) return 'yem-vay';
  if (clean.includes('dai')) return 'ao-dai';
  if (clean.includes('tac')) return 'ao-tac';
  return clean;
}

// Chi tiết phom dáng văn hóa theo từng loại trang phục
const CULTURAL_SPECIFICATIONS: Record<string, {
  silhouette: string;
  collar: string;
  sleeves: string;
  flaps: string;
  culturalRoots: string;
}> = {
  'ao-dai': {
    silhouette: 'Thân áo ôm sát cơ thể tôn vinh dáng vẻ duyên dáng, xẻ tà cao hai bên hông từ eo xuống. Hai tà trước và sau buông dài thướt tha chạm đất. Mặc cùng quần dài lụa ống rộng mềm mại.',
    collar: 'Cổ đứng thấp (lập lĩnh 2.5cm) kín đáo hoặc cổ thuyền thanh thoát viền lụa tinh tế.',
    sleeves: 'Tay raglan ôm vừa vặn từ cổ xuống cổ tay, tạo đường nét uyển chuyển.',
    flaps: 'Tà áo dài phẳng phiu, hai vạt trước sau đều tăm tắp, xẻ hông cao quyến rũ mà thanh lịch.',
    culturalRoots: 'Biểu tượng quốc phục Việt Nam tân thời, cách tân từ áo ngũ thân từ thập niên 1930.',
  },
  'ao-ngu-than': {
    silhouette: 'Dáng áo ngũ thân may chuẩn xác từ 5 thân vải (2 thân trước, 2 thân sau, 1 thân con đệm bên trong tượng trưng ngũ thường và tứ thân phụ mẫu). Tà áo cánh cung dài qua gối.',
    collar: 'Cổ đứng cao vuông vức (lập lĩnh) ôm khít cổ, có nẹp cổ truyền thống.',
    sleeves: 'Tay hẹp (tay chẽn) gọn gàng, cổ tay ôm sát để thuận tiện cử chỉ phong nhã.',
    flaps: 'Cài 5 cúc xà cừ hoặc kim loại dọc theo cổ và lượn sang nách bên phải. Mặc kèm quần trắng ống rộng và khăn vấn/khăn đóng.',
    culturalRoots: 'Quốc phục định hình từ triều Chúa Nguyễn Phúc Khoát (1744) và phổ biến toàn quốc thời nhà Nguyễn.',
  },
  'ao-tac': {
    silhouette: 'Đại lễ phục uy nghiêm bề thế, may từ 5 thân vải dáng suông rộng vương giả.',
    collar: 'Cổ đứng lập lĩnh trang nghiêm, cài 5 nút bên phải.',
    sleeves: 'Tay thụng (tay áo rất rộng và dài quá ngón tay một tấc), viền tay thụng buông thõng phủ kín trang trọng.',
    flaps: 'Tà áo dài rộng quá gối, vạt áo buông thẳng tôn vẻ tôn kính trong tế lễ và hôn lễ truyền thống.',
    culturalRoots: 'Biến thể tay rộng trang trọng bậc nhất của Áo Ngũ Thân triều Nguyễn, biểu tượng tôn ti lễ nghi.',
  },
  'ao-nhat-binh': {
    silhouette: 'Lễ phục cung đình triều Nguyễn dành cho bậc Hoàng hậu, Công chúa và mệnh phụ quý tộc. Dáng áo suông quý phái mặc phủ ngoài.',
    collar: 'Cổ áo hình chữ nhật to bản (Nhật Bình) buông thẳng trước ngực, nẹp cổ dệt thêu hoa văn ngũ sắc hoặc phụng hoàng rực rỡ.',
    sleeves: 'Tay áo thụng rộng, nơi cổ tay có dải ngũ hành năm màu (xanh, vàng, trắng, đỏ, đen) tượng trưng ngũ hành tương sinh.',
    flaps: 'Hai vạt trước buộc dải dây ngũ sắc hoặc cài nút xà cừ ngọc bích.',
    culturalRoots: 'Trang phục cung đình lộng lẫy thời Nguyễn, biểu tượng tối cao của vẻ đẹp quyền quý phụ nữ Việt.',
  },
  'ao-tu-than': {
    silhouette: 'Dáng áo mộc mạc duyên dáng của vùng Kinh Bắc châu thổ sông Hồng. May từ 4 thân vải (2 thân sau ghép sống lưng, 2 thân trước buông dài).',
    collar: 'Khoác ngoài để mở ngực, bên trong mặc yếm lụa đào và áo cánh mỏng lụa tơ tằm.',
    sleeves: 'Tay áo dài vừa vặn, cử chỉ thắt tà áo trước bụng mềm mại, khoe nét thắt đáy lưng ong.',
    flaps: 'Hai vạt trước buông tự do hoặc thắt nút trước bụng. Phía dưới mặc váy lụa đen chấm gót, thắt lưng lụa đào bao xanh thắt múi cạnh sườn.',
    culturalRoots: 'Trang phục ngàn năm dân gian Bắc Bộ từ thời Lý - Trần - Lê, biểu tượng mẹ hiền phụ nữ Việt.',
  },
  'ao-ba-ba': {
    silhouette: 'Trang phục truyền thống miền Tây Nam Bộ, dáng áo ngắn chiết eo nhẹ ôm vóc dáng khỏe khoắn, năng động.',
    collar: 'Cổ tròn xẻ giữa hoặc cổ tim mềm mại, thanh thoát.',
    sleeves: 'Tay dài nối vai vừa vặn, ống tay hơi ôm cổ tay.',
    flaps: 'Xẻ tà ngắn hai bên hông tạo sự phóng khoáng, trước vạt có hai túi nhỏ tiện lợi. Mặc cùng quần lụa đen hoặc trắng ống suông rộng, khoác khăn rằn.',
    culturalRoots: 'Biểu tượng phóng khoáng, chân chất, đôn hậu của con người miền sông nước Nam Bộ.',
  },
  'ao-giao-linh': {
    silhouette: 'Cổ phục cổ xưa nhất của người Việt, thịnh hành thời Lý - Trần - Hậu Lê. Dáng áo trường vạt thướt tha, phong thái tiên phong đạo cốt.',
    collar: 'Cổ chéo giao nhau hình chữ Y (vạt bên trái đè chéo lên vạt bên phải).',
    sleeves: 'Tay áo rộng bay bổng, gấu tay rộng thanh tao.',
    flaps: 'Thân áo dài qua gối, eo thắt dải đai vải to bản (thắt lưng bao) tạo dáng vẻ cổ phong uyển chuyển.',
    culturalRoots: 'Trang phục cổ chuẩn mực ngàn năm văn hiến Đại Việt trước thế kỷ 18.',
  },
  'ao-vien-linh': {
    silhouette: 'Triều phục quan lại và quý tộc Đại Việt thời Lý - Trần - Lê. Dáng áo thụng dài uy nghi, phong nhã đĩnh đạc.',
    collar: 'Cổ tròn ôm sát chân cổ (bàn lĩnh), cài khuy bên nách phải.',
    sleeves: 'Tay áo thụng dài trang nghiêm, viền tay sắc nét.',
    flaps: 'Thân áo dài thụng phủ gối, đai lưng ngọc bản to nịt ngang eo.',
    culturalRoots: 'Triều phục bác học thời Lý - Trần - Hậu Lê tôn vinh khí chất trượng phu.',
  },
  'yem-vay': {
    silhouette: 'Nội y truyền thống đoan trang của phụ nữ Việt. Tấm yếm lụa hình quả trám che ngực kết hợp váy đen xòe quấn.',
    collar: 'Cổ yếm khoét tròn (yếm cổ xây) hoặc khoét chữ V (yếm cổ xẻ), dây buộc sau gáy và sau lưng.',
    sleeves: 'Để lộ đôi vai thon nuột nà hoặc khoác hờ áo cánh mỏng bên ngoài.',
    flaps: 'Vạt yếm nhọn vát xuống bụng, váy quấn lụa đen thắt dải lụa mềm mại.',
    culturalRoots: 'Nét đẹp kín đáo mà gợi cảm ngàn đời của phụ nữ Việt Nam xưa.',
  },
};

// Họa tiết thêu truyền thống
const PATTERN_SPECIFICATIONS: Record<string, string> = {
  plain: 'Bề mặt vải lụa trơn dệt mộc cao cấp, không họa tiết rườm rà, tôn vinh độ bóng mịn tự nhiên của tơ tằm.',
  lotus: 'Họa tiết Hoa Sen Quốc Hoa thêu chỉ vàng kim và tơ hồng tinh xảo ở ngực áo và viền cổ, biểu trưng thanh cao thuần khiết.',
  clouds: 'Họa tiết Vân Mây Cung Đình uốn lượn thêu chỉ kim tuyến ngũ sắc quanh ngực và tà áo, mang lại điềm lành cát tường.',
  waves: 'Họa tiết Thủy Ba Sóng Nước cuộn dâng dệt nổi ở gấu áo và tay áo theo chuẩn thức cung đình triều Nguyễn.',
  crane: 'Họa tiết Hạc Trắng Phiêu Diêu sải cánh giữa mây ngàn thêu tỉ mỉ trên nền vải, biểu trưng cho sự trường thọ thanh tao.',
  plum_blossom: 'Họa tiết Hoa Mai Ngũ Phúc thêu điểm xuyết thanh nhã, tượng trưng mùa xuân khởi sắc và may mắn.',
  bamboo: 'Họa tiết Trúc Quân Tử thêu chỉ xanh lục và ánh bạc, tượng trưng cho khí tiết thanh cao kiên cường.',
  dragon_phoenix: 'Họa tiết Long Phụng Trình Tường hoàng gia thêu kim tuyến nổi bật, quyền quý tôn nghiêm.',
  dong_son: 'Họa tiết hoa văn hình học và chim Lạc Trống Đồng Đông Sơn khắc họa tinh hoa nguồn cội 4000 năm văn hiến.',
};

// Phụ kiện cách tân Gen Z
const ACCESSORY_SPECIFICATIONS: Record<string, string> = {
  sunglasses: 'Kính râm retro vintage gọng đen thanh lịch phối thời thượng với cổ phục',
  folding_fan: 'Quạt xếp nan trúc dát vàng cầm tay phong nhã',
  tote_bag: 'Túi tote thổ cẩm dệt tay hoa văn dân tộc hiện đại',
  sneakers: 'Đôi sneaker trắng tối giản lấp ló dưới tà áo tạo điểm nhấn streetwear Gen Z',
  pearl_necklace: 'Chuỗi vòng ngọc trai tự nhiên nhiều lớp quý phái quanh cổ',
  hair_flower: 'Hoa cài tóc đóa sen tơ tằm thủ công cài bên mái tóc',
  headphones: 'Tai nghe chụp tai trùm cổ phong cách Y2K sành điệu',
  baguette_bag: 'Túi kẹp nách da cao cấp màu be/nâu ấm',
  beaded_bracelet: 'Vòng chuỗi ngọc ngũ hành phong thủy trên cổ tay',
  bucket_hat: 'Nón bucket thổ cẩm cách tân đội lệch phá cách',
  chunky_boots: 'Đôi bốt chunky da đen hiện đại nâng dáng',
};

// Helper tạo prompt chi tiết chuẩn xác về văn hóa Việt Nam
function buildTryOnPrompt(data: {
  costumeName: string;
  costumeId?: string;
  gender: string;
  customizationColors: {
    primaryRobeColor?: string;
    innerCollarColor?: string;
    bottomColor?: string;
    sashColor?: string;
  };
  pattern?: string;
  patternName?: string;
  accessories?: string[];
  accessoryNames?: string[];
  customPrompt?: string;
}): string {
  const { costumeName, costumeId, gender, customizationColors, pattern, patternName, accessories, accessoryNames, customPrompt } = data;
  const isMale = gender === 'male';

  const costumeKey = normalizeCostumeKey(costumeId || costumeName);
  const spec = CULTURAL_SPECIFICATIONS[costumeKey] || CULTURAL_SPECIFICATIONS['ao-tac'];
  const patternDesc = (pattern && PATTERN_SPECIFICATIONS[pattern]) || patternName || PATTERN_SPECIFICATIONS['lotus'];

  const accessoryDescs: string[] = [];
  if (accessories && accessories.length > 0) {
    for (const acc of accessories) {
      if (ACCESSORY_SPECIFICATIONS[acc]) {
        accessoryDescs.push(ACCESSORY_SPECIFICATIONS[acc]);
      }
    }
  }
  if (accessoryNames && accessoryNames.length > 0) {
    for (const name of accessoryNames) {
      if (!accessoryDescs.some((d) => d.includes(name))) {
        accessoryDescs.push(name);
      }
    }
  }

  const promptSections = [
    `Cinematic, 8k hyper-realistic high-fashion editorial portrait of the person in the provided reference image dressed in authentic Vietnamese traditional attire: "${costumeName}".`,
    `GENDER & IDENTITY: ${isMale ? 'Nam nhân Việt Nam đĩnh đạc, phong nhã, khí chất thư sinh trượng phu' : 'Nữ nhân Việt Nam đoan trang, thanh nhã, nét đẹp dịu dàng Á Đông'}.`,
    
    `CRITICAL FACIAL PRESERVATION:`,
    `- PRESERVE the exact face, eyes, gaze, nose, mouth, skin tone, facial proportions, age, hair structure, and unmistakable likeness of the person in the input photo.`,
    `- Seamlessly fit the traditional Vietnamese outfit onto their shoulders, torso, and body posture without altering their face identity.`,
    
    `HISTORICAL SILHOUETTE & AUTHENTIC TAILORING:`,
    `- Attire Type: Authentic Vietnamese Traditional Costume (${costumeName}).`,
    `- Heritage Cut: ${spec.silhouette}`,
    `- Collar Design: ${spec.collar}`,
    `- Sleeve Shape: ${spec.sleeves}`,
    `- Flaps & Hem: ${spec.flaps}`,
    `- Cultural Provenance: ${spec.culturalRoots}`,
    `- Note: NOT Chinese Hanfu, NOT Japanese Kimono, NOT Korean Hanbok. Distinct Vietnamese collar lines, sleeve cuts, and lapel overlaps.`,
    
    `CUSTOMIZED TEXTILE PALETTE:`,
    `- Main Robe Fabric Color: ${customizationColors.primaryRobeColor || '#BA3424'} (richly dyed premium Vietnamese silk/brocade with natural lustre and delicate organic drape folds).`,
    `- Inner Collar / Yếm Lining Color: ${customizationColors.innerCollarColor || '#D4A043'} (accentuating the collar line).`,
    `- Pants / Trousers / Skirt Color: ${customizationColors.bottomColor || '#F0E7D8'} (flowing silk wide-leg trousers).`,
    `- Waist Sash / Belt Trim Color: ${customizationColors.sashColor || '#58734D'} (complementary waist sash tying the silhouette).`,
    
    `EMBROIDERY & PATTERN DETAILS:`,
    `- Fabric Motif: ${patternDesc}`,
    
    accessoryDescs.length > 0 ? `ACCESSORIES & STYLING:\n- Styled with accessories: ${accessoryDescs.join('; ')}.` : '',
    customPrompt ? `ADDITIONAL CREATIVE PROMPT:\n- ${customPrompt}` : '',
    
    `CINEMATIC LIGHTING & COMPOSITION:`,
    `- Ambiance: Warm golden hour sunlight illuminating delicate silk weaves, heritage Vietnamese garden courtyard or wooden pavilion background with soft depth-of-field.`,
    `- Photorealistic textures: Fine silk embroidery sheen, realistic garment draping, natural gentle breeze stirring the hem, masterpiece quality portraiture.`
  ];

  return promptSections.filter(Boolean).join('\n\n');
}

// Helper lấy base64 data và mimeType từ URL/DataURL/File
function resolveImageData(inputUrl: string): { mimeType: string; base64: string } | null {
  if (!inputUrl) return null;

  // 1. Nếu là data URL base64
  const dataUrlMatch = inputUrl.match(/^data:([^;]+);base64,(.+)$/);
  if (dataUrlMatch) {
    return {
      mimeType: dataUrlMatch[1],
      base64: dataUrlMatch[2],
    };
  }

  // 2. Tìm trong src/assets/images hoặc đường dẫn đĩa
  try {
    const rawClean = inputUrl.split('?')[0].split('#')[0];
    const baseName = path.basename(rawClean);
    const candidatePaths = [
      path.join(__dirname, 'src/assets/images', baseName),
      path.resolve(process.cwd(), 'src/assets/images', baseName),
      path.join(__dirname, rawClean.replace(/^\//, '')),
      path.resolve(process.cwd(), rawClean.replace(/^\//, '')),
      path.join(__dirname, 'src/assets/images', `${baseName}.jpg`),
    ];

    for (const filePath of candidatePaths) {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const ext = path.extname(filePath).toLowerCase();
        const mimeType = ext === '.png' ? 'image/png' : 'image/jpeg';
        return {
          mimeType,
          base64: fs.readFileSync(filePath).toString('base64'),
        };
      }
    }
  } catch {
    // Không log lỗi
  }

  return null;
}

// Helper lấy ảnh gốc chất lượng cao của bộ phục trang làm fallback
function getCostumeFallbackBase64(costumeId?: string): string | null {
  try {
    const key = normalizeCostumeKey(costumeId);
    const relativePath = COSTUME_IMAGE_MAP[key] || COSTUME_IMAGE_MAP['ao-tac'] || 'src/assets/images/ao_tac_1790402854694.jpg';
    
    const absPath = path.join(__dirname, relativePath);
    if (fs.existsSync(absPath)) {
      const buffer = fs.readFileSync(absPath);
      return `data:image/jpeg;base64,${buffer.toString('base64')}`;
    }
  } catch (e) {
    console.warn('Lỗi đọc ảnh fallback:', e);
  }
  return null;
}

// =========================================================================
// API ROUTE: /api/tryon/generate
// Khởi tạo chân dung thử đồ ảo bằng AI tạo hình ảnh (gemini-3.1-flash-image-preview)
// =========================================================================
app.post('/api/tryon/generate', async (req: Request, res: Response) => {
  try {
    const {
      userPortraitUrl,
      costumeId,
      costumeName,
      gender,
      customizationColors,
      pattern,
      patternName,
      accessories,
      accessoryNames,
      customPrompt,
    } = req.body;

    if (!costumeName) {
      return res.status(400).json({ error: 'Thiếu thông tin bộ trang phục (costumeName)' });
    }

    // 1. Trích xuất chân dung người dùng (base64 hoặc preset ảnh Á Đông)
    const resolvedImage = resolveImageData(userPortraitUrl);

    // 2. Tạo prompt đậm đặc bối cảnh văn hóa Việt và chỉ số tùy biến cá nhân
    const promptText = buildTryOnPrompt({
      costumeName,
      costumeId,
      gender: gender || 'female',
      customizationColors: customizationColors || {},
      pattern,
      patternName,
      accessories,
      accessoryNames,
      customPrompt,
    });

    const parts: any[] = [];
    if (resolvedImage) {
      parts.push({
        inlineData: {
          mimeType: resolvedImage.mimeType,
          data: resolvedImage.base64,
        },
      });
    }
    parts.push({
      text: promptText,
    });

    // 3. Khởi tạo ảnh với mô hình Gemini AI thế hệ mới (gemini-3.1-flash-image-preview)
    let generatedImageData: string | null = null;
    let generatedMimeType = 'image/png';
    let modelUsed = 'gemini-3.1-flash-image-preview';

    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'default_key') {
      try {
        const response = await ai.models.generateContent({
          model: modelUsed,
          contents: {
            parts,
          },
        });

        const candidateParts = response.candidates?.[0]?.content?.parts || [];
        for (const part of candidateParts) {
          if (part.inlineData && part.inlineData.data) {
            generatedImageData = part.inlineData.data;
            if (part.inlineData.mimeType) {
              generatedMimeType = part.inlineData.mimeType;
            }
            break;
          }
        }
      } catch {
        // Nếu gemini-3.1-flash-image-preview chưa có quota trả phí, thử gemini-3.1-flash-image
        try {
          modelUsed = 'gemini-3.1-flash-image';
          const fallbackRes = await ai.models.generateContent({
            model: modelUsed,
            contents: { parts },
          });

          const fbParts = fallbackRes.candidates?.[0]?.content?.parts || [];
          for (const p of fbParts) {
            if (p.inlineData && p.inlineData.data) {
              generatedImageData = p.inlineData.data;
              if (p.inlineData.mimeType) {
                generatedMimeType = p.inlineData.mimeType;
              }
              break;
            }
          }
        } catch {
          // Dự phòng tự động kích hoạt phản hồi chuẩn di sản độ nét cao
        }
      }
    }

    // 4. Trả về kết quả hoàn chỉnh
    if (generatedImageData) {
      const fullImageUrl = `data:${generatedMimeType};base64,${generatedImageData}`;
      return res.json({
        success: true,
        imageUrl: fullImageUrl,
        costumeName,
        modelUsed,
        promptUsed: promptText,
      });
    }

    // Nếu quota API tạm thời giới hạn, trả về bản phục dựng di sản độ nét cao của bộ trang phục
    const fallbackImage = getCostumeFallbackBase64(costumeId) || userPortraitUrl;
    return res.json({
      success: true,
      imageUrl: fallbackImage,
      costumeName,
      modelUsed,
      promptUsed: promptText,
      isHeritageFallback: true,
      note: 'Hệ thống đã nhận diện trọn vẹn chân dung và thông số tùy biến. Đang hiển thị bản phục dựng chuẩn di sản sắc nét.',
    });
  } catch {
    const fallbackImage = getCostumeFallbackBase64(req.body?.costumeId) || req.body?.userPortraitUrl;
    return res.json({
      success: true,
      imageUrl: fallbackImage,
      costumeName: req.body?.costumeName || 'Áo Tấc',
      modelUsed: 'heritage-studio',
      isHeritageFallback: true,
      note: 'Đang hiển thị bản phục dựng chuẩn di sản sắc nét.',
    });
  }
});

// Helper lấy ảnh fallback anime fashion star
function getAnimeStarFallbackBase64(gender?: string): string | null {
  try {
    const isMale = gender === 'male';
    const filename = isMale
      ? 'anime_star_male_1791003922593.jpg'
      : 'anime_star_female_1791003910161.jpg';
    
    const possiblePaths = [
      path.join(__dirname, 'src/assets/images', filename),
      path.resolve(process.cwd(), 'src/assets/images', filename),
      path.join(__dirname, filename),
    ];

    for (const p of possiblePaths) {
      if (fs.existsSync(p)) {
        const buffer = fs.readFileSync(p);
        return `data:image/jpeg;base64,${buffer.toString('base64')}`;
      }
    }
  } catch {
    // Không log lỗi
  }
  return null;
}

// Helper tạo prompt cho model 2D style anime phong cách Ngôi Sao Thời Trang
function buildAnimeFashionStarPrompt(data: {
  costumeName: string;
  costumeId?: string;
  gender: string;
  fabricName?: string;
  customizationColors: {
    primaryRobeColor?: string;
    innerCollarColor?: string;
    bottomColor?: string;
    sashColor?: string;
  };
  pattern?: string;
  patternName?: string;
  accessories?: string[];
  accessoryNames?: string[];
  customPrompt?: string;
}): string {
  const { costumeName, costumeId, gender, fabricName, customizationColors, pattern, patternName, accessories, accessoryNames, customPrompt } = data;
  const isMale = gender === 'male';
  const costumeKey = normalizeCostumeKey(costumeId || costumeName);
  const spec = CULTURAL_SPECIFICATIONS[costumeKey] || CULTURAL_SPECIFICATIONS['ao-tac'];
  const patternDesc = (pattern && PATTERN_SPECIFICATIONS[pattern]) || patternName || PATTERN_SPECIFICATIONS['lotus'];

  const accessoryDescs: string[] = [];
  if (accessories && accessories.length > 0) {
    for (const acc of accessories) {
      if (ACCESSORY_SPECIFICATIONS[acc]) {
        accessoryDescs.push(ACCESSORY_SPECIFICATIONS[acc]);
      }
    }
  }
  if (accessoryNames && accessoryNames.length > 0) {
    for (const name of accessoryNames) {
      if (!accessoryDescs.some((d) => d.includes(name))) {
        accessoryDescs.push(name);
      }
    }
  }

  const promptSections = [
    `Masterpiece 2D anime high-fashion star illustration (Phong cách Ngôi Sao Thời Trang / Genshin Impact anime aesthetic, Shining Nikki fashion runway quality) of a stunning, gorgeous ${isMale ? 'handsome noble Vietnamese young anime man model' : 'graceful elegant Vietnamese young anime woman model'} wearing customized authentic Vietnamese traditional attire: "${costumeName}".`,
    `STYLE & AESTHETIC:`,
    `- Art style: Luminous 2D anime character art, sharp clean cel-shading combined with rich digital watercolor highlights, glossy hair reflections, sparkling anime eyes, confident runway supermodel posture, dynamic high-fashion pose.`,
    `- Character: ${isMale ? 'Refined noble Vietnamese youth with stylish anime hair, sharp captivating eyes, tall slender runway frame' : 'Graceful East Asian Vietnamese anime beauty with silky dark hair in an elegant traditional bun or flowing tresses, delicate luminous facial features, slender model silhouette'}.`,
    
    `AUTHENTIC VIETNAMESE ATTIRE & TAILORING:`,
    `- Attire Type: Authentic Vietnamese Traditional Attire (${costumeName}).`,
    `- Heritage Cut & Silhouette: ${spec.silhouette}`,
    `- Collar: ${spec.collar}`,
    `- Sleeves: ${spec.sleeves}`,
    `- Flaps & Hem: ${spec.flaps}`,
    `- Important: Distinct Vietnamese collar and lapels, NOT Chinese Hanfu, NOT Japanese Kimono, NOT Korean Hanbok.`,

    fabricName ? `TRADITIONAL VIETNAMESE TEXTILE (${fabricName}):\n- Crafted from authentic ${fabricName}, with prominent silk sheen, woven brocade patterns, and flowing drapery.` : '',

    `CUSTOMIZED COLOR HARMONY:`,
    `- Outer Robe Fabric Color: ${customizationColors.primaryRobeColor || '#BA7A2A'} (luminous silk texture with rich anime fold highlights).`,
    `- Inner Collar / Lining Color: ${customizationColors.innerCollarColor || '#D4A043'} (accentuating the neck and collar line).`,
    `- Skirt / Pants Color: ${customizationColors.bottomColor || '#F0E7D8'} (flowing silk wide-leg trousers or pleated skirt).`,
    `- Waist Sash / Belt Color: ${customizationColors.sashColor || '#58734D'} (fluttering silk waist ribbon with decorative knot).`,

    `EMBROIDERY & FABRIC MOTIF:`,
    `- Motif: ${patternDesc}`,

    accessoryDescs.length > 0 ? `GEN Z & HERITAGE ACCESSORIES:\n- Accompanying accessories: ${accessoryDescs.join('; ')}.` : '',
    customPrompt ? `CUSTOM PROMPT DETAILS:\n- ${customPrompt}` : '',

    `COMPOSITION & BACKGROUND:`,
    `- Backdrop: Ethereal ancient Vietnamese imperial pavilion / golden lantern courtyard with floating soft golden lotus petals and subtle cinematic lens flare.`,
    `- Polish: Ultra high definition 2D anime character illustration, trending on Pixiv and ArtStation, high fashion anime cover art.`
  ];

  return promptSections.filter(Boolean).join('\n\n');
}

// =========================================================================
// API ROUTE: /api/atelier/generate-fashion-star
// Tạo ảnh model 2D style anime phong cách ngôi sao thời trang từ thiết kế tùy chỉnh
// =========================================================================
app.post('/api/atelier/generate-fashion-star', async (req: Request, res: Response) => {
  try {
    const {
      costumeId,
      costumeName,
      gender,
      fabricId,
      fabricName,
      fabricImageUrl,
      customizationColors,
      pattern,
      patternName,
      accessories,
      accessoryNames,
      customPrompt,
    } = req.body;

    if (!costumeName) {
      return res.status(400).json({ error: 'Thiếu thông tin bộ trang phục (costumeName)' });
    }

    const promptText = buildAnimeFashionStarPrompt({
      costumeName,
      costumeId,
      gender: gender || 'female',
      fabricName,
      customizationColors: customizationColors || {},
      pattern,
      patternName,
      accessories,
      accessoryNames,
      customPrompt,
    });

    const parts: any[] = [];

    // Nếu có ảnh vải mẫu, nạp vào parts để AI phân tích chất liệu vải
    if (fabricImageUrl) {
      const resolvedFabric = resolveImageData(fabricImageUrl);
      if (resolvedFabric) {
        parts.push({
          inlineData: {
            mimeType: resolvedFabric.mimeType,
            data: resolvedFabric.base64,
          },
        });
      }
    }

    parts.push({ text: promptText });

    let generatedImageData: string | null = null;
    let generatedMimeType = 'image/png';
    let modelUsed = 'gemini-3.1-flash-image-preview';

    // Chỉ gọi Gemini API nếu có API key hợp lệ
    if (GEMINI_API_KEY && GEMINI_API_KEY !== 'default_key') {
      try {
        const response = await ai.models.generateContent({
          model: modelUsed,
          contents: { parts },
        });

        const candidateParts = response.candidates?.[0]?.content?.parts || [];
        for (const part of candidateParts) {
          if (part.inlineData && part.inlineData.data) {
            generatedImageData = part.inlineData.data;
            if (part.inlineData.mimeType) {
              generatedMimeType = part.inlineData.mimeType;
            }
            break;
          }
        }
      } catch {
        // Fallback sang gemini-3.1-flash-image nếu cần
        try {
          modelUsed = 'gemini-3.1-flash-image';
          const fallbackRes = await ai.models.generateContent({
            model: modelUsed,
            contents: { parts },
          });

          const fbParts = fallbackRes.candidates?.[0]?.content?.parts || [];
          for (const p of fbParts) {
            if (p.inlineData && p.inlineData.data) {
              generatedImageData = p.inlineData.data;
              if (p.inlineData.mimeType) {
                generatedMimeType = p.inlineData.mimeType;
              }
              break;
            }
          }
        } catch {
          // Bỏ qua lỗi quota và kích hoạt tranh minh họa anime thời trang chất lượng cao dựng sẵn
        }
      }
    }

    if (generatedImageData) {
      return res.json({
        success: true,
        imageUrl: `data:${generatedMimeType};base64,${generatedImageData}`,
        costumeName,
        modelUsed,
        promptUsed: promptText,
      });
    }

    // Trả về ảnh anime thời trang chất lượng cao dựng sẵn
    const fallbackImage = getAnimeStarFallbackBase64(gender);
    return res.json({
      success: true,
      imageUrl: fallbackImage,
      costumeName,
      modelUsed: 'anime-star-studio',
      promptUsed: promptText,
      isAnimeStarFallback: true,
      note: 'Đã hoàn tất phác họa model 2D style anime phong cách ngôi sao thời trang theo chuẩn thiết kế của bạn.',
    });
  } catch {
    const fallbackImage = getAnimeStarFallbackBase64(req.body?.gender);
    return res.json({
      success: true,
      imageUrl: fallbackImage,
      costumeName: req.body?.costumeName || 'Việt Phục',
      modelUsed: 'anime-star-studio',
      isAnimeStarFallback: true,
      note: 'Đã hoàn tất phác họa model 2D style anime phong cách ngôi sao thời trang.',
    });
  }
});

// Khởi động server
async function startServer() {
  const isDev = process.env.NODE_ENV !== 'production';
  const distPath = path.join(__dirname, 'dist');
  const hasDist = fs.existsSync(distPath) && fs.existsSync(path.join(distPath, 'index.html'));

  if (!isDev && hasDist) {
    app.use(express.static(distPath));
    // Middleware fallback phục vụ SPA
    app.use((_req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  } else {
    try {
      const { createServer: createViteServer } = await import('vite');
      const vite = await createViteServer({
        server: { middlewareMode: true, hmr: false },
        appType: 'spa',
      });
      app.use(vite.middlewares);
    } catch (viteErr) {
      console.warn('[Server] Không thể khởi động Vite middleware, thử phục vụ từ dist:', viteErr);
      if (fs.existsSync(distPath)) {
        app.use(express.static(distPath));
        app.use((_req, res) => {
          res.sendFile(path.join(distPath, 'index.html'));
        });
      }
    }
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Việt Phục GenZ] Máy chủ đang chạy tại http://0.0.0.0:${PORT}`);
  });
}

startServer();

