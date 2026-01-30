# 🚀 部署指南 - Cloudflare Pages（推荐国内访问）

## 方案选择

**推荐：Cloudflare Pages** - 国内访问速度快，免费，支持 Serverless Functions

---

## 📋 步骤 1: 连接 GitHub 仓库

1. 访问 https://dash.cloudflare.com
2. 登录你的 Cloudflare 账号（如果没有就注册一个）
3. 点击 **Workers & Pages** → **Create application**
4. 选择 **Pages** → **Connect to Git**
5. 选择你的 GitHub 仓库：`huangzhihou/trungpa-dharma-ai-gitee-mirror`
6. 点击 **Set up build and deployments**

---

## ⚙️ 步骤 2: 配置构建设置

在配置页面填写：

**Build settings:**
- Framework preset: **None**
- Build command: （留空）
- Build output directory: **public**

**Environment variables:**
- Key: `ZHIPU_API_KEY`
- Value: `a3b94c17d28e4940b5102294f1d9cf61.uB51O7OoEEejjWlL`
- Environment: **Production + Preview + Development**

点击 **Save and Deploy**

---

## ✅ 步骤 3: 配置 Functions

部署完成后：

1. 在项目页面，点击 **Settings** → **Functions**
2. 在 **Environment variables** 中添加：
   - Key: `ZHIPU_API_KEY`
   - Value: `a3b94c17d28e4940b5102294f1d9cf61.uB51O7OoEEejjWlL`

3. 如果需要，可以在 **Settings** → **Custom domains** 添加自定义域名

---

## 🌐 步骤 4: 访问网站

部署完成后（通常需要 1-2 分钟），你会得到：

**主要访问地址：**
```
https://trungpa-dharma-ai-gitee-mirror.pages.dev
```

**或者你可以在部署过程中重命名为：**
```
https://trungpa-dharma-ai.pages.dev
```

---

## 🔧 如果 GitHub 仓库没有同步

如果 Cloudflare 找不到 GitHub 仓库，先手动推送：

```bash
cd /Users/h/clawd/trungpa-dharma-ai
git push github main
```

---

## 📝 备用方案：Vercel（国内访问可能较慢）

如果你想用 Vercel：

1. 访问 https://vercel.com/new
2. 导入 GitHub 仓库
3. 配置：
   - Framework: **Other**
   - Root Directory: **.**
   - Build Command: （留空）
   - Output Directory: **public**
4. **重要：** 添加环境变量 `ZHIPU_API_KEY` = `a3b94c17d28e4940b5102294f1d9cf61.uB51O7OoEEejjWlL`
5. 点击 **Deploy**

访问地址：`https://trungpa-dharma-ai.vercel.app`

---

## 🎯 关键要点

1. **必须配置环境变量** `ZHIPU_API_KEY`，否则 AI 功能无法工作
2. **Cloudflare Pages** 国内访问速度更快，推荐使用
3. 项目已配置好路由规则和 API 函数，无需额外配置
4. 首次部署后，后续更新会自动部署（基于 Git 推送）

---

## 🆘 遇到问题？

1. **API 404 错误**：检查 `ZHIPU_API_KEY` 是否正确配置
2. **页面无法访问**：等待 1-2 分钟让部署完成
3. **查询无结果**：检查数据文件 `data/all-content.json` 是否存在
4. **国内访问慢**：使用 Cloudflare Pages 而不是 Vercel

---

**部署完成后，你就可以通过浏览器访问网站，开始对话了！🎉**
