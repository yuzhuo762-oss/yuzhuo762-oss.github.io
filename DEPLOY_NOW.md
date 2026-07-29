# 部署指南 - 发布作品集网站

## 准备工作

1. 打开 https://github.com ，注册或登录你的账号
2. 打开 https://vercel.com ，用 GitHub 账号登录

## 第一步：上传到 GitHub

在电脑上打开终端（cmd 或 PowerShell），逐行执行：

`ash
# 进入项目目录
cd /d E:\作品集网站制作

# 删除旧的 .git 文件夹（如果有权限问题）
rmdir /s /q .git

# 初始化 Git
git init -b main

# 添加所有文件
git add .

# 提交
git commit -m "初始化作品集网站"

# 创建 GitHub 仓库并连接
# 先打开 https://github.com/new 创建新仓库（名字随意，比如 zhuo-portfolio）
# 创建后执行（替换 YOUR_USERNAME 为你的 GitHub 用户名）：
git remote add origin https://github.com/YOUR_USERNAME/zhuo-portfolio.git
git push -u origin main
`

## 第二步：用 Vercel 部署（推荐，最简单）

1. 打开 https://vercel.com ，用 GitHub 登录
2. 点击 "Add New..." → "Project"
3. 选择刚才上传的 zhuo-portfolio 仓库
4. Framework Preset → 选择 **Other**
5. 点击 **Deploy**
6. 等 10 秒，Vercel 会给你一个链接：https://zhuo-portfolio.vercel.app
7. 把这个链接发给别人，他们就能看到了

## 以后更新内容

修改完网站文件后，执行：

`ash
cd /d E:\作品集网站制作
git add .
git commit -m "更新内容"
git push
`

Vercel 会自动重新部署，1 分钟左右更新生效。

## 没成功？

告诉我卡在哪一步，我帮你解决。
