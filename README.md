## 开发环境

* Java环境：jdk8
* 框架：Spring4.1.0 + Shiro1.2.4 + Hibernate4.3.6 + JPA2.1
* IDE: Eclipse Luna Release 4.4.0

## 协作说明

* 每个开发自建一个分支，每日开始工作前拉取master分支并将自己的分支rebase到master

> 创建分支并推到远端

```
git checkout -b your-branch-name
git push origin your-branch-name
```
> 拉取分支并将自己的分支rebase到master

```
git checkout master
git pull origin master
git checkout your-branch-name
git rebase master
```
> 每日下班前推送一次自己的分支到远端，并申请合并

```
git push origin your-branch-name
```

![image](http://git.bin-go.cc/ucan/api/uploads/58ad1f516bfc9711d491dc4dcf47ab74/image.png)

> master在合并前可以review代码，添加评论，或添加行级代码评论

![image](http://git.bin-go.cc/ucan/api/uploads/3dc52f154b568111b5c0161b9d69430d/image.png)
