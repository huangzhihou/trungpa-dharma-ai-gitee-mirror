# Gitee Pages 部署指南

## 📋 准备工作

### 1. 注册/登录 Gitee

**访问：** https://gitee.com

如果没有账号：
1. 点击右上角 "注册"
2. 填写：
   - 用户名（建议：trungpa-dharma）
   - 密码
   - 邮箱
   - 手机号
3. 完成人脸识别（实名认证）
4. 验证邮箱和手机

如果有账号，直接登录。

⚠️ **注意**：Gitee Pages 需要实名认证才能使用。

---

## 🚀 部署步骤

### 方案 A：完全自动部署（推荐，需要你提供信息）

你需要提供：
1. Gitee 用户名
2. Gitee 密码或个人访问令牌
3. 是否已有仓库（trungpa-dharma-ai）

**我会帮你：**
- ✅ 创建 Gitee 仓库
- ✅ 推送代码到 Gitee
- ✅ 开启 Gitee Pages 服务
- ✅ 完成部署

### 方案 B：手动部署（安全，自己操作）

#### 第 1 步：创建仓库

1. 登录 Gitee：https://gitee.com
2. 点击右上角 "+" → "新建仓库"
3. 仓库信息：
   - 仓库名称：`trungpa-dharma-ai`
   - 仓库介绍：`Chögyam Trungpa 教法知识库`
   - 是否开源：**公开**
   - 语言：选择 `Other`
4. 点击 "创建仓库"

#### 第 2 步：获取仓库地址

在仓库页面找到克隆地址，选择：
```
https://gitee.com/你的用户名/trungpa-dharma-ai.git
```

#### 第 3 步：推送代码到 Gitee

打开终端，执行：

```bash
cd /Users/h/clawd/trungpa-dharma-ai

# 添加 Gitee 远程仓库
git remote add gitee https://gitee.com/你的用户名/trungpa-dharma-ai.git

# 推送代码
git push gitee main
```

**如果提示输入用户名和密码：**
- 用户名：你的 Gitee 用户名
- 密码：你的 Gitee 密码

#### 第 4 步：开启 Gitee Pages

1. 在 Gitee 仓库页面
2. 点击 "服务" → "Gitee Pages"
3. 点击 "启动"
4. 选择部署分支：`main`
5. 点击 "确认"

等待 1-2 分钟，部署完成！

---

## ✅ 部署成功后

你会获得免费域名：
```
https://你的用户名.gitee.io/trungpa-dharma-ai
```

---

## 🌐 你将拥有的网站

### 域名对比

| 平台 | 域名 | 国内速度 | 国际速度 |
|------|------|---------|---------|
| Vercel | trungpa-dharma-ai.vercel.app | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ |
| Gitee Pages | 你的用户名.gitee.io | ⭐⭐⭐⭐⭐⭐ | ⭐⭐⭐ |

### 双域名优势

- **国际访问**：用 Vercel（https://trungpa-dharma-ai.vercel.app）
- **国内访问**：用 Gitee（https://你的用户名.gitee.io）
- **两全其美**：两个网站，同一代码

---

## 💡 推荐访问方式

**在国内：**
```
https://你的用户名.gitee.io/trungpa-dharma-ai
```

**在国际：**
```
https://trungpa-dharma-ai.vercel.app
```

---

## 🎯 快速部署（如果你信任我）

如果你想让我自动完成，请提供：

1. **Gitee 用户名：**
   ```
   （例如：trungpa-dharma）
   ```

2. **Gitee 密码** 或 **个人访问令牌：**
   ```
   密码：********
   或令牌：gitee_xxxxxxxxxxxx
   ```

**如何创建个人访问令牌：**
1. 登录 Gitee
2. 点击右上角头像 → "设置"
3. 左侧菜单 → "安全设置"
4. "个人访问令牌" → "生成新令牌"
5. 令牌描述：`trungpa-dharma-ai deploy`
6. 勾选权限：`projects`、`pull_requests`
7. 点击 "提交"
8. **复制令牌**（只显示一次！）

---

**提供信息后，我会帮你：**
- ✅ 创建 Gitee 仓库
- ✅ 推送代码
- ✅ 开启 Gitee Pages
- ✅ 测试网站
- ✅ 给你最终的访问地址

---

## ⚠️ 注意事项

1. **实名认证**：Gitee Pages 需要实名认证
2. **代码开源**：Gitee Pages 只支持公开仓库
3. **首次部署**：可能需要 2-3 分钟
4. **更新方式**：以后推送新代码会自动更新网站

---

**选择你的方案：**

**A. 提供信息，让我自动部署**（最快，5分钟）
**B. 按照上面的步骤手动部署**（安全，10分钟）

告诉我你的选择！🚀
