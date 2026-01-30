# 翻译质量改进方案

## 当前问题分析

查看代码后，发现系统使用智谱 GLM-4 直接回答用户问题，没有明确的翻译逻辑。可能的问题：

1. **系统提示词不够专业** - 没有强调术语准确性
2. **缺少术语规范** - 专业术语可能翻译不一致
3. **温度参数过高** - `temperature: 0.7` 可能导致不够精确
4. **缺少上下文要求** - 没有要求 AI 引用原文

---

## 改进方案

### 方案 1: 优化系统提示词（推荐）

改进 `systemPrompt`，让它更专业：

```javascript
const systemPrompt = context
  ? `你是一位资深的藏传佛学翻译专家，精通Chögyam Trungpa喇嘛的教法体系。

专业要求：
1. 术语准确性：确保"精神唯物主义"、"正念"、"大手印"、"基本善"等核心术语翻译准确
2. 尊重原意：基于提供的资料回答，保持 Trungpa 喇嘛的教法精髓
3. 清晰表达：避免晦涩难懂，用通俗易懂的语言解释
4. 引用原文：如有必要，适当引用原始资料中的表述

以下是相关资料：
${context}

请基于这些资料回答问题，保持专业性和准确性。如果资料中没有相关内容，请诚实说明。`
  : `你是一位资深的藏传佛学翻译专家，精通Chögyam Trungpa喇嘛的教法体系。

专业要求：
1. 术语准确性：确保"精神唯物主义"、"正念"、"大手印"、"基本善"等核心术语翻译准确
2. 尊重原意：保持 Trungpa 喇嘛的教法精髓
3. 清晰表达：避免晦涩难懂，用通俗易懂的语言解释`;
```

---

### 方案 2: 降低温度参数

让回答更精确：

```javascript
const requestBody = {
  model: 'glm-4',
  messages: [
    { role: 'system', content: systemPrompt },
    ...messages
  ],
  temperature: 0.3,  // 从 0.7 降到 0.3，更精确
  max_tokens: 2000
};
```

---

### 方案 3: 添加术语字典

在代码中添加术语对照表：

```javascript
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
  'bodhichitta': '菩提心'
};

function enhancePromptWithTerms(prompt) {
  // 在系统提示词中添加术语对照
  return prompt + '\n\n术语规范：\n' +
    Object.entries(termDictionary)
      .map(([en, cn]) => `${en} → ${cn}`)
      .join('\n');
}
```

---

### 方案 4: 要求 AI 引用原文

添加引用要求：

```javascript
const systemPrompt = context
  ? `你是一位资深的藏传佛学翻译专家...

回答格式要求：
1. 先给出清晰、准确的回答
2. 对于关键概念，提供原文（英文）对应词
3. 如果有引用，标明来源书籍

以下是相关资料：
${context}`
  : ...
```

---

## 推荐实施步骤

### 立即实施（快速改进）
1. 优化系统提示词
2. 降低温度参数到 0.3

### 后续优化（进一步改进）
3. 添加术语字典
4. 要求 AI 引用原文
5. 收集反馈持续调优

---

## 需要我帮你实施吗？

我可以：
- ✅ 立即实施方案 1（优化提示词）
- ✅ 立即实施方案 2（降低温度）
- ✅ 实施所有改进方案
- ✅ 部署到线上并测试

**请告诉我你想实施哪个方案！** 🚀
