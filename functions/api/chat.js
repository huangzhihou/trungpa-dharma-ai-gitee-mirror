// Cloudflare Pages Function for Chat API
// 使用 fetch 获取静态数据，不依赖 Node.js fs 模块

// 专业术语字典（中英文对照）
const termDictionary = {
  'spiritual materialism': '精神唯物主义',
  'mindfulness': '正念',
  'mahamudra': '大手印',
  'basic goodness': '基本善',
  'bodhisattva vow': '菩萨戒',
  'tantra': '密续',
  'dharma': '法',
  'sangha': '僧伽',
  'guru': '上师',
  'shambhala': '香巴拉',
  'warriorship': '勇士精神',
  'bodhichitta': '菩提心',
  'buddha nature': '佛性',
  'enlightenment': '觉悟',
  'karma': '业力',
  'samsara': '轮回',
  'nirvana': '涅槃',
  'dharmata': '真如',
  'rigpa': '本觉',
  'emptiness': '空性',
  'compassion': '慈悲',
  'vipashyana': '毗婆舍那',
  'shamatha': '奢摩他',
  'vajrayana': '金刚乘',
  'mahayana': '大乘',
  'theravada': '上座部',
  'kagyu': '噶举',
  'bodhisattva': '菩萨',
  'arhat': '阿罗汉'
};

// 全局缓存（使用环境变量存储以支持跨请求缓存）
let cachedBooks = null;
let cacheTime = null;
const CACHE_DURATION = 10 * 60 * 1000; // 10分钟缓存

// 书籍文件列表（用于分片加载）
const BOOK_FILES = [
  'The_Collected_Works_of_Ch_gyam_Trungpa_Volume_1__Ch_gyam_Trungpa___Z-Library___1_.pdf.json',
  'The_Collected_Works_of_Cho_gyam_Trungpa_Volume_3__Cho_gyam_Trungpa___Z-Library_.pdf.json',
  'The_Collected_Works_of_Ch_gyam_Trungpa_Volume_2__Ch_gyam_Trungpa___Z-Library_.pdf.json',
  'The_Collected_Works_of_Ch_gyam_Trungpa_Volume_4__Ch_gyam_Trungpa___Z-Library_.pdf.json',
  'The_Collected_Works_of_Ch_gyam_Trungpa_Volume_5__Ch_gyam_Trungpa___Z-Library_.pdf.json',
  'The_Collected_Works_of_Ch_gyam_Trungpa_Volume_6__Ch_gyam_Trungpa___Z-Library_.pdf.json',
  'The_Collected_Works_of_Ch_gyam_Trungpa_Volume_7__Ch_gyam_Trungpa___Z-Library_.pdf.json',
  'The_Collected_Works_of_Ch_gyam_Trungpa_Volume_8__Ch_gyam_Trungpa___Z-Library_.pdf.json',
  'The_Collected_Works_of_Ch_gyam_Trungpa__Volume_9__Chogyam_Trungpa__Carolyn_Rose_Gimian___Z-Library_.pdf.json',
  'The_Collected_Works_of_Ch_gyam_Trungpa__Volume_10__Chogyam_Trungpa__Carolyn_Rose_Gimian___Z-Library_.pdf.json'
];

// 获取书籍数据 - 支持分片加载
async function getBooksData() {
  // 检查缓存
  if (cachedBooks && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
    console.log('✅ 使用缓存数据');
    return cachedBooks;
  }

  try {
    // 首先尝试加载完整的合并文件
    const response = await fetch('/data/all-content.json', {
      headers: {
        'Range': 'bytes=0-10485760' // 限制前 10MB
      }
    });

    if (response.ok || response.status === 206) {
      const text = await response.text();
      // 尝试解析 JSON（可能不完整）
      try {
        const data = JSON.parse(text);
        cachedBooks = data;
        cacheTime = Date.now();
        console.log('✅ 数据加载成功:', data.length, '本书');
        return data;
      } catch (e) {
        // 如果 JSON 不完整，尝试修复
        const lastBrace = text.lastIndexOf('}');
        if (lastBrace > 0) {
          const fixedText = text.substring(0, lastBrace + 1) + ']';
          const data = JSON.parse(fixedText);
          cachedBooks = data;
          cacheTime = Date.now();
          console.log('✅ 数据加载成功（修复）:', data.length, '本书');
          return data;
        }
      }
    }

    // 如果合并文件失败，尝试加载单个书籍文件
    console.log('⚠️ 合并文件加载失败，尝试加载单个书籍文件...');
    const books = [];

    for (const bookFile of BOOK_FILES) {
      try {
        const bookResponse = await fetch(`/data/${bookFile}`);
        if (bookResponse.ok) {
          const bookData = await bookResponse.json();
          if (Array.isArray(bookData)) {
            books.push(...bookData);
          } else {
            books.push(bookData);
          }
          console.log(`✅ 加载 ${bookFile} 成功`);
        }
      } catch (err) {
        console.warn(`⚠️ 加载 ${bookFile} 失败:`, err.message);
      }
    }

    if (books.length > 0) {
      cachedBooks = books;
      cacheTime = Date.now();
      console.log('✅ 加载了', books.length, '本书');
      return books;
    }

    console.error('❌ 所有数据加载方式都失败了');
    return [];
  } catch (error) {
    console.error('❌ 加载数据失败:', error.message);
    return [];
  }
}

// 搜索相关内容 - 优化版本
function searchContent(books, query, topResults = 5) {
  const queryLower = query.toLowerCase();
  const results = [];

  // 限制处理的段落数量以提高性能
  let maxParagraphs = 0;
  const MAX_PARAGRAPHS = 5000; // 最多处理 5000 个段落

  books.forEach(book => {
    const paragraphs = book.text.split(/\n+/).filter(p => p.trim().length > 50);

    paragraphs.forEach((para, index) => {
      if (maxParagraphs >= MAX_PARAGRAPHS) return;

      const score = calculateRelevance(queryLower, para);
      if (score > 0) {
        results.push({
          book: book.filename,
          text: para.trim(),
          score: score
        });
        maxParagraphs++;
      }
    });
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topResults);
}

// 简单的相关度计算
function calculateRelevance(query, text) {
  const words = query.split(/\s+/);
  const textLower = text.toLowerCase();

  let score = 0;
  words.forEach(word => {
    if (word.length > 2) {
      const regex = new RegExp(word, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        score += matches.length;
      }
    }
  });

  return score;
}

// 生成术语规范文本
function getTermsGuidance() {
  return `
术语规范（确保翻译准确性）：
${Object.entries(termDictionary)
  .slice(0, 15)
  .map(([en, cn]) => `  • ${en} → ${cn}`)
  .join('\n')}
`;
}

// 统一处理上师称呼
function standardizeTeacherName(text) {
  let result = text;

  // 移除所有括号内的重复
  result = result.replace(/秋阳创巴仁波切[（(]\s*[秋阳创巴仁波切]+[）)]\s*/g, '秋阳创巴仁波切 ');

  // 修复连续重复
  while (result.includes('秋阳创巴仁波切 秋阳创巴仁波切')) {
    result = result.replace(/秋阳创巴仁波切\s+秋阳创巴仁波切/g, '秋阳创巴仁波切');
  }

  // 修复括号前的重复
  result = result.replace(/秋阳创巴仁波切\s*[（(]/g, '秋阳创巴仁波切（');

  // 替换英文名
  result = result.replace(/Chögyam\s+Trungpa\s+喇嘛/gi, '秋阳创巴仁波切');
  result = result.replace(/Chögyam\s+Trungpa/gi, '秋阳创巴仁波切');

  return result;
}

// 调用智谱AI API
async function callZhipuAI(messages, context, apiKey) {
  if (!apiKey) {
    throw new Error('API Key 未配置');
  }

  const systemPrompt = context
    ? `你是一位资深的藏传佛学翻译专家，精通秋阳创巴仁波切的教法体系。

专业要求：
1. 术语准确性：确保"精神唯物主义"、"正念"、"大手印"、"基本善"等核心术语翻译准确
2. 尊重原意：基于提供的资料回答，保持秋阳创巴仁波切的教法精髓
3. 清晰表达：避免晦涩难懂，用通俗易懂的语言解释

重要提醒（必须严格遵守）：
- 提及上师时，统一使用"秋阳创巴仁波切"这一尊称
- 绝对禁止在括号内重复上师名字
- 绝对禁止连续重复上师名字

回答格式要求：
1. 先给出清晰、准确的中文回答
2. 对于关键概念，提供英文原文（括号标注）
3. 如有引用，标明来源书籍
${getTermsGuidance()}

以下是相关资料：
${context}

请基于这些资料回答问题。如果资料中没有相关内容，请诚实说明。`
    : `你是一位资深的藏传佛学翻译专家，精通秋阳创巴仁波切的教法体系。
专业要求：术语准确、尊重原意、清晰表达。
提及上师时使用"秋阳创巴仁波切"。
${getTermsGuidance()}`;

  const requestBody = {
    model: 'glm-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.3,
    max_tokens: 2000
  };

  const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify(requestBody)
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`API 请求失败: ${response.status}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Cloudflare Pages Function 入口
export async function onRequest(context) {
  const { request, env } = context;

  // CORS 头
  const corsHeaders = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  };

  // OPTIONS 请求
  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

  // 只允许 POST
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: '方法不允许' }), {
      status: 405,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }

  try {
    const { message, history = [] } = await request.json();

    if (!message) {
      return new Response(JSON.stringify({ error: '请提供消息' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }

    console.log(`💬 用户提问: ${message}`);

    // 获取数据并搜索
    const books = await getBooksData();
    const relevantContent = searchContent(books, message, 3);
    console.log(`📚 找到 ${relevantContent.length} 条相关内容`);

    // 组合上下文
    let contextStr = '';
    if (relevantContent.length > 0) {
      contextStr = relevantContent.map((item, i) =>
        `[来源 ${i + 1}: ${item.book}]\n${item.text}`
      ).join('\n\n');
    }

    // 准备消息
    const messages = [
      ...history.slice(-10).map(h => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    // 使用环境变量中的 API Key
    const apiKey = env.ZHIPU_API_KEY || '';

    const response = await callZhipuAI(messages, contextStr, apiKey);

    // 统一处理上师称呼
    const standardizedResponse = standardizeTeacherName(response);

    return new Response(JSON.stringify({
      response: standardizedResponse,
      sources: relevantContent.map(item => item.book)
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('❌ 聊天错误:', error);
    return new Response(JSON.stringify({
      error: '抱歉，处理您的请求时出错了。请稍后再试。',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
