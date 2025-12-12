import { useState } from "react";
import { Button, Card, Input } from "react-vant";
import { Upload, FileText, CheckCircle, AlertCircle, Loader, ChevronDown, ChevronRight, Minimize2, Maximize2, Image, X } from "lucide-react";
import { useUpload, useCheckDuplicateBook } from "./index";
import type { UploadFormData, ParsedChapter } from "../../types/upload";
import { ChapterParser } from "./chapterParser";
import {  useUploadImage } from "./imageService";
import MobileNavbar from "../../components/MobileNavbar";

export default function MobileUpload() {
  const [formData, setFormData] = useState<UploadFormData>({
    bookName: "",
    authorName: "",
    bookContent: "",
  });
  const [parsedChapters, setParsedChapters] = useState<ParsedChapter[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [imageSource, setImageSource] = useState<'auto' | 'upload' | null>(null);

  const uploadHook = useUpload();
  const uploadImageMutation = useUploadImage();
  
  
  // 创建 ChapterParser 实例
  const parser = new ChapterParser();

  // 监听书名变化，自动获取图片
  const handleBookNameChange = (bookName: string) => {
    setFormData(prev => ({ ...prev, bookName }));
    if (!bookName.trim()) {
      setImageSource(null);
    }
  };

  // 处理图片上传
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !formData.bookName.trim()) return;

    try {
      await uploadImageMutation.mutateAsync({
        file,
        bookName: formData.bookName
      });
      
      setFormData(prev => ({ 
        ...prev, 
        bookImage: undefined, // 清除缓存的数据，使用查询结果
        imageSource: 'upload'
      }));
      setImageSource('upload');
    } catch (error) {
      console.error('图片上传失败:', error);
    }
  };

  // 清除自定义图片，回到自动获取
  const handleClearCustomImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      bookImage: undefined,
      imageFile: undefined
    }));
    setImageSource(null);
    // 重新获取自动图片
  };

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
        // 重置展开状态
        setExpandedChapters(new Set());
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
      // 重置展开状态
      setExpandedChapters(new Set());
    }
  };

  // 切换单个章节展开/收起状态
  const toggleChapterExpansion = (index: number) => {
    setExpandedChapters(prev => {
      const newSet = new Set(prev);
      if (newSet.has(index)) {
        newSet.delete(index);
      } else {
        newSet.add(index);
      }
      return newSet;
    });
  };

  // 展开所有章节
  const expandAllChapters = () => {
    setExpandedChapters(new Set(parsedChapters.map((_, index) => index)));
  };

  // 收起所有章节
  const collapseAllChapters = () => {
    setExpandedChapters(new Set());
  };

  // 格式化章节内容显示
  const formatChapterContent = (content: string, isExpanded: boolean) => {
    const maxPreviewLength = 150;
    if (content.length <= maxPreviewLength || isExpanded) {
      return content;
    }
    return content.substring(0, maxPreviewLength) + '...';
  };

  // 表单提交
  const handleSubmit = async () => {
    if (!formData.bookName || !formData.authorName || !formData.bookContent) {
      alert("请填写完整信息");
      return;
    }

    try {

      // 没有重复，继续上传
      uploadHook.mutate(formData);
    } catch (error) {
      console.error('检查重复失败:', error);
      alert("检查重复失败，请重试");
    }
  };

  // 进度百分比计算
  const progressPercentage = uploadHook.progress.total > 0 ? (uploadHook.progress.current / uploadHook.progress.total) * 100 : 0;

  // 图片相关状态

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
                onChange={handleBookNameChange}
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

            {/* 图片上传区域 */}
           <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                书籍封面
              </label>
              
              <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center
                            hover:border-blue-400 dark:hover:border-blue-500 transition-colors duration-200">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload-pc"
                    disabled={uploadHook.isPending || uploadImageMutation.isPending}
                  />
                  <label htmlFor="image-upload-pc" className="cursor-pointer">
                    <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-600 dark:text-gray-300 mb-2">
                      点击上传封面图片
                    </p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      支持 JPG 格式，最大 5MB
                    </p>
                  </label>
                </div>
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
                <div className="mb-3">
                  <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-2">
                    章节预览 (共 {parsedChapters.length} 章)
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={expandAllChapters}
                      className="flex items-center px-2 py-1 text-xs bg-blue-100 hover:bg-blue-200 
                               dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 
                               rounded-lg transition-colors duration-200"
                    >
                      <Maximize2 className="h-3 w-3 mr-1" />
                      全部展开
                    </button>
                    <button
                      type="button"
                      onClick={collapseAllChapters}
                      className="flex items-center px-2 py-1 text-xs bg-gray-100 hover:bg-gray-200 
                               dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 
                               rounded-lg transition-colors duration-200"
                    >
                      <Minimize2 className="h-3 w-3 mr-1" />
                      全部收起
                    </button>
                  </div>
                </div>
                <div className="max-h-80 overflow-y-auto space-y-2">
                  {parsedChapters.map((chapter, index) => {
                    const isExpanded = expandedChapters.has(index);
                    return (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                        <div 
                          className="p-2 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 
                                   transition-colors duration-200"
                          onClick={() => toggleChapterExpansion(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-1">
                              {isExpanded ? (
                                <ChevronDown className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                              ) : (
                                <ChevronRight className="h-3 w-3 text-gray-500 dark:text-gray-400" />
                              )}
                              <span className="text-xs font-medium text-gray-900 dark:text-white truncate flex-1 mr-2">
                                {chapter.title}
                              </span>
                              <span className="text-xs text-gray-500 dark:text-gray-400">
                                ({chapter.content.length})
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {isExpanded ? '收起' : '展开'}
                            </span>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="p-3 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                            <div className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {formatChapterContent(chapter.content, true)}
                            </div>
                            {chapter.content.length > 150 && (
                              <button
                                type="button"
                                onClick={() => toggleChapterExpansion(index)}
                                className="mt-2 text-xs text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 
                                         font-medium transition-colors duration-200"
                              >
                                收起内容
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
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
