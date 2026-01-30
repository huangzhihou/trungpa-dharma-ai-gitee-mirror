// Cloudflare Pages Function for Chat API - 优化版
// 使用 fetch 获取静态数据，不依赖 Node.js fs 模块

// 完整术语词典（梵藏中英对照）
const termDictionary = {
  // 核心概念
  'spiritual materialism': '精神唯物主义',
  'mindfulness': '正念',
  'awareness': '觉知',
  'consciousness': '意识',
  'mahamudra': '大手印',
  'basic goodness': '本初善',
  'bodhisattva vow': '菩萨戒',
  'bodhichitta': '菩提心',
  'buddha nature': '佛性',
  'enlightenment': '觉悟',
  'bodhi': '菩提',
  'nirvana': '涅槃',
  'samsara': '轮回',
  'karma': '业力',
  'dharma': '法',
  'dharmata': '真如',
  'suchness': '如是',
  'tathagata': '如来',
  'sunyata': '空性',
  'shunyata': '空性',
  'emptiness': '空性',
  'voidness': '虚空',

  // 禅修
  'shamatha': '奢摩他',
  'samatha': '奢摩他',
  'zhi': '止',
  'vipashyana': '毗婆舍那',
  'vipassana': '毗婆舍那',
  'guan': '观',
  'meditation': '禅修',
  'contemplation': '观想',
  'visualization': '观想',
  'sadhana': '修法',
  'practice': '修行',
  'yoga': '瑜伽',
  'path': '道',

  // 金刚乘
  'tantra': '密续',
  'vajrayana': '金刚乘',
  'vajra': '金刚',
  'guru': '上师',
  'lama': '喇嘛',
  'rinpoche': '仁波切',
  'yidam': '本尊',
  'deity': '本尊',
  'mandala': '曼荼罗',
  'abhisheka': '灌顶',
  'initiation': '灌顶',
  'samaya': '三昧耶',

  // 教派
  'mahayana': '大乘',
  'hinayana': '小乘',
  'theravada': '上座部',
  'kagyu': '噶举派',
  'nyingma': '宁玛派',
  'sakya': '萨迦派',
  'gelug': '格鲁派',

  // 人物称谓
  'bodhisattva': '菩萨',
  'arhat': '阿罗汉',
  'pratyekabuddha': '缘觉',
  'shravaka': '声闻',
  'yogi': '瑜伽士',
  'yogini': '瑜伽女',
  'warrior': '勇士',

  // 品质
  'compassion': '慈悲',
  'karuna': '慈悲',
  'loving-kindness': '慈爱',
  'maitri': '慈',
  'metta': '慈',
  'sympathetic joy': '随喜',
  'mudita': '随喜',
  'equanimity': '舍',
  'upeksha': '舍',

  // 智慧
  'prajna': '般若',
  'wisdom': '智慧',
  'jnana': '智',
  'vidya': '明',
  'rigpa': '本觉',
  'yeshe': '智慧',
  'discriminating awareness': '辨别智',
  'intellect': ' intellect',

  // 力量
  'five powers': '五力',
  'five faculties': '五根',
  'seven factors of enlightenment': '七觉支',
  'eightfold path': '八正道',
  'four noble truths': '四圣谛',
  'noble eightfold path': '圣八道',

  // 六度
  'generosity': '布施',
  'dana': '布施',
  'ethics': '持戒',
  'morality': '戒律',
  'patience': '忍辱',
  'ksanti': '忍辱',
  'diligence': '精进',
  'virya': '精进',
  'energy': '精进',
  'concentration': '禅定',
  'dhyana': '禅那',
  'samadhi': '三摩地',

  // 香巴拉
  'shambhala': '香巴拉',
  'great eastern sun': '东方大日',
  'setting sun': '落日',
  'sacred world': '神圣世界',
  'drala': '德拉',
  'windhorse': '风马',
  'lungta': '风马',
  'tiger lion': '虎狮',
  'garuda': '金翅鸟',
  'dragon': '龙',

  // 其他
  'sangha': '僧伽',
  'buddha': '佛',
  'thus come one': '如来',
  'tathagatagarbha': '如来藏',
  'buddha-dhatu': '佛性',
  'alaya-vijnana': '阿赖耶识',
  'store consciousness': '藏识',
  'manas': '末那识',
  'five skandhas': '五蕴',
  'aggregates': '蕴',

  // 修道
  'renunciation': '出家',
  'monk': '比丘',
  'nun': '比丘尼',
  'upasaka': '优婆塞',
  'upasika': '优婆夷',
  'precepts': '戒律',

  // 障碍
  'klesha': '烦恼',
  'afflictive emotions': '烦恼',
  'defilements': '垢染',
  'obstacles': '障碍',
  'hindrances': '盖障',
  'maras': '魔',

  // 结果
  'realization': '证悟',
  'attainment': '成就',
  'siddhi': '悉地',
  'accomplishment': '成就',
};

// 全局缓存
let cachedBooks = null;
let cacheTime = null;
const CACHE_DURATION = 10 * 60 * 1000;

// 书籍文件列表
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

// 获取书籍数据
async function getBooksData() {
  if (cachedBooks && cacheTime && (Date.now() - cacheTime < CACHE_DURATION)) {
    return cachedBooks;
  }

  try {
    const response = await fetch('/data/all-content.json', {
      headers: { 'Range': 'bytes=0-10485760' }
    });

    if (response.ok || response.status === 206) {
      const text = await response.text();
      try {
        const data = JSON.parse(text);
        cachedBooks = data;
        cacheTime = Date.now();
        return data;
      } catch (e) {
        const lastBrace = text.lastIndexOf('}');
        if (lastBrace > 0) {
          const fixedText = text.substring(0, lastBrace + 1) + ']';
          const data = JSON.parse(fixedText);
          cachedBooks = data;
          cacheTime = Date.now();
          return data;
        }
      }
    }

    // 备用：加载单个文件
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
        }
      } catch (err) {
        // 跳过错误文件
      }
    }

    if (books.length > 0) {
      cachedBooks = books;
      cacheTime = Date.now();
      return books;
    }

    return [];
  } catch (error) {
    console.error('加载数据失败:', error.message);
    return [];
  }
}

// 改进的搜索算法 - 支持中文和英文关键词
function searchContent(books, query, topResults = 5) {
  const results = [];
  const keywords = extractKeywords(query);

  books.forEach(book => {
    const paragraphs = book.text.split(/\n+/).filter(p => p.trim().length > 30);

    paragraphs.forEach((para) => {
      const score = calculateRelevance(keywords, para);
      if (score > 0) {
        results.push({
          book: book.filename,
          text: para.trim(),
          score: score
        });
      }
    });
  });

  return results
    .sort((a, b) => b.score - a.score)
    .slice(0, topResults);
}

// 提取关键词（中英文）
function extractKeywords(query) {
  // 移除常见停用词
  const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'what', 'how', 'why', '的', '是', '什么', '怎么', '如何', '为什么', '吗']);

  // 提取英文单词
  const englishWords = query.toLowerCase().match(/[a-z]+/gi) || [];
  // 提取中文词组（2-4个字）
  const chineseWords = query.match(/[\u4e00-\u9fa5]{2,4}/g) || [];

  const keywords = [
    ...englishWords.filter(w => w.length > 2 && !stopWords.has(w)),
    ...chineseWords.filter(w => !stopWords.has(w))
  ];

  return [...new Set(keywords)];
}

// 改进的相关度计算
function calculateRelevance(keywords, text) {
  const textLower = text.toLowerCase();
  let score = 0;

  keywords.forEach(keyword => {
    // 完全匹配
    if (textLower.includes(keyword)) {
      const regex = new RegExp(keyword, 'gi');
      const matches = textLower.match(regex);
      if (matches) {
        score += matches.length * 2;
      }
    }

    // 部分匹配
    if (keyword.length > 3) {
      const partialRegex = new RegExp(keyword.substring(0, keyword.length - 1), 'gi');
      if (partialRegex.test(textLower)) {
        score += 0.5;
      }
    }
  });

  return score;
}

// 卷名映射
const volumeNameMap = {
  'Volume_1': '卷一',
  'Volume_2': '卷二',
  'Volume_3': '卷三',
  'Volume_4': '卷四',
  'Volume_5': '卷五',
  'Volume_6': '卷六',
  'Volume_7': '卷七',
  'Volume_8': '卷八',
  'Volume_9': '卷九',
  'Volume_10': '卷十'
};

// 优化的来源格式化
function formatSources(relevantContent) {
  if (!relevantContent || relevantContent.length === 0) return [];

  // 按卷分组
  const volumeGroups = {};
  relevantContent.forEach(item => {
    const volMatch = item.book.match(/Volume[_\s]*(\d+)/i);
    const volNum = volMatch ? volMatch[1] : '';
    const volName = volumeNameMap[`Volume_${volNum}`] || `卷${volNum}`;
    if (!volumeGroups[volName]) {
      volumeGroups[volName] = [];
    }
    volumeGroups[volName].push(item);
  });

  // 生成友好的来源描述
  return Object.entries(volumeGroups).map(([volName, items]) => {
    if (items.length > 1) {
      return `${volName}（${items.length} 处）`;
    }
    return volName;
  });
}

// 获取完整术语指导
function getTermsGuidance() {
  const categories = {
    '核心概念': ['spiritual materialism', 'mindfulness', 'mahamudra', 'basic goodness', 'bodhichitta'],
    '修道': ['shamatha', 'vipashyana', 'meditation', 'sadhana', 'practice'],
    '金刚乘': ['tantra', 'vajrayana', 'guru', 'yidam', 'samaya'],
    '教派': ['mahayana', 'vajrayana', 'kagyu', 'ningma'],
    '品质': ['compassion', 'prajna', 'bodhi', 'karuna', 'mudita'],
  };

  let guidance = '\n【术语翻译规范】\n';
  Object.entries(categories).forEach(([cat, terms]) => {
    guidance += `\n${cat}：\n`;
    terms.forEach(term => {
      const cn = termDictionary[term] || term;
      guidance += `  ${term} → ${cn}\n`;
    });
  });

  return guidance;
}

// 改进的后处理 - 规范化输出
function standardizeOutput(text) {
  let result = text;

  // 测试：添加标记确认函数被调用
  result = '[TEST]' + result;

  // 1. 过滤敏感政治内容
  const sensitivePatterns = [
    /1959年[^。]*。?/g,
    /1960年代[^。]*。?/g,
    /西藏[^。]*?(政治|变革|事件|冲突|动乱|前往)[^。]*。?/g,
    /政治[^。]*?(变革|事件|动荡)[^。]*。?/g,
    /苏格兰[^。]*。?/g,
    /逃离[^。]*。?/g,
    /印度[^。]*?(继续|修行)[^。]*。?/g,
  ];
  sensitivePatterns.forEach(pattern => {
    result = result.replace(pattern, '');
  });

  // 2. 清理多余空格
  result = result.replace(/\s{2,}/g, ' ');

  // 3. 上师称呼规范化
  let idx;
  while ((idx = result.indexOf('秋阳秋阳')) !== -1) {
    result = result.substring(0, idx) + '秋阳' + result.substring(idx + 4);
  }

  // 处理英文名变体
  result = result.replace(/(?:Chögyam|Chogyam)?\s*Trungpa(?:\s+Rinpoche)?/gi, '秋阳创巴仁波切');
  // 统一短版本
  result = result.replace(/创巴仁波切/g, '秋阳创巴仁波切');

  // 4. 修复其他重复字符
  result = result.replace(/([^\n])\1{2,}/g, '$1');

  // 5. 清理多余空行
  result = result.replace(/\n\s*\n\s*\n/g, '\n\n');

  // 6. 移除AI痕迹
  result = result.replace(/作为(一个)?AI/g, '作为助教');
  result = result.replace(/作为一个?(语言模型|AI助手)/g, '');
  result = result.replace(/非常感谢您的提问/g, '');

  return result.trim();
}

// 优化的系统提示词
function buildSystemPrompt(hasContext) {
  const basePrompt = `你是秋阳创巴仁波切教法的AI助教，精通藏传佛教与西方禅修传统。

【重要规范】
1. **称呼规范**：提到老师时，只使用"秋阳创巴仁波切"或"仁波切"，绝对不要重复"秋阳"二字
2. **内容限制**：只回答佛教教法、禅修、哲学相关内容
   - 绝对不涉及任何政治内容
   - 绝对不讨论历史政治事件
   - 绝不提及1959年、西藏政治变革等敏感内容
   - 聚焦于佛法教导、禅修方法、心灵成长

【翻译原则】
1. **准确性优先**：严格遵循既定术语翻译，不得随意创新
2. **简洁明了**：用现代汉语表达，避免古奥晦涩
3. **保持原意**：不添加、不删减、不扭曲原意
4. **前后一致**：同一概念始终使用同一译名

【术语统一】（必须严格遵守）
${getTermsGuidance()}

【回答风格】
- 直接切入主题，不铺垫废话
- 分段清晰，每段表达一个完整观点
- 举例说明时使用"例如："、"比如："引导
- 列举时使用序号或项目符号
- 避免过度解释，相信读者的理解能力

${hasContext ? `
【参考资料】
以下内容来自原文，请严格基于这些资料回答：
- 只能引用、整合、重新表述
- 不得添加资料外的内容
- 如资料不足以回答问题，诚实说明
` : `
【注意】
- 当前无参考资料，请基于秋阳创巴仁波切的既定教导回答
- 如果超出教法范围，诚实告知
- 不得编造或臆测
`}`;

  return basePrompt;
}

// 调用智谱AI API
async function callZhipuAI(messages, context, apiKey) {
  if (!apiKey) {
    throw new Error('API Key 未配置');
  }

  const systemPrompt = buildSystemPrompt(!!context);

  const requestBody = {
    model: 'glm-4',
    messages: [
      { role: 'system', content: systemPrompt },
      ...messages
    ],
    temperature: 0.2,
    top_p: 0.9,
    max_tokens: 2500
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
    throw new Error(`API 请求失败: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  return data.choices[0].message.content;
}

// Cloudflare Pages Function 入口
export async function onRequest(context) {
  const { request, env } = context;

  const corsHeaders = {
    'Access-Control-Allow-Credentials': 'true',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,OPTIONS,PATCH,DELETE,POST,PUT',
    'Access-Control-Allow-Headers': 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  };

  if (request.method === 'OPTIONS') {
    return new Response(null, {
      status: 200,
      headers: corsHeaders
    });
  }

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

    // 获取数据并搜索
    const books = await getBooksData();
    const relevantContent = searchContent(books, message, 5); // 增加到5条结果

    // 组合上下文
    let contextStr = '';
    if (relevantContent.length > 0) {
      contextStr = relevantContent.map((item, i) =>
        `[资料${i + 1}] ${item.text}`
      ).join('\n\n');
    }

    // 准备消息
    const messages = [
      ...history.slice(-8).map(h => ({  // 减少到8条历史
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    const apiKey = env.ZHIPU_API_KEY || '';
    const response = await callZhipuAI(messages, contextStr, apiKey);

    // 后处理
    const finalResponse = standardizeOutput(response);

    // 生成友好的来源描述
    const sources = formatSources(relevantContent);

    return new Response(JSON.stringify({
      response: finalResponse,
      sources: sources
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('聊天错误:', error);
    return new Response(JSON.stringify({
      error: '抱歉，处理您的请求时出错了。请稍后再试。',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    });
  }
}
