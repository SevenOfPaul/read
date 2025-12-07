import { useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader } from "lucide-react";
import { useUpload } from "./index";
import type { UploadFormData, ParsedChapter } from "../../types/upload";
import { ChapterParser } from "./chapterParser";
import Navbar from "../../components/Navbar";

export default function PCUpload() {
  const [formData, setFormData] = useState<UploadFormData>({
    bookName: "",
    authorName: "",
    bookContent: "",
  });
  const [parsedChapters, setParsedChapters] = useState<ParsedChapter[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [fileName, setFileName] = useState<string>("");

  const uploadHook = useUpload();
  
  // 创建 ChapterParser 实例
  const parser = new ChapterParser();

  // 简化的文件上传处理
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file && file.type === "text/plain") {
      setFileName(file.name);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const content = e.target?.result as string;
          
          if (!content || content.trim().length < 1) {
            alert('文件内容为空，请检查文件格式');
            return;
          }
          
          console.log(`文件解析开始: ${file.name} (${content.length}字符)`);
          
          // 设置内容并解析章节
          setFormData(prev => ({ ...prev, bookContent: content }));
          const chapters = parser.parseTxtContent(content);
          setParsedChapters(chapters);
          setShowPreview(true);
          
          console.log(`解析完成: ${file.name} (${chapters.length}章节)`);
          
        } catch (error) {
          console.error('文件处理失败:', error);
          alert('文件处理失败，请检查文件格式');
        }
      };
      
      reader.onerror = () => {
        alert('文件读取失败，请重试');
      };
      
      // 使用默认的文本读取方式
      reader.readAsText(file);
    }
  };

  // 表单提交
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
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
      <Navbar title="夜读小说网 - 上传" subtitle="分享你的精彩作品" />
      
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <Upload className="h-16 w-16 text-blue-500 mx-auto mb-4" />
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              上传小说
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              支持TXT格式文件，智能识别章节结构
            </p>
          </div>

          {uploadHook.error && (
            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <span className="text-red-700 dark:text-red-300">{uploadHook.error.message}</span>
            </div>
          )}

          {uploadHook.progress.status !== 'idle' && (
            <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-blue-700 dark:text-blue-300 font-medium">
                  {uploadHook.progress.status === 'success' ? (
                    <CheckCircle className="h-5 w-5 inline mr-2" />
                  ) : (
                    <Loader className="h-5 w-5 inline mr-2 animate-spin" />
                  )}
                  {uploadHook.progress.message}
                </span>
                <span className="text-blue-600 dark:text-blue-400 text-sm">
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

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* 书名 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                书名 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.bookName}
                onChange={(e) => setFormData(prev => ({ ...prev, bookName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
                placeholder="请输入书名"
                disabled={uploadHook.isPending}
              />
            </div>

            {/* 作者 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                作者 <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formData.authorName}
                onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-blue-500 focus:border-transparent
                         transition-colors duration-200"
                placeholder="请输入作者姓名"
                disabled={uploadHook.isPending}
              />
            </div>

            {/* 文件上传 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                上传TXT文件 <span className="text-red-500">*</span>
              </label>
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center
                            hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                <input
                  type="file"
                  accept=".txt"
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                  disabled={uploadHook.isPending}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-300">
                    点击选择TXT文件或拖拽文件到此处
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                    智能识别复杂章节格式
                  </p>
                  {fileName && (
                    <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
                      已选择: {fileName}
                    </p>
                  )}
                </label>
              </div>
            </div>

            {/* 章节预览 */}
            {showPreview && parsedChapters.length > 0 && (
              <div className="border border-gray-200 dark:border-gray-600 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  章节预览 (共 {parsedChapters.length} 章)
                </h3>
                <div className="max-h-64 overflow-y-auto space-y-2">
                  {parsedChapters.map((chapter, index) => (
                    <div key={index} className="text-sm p-2 bg-gray-50 dark:bg-gray-700 rounded">
                      <span className="font-medium">{chapter.title}</span>
                      <span className="text-gray-500 dark:text-gray-400 ml-2">
                        ({chapter.content.length} 字符)
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 提交按钮 */}
            <div className="pt-4">
              <button
                type="submit"
                disabled={uploadHook.isPending || !formData.bookName || !formData.authorName || !formData.bookContent}
                className="w-full py-3 px-6 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 
                         text-white font-medium rounded-lg transition-colors duration-200
                         disabled:cursor-not-allowed flex items-center justify-center"
              >
                {uploadHook.isPending ? (
                  <>
                    <Loader className="h-5 w-5 mr-2 animate-spin" />
                    解析中...
                  </>
                ) : (
                  <>
                    <Upload className="h-5 w-5 mr-2" />
                    开始解析
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
