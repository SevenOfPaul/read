import { useNavigate } from "react-router";
import { Button, Card } from "react-vant";
import { BookOpen, Home, Search, ArrowLeft } from "lucide-react";

export default function NotFound() {
  const navigate = useNavigate();

  const handleBackHome = () => {
    navigate("/");
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-blue-900 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl mx-auto">
        
        {/* PC端布局 */}
        <div className="hidden md:block">
          <div className="text-center">
            {/* 404大数字 */}
            <div className="relative mb-8">
              <h1 className="text-9xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                404
              </h1>
              <div className="absolute inset-0 text-9xl font-bold text-blue-200 dark:text-blue-800 opacity-20 animate-pulse">
                404
              </div>
            </div>

            {/* 标题和描述 */}
            <div className="mb-12">
              <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                页面丢失了 📚
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto leading-relaxed">
                看起来您要找的书籍页面不在书架上了。不要担心，让我们帮您找到正确的方向。
              </p>
            </div>

            {/* 图书插画区域 */}
            <div className="mb-12">
              <div className="relative">
                <BookOpen className="h-32 w-32 text-gray-300 dark:text-gray-600 mx-auto" />
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-red-400 rounded-full animate-bounce"></div>
                <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-yellow-400 rounded-full animate-bounce delay-100"></div>
              </div>
            </div>

            {/* 操作按钮组 */}
            <div className="flex justify-center space-x-4 mb-12">
              <Button
                type="primary"
                size="large"
                icon={<Home className="h-5 w-5" />}
                onClick={handleBackHome}
                className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-none"
                style={{ borderRadius: '12px', padding: '12px 32px' }}
              >
                返回首页
              </Button>
              <Button
                type="default"
                size="large"
                icon={<Search className="h-5 w-5" />}
                onClick={() => navigate("/search")}
                className="border-2 border-gray-300 hover:border-blue-400 text-gray-700 hover:text-blue-600"
                style={{ borderRadius: '12px', padding: '12px 32px' }}
              >
                搜索图书
              </Button>
              <Button
                type="default"
                size="large"
                icon={<ArrowLeft className="h-5 w-5" />}
                onClick={handleGoBack}
                className="border-2 border-gray-300 hover:border-gray-400 text-gray-700 hover:text-gray-900"
                style={{ borderRadius: '12px', padding: '12px 32px' }}
              >
                上一页
              </Button>
            </div>

            {/* 建议区域 */}
            <Card className="max-w-2xl mx-auto bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm border-0 shadow-xl">
              <Card.Header>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white flex items-center">
                  <Search className="h-5 w-5 mr-2 text-blue-500" />
                  您可能在寻找
                </h3>
              </Card.Header>
              <Card.Body>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
                       onClick={() => navigate("/")}>
                    <div className="font-medium text-gray-900 dark:text-white">首页</div>
                    <div className="text-gray-500 dark:text-gray-400">浏览所有图书</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer transition-colors"
                       onClick={() => navigate("/category")}>
                    <div className="font-medium text-gray-900 dark:text-white">分类浏览</div>
                    <div className="text-gray-500 dark:text-gray-400">按类别查找</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-purple-50 dark:hover:bg-purple-900/30 cursor-pointer transition-colors"
                       onClick={() => navigate("/favorites")}>
                    <div className="font-medium text-gray-900 dark:text-white">我的收藏</div>
                    <div className="text-gray-500 dark:text-gray-400">查看收藏的书籍</div>
                  </div>
                  <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-orange-50 dark:hover:bg-orange-900/30 cursor-pointer transition-colors"
                       onClick={() => navigate("/recent")}>
                    <div className="font-medium text-gray-900 dark:text-white">最近阅读</div>
                    <div className="text-gray-500 dark:text-gray-400">继续上次阅读</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* 移动端布局 */}
        <div className="md:hidden">
          <div className="text-center">
            {/* 404数字 - 移动端 */}
            <div className="relative mb-6">
              <h1 className="text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
                404
              </h1>
            </div>

            {/* 标题和描述 - 移动端 */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                页面丢失了 📚
              </h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                看起来您要找的内容不在这里
              </p>
            </div>

            {/* 图书图标 - 移动端 */}
            <div className="mb-8">
              <BookOpen className="h-20 w-20 text-gray-300 dark:text-gray-600 mx-auto" />
            </div>

            {/* 主要操作按钮 - 移动端 */}
            <div className="space-y-3 mb-6">
              <Button
                type="primary"
                block
                icon={<Home className="h-5 w-5" />}
                onClick={handleBackHome}
                className="h-12 text-base"
              >
                返回首页
              </Button>
              <Button
                type="default"
                block
                icon={<Search className="h-5 w-5" />}
                onClick={() => navigate("/search")}
                className="h-12 text-base"
              >
                搜索图书
              </Button>
            </div>

            {/* 建议卡片 - 移动端 */}
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-0">
              <Card.Body>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center justify-center">
                  <Search className="h-5 w-5 mr-2 text-blue-500" />
                  推荐入口
                </h3>
                <div className="space-y-3">
                  <div 
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-blue-50 dark:hover:bg-blue-900/30 cursor-pointer transition-colors"
                    onClick={() => navigate("/")}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">首页</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">浏览所有图书</div>
                  </div>
                  <div 
                    className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg hover:bg-green-50 dark:hover:bg-green-900/30 cursor-pointer transition-colors"
                    onClick={() => navigate("/category")}
                  >
                    <div className="font-medium text-gray-900 dark:text-white">分类浏览</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">按类别查找</div>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </div>

        {/* 底部信息 */}
        <footer className="mt-12 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            如果问题持续存在，请联系我们的技术支持
          </p>
        </footer>
      </div>
    </div>
  );
}
