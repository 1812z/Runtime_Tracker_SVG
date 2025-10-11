// Cloudflare Workers 版本 - GitHub Stats 样式 + AI 总结

// 生成电池SVG
function generateBatterySVG(batteryLevel, isDarkMode = false) {
    if (batteryLevel <= 0) return '';

    const fillColor = batteryLevel > 20 ? '#4c71f2' : '#f85149';
    const strokeColor = isDarkMode ? '#9ca3af' : '#8b949e';

    return `
    <g>
      <rect x="0" y="0" width="18" height="11" rx="1.5" fill="none" stroke="${strokeColor}" stroke-width="1"/>
      <rect x="18.5" y="3" width="2" height="5" rx="0.5" fill="${strokeColor}"/>
      <rect x="1" y="1" width="${(batteryLevel / 100) * 16}" height="9" rx="1" fill="${fillColor}"/>
    </g>`;
}

// 生成状态圆形图标SVG
function generateStatusCircle(running, isDarkMode = false) {
    const color = running ? '#4c71f2' : '#f85149';
    const bgColor = running ? (isDarkMode ? '#21262d' : '#dbeafe') : (isDarkMode ? '#21262d' : '#fee2e2');

    return `
    <g>
      <circle cx="8" cy="8" r="8" fill="${bgColor}" opacity="0.2"/>
      <circle cx="8" cy="8" r="4" fill="${color}"/>
    </g>`;
}

// XML转义函数
function escapeXml(unsafe) {
    if (!unsafe) return '';
    return String(unsafe)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

// 生成设备列表SVG - GitHub Stats 样式
function generateDeviceListSVG(devices, isDarkMode = false) {
    const bgColor = isDarkMode ? '#0d1117' : '#fffefe';
    const borderColor = isDarkMode ? '#30363d' : '#e4e2e2';
    const titleColor = isDarkMode ? '#58a6ff' : '#2f80ed';
    const textColor = isDarkMode ? '#c9d1d9' : '#434d58';
    const statColor = isDarkMode ? '#8b949e' : '#434d58';

    const itemHeight = 45;
    const padding = 25;
    const headerHeight = 60;
    const statsStartY = 80;

    const statsHeight = devices.length * itemHeight + 60;
    const totalHeight = headerHeight + statsHeight + padding;
    const width = 500;

    let svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${totalHeight}" viewBox="0 0 ${width} ${totalHeight}" fill="none" role="img" aria-labelledby="titleId">
  <title id="titleId">设备状态监控面板</title>
  <desc id="descId">当前监控 ${devices.length} 个设备的运行状态</desc>
  
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
    
    .device-name {
      font: 700 13px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: ${textColor};
    }
    
    .device-info {
      font: 400 11px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: ${statColor};
    }
    
    .battery-text {
      font: 400 10px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: ${statColor};
    }
    
    .stagger {
      opacity: 0;
      animation: fadeInAnimation 0.3s ease-in-out forwards;
    }
    
    .status-running {
      fill: #4c71f2;
    }
    
    .status-stopped {
      fill: #f85149;
    }
    
    .not_bold { font-weight: 400; }
    .bold { font-weight: 700; }
    
    @keyframes fadeInAnimation {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    
    @keyframes slideInAnimation {
      from {
        transform: translateX(-10px);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
  </style>

  <rect data-testid="card-bg" x="0.5" y="0.5" rx="4.5" height="99%" stroke="${borderColor}" 
        width="${width - 1}" fill="${bgColor}" stroke-opacity="1"/>

  <g data-testid="card-title" transform="translate(${padding}, 35)">
    <g transform="translate(0, 0)">
      <g transform="translate(0, -8)">
        <rect x="0" y="0" width="20" height="14" rx="2" fill="none" stroke="${titleColor}" stroke-width="1.5"/>
        <rect x="4" y="3" width="12" height="8" rx="1" fill="none" stroke="${titleColor}" stroke-width="1"/>
        <rect x="8" y="16" width="4" height="2" fill="${titleColor}"/>
        <rect x="6" y="18" width="8" height="1" fill="${titleColor}"/>
      </g>
      <text x="30" y="0" class="header" data-testid="header">设备监控面板</text>
    </g>
  </g>

  <g data-testid="main-card-body" transform="translate(0, ${headerHeight})">
    <g transform="translate(${padding}, 20)">
      <text class="stat bold" y="0">在线设备: ${devices.filter(d => d.running).length}/${devices.length}</text>
      <text class="device-info" y="18">最后更新: ${new Date().toLocaleString('zh-CN')}</text>
    </g>
`;

    devices.forEach((device, index) => {
        const y = 60 + (index * itemHeight);
        const animationDelay = 450 + (index * 150);

        svgContent += `
    <g transform="translate(0, ${y})">
      <g class="stagger" style="animation-delay: ${animationDelay}ms" transform="translate(${padding}, 0)">
        <g transform="translate(0, 4)">
          ${generateStatusCircle(device.running, isDarkMode)}
        </g>
        
        <text class="device-name" x="25" y="12">${escapeXml(device.device)}</text>
        <text class="device-info" x="25" y="28">${escapeXml(device.currentApp || '无应用运行')}</text>
        
        <text class="stat bold ${device.running ? 'status-running' : 'status-stopped'}" 
              x="200" y="12">${device.running ? '● 运行中' : '● 已停止'}</text>
        
        ${device.batteryLevel > 0 ? `
        <g transform="translate(320, 8)">
          <text class="battery-text" x="0" y="0">电量:</text>
          <g transform="translate(30, -8)">
            ${generateBatterySVG(parseInt(device.batteryLevel), isDarkMode)}
          </g>
          <text class="battery-text" x="55" y="0">${device.batteryLevel}%</text>
        </g>
        ` : ''}
      </g>
    </g>`;
    });

    svgContent += `
  </g>
</svg>`;

    return svgContent;
}

// 生成AI总结SVG - GitHub Stats 样式
// 生成AI总结SVG - GitHub Stats 样式
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

    // 智能文本换行处理 - 严格控制宽度防止溢出
    function wrapText(text, maxWidth) {
        const lines = [];
        // 更保守的字符宽度估算
        const chineseCharWidth = 12;  // 中文字符宽度
        const englishCharWidth = 7;   // 英文字符宽度
        const safetyMargin = 20;      // 安全边距

        // 计算安全的最大字符数（使用中文宽度作为基准更安全）
        const maxCharsPerLine = Math.floor((maxWidth - safetyMargin) / chineseCharWidth);

        if (!text || text.trim() === '') {
            return ['暂无内容'];
        }

        // 预处理：替换多个空格和换行符
        text = text.replace(/\s+/g, ' ').trim();

        let currentLine = '';
        let currentWidth = 0;

        for (let i = 0; i < text.length; i++) {
            const char = text[i];

            // 判断是中文还是英文
            const isChinese = /[\u4e00-\u9fa5]/.test(char);
            const charWidth = isChinese ? chineseCharWidth : englishCharWidth;

            // 检查是否是标点符号，可以优先在标点处换行
            const isPunctuation = /[。！？!?;,，、]/.test(char);

            // 如果加上当前字符会超出宽度
            if (currentWidth + charWidth > maxWidth - safetyMargin) {
                // 保存当前行
                if (currentLine.trim()) {
                    lines.push(currentLine.trim());
                }
                currentLine = char;
                currentWidth = charWidth;
            } else {
                currentLine += char;
                currentWidth += charWidth;

                // 如果遇到标点符号且当前行已经比较长，可以考虑换行
                if (isPunctuation && currentWidth > (maxWidth - safetyMargin) * 0.7) {
                    if (currentLine.trim()) {
                        lines.push(currentLine.trim());
                    }
                    currentLine = '';
                    currentWidth = 0;
                }
            }
        }

        // 保存最后一行
        if (currentLine.trim()) {
            lines.push(currentLine.trim());
        }

        // 如果没有生成任何行，返回默认内容
        if (lines.length === 0) {
            return ['暂无内容'];
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

// 生成错误SVG - GitHub Stats 样式
function generateErrorSVG(message, details = '', isDarkMode = false) {
    const bgColor = isDarkMode ? '#0d1117' : '#fffefe';
    const borderColor = isDarkMode ? '#30363d' : '#e4e2e2';
    const titleColor = isDarkMode ? '#f85149' : '#d73a49';
    const textColor = isDarkMode ? '#c9d1d9' : '#434d58';

    return `
<svg xmlns="http://www.w3.org/2000/svg" width="450" height="150" viewBox="0 0 450 150" fill="none" role="img">
  <style>
    .error-header {
      font: 600 18px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: ${titleColor};
    }
    .error-text {
      font: 400 14px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: ${textColor};
    }
    .error-details {
      font: 400 12px 'Segoe UI', Ubuntu, Sans-Serif;
      fill: ${textColor};
      opacity: 0.7;
    }
  </style>

  <rect x="0.5" y="0.5" rx="4.5" height="99%" stroke="${borderColor}" 
        width="449" fill="${bgColor}" stroke-opacity="1"/>

  <g transform="translate(25, 35)">
    <text x="0" y="0" class="error-header">❌ ${escapeXml(message)}</text>
  </g>

  <g transform="translate(25, 70)">
    <text x="0" y="0" class="error-text">${escapeXml(details)}</text>
    <text x="0" y="25" class="error-details">请检查API地址和参数是否正确且可访问</text>
  </g>
</svg>`;
}

// 路由处理函数 - 设备列表
async function handleDevicesSVG(request) {
    try {
        const url = new URL(request.url);
        const api = url.searchParams.get('api');
        const theme = url.searchParams.get('theme') || 'light';

        if (!api) {
            const isDarkMode = theme === 'dark';
            return new Response(
                generateErrorSVG('缺少API参数', '请提供api参数', isDarkMode),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'image/svg+xml',
                        'Access-Control-Allow-Origin': '*',
                        'Cache-Control': 'no-cache'
                    }
                }
            );
        }

        const apiUrl = api.startsWith('http') ? api : `https://${api}`;
        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'Device-SVG-Generator/2.0'
            }
        });

        if (!response.ok) {
            throw new Error(`API返回错误: ${response.status}`);
        }

        const devices = await response.json();

        if (!Array.isArray(devices)) {
            throw new Error('API返回的数据格式不正确，期望数组格式');
        }

        const isDarkMode = theme === 'dark';
        const svg = generateDeviceListSVG(devices, isDarkMode);

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=300',
                'Access-Control-Allow-Origin': '*',
            }
        });

    } catch (error) {
        console.error('Error generating SVG:', error);

        const isDarkMode = (new URL(request.url)).searchParams.get('theme') === 'dark';
        let errorMessage = '生成SVG时发生错误';

        if (error.message.includes('fetch')) {
            errorMessage = 'API地址无法访问';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'API请求超时';
        }

        const errorSvg = generateErrorSVG(errorMessage, error.message, isDarkMode);

        return new Response(errorSvg, {
            status: 500,
            headers: {
                'Content-Type': 'image/svg+xml',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

// 路由处理函数 - AI 总结
async function handleAISummarySVG(request) {
    try {
        const url = new URL(request.url);
        const api = url.searchParams.get('api');
        const deviceId = url.searchParams.get('deviceId');
        const theme = url.searchParams.get('theme') || 'light';

        if (!api || !deviceId) {
            const isDarkMode = theme === 'dark';
            return new Response(
                generateErrorSVG('缺少必需参数', '请提供api和deviceId参数', isDarkMode),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'image/svg+xml',
                        'Access-Control-Allow-Origin': '*',
                        'Cache-Control': 'no-cache'
                    }
                }
            );
        }

        const apiBase = api.startsWith('http') ? api : `https://${api}`;
        const apiUrl = `${apiBase}/ai/summary/${deviceId}`;

        const response = await fetch(apiUrl, {
            headers: {
                'User-Agent': 'AI-Summary-SVG-Generator/2.0'
            }
        });

        if (!response.ok) {
            throw new Error(`API返回错误: ${response.status}`);
        }

        const summaryData = await response.json();
        const isDarkMode = theme === 'dark';
        const svg = generateAISummarySVG(summaryData, isDarkMode);

        return new Response(svg, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'public, max-age=300',
                'Access-Control-Allow-Origin': '*',
            }
        });

    } catch (error) {
        console.error('Error generating AI summary SVG:', error);

        const isDarkMode = (new URL(request.url)).searchParams.get('theme') === 'dark';
        let errorMessage = '获取AI总结失败';

        if (error.message.includes('fetch')) {
            errorMessage = 'API地址无法访问';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'API请求超时';
        }

        const errorSvg = generateErrorSVG(errorMessage, error.message, isDarkMode);

        return new Response(errorSvg, {
            status: 500,
            headers: {
                'Content-Type': 'image/svg+xml',
                'Access-Control-Allow-Origin': '*',
            }
        });
    }
}

// 健康检查
function handleHealth() {
    return new Response(
        JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '2.0.0',
            platform: 'Cloudflare Workers',
            style: 'GitHub Stats',
            features: ['devices-svg', 'ai-summary-svg']
        }),
        {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
    );
}

// 使用说明
function handleRoot(request) {
    const url = new URL(request.url);
    const baseUrl = `${url.protocol}//${url.host}`;

    return new Response(
        JSON.stringify({
            name: '设备列表和AI总结SVG生成器 (GitHub Stats 风格)',
            version: '2.0.0',
            platform: 'Cloudflare Workers',
            style: 'GitHub Stats Card',
            endpoints: {
                '/devices-svg': {
                    method: 'GET',
                    description: '生成设备列表SVG (GitHub Stats 风格)',
                    parameters: {
                        api: '必需 - 设备数据API地址',
                        theme: '可选 - 主题模式 (light/dark，默认为light)'
                    },
                    example: `${baseUrl}/devices-svg?api=https://api-usage.1812z.top/api/devices&theme=dark`
                },
                '/ai-summary-svg': {
                    method: 'GET',
                    description: '生成AI使用总结SVG (GitHub Stats 风格)',
                    parameters: {
                        api: '必需 - API基础地址',
                        deviceId: '必需 - 设备ID',
                        theme: '可选 - 主题模式 (light/dark，默认为light)'
                    },
                    example: `${baseUrl}/ai-summary-svg?api=https://api-usage.1812z.top&deviceId=device123&theme=dark`
                },
                '/health': {
                    method: 'GET',
                    description: '健康检查'
                }
            },
            usage: {
                github_readme_devices: `![设备状态](${baseUrl}/devices-svg?api=your-api-url&theme=dark)`,
                github_readme_ai: `![AI总结](${baseUrl}/ai-summary-svg?api=your-api-url&deviceId=your-device-id&theme=dark)`,
                themes: ['light', 'dark']
            }
        }, null, 2),
        {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            }
        }
    );
}

// 主处理函数
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // CORS 预检请求
        if (request.method === 'OPTIONS') {
            return new Response(null, {
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'GET, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type',
                }
            });
        }

        // 路由处理
        switch (url.pathname) {
            case '/devices-svg':
                return handleDevicesSVG(request);
            case '/ai-summary-svg':
                return handleAISummarySVG(request);
            case '/health':
                return handleHealth();
            case '/':
                return handleRoot(request);
            default:
                return new Response('Not Found', {
                    status: 404,
                    headers: {
                        'Access-Control-Allow-Origin': '*',
                    }
                });
        }
    }
};