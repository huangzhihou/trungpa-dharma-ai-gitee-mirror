#!/usr/bin/bash

# Gitee Pages 自动化开启脚本
# 使用 Gitee API 开启 Pages 服务

set timeout 120
set user "laohuanglearndharma"
set password "Amituofo2026"
set repo_name "trungpa-dharma-ai"

echo "🚀 开始 Gitee Pages 部署..."

# 获取仓库信息
echo ""
echo "📦 步骤 1：检查仓库..."

REPO_INFO=$(curl -s "https://gitee.com/api/v5/repos/$user/$repo_name" | grep -o '"id":[0-9]*' | grep -o '[0-9]*')

if [ -z "$REPO_INFO" ]; then
    echo "❌ 仓库不存在或 API 调用失败"
    echo "请确认仓库名称是否正确"
    exit 1
fi

echo "✅ 仓库 ID: $REPO_INFO"

# 开启 Pages 服务
echo ""
echo "📦 步骤 2：开启 Gitee Pages 服务..."

PAGE_INFO=$(curl -s -X POST \
  -H "Authorization: token $user:$password" \
  "https://gitee.com/api/v5/repos/$user/$repo_name/pages" \
  -d '{
    "build_branch": "main",
    "force_https": true
  }')

echo "$PAGE_INFO" | jq '.' 2>/dev/null || echo "$PAGE_INFO"

# 检查是否成功
if echo "$PAGE_INFO" | grep -q "url"; then
    echo ""
    echo "✅✅✅ Gitee Pages 开启成功！✅✅✅"
    echo ""
    echo "📦 步骤 3：获取访问地址..."
    
    # 等待 5 秒让 Gitee 准备好
    sleep 5
    
    # 获取 Pages URL
    PAGE_URL=$(curl -s "https://gitee.com/api/v5/repos/$user/$repo_name/pages" | grep -o '"https://[^"]*"' | grep -o 'https://[^"]*')
    
    echo ""
    echo "🌐 访问地址："
    echo "$PAGE_URL"
    echo ""
    echo "🎉 国内访问已配置！"
    echo ""
    echo "📝 下一步："
    echo "等待 1-2 分钟，然后访问上面的地址"
    echo ""
    echo "💡 提示："
    echo "- 国内访问速度：⭐⭐⭐⭐⭐"
    echo "- 完全免费"
    echo "- 自动 HTTPS"
    echo "- 后续代码更新会自动同步"
    
    # 保存到文件
    echo "$PAGE_URL" > /Users/h/clawd/trungpa-dharma-ai/GITEE_PAGES_URL.txt
    
else
    echo ""
    echo "❌ Pages 开启失败"
    echo ""
    echo "📝 可能的原因："
    echo "1. API Token 无效或已过期"
    echo "2. 仓库不存在或仓库名称错误"
    echo "3. 用户名或密码错误"
    echo ""
    echo "🔧 手动开启方法（更可靠）："
    echo ""
    echo "1. 访问：https://gitee.com"
    echo "2. 登录后进入仓库页面"
    echo "3. 点击左侧菜单 '服务' → 'Gitee Pages'"
    echo "4. 点击 '启动'，选择分支：main"
    echo "5. 点击 '确认'"
    echo ""
    echo "只需 2 分钟即可完成！"
    exit 1
fi
