// 生成AI总结SVG - GitHub Stats 样式
function generateAISummarySVG(summaryData, isDarkMode = false) {
    const bgColor = isDarkMode ? '#0d1117' : '#fffefe';
    const borderColor = isDarkMode ? '#30363d' : '#e4e2e2';
    const titleColor = isDarkMode ? '#58a6ff' : '#2f80ed';
    const textColor = isDarkMode ? '#c9d1d9' : '#434d58';
    const statColor = isDarkMode ? '#8b949e' : '#434d58';
    const accentColor = isDarkMode ? '#58a6ff' : '#2f80ed';

    const width = 500;  // 与设备列表卡片一致
    const padding = 25;
    const lineHeight = 18;
    const headerHeight = 60;
    const maxContentWidth = width - 2 * padding;  // 内容最大宽度

    // 智能文本换行处理 - 按字符宽度和标点符号分行
    function wrapText(text, maxWidth) {
        const lines = [];
        const avgCharWidth = 6.5;  // 平均字符宽度（像素）
        const maxCharsPerLine = Math.floor(maxWidth / avgCharWidth);

        // 按句子分割（支持中英文标点）
        const sentences = text.split(/([。！？!?;\n])/);
        let currentLine = '';

        for (let i = 0; i < sentences.length; i++) {
            const segment = sentences[i];

            if (!segment) continue;

            // 如果当前行加上新片段不超过最大长度
            if ((currentLine + segment).length <= maxCharsPerLine) {
                currentLine += segment;
            } else {
                // 如果当前行已有内容，先保存
                if (currentLine) {
                    lines.push(currentLine.trim());
                    currentLine = segment;
                } else {
                    // 如果单个片段就超长，强制分割
                    let remaining = segment;
                    while (remaining.length > maxCharsPerLine) {
                        lines.push(remaining.substring(0, maxCharsPerLine));
                        remaining = remaining.substring(maxCharsPerLine);
                    }
                    currentLine = remaining;
                }
            }
        }

        if (currentLine.trim()) {
            lines.push(currentLine.trim());
        }

        return lines;
    }

    const summary = summaryData.summary || summaryData.message || '暂无总结';
    const deviceName = summaryData.deviceName || summaryData.device || summaryData.deviceId || '未知设备';
    const timestamp = summaryData.timestamp || new Date().toISOString();

    const summaryLines = wrapText(summary, maxContentWidth);
    const contentHeight = summaryLines.length * lineHeight + 40;  // 内容高度 + 底部边距
    const statsHeight = contentHeight + 80;  // 统计区域高度
    const totalHeight = headerHeight + statsHeight + padding;

    let svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}" fill="none" role="img" aria-labelledby="aiTitleId">
  <title id="aiTitleId">AI 使用总结</title>
  <desc id="aiDescId">设备 ${escapeXml(deviceName)} 的 AI 使用分析</desc>
  
  <style>
    .header {
      font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: ${titleColor};
      animation: fadeInAnimation 0.8s ease-in-out forwards;
    }
    @supports(-moz-appearance: auto) {
      .header { font-size: 15.5px; }
    }
    
    .stat {
      font: 600 14px 'Segoe UI', Ubuntu, "Helvetica Neue", Sans-Serif; 
      fill: ${statColor};
    }
    @supports(-moz-appearance: auto) {
      .stat { font-size: 12px; }
    }
    
    .ai-content {
      font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: ${textColor};
      line-height: 1.5;
    }
    
    .ai-device-info {
      font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: ${statColor};
    }
    
    .stagger {
      opacity: 0;
      animation: fadeInAnimation 0.3s ease-in-out forwards;
    }
    
    .not_bold { font-weight: 400; }
    .bold { font-weight: 700; }
    
    @keyframes fadeInAnimation {
      from { opacity: 0; }
      to { opacity: 1; }
    }
  </style>

  <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="${borderColor}" 
        width="${width - 1}" fill="${bgColor}" stroke-opacity="1"/>

  <g data-testid="card-title" transform="translate(${padding}, 35)">
    <g transform="translate(0, 0)">
      <g transform="translate(0, -10)">
        <circle cx="10" cy="10" r="10" fill="${accentColor}" opacity="0.15"/>
        <g transform="translate(10, 10)">
          <path d="M-4,-4 L-4,4 M4,-4 L4,4 M-4,0 L4,0" stroke="${accentColor}" stroke-width="1.8" stroke-linecap="round"/>
          <circle cx="-4" cy="-4" r="1.5" fill="${accentColor}"/>
          <circle cx="4" cy="-4" r="1.5" fill="${accentColor}"/>
          <circle cx="-4" cy="4" r="1.5" fill="${accentColor}"/>
          <circle cx="4" cy="4" r="1.5" fill="${accentColor}"/>
        </g>
      </g>
      <text x="30" y="0" class="header" data-testid="header">AI 使用总结</text>
    </g>
  </g>

  <g data-testid="main-card-body" transform="translate(0, ${headerHeight})">
    <g transform="translate(${padding}, 20)">
      <text class="stat bold" y="0">设备: ${escapeXml(deviceName)}</text>
      <text class="ai-device-info" y="18">生成时间: ${new Date(timestamp).toLocaleString('zh-CN', {
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit'
    })}</text>
    </g>
    
    <g class="stagger" style="animation-delay: 200ms" transform="translate(${padding}, 60)">
      <text class="stat bold" y="0">📊 总结内容</text>
      
      <g transform="translate(0, 25)">
`;

    // 渲染总结内容的每一行
    summaryLines.forEach((line, index) => {
        const animationDelay = 400 + (index * 80);
        svgContent += `
        <text class="ai-content stagger" style="animation-delay: ${animationDelay}ms" 
              x="0" y="${index * lineHeight}">${escapeXml(line)}</text>`;
    });

    svgContent += `
      </g>
    </g>
  </g>
</svg>`;

    return svgContent;
}