这是一个remix的ssr项目
运行在cloudflare pages环境
无法使用nodejs运行时
名字叫做夜读小说网
增加一些广告词 符合c端设计
你的所有请求都需要使用@tanstack/react-query
你如果要修改文件则直接重写整个文件 不要替换或修改
非我同意禁止新建组件
第二次修改失败后 直接重写全部文件
默认ui库为tailwind和vant-react
默认图标库为lucide-react
需要适配两端 所以请求和处理逻辑需要抽离出来
ui页面在pc和moible文件夹下
请求webhost接口的返回值在types文件夹下为response<T>
entities.d.ts为书籍 作者 章节的数据结构
页面的代码结构需要是 pageName/index.tsx pc.tsx mobile.tsx
index.tsx中编写公共请求和tailwind去返回pc或mobile
entities.d.ts文件内容禁止修改
如果新类型新建文件定义 并且优先引入entities.d.ts
数据库字段不是下划线而是驼峰
数据库字段查询必须使用双引号包裹
序列化参数需要使用单引号包裹
注意ui需要使用tailwind的dark兼容黑白模式
每个模块的index.css都要单独增加
@reference "tailwindcss";
@custom-variant dark (&:where(.dark, .dark *));]
不要用什么乱七八糟的trim replace 整理文字格式
可以点击的功能 都要加上cursor-pointer
已安装ahooks
状态管理使用zustand
