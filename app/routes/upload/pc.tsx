import { useEffect, useState } from "react";
import { Upload, FileText, CheckCircle, AlertCircle, Loader, ChevronDown, ChevronRight, Minimize2, Maximize2, Image, X } from "lucide-react";
import { useUpload, useCheckDuplicateBook } from "./index";
import type { UploadFormData, ParsedChapter } from "../../types/upload";
import { ChapterParser } from "./chapterParser";
import { useUploadImage } from "./imageService";
import Navbar from "../../components/Navbar";
import { Toast } from "react-vant";

export default function PCUpload() {
  const [formData, setFormData] = useState<UploadFormData>({
    bookName: "",
    authorName: "",
    bookContent: "",
  });
  const [parsedChapters, setParsedChapters] = useState<ParsedChapter[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  const [fileName, setFileName] = useState<string>("");
  const [expandedChapters, setExpandedChapters] = useState<Set<number>>(new Set());
  const [imageSource, setImageSource] = useState<'auto' | 'upload' | null>(null);
  const [imageLoadStatus, setImageLoadStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [imageErrorMessage, setImageErrorMessage] = useState<string>('');

  const uploadHook = useUpload();
  const uploadImageMutation = useUploadImage();
  
  // 重复检查 - 放在组件顶层
  const duplicateCheck = useCheckDuplicateBook(formData.bookName, formData.authorName);
  
  // 创建 ChapterParser 实例
  const parser = new ChapterParser();

  // 监听书名变化，自动设置图片src
  const handleBookNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const bookName = e.target.value;
    console.log(bookName,"n")
    setFormData(prev => ({ ...prev, bookName }));
    if (!bookName) {
      setImageSource(null);
      setImageLoadStatus('idle');
      setImageErrorMessage('');
    } else {
      // 自动设置图片src，清理书名中的特殊字符
      const cleanBookName = bookName;
      const imageSrc = `${import.meta.env.VITE_imgHost}/file/${cleanBookName}.jpg`;
      console.log('图片URL:', imageSrc); // 调试信息
      setFormData(prev => ({ ...prev, bookImage: imageSrc }));
      setImageLoadStatus('loading'); // 设置为加载中状态
      setImageSource('auto');
      setImageErrorMessage('');
    }
  };

  // 处理图片上传
  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !formData.bookName){
    Toast.info('请先输入书名');
      return
    };

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

  // 图片加载成功
  const handleImageLoad = () => {
    console.log('图片加载成功');
    setImageLoadStatus('success');
    setImageErrorMessage('');
  };

  // 图片加载失败
  const handleImageError = () => {
    console.log('图片加载失败:', formData.bookImage);
    setImageLoadStatus('error');
    setImageErrorMessage(`无法加载图片: ${formData.bookImage}`);
  };

  // 清除自定义图片，回到自动获取
  const handleClearCustomImage = () => {
    setFormData(prev => ({ 
      ...prev, 
      bookImage: undefined,
      imageFile: undefined
    }));
    setImageSource(null);
    setImageLoadStatus('idle');
    setImageErrorMessage('');
    // 重新获取自动图片
      console.log(formData)
    if (formData.bookName) {
      const cleanBookName = formData.bookName;
      const imageSrc = `${import.meta.env.VITE_imgHost}/file/${cleanBookName}.jpg`;
      setFormData(prev => ({ ...prev, bookImage: imageSrc }));
      setImageSource('auto');
      setImageLoadStatus('loading');
    }
  };

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
          // 重置展开状态
          setExpandedChapters(new Set());
          
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
    const maxPreviewLength = 200;
    if (content.length <= maxPreviewLength || isExpanded) {
      return content;
    }
    return content.substring(0, maxPreviewLength) + '...';
  };

  // 表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.bookName || !formData.authorName || !formData.bookContent) {
      Toast.fail("请填写完整信息");
      return;
    }

    try {
      // 检查重复
      const isDuplicate = await duplicateCheck.refetch();
      
      if (isDuplicate.data === true) {
        Toast.fail("书库中已存在同名同作者书籍，请检查书名和作者信息");
        return;
      }

      // 没有重复，继续上传
      uploadHook.mutate(formData);
    } catch (error) {
      console.error('检查重复失败:', error);
      Toast.fail("检查重复失败，请重试");
    }
  };

  // 进度百分比计算
  const progressPercentage = uploadHook.progress.total > 0 ? (uploadHook.progress.current / uploadHook.progress.total) * 100 : 0;

  // 获取图片显示区域
  const renderImageSection = () => {
    const hasBookName = formData.bookName.trim();
    const hasImage = formData.bookImage && hasBookName;

    if (!hasBookName) {
      return (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center
                      bg-gray-50 dark:bg-gray-700/50">
          <Image className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-500 dark:text-gray-400 mb-2">
            请先输入书名以自动获取封面
          </p>
          <p className="text-sm text-gray-400 dark:text-gray-500">
            或手动上传封面图片
          </p>
        </div>
      );
    }

    if (imageLoadStatus === 'loading' && hasImage) {
      // 显示加载状态
      return (
        <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center
                      bg-gray-50 dark:bg-gray-700/50">
          <Loader className="h-12 w-12 text-blue-500 mx-auto mb-4 animate-spin" />
          <p className="text-gray-600 dark:text-gray-300 mb-2">
            正在加载封面图片...
          </p>
           <img
              src={formData.bookImage}
              alt="书籍封面"
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
              onLoad={handleImageLoad}
              onError={handleImageError}
            />
          <p className="text-sm text-gray-500 dark:text-gray-400 break-all">
            {formData.bookImage}
          </p>
        </div>
      );
    }

    if (imageLoadStatus === 'success' && hasImage) {
      // 显示图片预览和更换按钮
      return (
        <div className="space-y-4">
          <div className="relative group">
            <img
              src={formData.bookImage}
              alt="书籍封面"
              className="w-full max-w-sm mx-auto rounded-lg shadow-lg"
            />
            <div className="absolute inset-0  bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                id="image-upload-pc-replace"
                disabled={uploadHook.isPending || uploadImageMutation.isPending}
              />
              <label 
                htmlFor="image-upload-pc-replace" 
                className="opacity-0 group-hover:opacity-100 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg cursor-pointer transition-all duration-200 flex items-center"
              >
                <Upload className="h-4 w-4 mr-2" />
                更换封面
              </label>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">
              自动获取封面图片
            </p>
            <button
              type="button"
              onClick={handleClearCustomImage}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              重新获取封面
            </button>
          </div>
        </div>
      );
    }

    // 显示上传区域（图片加载失败或没有图片）
    return (
      <div className="space-y-4">
        {imageLoadStatus === 'error' && hasImage && (
          <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <div className="flex items-start space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
              <div>
                <p className="text-red-700 dark:text-red-300 text-sm mb-2">
                  图片加载失败
                </p>
                <p className="text-red-600 dark:text-red-400 text-xs break-all">
                  {formData.bookImage}
                </p>
                <p className="text-red-500 dark:text-red-400 text-xs mt-1">
                  请手动上传封面图片
                </p>
              </div>
            </div>
          </div>
        )}
        
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
        
        {hasImage && (
          <div className="text-center">
            <button
              type="button"
              onClick={handleClearCustomImage}
              className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium"
            >
              重新尝试获取封面
            </button>
          </div>
        )}
      </div>
    );
  };

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
                onChange={handleBookNameChange}
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

            {/* 图片上传区域 */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                书籍封面
              </label>
              
              {renderImageSection()}
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
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    章节预览 (共 {parsedChapters.length} 章)
                  </h3>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={expandAllChapters}
                      className="flex items-center px-3 py-1 text-sm bg-blue-100 hover:bg-blue-200 
                               dark:bg-blue-900 dark:hover:bg-blue-800 text-blue-700 dark:text-blue-300 
                               rounded-lg transition-colors duration-200"
                    >
                      <Maximize2 className="h-4 w-4 mr-1" />
                      全部展开
                    </button>
                    <button
                      type="button"
                      onClick={collapseAllChapters}
                      className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 
                               dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 
                               rounded-lg transition-colors duration-200"
                    >
                      <Minimize2 className="h-4 w-4 mr-1" />
                      全部收起
                    </button>
                  </div>
                </div>
                <div className="max-h-96 overflow-y-auto space-y-3">
                  {parsedChapters.map((chapter, index) => {
                    const isExpanded = expandedChapters.has(index);
                    return (
                      <div key={index} className="border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                        <div 
                          className="p-3 bg-gray-50 dark:bg-gray-700 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600 
                                   transition-colors duration-200"
                          onClick={() => toggleChapterExpansion(index)}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {isExpanded ? (
                                <ChevronDown className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              ) : (
                                <ChevronRight className="h-4 w-4 text-gray-500 dark:text-gray-400" />
                              )}
                              <span className="font-medium text-gray-900 dark:text-white">{chapter.title}</span>
                              <span className="text-sm text-gray-500 dark:text-gray-400">
                                ({chapter.content.length} 字符)
                              </span>
                            </div>
                            <span className="text-xs text-gray-400 dark:text-gray-500">
                              {isExpanded ? '收起' : '展开'}
                            </span>
                          </div>
                        </div>
                        {isExpanded && (
                          <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-600">
                            <div className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-wrap">
                              {formatChapterContent(chapter.content, true)}
                            </div>
                            {chapter.content.length > 200 && (
                              <button
                                type="button"
                                onClick={() => toggleChapterExpansion(index)}
                                className="mt-3 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 
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
                    开始上传
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
