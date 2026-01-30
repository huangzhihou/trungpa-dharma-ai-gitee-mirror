#!/bin/bash

# Cloudflare Pages 自动化部署脚本
# 需要 Cloudflare Account ID 和 API Token

set timeout 180
set cloudflare_account_id ""  # 需要填入
set cloudflare_api_token ""  # 需要填入
set project_name "trungpa-dharma-ai"
set github_repo "huangzhihou/trungpa-dharma-ai"

echo "🚀 开始 Cloudflare Pages 部署..."

# 检查是否提供了凭据
if [ -z "$cloudflare_account_id" ] || [ -z "$cloudflare_api_token" ]; then
    echo ""
    echo "❌ 缺少 Cloudflare 凭据！"
    echo ""
    echo "请先获取："
    echo "1. Cloudflare Account ID: https://dash.cloudflare.com/profile/api-tokens"
    echo "2. Cloudflare API Token: 在同一页面创建"
    echo ""
    echo "然后编辑本脚本，填入凭据，重新运行"
    exit 1
fi

# 创建项目
echo "📦 创建 Cloudflare Pages 项目..."

PROJECT_INFO=$(curl -s -X POST \
  -H "Authorization: Bearer $cloudflare_api_token" \
  -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/accounts/$cloudflare_account_id/pages/projects" \
  -d '{
    "name": "'"$project_name"'",
    "production_branch": "main",
    "github": {
      "owner": "huangzhihou",
      "repository": "'"$github_repo"'",
      "production_branch": "main"
    }
  }')

PROJECT_URL=$(echo $PROJECT_INFO | grep -o '"url":"[^"]*"' | cut -d'"' -f 2)

if [ -z "$PROJECT_URL" ]; then
    echo "❌ 项目创建失败！"
    echo "$PROJECT_INFO"
    exit 1
fi

echo "✅ 项目创建成功！"
echo "📊 项目 URL: https://dash.cloudflare.com$PROJECT_URL"

# 等待部署（通常需要 1-2 分钟）
echo "⏳ 等待部署完成..."

sleep 5

# 获取部署状态
echo "📋 检查部署状态..."

DEPLOYMENT_INFO=$(curl -s \
  -H "Authorization: Bearer $cloudflare_api_token" \
  -H "Content-Type: application/json" \
  "https://api.cloudflare.com/client/v4/accounts/$cloudflare_account_id/pages/projects/$project_name/deployments")

DEPLOYMENT_LATEST_STAGE=$(echo $DEPLOYMENT_INFO | grep -o '"latest_stage":\s*"[^"]*"' | cut -d'"' -f 2)

echo "部署状态: $DEPLOYMENT_LATEST_STAGE"

# 生成最终访问地址
echo ""
echo "✅✅✅ 部署完成！✅✅✅"
echo ""
echo "🌐 访问地址："
echo "https://$project_name.pages.dev"
echo ""
echo "📝 控制面板："
echo "https://dash.cloudflare.com$PROJECT_URL"
echo ""
echo "💡 备用域名："
echo "https://laohuanglearndharma.gitee.io/trungpa-dharma-ai"
echo ""
