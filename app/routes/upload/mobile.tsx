import { useState } from "react";
import { Button, Card, Input } from "react-vant";
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useUpload } from "./index";
import type { UploadFormData, ParsedChapter } from "../../types/upload";
import { ChapterParser } from "./chapterParser";
import MobileNavbar from "../../components/MobileNavbar";

export default function MobileUpload() {
  const [formData, setFormData] = useState<UploadFormData>({
    bookName: "",
    authorName: "",
    bookContent: "",
  });
  const [parsedChapters, setParsedChapters] = useState<ParsedChapter[]>([]);
  const [showPreview, setShowPreview] = useState(false);

  const uploadHook = useUpload();
  
  // 创建 ChapterParser 实例
  const parser = new ChapterParser();

  // 文件上传处理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        setFormData(prev => ({ ...prev, bookContent: content }));
        // 使用 ChapterParser 解析章节
        const chapters = parser.parseTxtContent(content);
        setParsedChapters(chapters);
        setShowPreview(true);
      };
      reader.readAsText(file);
    }
  };

  // 手动解析章节
  const handleParseContent = () => {
    if (formData.bookContent.trim()) {
      // 使用 ChapterParser 解析章节
      const chapters = parser.parseTxtContent(formData.bookContent);
      setParsedChapters(chapters);
      setShowPreview(true);
    }
  };

  // 表单提交
  const handleSubmit = () => {
    if (!formData.bookName || !formData.authorName || !formData.bookContent) {
      alert("请填写完整信息");
      return;
    }
    uploadHook.mutate(formData);
  };

  // 进度百分比计算
  const progressPercentage = uploadHook.progress.total > 0 ? (uploadHook.progress.current / uploadHook.progress.total) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <MobileNavbar 
        title="夜读小说网 - 上传" 
        subtitle="分享你的精彩作品"
        showBack={true}
        showSearch={false}
        onBackClick={() => window.history.back()}
      />
      
      <div className="px-4 py-6">
        <Card>
          <div className="text-center mb-6">
            <Upload className="h-12 w-12 text-blue-500 mx-auto mb-3" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
              上传小说
            </h1>
            <p className="text-sm text-gray-600 dark:text-gray-300">
              支持TXT格式文件，智能识别章节结构
            </p>
          </div>

          {uploadHook.error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
              <AlertCircle className="h-4 w-4 text-red-500 mr-2 flex-shrink-0" />
              <span className="text-sm text-red-700 dark:text-red-300">{uploadHook.error.message}</span>
            </div>
          )}

          {uploadHook.progress.status !== 'idle' && (
            <div className="mb-4 p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-blue-700 dark:text-blue-300 font-medium flex items-center">
                  {uploadHook.progress.status === 'success' ? (
                    <CheckCircle className="h-4 w-4 inline mr-2" />
                  ) : (
                    <Loader className="h-4 w-4 inline mr-2 animate-spin" />
                  )}
                  {uploadHook.progress.message}
                </span>
                <span className="text-xs text-blue-600 dark:text-blue-400">
                  {uploadHook.progress.current}/{uploadHook.progress.total}
                </span>
              </div>
              <div className="w-full bg-blue-200 dark:bg-blue-800 rounded-full h-2">
                <div 
                  className="bg-blue-600 dark:bg-blue-400 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progressPercentage}%` }}
                ></div>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* 书名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                书名 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="请输入书名"
                value={formData.bookName}
                onChange={(value: string) => setFormData(prev => ({ ...prev, bookName: value }))}
                disabled={uploadHook.isPending}
              />
            </div>

            {/* 作者 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                作者 <span className="text-red-500">*</span>
              </label>
              <Input
                placeholder="请输入作者姓名"
                value={formData.authorName}
                onChange={(value: string) => setFormData(prev => ({ ...prev, authorName: value }))}
                disabled={uploadHook.isPending}
              />
            </div>

            {/* 文件上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                上传TXT文件 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4 text-center
                            hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload-mobile"
                  disabled={uploadHook.isPending}
                />
                <label htmlFor="file-upload-mobile" className="cursor-pointer">
                  <FileText className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 dark:text-gray-300">
                    点击选择TXT文件
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    智能识别复杂章节格式
                  </p>
                </label>
              </div>
            </div>


            {/* 章节预览 */}
            {showPreview && parsedChapters.length > 0 && (
              <Card>
                <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">
                  章节预览 (共 {parsedChapters.length} 章)
                </h3>
                <div className="max-h-48 overflow-y-auto space-y-2">
                  {parsedChapters.slice(0, 5).map((chapter, index) => (
                    <div key={index} className="text-xs p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="font-medium">{chapter.title}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        ({chapter.content.length} 字符)
                      </span>
                    </div>
                  ))}
                  {parsedChapters.length > 5 && (
                    <div className="text-xs text-gray-500 dark:text-gray-400 text-center py-2">
                      还有 {parsedChapters.length - 5} 个章节...
                    </div>
                  )}
                </div>
              </Card>
            )}

            {/* 提交按钮 */}
            <div className="pt-4">
              <Button
                type="primary"
                size="large"
                block
                onClick={handleSubmit}
                disabled={uploadHook.isPending || !formData.bookName || !formData.authorName || !formData.bookContent}
                loading={uploadHook.isPending}
                loadingText="解析中..."
                icon={!uploadHook.isPending ? <Upload className="h-4 w-4 mr-1" /> : undefined}
              >
                {!uploadHook.isPending ? '开始解析' : '解析中...'}
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
