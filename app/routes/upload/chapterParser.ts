import type { ParsedChapter } from "../../types/upload";

/**
 * 智能章节解析器
 * 支持复杂的中文数字识别，自动合并分章节
 */
export class ChapterParser {
  /**
   * 从章节名称中提取中文数字
   * 支持格式：第三一一章(311)、第三一七章(317)、第两千零五十一章、第X章、老东西等复杂后缀
   */
  extractChineseNumber(chapterName: string): string | null {
    // 1. 尝试匹配"第X章"格式（开头匹配）- 支持第三一一章、第三一七章等格式
    let match = chapterName.match(/^第([一二三四五六七八九十百千万两零〇\d]+)章/);
    if (match && match[1]) {
      return match[1];
    }
    
    // 2. 尝试匹配"第X节"格式（开头匹配）
    match = chapterName.match(/^第([一二三四五六七八九十百千万两零〇\d]+)节/);
    if (match && match[1]) {
      return match[1];
    }
    
    // 3. 尝试匹配"第X回"格式（开头匹配）
    match = chapterName.match(/^第([一二三四五六七八九十百千万两零〇\d]+)回/);
    if (match && match[1]) {
      return match[1];
    }
    
    // 4. 尝试匹配"第X"后面跟其他文字的情况，如"第两千零三十老东西"（开头匹配）
    match = chapterName.match(/^第([一二三四五六七八九十百千万两零〇\d]+)[^章节回]*/);
    if (match && match[1]) {
      // 只取前面的中文数字部分
      const pureNumber = match[1].match(/^[一二三四五六七八九十百千万两零〇\d]+/);
      return pureNumber ? pureNumber[0] : match[1];
    }
    
    // 5. 尝试匹配开头的中文数字，后面可以跟任何字符，如"三千零三十老东西"（开头匹配）
    match = chapterName.match(/^([一二三四五六七八九十百千万两零〇\d]+)[^章节回]*/);
    if (match && match[1]) {
      return match[1];
    }
    
    // 6. 最后尝试提取任何位置的中文数字
    match = chapterName.match(/第([一二三四五六七八九十百千万两零〇\d]+)/);
    if (match && match[1]) {
      return match[1];
    }
    // 7. 最后尝试提取任何位置的中文数字
    match = chapterName.match(/^([一二三四五六七八九十百千万两零〇\d]+)/);
    if (match && match[1]) {
      return match[1];
    }

    return null;
  }

  /**
   * 将简写中文数字扩展为完整形式
   * 例如：三五九 -> 三百五十九, 三八一 -> 三百八十一
   */
  private expandShortChineseNumber(chineseNumber: string): string {
    // 数字映射表
    const digitMap: { [key: string]: string } = {
      '零': '零',
      '一': '一', 
      '二': '二',
      '三': '三',
      '四': '四',
      '五': '五',
      '六': '六',
      '七': '七',
      '八': '八',
      '九': '九',
      '0': '零',
      '1': '一',
      '2': '二', 
      '3': '三',
      '4': '四',
      '5': '五',
      '6': '六',
      '7': '七',
      '8': '八',
      '9': '九'
    };

    // 如果已经是完整形式（包含"十"、"百"、"千"、"万"等），直接返回
    if (chineseNumber.match(/[十百千万]/)) {
      return chineseNumber;
    }

    // 如果长度小于等于3位，可能是简写形式
    if (chineseNumber.length <= 3 && chineseNumber.length >= 2) {
      // 将简写形式转换为完整形式
      const expanded = chineseNumber
        .split('')
        .map(digit => digitMap[digit] || digit)
        .join('');
      
      // 根据长度添加位次
      if (expanded.length === 2) {
        // 两位数：如"三九" -> "三十九"
        return expanded[0] + '十' + expanded[1];
      } else if (expanded.length === 3) {
        // 三位数：如"三五九" -> "三百五十九"
        return expanded[0] + '百' + expanded[1] + '十' + expanded[2];
      }
    }

    return chineseNumber;
  }

  /**
   * 转换中文数字为阿拉伯数字
   */
  convertChineseToNumber(chineseNumber: string): number | null {
    try {
      // 预处理中文数字
      let processedNumber = chineseNumber
        .replace(/零/g, '0')
        .replace(/〇/g, '0')
        .replace(/两/g, '2');
      
      // 处理简写形式的中文数字（如"三五九" -> "三百五十九"）
      processedNumber = this.expandShortChineseNumber(processedNumber);
      
      // 简单中文数字转阿拉伯数字的实现
      const result = this.simpleChineseToNumber(processedNumber);
      const parsedNumber = parseInt(result);
      
      // 验证转换结果
      if (!isNaN(parsedNumber) && parsedNumber > 0) {
        return parsedNumber;
      }
      
      return null;
    } catch (error: any) {
      console.warn(`⚠️ 转换中文数字失败: ${chineseNumber}`, error);
      return null;
    }
  }

  /**
   * 简单中文数字转阿拉伯数字实现
   */
  private simpleChineseToNumber(chinese: string): string {
    const numMap: { [key: string]: string } = {
      '零': '0', '一': '1', '二': '2', '三': '3', '四': '4', 
      '五': '5', '六': '6', '七': '7', '八': '8', '九': '9'
    };

    let result = '';
    let currentNum = '';

    for (const char of chinese) {
      if (numMap[char]) {
        currentNum += numMap[char];
      } else if (char === '十') {
        if (currentNum === '') {
          result += '10';
        } else {
          result += currentNum + '0';
        }
        currentNum = '';
      } else if (char === '百') {
        if (currentNum === '') {
          result += '100';
        } else {
          result += currentNum + '00';
        }
        currentNum = '';
      } else if (char === '千') {
        if (currentNum === '') {
          result += '1000';
        } else {
          result += currentNum + '000';
        }
        currentNum = '';
      } else if (char === '万') {
        result += '0000';
        currentNum = '';
      }
    }

    if (currentNum) {
      result += currentNum;
    }

    return result || '0';
  }

  /**
   * 检查是否为分章节格式
   */
  private isSplitChapter(line: string): { isSplit: boolean; baseTitle?: string; current?: number; total?: number } {
    const splitChapterPattern = /^(第[一二三四五六七八九十百千万两零〇\d]+章)\s+(\d+)\/(\d+)/;
    const match = line.match(splitChapterPattern);
    
    if (match && match[1] && match[2] && match[3]) {
      return {
        isSplit: true,
        baseTitle: match[1],
        current: parseInt(match[2]),
        total: parseInt(match[3])
      };
    }
    
    return { isSplit: false };
  }

  /**
   * 检查是否为普通章节标题
   */
  private isChapterTitle(line: string): { isChapter: boolean; chapterNumber?: string; chapterTitle?: string } {
    // 标准章节模式
    const patterns = [
      // 标准格式：第X章 标题
      { regex: /^第([零一二三四五六七八九十百千万\d]+)章\s+(.+)$/, type: 'chapter_with_title' },
      { regex: /^第([零一二三四五六七八九十百千万\d]+)\s+章\s+(.+)$/, type: 'chapter_with_title' },
      
      // 第X回格式
      { regex: /^第([零一二三四五六七八九十百千万\d]+)回\s+(.+)$/, type: 'chapter_with_title' },
      { regex: /^第([零一二三四五六七八九十百千万\d]+)回$/, type: 'chapter_only' },
      
      // 第X节格式
      { regex: /^第([零一二三四五六七八九十百千万\d]+)节\s+(.+)$/, type: 'chapter_with_title' },
      { regex: /^第([零一二三四五六七八九十百千万\d]+)节$/, type: 'chapter_only' },
      
      // 复杂模式：第X章（后面可能有其他文字）
      { regex: /^第([一二三四五六七八九十百千万两零〇\d]+)章.*$/, type: 'chapter_only' },
      { regex: /^第([一二三四五六七八九十百千万两零〇\d]+)回.*$/, type: 'chapter_only' },
      { regex: /^第([一二三四五六七八九十百千万两零〇\d]+)节.*$/, type: 'chapter_only' },
      
      // 纯数字格式
      { regex: /^([一二三四五六七八九十百千万\d]+)\s+(.+)$/, type: 'number_with_title' },
      { regex: /^([一二三四五六七八九十百千万\d]+)$/, type: 'number_only' },
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern.regex);
      if (match) {
        if (pattern.type === 'chapter_with_title' && match[1] && match[2]) {
          const chapterNumber = match[1];
          const title = match[2];
          let chapterTitle = '';
          
          if (line.includes('章')) {
            chapterTitle = `第${chapterNumber}章 ${title}`;
          } else if (line.includes('回')) {
            chapterTitle = `第${chapterNumber}回 ${title}`;
          } else if (line.includes('节')) {
            chapterTitle = `第${chapterNumber}节 ${title}`;
          } else {
            chapterTitle = `第${chapterNumber}章 ${title}`;
          }
          
          return { isChapter: true, chapterNumber, chapterTitle };
        } else if (pattern.type === 'chapter_only') {
          const chapterNumber = match[1];
          let chapterTitle = '';
          
          if (line.includes('章')) {
            chapterTitle = `第${chapterNumber}章`;
          } else if (line.includes('回')) {
            chapterTitle = `第${chapterNumber}回`;
          } else if (line.includes('节')) {
            chapterTitle = `第${chapterNumber}节`;
          } else {
            chapterTitle = `第${chapterNumber}章`;
          }
          
          return { isChapter: true, chapterNumber, chapterTitle };
        } else if (pattern.type === 'number_with_title') {
          const chapterNumber = match[1];
          const title = match[2];
          const chapterTitle = `第${chapterNumber}章 ${title}`;
          
          return { isChapter: true, chapterNumber, chapterTitle };
        } else if (pattern.type === 'number_only') {
          const chapterNumber = match[1];
          const chapterTitle = `第${chapterNumber}章`;
          
          return { isChapter: true, chapterNumber, chapterTitle };
        }
      }
    }

    return { isChapter: false };
  }

  /**
   * 智能解析TXT内容为章节（修复版 - 正确处理分章节合并）
   */
  parseTxtContent(content: string): ParsedChapter[] {
    const lines = content.split('\n').filter(line => line.trim());
    const chapters: ParsedChapter[] = [];
    let currentChapter: ParsedChapter | null = null;
    let currentContent: string[] = [];
    let chapterIndex = 0;


    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // 首先检查是否为分章节格式
      const splitInfo = this.isSplitChapter(line);
      
      if (splitInfo.isSplit) {
        
        // 检查是否与当前章节是同一个
        const isSameChapter = currentChapter && 
          this.extractChineseNumber(currentChapter.title) === 
          this.extractChineseNumber(splitInfo.baseTitle || '');
        
        if (isSameChapter) {
          // 同一章节的分章节，添加到当前章节内容
          currentContent.push(`\n--- 分章节 ${splitInfo.current}/${splitInfo.total} ---\n`);
          continue;
        } else {
          // 新的章节，开始新章节
          if (currentChapter) {
            currentChapter.content = currentContent.join('\n').trim();
            chapters.push(currentChapter);
          }
          
          // 创建新章节
          const chapterTitle = splitInfo.baseTitle || `第${chapterIndex + 1}章`;
          const chineseNumber = this.extractChineseNumber(chapterTitle);
          let processedNumber = '';
          if (chineseNumber) {
            const number = this.convertChineseToNumber(chineseNumber);
            processedNumber = number ? number.toString() : '';
          }
          
          currentContent = [`--- 分章节 ${splitInfo.current}/${splitInfo.total} ---\n`];
          currentChapter = {
            title: chapterTitle,
            content: '',
            idx: chapterIndex++,
            bookId: undefined
          };
        }
      } else {
        // 检查是否为普通章节标题
        const chapterInfo = this.isChapterTitle(line);
        
        if (chapterInfo.isChapter) {
          
          // 保存上一章节
          if (currentChapter) {
            currentChapter.content = currentContent.join('\n').trim();
            chapters.push(currentChapter);
          }
          
          // 处理数字转换
          let processedNumber = chapterInfo.chapterNumber || '';
          if (chapterInfo.chapterNumber) {
            const chineseNumber = this.extractChineseNumber(chapterInfo.chapterTitle || '');
            if (chineseNumber) {
              const number = this.convertChineseToNumber(chineseNumber);
              if (number) {
                processedNumber = number.toString();
              }
            }
          }
          
          // 创建新章节
          currentContent = [];
          currentChapter = {
            title: chapterInfo.chapterTitle || `第${chapterIndex + 1}章`,
            content: '',
            idx: chapterIndex++,
            bookId: undefined
          };
        } else {
          // 普通内容行
          if (currentChapter) {
            currentContent.push(line);
          } else {
            currentChapter = {
              title: `第1章 序言`,
              content: '',
              idx: chapterIndex++,
              bookId: undefined
            };
            currentContent.push(line);
          }
        }
      }
    }

    // 添加最后一章
    if (currentChapter) {
      currentChapter.content = currentContent.join('\n').trim();
      chapters.push(currentChapter);
    }

    
    // 如果没有识别到任何章节，将整个内容作为一章
    if (chapters.length === 0) {
      return [{
        title: "第1章 内容",
        content: content,
        idx: 0,
        bookId: undefined
      }];
    }


    return chapters;
  }
}
