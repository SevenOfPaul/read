# 移动端逻辑统一方案 - 待办清单

## 任务目标
以PC端为准，统一移动端逻辑，移除移动端多余功能，保留移动端特色交互。

## 待办清单

### 1. 首页 (Home) - `app/routes/home/mobile.tsx`
- [x] 移除侧边栏功能 (`isSidebarOpen` 状态管理)
- [x] 简化功能按钮区（保留必要功能）
- [x] 移除移动端特色说明卡片
- [x] 保留移动端底部信息栏
- [x] 保留MobileNavbar

### 2. 书籍详情页 (Book) - `app/routes/book/mobile.tsx`
- [x] 保持现状，无需修改
- [x] 确认MobileNavbar和移动端布局保留

### 3. 阅读页 (Read) - `app/routes/read/mobile.tsx`
- [x] 保持现状，无需修改
- [x] 确认ActionSheet主题设置保留
- [x] 确认MobileNavbar和底部信息栏保留

### 4. 分类页 (Category) - `app/routes/category/mobile.tsx`
- [x] 保持现状，无需修改
- [x] 确认分类选择器弹窗保留
- [x] 确认筛选工具栏保留
- [x] 确认底部信息栏保留

### 5. 排行榜页 (Rank) - `app/routes/rank/mobile.tsx`
- [x] 简化快捷按钮区
- [x] 移除移动端多余的快捷按钮
- [x] 保持MobileNavbar和底部信息栏

### 6. 作者页 (Author) - `app/routes/author/mobile.tsx`
- [x] 简化快捷功能区
- [x] 移除移动端多余按钮
- [x] 保持MobileNavbar和底部信息栏

### 7. 专题页 (Special) - `app/routes/special/mobile.tsx`
- [x] 简化专题类型选择器
- [x] 移除复杂样式，保留基本功能
- [x] 保持筛选工具栏和底部信息栏

### 8. 上传页 (Upload) - `app/routes/upload/mobile.tsx`
- [x] 保持现状，无需修改
- [x] 确认MobileNavbar和简化布局保留

## 需要保留的移动端特色功能
1. 移动端特色的底部信息栏
2. MobileNavbar组件和移动端导航交互
3. ActionSheet形式的主题设置（阅读页）
4. 分类选择器弹窗（分类页）
5. 筛选工具栏（分类页、专题页）

## 需要移除的移动端多余功能
1. 首页的侧边栏功能
2. 首页的功能按钮网格布局
3. 首页的移动端特色说明卡片
4. 排行榜页移动端多余的快捷按钮
5. 作者页移动端多余的快捷功能
6. 专题页复杂的类型选择器样式

## 统一原则
- 以PC端功能逻辑为准
- 保留移动端友好的交互方式
- 简化移动端复杂的UI元素
- 保持核心功能一致性
