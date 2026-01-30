# 获取 Cloudflare 凭据（图文指南）

## 📋 你需要获取两项信息

### 第一项：Account ID

1. 打开浏览器，访问：**https://dash.cloudflare.com**
2. 登录你的 Cloudflare 账号
3. 登录后，看**右侧边栏**（滚动到最下面）
4. 找到 **"Account ID"** 这一行
5. 点击右侧的 **复制图标**（两个小方块）
6. 把这串字符（类似 `xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx`）保存下来

**位置提示：**
- 如果没有看到，点击右上角齿轮图标 ⚙️（Settings）
- Account ID 通常在页面底部或设置页面
- 是一串 32 位字符的字符串

---

### 第二项：API Token

1. 访问：**https://dash.cloudflare.com/profile/api-tokens**
2. 点击蓝色按钮 **"Create Token"**
3. 你会看到一些预设模板，滚动找到：
   - **"Edit Cloudflare Pages"** 模板 ⭐（推荐）
   - 或者点击 **"Create Custom Token"**
4. 点击 **"Use template"** 或 **"Continue to summary"**
5. 确认权限包括：
   - ✅ Account → Cloudflare Pages → Edit
6. 点击 **"Continue to summary"** → **"Create Token"**
7. **重要：** 复制显示的 Token（只显示一次！）
   - 点击 "Copy" 按钮
   - 格式类似：`xxxxx_yyyyyyyyyyyyyyyyyyyy`

**如果找不到 "Edit Cloudflare Pages" 模板：**
- 点击 "Create Custom Token"
- 权限设置：
  - **Account** → **Cloudflare Pages** → **Edit**
  - 其他的可以留空
- 点击 "Continue to summary" → "Create Token"

---

## 📝 把两项信息发给我

获取完成后，请告诉我：

```
Account ID: 你的32位ID
API Token: 以_xxxxx开头的长字符串
```

我会立即帮你完成部署！
