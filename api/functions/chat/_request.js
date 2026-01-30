import fs from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), 'data');

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

// 加载所有书籍内容
let allBooks = [];

try {
  const mergedFile = path.join(DATA_DIR, 'all-content.json');
  if (fs.existsSync(mergedFile)) {
    allBooks = JSON.parse(fs.readFileSync(mergedFile, 'utf8'));
    console.log('✅ 数据加载成功:', allBooks.length, '本书');
  } else {
    console.error('❌ 数据文件不存在');
  }
} catch (error) {
  console.error('❌ 加载数据失败:', error.message);
}

// 搜索相关内容
function searchContent(query, topResults = 5) {
  const queryLower = query.toLowerCase();
  const results = [];

  allBooks.forEach(book => {
    const paragraphs = book.text.split(/\n+/).filter(p => p.trim().length > 50);

    paragraphs.forEach((para, index) => {
      const score = calculateRelevance(queryLower, para);
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
  .slice(0, 15)  // 只取前15个核心术语，避免提示词过长
  .map(([en, cn]) => `  • ${en} → ${cn}`)
  .join('\n')}
`;
}

// 统一处理上师称呼
function standardizeTeacherName(text) {
  // 将各种可能的变体统一为"秋阳创巴仁波切"
  // 系统提示词已要求 AI 使用正确称呼，这里只处理遗漏的情况
  let result = text;

  // 移除所有括号内的重复
  result = result.replace(/秋阳创巴仁波切[（(]\s*[秋阳创巴仁波切]+[）)]\s*/g, '秋阳创巴仁波切 ');

  // 修复连续重复（全局替换，直到没有重复）
  while (result.includes('秋阳创巴仁波切 秋阳创巴仁波切')) {
    result = result.replace(/秋阳创巴仁波切\s+秋阳创巴仁波切/g, '秋阳创巴仁波切');
  }

  // 修复括号前的重复
  result = result.replace(/秋阳创巴仁波切\s*[（(]/g, '秋阳创巴仁波切（');

  // 替换英文名（放在最后，避免影响上面的替换）
  result = result.replace(/Chögyam\s+Trungpa\s+喇嘛/gi, '秋阳创巴仁波切');
  result = result.replace(/Chögyam\s+Trungpa/gi, '秋阳创巴仁波切');

  return result;
}

// 调用智谱AI API - 使用 fetch
async function callZhipuAI(messages, context = '') {
  const apiKey = process.env.ZHIPU_API_KEY;

  if (!apiKey) {
    console.error('❌ ZHIPU_API_KEY 未设置');
    throw new Error('API Key 未配置');
  }

  console.log('🔑 API Key 前缀:', apiKey.substring(0, 10) + '...');

  try {
    // 优化的系统提示词
    const systemPrompt = context
      ? `你是一位资深的藏传佛学翻译专家，精通秋阳创巴仁波切的教法体系。

专业要求：
1. 术语准确性：确保"精神唯物主义"、"正念"、"大手印"、"基本善"等核心术语翻译准确
2. 尊重原意：基于提供的资料回答，保持秋阳创巴仁波切的教法精髓
3. 清晰表达：避免晦涩难懂，用通俗易懂的语言解释

重要提醒（必须严格遵守）：
- 提及上师时，统一使用"秋阳创巴仁波切"这一尊称
- 绝对禁止在括号内重复上师名字（如：秋阳创巴仁波切（秋阳创巴仁波切）是绝对错误的）
- 绝对禁止连续重复上师名字（如：秋阳创巴仁波切 秋阳创巴仁波切 是绝对错误的）
- 如需标注年份，格式为：秋阳创巴仁波切（1940-1987）
- 如需标注尊称，格式为：秋阳创巴仁波切（Rinpoche）
- 绝对禁止在括号内写"秋阳创巴仁波切"这个完整名字

回答格式要求：
1. 先给出清晰、准确的中文回答
2. 对于关键概念，提供英文原文（括号标注）
3. 如有引用，标明来源书籍
${getTermsGuidance()}

以下是相关资料：
${context}

请基于这些资料回答问题，保持专业性和准确性。如果资料中没有相关内容，请诚实说明。`
      : `你是一位资深的藏传佛学翻译专家，精通秋阳创巴仁波切的教法体系。

专业要求：
1. 术语准确性：确保"精神唯物主义"、"正念"、"大手印"、"基本善"等核心术语翻译准确
2. 尊重原意：保持秋阳创巴仁波切的教法精髓
3. 清晰表达：避免晦涩难懂，用通俗易懂的语言解释

重要提醒（必须严格遵守）：
- 提及上师时，统一使用"秋阳创巴仁波切"这一尊称
- 绝对禁止在括号内重复上师名字
- 绝对禁止连续重复上师名字
- 如需标注年份，格式为：秋阳创巴仁波切（1940-1987）
- 如需标注尊称，格式为：秋阳创巴仁波切（Rinpoche）
- 绝对禁止在括号内写"秋阳创巴仁波切"这个完整名字

回答格式要求：
对于关键概念，提供英文原文（括号标注）
提及上师时，统一使用"秋阳创巴仁波切"这一尊称
${getTermsGuidance()}`;

    const requestBody = {
      model: 'glm-4',
      messages: [
        { role: 'system', content: systemPrompt },
        ...messages
      ],
      temperature: 0.3,  // 降低温度，更精确
      max_tokens: 2000
    };

    console.log('📤 发送请求到智谱 AI（温度: 0.3）...');

    const response = await fetch('https://open.bigmodel.cn/api/paas/v4/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify(requestBody)
    });

    console.log('📥 响应状态:', response.status);

    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ 智谱 AI 错误响应:', errorText);
      throw new Error(`API 请求失败: ${response.status} ${errorText}`);
    }

    const data = await response.json();
    console.log('✅ 智谱 AI 响应成功');

    return data.choices[0].message.content;
  } catch (error) {
    console.error('❌ 智谱AI调用错误:', error.message);
    throw error;
  }
}

// Cloudflare Pages Function
export async function onRequest(context) {
  const { request, env } = context;

  // 设置 CORS
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

    console.log(`\n💬 用户提问: ${message}`);

    // 搜索相关内容
    const relevantContent = searchContent(message, 3);
    console.log(`📚 找到 ${relevantContent.length} 条相关内容`);

    // 组合上下文
    let context = '';
    if (relevantContent.length > 0) {
      context = relevantContent.map((item, i) =>
        `[来源 ${i + 1}: ${item.book}]\n${item.text}`
      ).join('\n\n');
    }

    // 调用AI
    const messages = [
      ...history.slice(-10).map(h => ({
        role: h.role,
        content: h.content
      })),
      { role: 'user', content: message }
    ];

    // 使用环境变量
    const originalEnv = process.env.ZHIPU_API_KEY;
    if (env.ZHIPU_API_KEY) {
      process.env.ZHIPU_API_KEY = env.ZHIPU_API_KEY;
    }

    const response = await callZhipuAI(messages, context);

    // 恢复环境变量
    process.env.ZHIPU_API_KEY = originalEnv;

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
