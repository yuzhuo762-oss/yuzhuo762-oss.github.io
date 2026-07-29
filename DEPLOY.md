# 部署指南 - 作品集网站

## 方式一：GitHub Pages（推荐，免费，最简单）

### 第 1 步：创建 GitHub 仓库
1. 打开 https://github.com ，登录你的账号
2. 点击右上角 + → New repository
3. 仓库名填写 zhuo-yirong（或任意名字），选择 Public
4. 不要勾选任何初始化选项，直接点 Create repository

### 第 2 步：上传网站文件
在电脑上打开终端（cmd 或 PowerShell），逐行执行：

`ash
# 进入项目目录
cd "C:\Users\legion、\Documents\作品集网站制作"

# 如果 .git 文件夹有权限问题，先删除
rmdir /s /q .git

# 初始化 Git
git init -b main

# 添加所有文件
git add .

# 提交
git commit -m "初始化作品集网站"

# 连接到你的 GitHub 仓库（换成你的 GitHub 用户名）
git remote add origin https://github.com/你的用户名/zhuo-yirong.git

# 上传
git push -u origin main
`

### 第 3 步：开启 GitHub Pages
1. 回到 GitHub 仓库页面
2. 点击 Settings → Pages
3. Source 选择 Deploy from a branch
4. Branch 选择 main，folder 选择 / (root)
5. 点击 Save
6. 等待 1-2 分钟，你的网站就会出现在：
   https://你的用户名.github.io/zhuo-yirong/

## 方式二：Vercel（自动 HTTPS，更快）

1. 打开 https://vercel.com ，用 GitHub 账号登录
2. 点击 Add New... → Project
3. 导入刚才上传的 GitHub 仓库
4. Framework Preset 选择 Other
5. 点击 Deploy
6. 几秒后即可访问，Vercel 会自动分配域名

## 本地预览（不部署时使用）

`ash
python -m http.server 3000
# 然后浏览器访问 http://localhost:3000
`

同一局域网的其他设备可以访问：
http://192.168.5.35:3000

## 替换作品图片

你的图片已经放在 assets/images/ 文件夹里了。如果要替换：
1. 把新图片放到 assets/images/
2. 文件名保持和原来一致即可覆盖

## 网站说明

这个网站是纯静态网站（HTML + CSS + JS），部署后：
- ✅ 任何人都能访问查看
- ✅ 陌生人无法修改内容（没有后台管理）
- ✅ 加载速度快
- ✅ 完全免费托管

如果有任何问题，随时问我。
