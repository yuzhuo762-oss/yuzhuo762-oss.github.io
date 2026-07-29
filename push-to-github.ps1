# 推送到 GitHub 脚本
# 打开 PowerShell（以管理员身份运行），执行以下命令：

cd E:\作品集网站制作

# 设置远端仓库
git remote add origin https://github.com/yuzhuo762-oss/zhuo-portfolio.git

# 如果上面那行提示 "already exists"，执行这句替换：
# git remote set-url origin https://github.com/yuzhuo762-oss/zhuo-portfolio.git

# 推送到 GitHub
git push -u origin main
