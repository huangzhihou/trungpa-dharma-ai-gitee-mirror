#!/bin/bash

# Cloudflare Pages 部署脚本（修复版）
# 使用 Cloudflare API 直接上传，不需要 GitHub

set -e

echo "=========================================="
echo "  Cloudflare Pages 自动部署工具（修复版）"
echo "=========================================="
echo ""

# 检查必要文件
if [ ! -f "public/index-vercel.html" ]; then
    echo "❌ 错误：找不到 public/index-vercel.html"
    echo "请确保在正确的项目目录中运行此脚本"
    exit 1
fi

# 检查数据文件
if [ ! -f "public/data/all-content.json" ]; then
    echo "⚠️  警告：找不到 public/data/all-content.json"
    echo "AI 查询功能将无法正常工作"
    exit 1
fi

# 检查函数文件
if [ ! -f "functions/api/chat.js" ]; then
    echo "❌ 错误：找不到 functions/api/chat.js"
    exit 1
fi

echo "✅ 所有必要文件检查通过"
echo ""

# 获取凭据
if [ -z "$CLOUDFLARE_ACCOUNT_ID" ]; then
    echo ""
    echo "请输入你的 Cloudflare Account ID："
    echo "(可以从 https://dash.cloudflare.com 的右侧边栏找到)"
    read -p "Account ID: " CLOUDFLARE_ACCOUNT_ID
fi

if [ -z "$CLOUDFLARE_API_TOKEN" ]; then
    echo ""
    echo "请输入你的 Cloudflare API Token："
    echo "(需要在 https://dash.cloudflare.com/profile/api-tokens 创建)"
    echo "权限需要：Account - Cloudflare Pages - Edit"
    read -p "API Token: " CLOUDFLARE_API_TOKEN
fi

PROJECT_NAME="trungpa-dharma-ai"

echo ""
echo "📦 开始构建..."

# 创建临时目录
TEMP_DIR=$(mktemp -d)
echo "临时目录: $TEMP_DIR"

# 复制必要文件
echo "📄 复制文件..."
cp -r public "$TEMP_DIR/"
cp -r functions "$TEMP_DIR/"

# 创建 package.json
cat > "$TEMP_DIR/package.json" << 'EOF'
{
  "type": "module"
}
EOF

# 创建 wrangler.toml
cat > "$TEMP_DIR/wrangler.toml" << EOF
name = "$PROJECT_NAME"
compatibility_date = "2024-01-01"
EOF

# 创建 ZIP 文件
cd "$TEMP_DIR"
ZIP_FILE="trungpa-dharma-ai-upload.zip"
echo "📦 创建 ZIP 文件..."
zip -r "$ZIP_FILE" . -x "*.DS_Store" "*.git*" "node_modules/*"

echo ""
echo "📤 上传到 Cloudflare Pages..."

# 获取现有项目（如果存在）
PROJECT_EXISTS=$(curl -s -X GET \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_NAME" | \
  grep -o '"success":[^,]*' | cut -d':' -f2)

if [ "$PROJECT_EXISTS" = "true" ]; then
    echo "✓ 项目已存在，创建新部署..."
else
    echo "➕ 创建新项目..."

    CREATE_RESULT=$(curl -s -X POST \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      -H "Content-Type: application/json" \
      "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects" \
      -d "{
        \"name\": \"$PROJECT_NAME\",
        \"production_branch\": \"main\"
      }")

    if echo "$CREATE_RESULT" | grep -q '"success":true'; then
        echo "✓ 项目创建成功"
    else
        echo "❌ 项目创建失败"
        echo "$CREATE_RESULT"
        exit 1
    fi
fi

# 上传文件
UPLOAD_URL=$(curl -s -X POST \
  -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
  "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments" | \
  jq -r '.result.upload_url')

if [ -z "$UPLOAD_URL" ] || [ "$UPLOAD_URL" = "null" ]; then
    echo "❌ 获取上传 URL 失败"
    exit 1
fi

echo "📤 开始上传 ZIP 文件..."
UPLOAD_RESULT=$(curl -X PUT \
  -H "Content-Type: application/zip" \
  --data-binary "@$ZIP_FILE" \
  "$UPLOAD_URL")

if echo "$UPLOAD_RESULT" | grep -q "success"; then
    echo "✓ 文件上传成功"
else
    echo "❌ 文件上传失败"
    echo "$UPLOAD_RESULT"
    exit 1
fi

# 等待部署
echo ""
echo "⏳ 等待部署完成..."
sleep 10

# 获取部署状态
for i in {1..30}; do
    DEPLOYMENT_STATUS=$(curl -s \
      -H "Authorization: Bearer $CLOUDFLARE_API_TOKEN" \
      "https://api.cloudflare.com/client/v4/accounts/$CLOUDFLARE_ACCOUNT_ID/pages/projects/$PROJECT_NAME/deployments" | \
      jq -r '.result[0].latest_stage')

    echo "部署状态: $DEPLOYMENT_STATUS"

    if [ "$DEPLOYMENT_STATUS" = "success" ]; then
        echo ""
        echo "=========================================="
        echo "✅ 部署成功！"
        echo "=========================================="
        echo ""
        echo "🌐 访问地址："
        echo "https://$PROJECT_NAME.pages.dev"
        echo ""
        echo "💡 后续步骤："
        echo "1. 访问 https://dash.cloudflare.com"
        echo "2. 进入 Workers & Pages → trungpa-dharma-ai"
        echo "3. Settings → Environment variables"
        echo "4. 添加环境变量：ZHIPU_API_KEY"
        echo ""
        break
    elif [ "$DEPLOYMENT_STATUS" = "failed" ]; then
        echo ""
        echo "❌ 部署失败，请检查日志"
        exit 1
    else
        sleep 10
    fi
done

# 清理
cd - > /dev/null
rm -rf "$TEMP_DIR"

echo "完成！"
