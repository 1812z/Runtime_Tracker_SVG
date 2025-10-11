// Cloudflare Worker - 设备列表和AI总结SVG生成器

// 生成电池SVG
function generateBatterySVG(batteryLevel, isDarkMode = false) {
    if (batteryLevel <= 0) return '';

    const fillColor = batteryLevel > 20 ? '#10b981' : '#ef4444';
    const strokeColor = isDarkMode ? '#9ca3af' : '#6b7280';

    return `
    <g>
      <rect x="0" y="0" width="18" height="11" rx="1.5" fill="none" stroke="${strokeColor}" stroke-width="1"/>
      <rect x="18.5" y="3" width="2" height="5" rx="0.5" fill="${strokeColor}"/>
      <rect x="1" y="1" width="${(batteryLevel / 100) * 16}" height="9" rx="1" fill="${fillColor}"/>
    </g>
  `;
}

// 生成状态图标SVG
function generateStatusIcon(running, isDarkMode = false) {
    const color = running ? '#10b981' : '#ef4444';

    if (running) {
        return `
      <circle cx="6" cy="6" r="6" fill="${color}"/>
      <path d="M4 6l2 2 4-4" stroke="white" stroke-width="1.5" fill="none"/>
    `;
    } else {
        return `
      <circle cx="6" cy="6" r="6" fill="${color}"/>
      <path d="M4 4l4 4M8 4l-4 4" stroke="white" stroke-width="1.5"/>
    `;
    }
}

// 生成设备列表SVG
function generateDeviceListSVG(devices, isDarkMode = false) {
    const bgColor = isDarkMode ? '#0f172a' : '#ffffff';
    const textColor = isDarkMode ? '#f1f5f9' : '#1f2937';
    const cardBgColor = isDarkMode ? '#1e293b' : '#f9fafb';
    const borderColor = isDarkMode ? '#334155' : '#e5e7eb';
    const secondaryTextColor = isDarkMode ? '#94a3b8' : '#6b7280';

    const cardHeight = 80;
    const cardSpacing = 10;
    const padding = 20;
    const headerHeight = 60;

    const totalHeight = headerHeight + padding + (devices.length * (cardHeight + cardSpacing)) - cardSpacing + padding;
    const width = 400;

    let svgContent = `
<svg width="${width}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 18px; font-weight: 600; fill: ${textColor}; }
      .device-name { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 16px; font-weight: 600; fill: ${textColor}; }
      .device-info { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 12px; fill: ${secondaryTextColor}; }
      .status-text { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; font-weight: 500; }
      .running { fill: ${isDarkMode ? '#065f46' : '#10b981'}; }
      .stopped { fill: ${isDarkMode ? '#7f1d1d' : '#ef4444'}; }
    </style>
  </defs>
  
  <rect width="100%" height="100%" fill="${bgColor}" rx="8"/>
  
  <g transform="translate(${padding}, ${padding})">
    <g transform="translate(0, 10)">
      <rect x="0" y="0" width="20" height="14" rx="2" fill="none" stroke="${textColor}" stroke-width="1.5"/>
      <rect x="4" y="3" width="12" height="8" rx="1" fill="none" stroke="${textColor}" stroke-width="1"/>
      <rect x="8" y="16" width="4" height="2" fill="${textColor}"/>
      <rect x="6" y="18" width="8" height="1" fill="${textColor}"/>
    </g>
    <text x="30" y="25" class="title">设备列表</text>
  </g>
`;

    devices.forEach((device, index) => {
        const y = headerHeight + padding + (index * (cardHeight + cardSpacing));

        svgContent += `
  <g transform="translate(${padding}, ${y})">
    <rect width="${width - 2 * padding}" height="${cardHeight}" rx="8" 
          fill="${cardBgColor}" stroke="${borderColor}" stroke-width="1"/>
    
    <text x="15" y="25" class="device-name">${escapeXml(device.device)}</text>
    <text x="15" y="42" class="device-info">当前应用: ${escapeXml(device.currentApp || '无')}</text>
    
    ${device.batteryLevel > 0 ? `
    <g transform="translate(15, 50)">
      <text x="0" y="12" class="device-info">电量:</text>
      <g transform="translate(35, 2)">
        ${generateBatterySVG(parseInt(device.batteryLevel), isDarkMode)}
      </g>
      <text x="60" y="12" class="device-info">${device.batteryLevel}%</text>
    </g>
    ` : ''}
    
    <g transform="translate(${width - 2 * padding - 80}, 15)">
      <rect width="70" height="20" rx="10" 
            fill="${device.running ? (isDarkMode ? '#064e3b' : '#dcfce7') : (isDarkMode ? '#7f1d1d' : '#fee2e2')}"/>
      <g transform="translate(8, 4)">
        ${generateStatusIcon(device.running, isDarkMode)}
      </g>
      <text x="40" y="14" class="status-text ${device.running ? 'running' : 'stopped'}" text-anchor="middle">
        ${device.running ? '运行中' : '已停止'}
      </text>
    </g>
  </g>
`;
    });

    svgContent += '</svg>';
    return svgContent;
}

// 生成AI总结SVG
function generateAISummarySVG(summaryData, isDarkMode = false) {
    const bgColor = isDarkMode ? '#0f172a' : '#ffffff';
    const textColor = isDarkMode ? '#f1f5f9' : '#1f2937';
    const cardBgColor = isDarkMode ? '#1e293b' : '#f9fafb';
    const borderColor = isDarkMode ? '#334155' : '#e5e7eb';
    const accentColor = isDarkMode ? '#3b82f6' : '#2563eb';
    const secondaryTextColor = isDarkMode ? '#94a3b8' : '#6b7280';

    const width = 500;
    const padding = 20;
    const lineHeight = 20;

    // 分割文本为多行
    function wrapText(text, maxWidth) {
        const words = text.split('');
        const lines = [];
        let currentLine = '';

        for (let char of words) {
            if (currentLine.length < maxWidth) {
                currentLine += char;
            } else {
                lines.push(currentLine);
                currentLine = char;
            }
        }
        if (currentLine) lines.push(currentLine);
        return lines;
    }

    const summary = summaryData.summary || summaryData.message || '暂无总结';
    const deviceName = summaryData.deviceName || summaryData.device || '未知设备';
    const timestamp = summaryData.timestamp || new Date().toISOString();

    const summaryLines = wrapText(summary, 50);
    const contentHeight = summaryLines.length * lineHeight;
    const totalHeight = 140 + contentHeight;

    let svgContent = `
<svg width="${width}" height="${totalHeight}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <style>
      .title { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 20px; font-weight: 700; fill: ${textColor}; }
      .subtitle { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 14px; font-weight: 500; fill: ${secondaryTextColor}; }
      .content { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 13px; fill: ${textColor}; line-height: 1.6; }
      .timestamp { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; font-size: 11px; fill: ${secondaryTextColor}; }
    </style>
  </defs>
  
  <rect width="100%" height="100%" fill="${bgColor}" rx="12"/>
  
  <!-- 标题栏 -->
  <g transform="translate(${padding}, ${padding})">
    <!-- AI图标 -->
    <g transform="translate(0, 5)">
      <circle cx="12" cy="12" r="12" fill="${accentColor}" opacity="0.1"/>
      <path d="M8 12l2 2 4-4M12 6v12M6 12h12" stroke="${accentColor}" stroke-width="2" fill="none" stroke-linecap="round"/>
    </g>
    <text x="35" y="22" class="title">AI 使用总结</text>
  </g>
  
  <!-- 设备信息卡片 -->
  <g transform="translate(${padding}, 60)">
    <rect width="${width - 2 * padding}" height="50" rx="8" 
          fill="${cardBgColor}" stroke="${borderColor}" stroke-width="1"/>
    
    <text x="15" y="20" class="subtitle">设备</text>
    <text x="15" y="38" class="content">${escapeXml(deviceName)}</text>
  </g>
  
  <!-- 总结内容 -->
  <g transform="translate(${padding}, 125)">
    <text x="0" y="0" class="subtitle">总结内容</text>
`;

    summaryLines.forEach((line, index) => {
        svgContent += `
    <text x="0" y="${(index + 1) * lineHeight + 10}" class="content">${escapeXml(line)}</text>`;
    });

    svgContent += `
  </g>
  
  <!-- 时间戳 -->
  <text x="${width - padding}" y="${totalHeight - 15}" class="timestamp" text-anchor="end">
    生成时间: ${new Date(timestamp).toLocaleString('zh-CN')}
  </text>
  
</svg>
`;

    return svgContent;
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

// 生成错误SVG
function generateErrorSVG(message, details = '', isDarkMode = false) {
    const bgColor = isDarkMode ? '#1e293b' : '#fee2e2';
    const textColor = isDarkMode ? '#ef4444' : '#dc2626';
    const detailColor = isDarkMode ? '#991b1b' : '#7f1d1d';

    return `
<svg width="500" height="150" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="${bgColor}" rx="8"/>
  <text x="250" y="50" text-anchor="middle" font-family="Arial, sans-serif" font-size="18" font-weight="600" fill="${textColor}">
    ❌ ${escapeXml(message)}
  </text>
  <text x="250" y="80" text-anchor="middle" font-family="Arial, sans-serif" font-size="13" fill="${detailColor}">
    ${escapeXml(details)}
  </text>
  <text x="250" y="105" text-anchor="middle" font-family="Arial, sans-serif" font-size="11" fill="${detailColor}">
    请检查API地址和参数是否正确
  </text>
</svg>
  `;
}

// 主处理函数
async function handleRequest(request) {
    const url = new URL(request.url);
    const path = url.pathname;

    // CORS headers
    const corsHeaders = {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
    };

    // 处理 OPTIONS 请求
    if (request.method === 'OPTIONS') {
        return new Response(null, { headers: corsHeaders });
    }

    // 根路径 - 使用说明
    if (path === '/') {
        return new Response(JSON.stringify({
            name: '设备列表和AI总结SVG生成器',
            version: '2.0.0',
            endpoints: {
                '/devices-svg': {
                    method: 'GET',
                    description: '生成设备列表SVG',
                    parameters: {
                        api: '必需 - 设备数据API地址',
                        theme: '可选 - 主题模式 (light/dark，默认为light)'
                    },
                    example: '/devices-svg?api=https://api-usage.1812z.top/api/devices&theme=dark'
                },
                '/ai-summary-svg': {
                    method: 'GET',
                    description: '生成使用总结SVG',
                    parameters: {
                        api: '必需 - API基础地址',
                        deviceId: '必需 - 设备ID',
                        theme: '可选 - 主题模式 (light/dark，默认为light)'
                    },
                    example: '/ai-summary-svg?api=https://api-usage.1812z.top&deviceId=device123&theme=dark'
                },
                '/health': {
                    method: 'GET',
                    description: '健康检查'
                }
            }
        }, null, 2), {
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }

    // 健康检查
    if (path === '/health') {
        return new Response(JSON.stringify({
            status: 'healthy',
            timestamp: new Date().toISOString(),
            version: '2.0.0'
        }), {
            headers: {
                'Content-Type': 'application/json',
                ...corsHeaders
            }
        });
    }

    // 设备列表SVG
    if (path === '/devices-svg') {
        const api = url.searchParams.get('api');
        const theme = url.searchParams.get('theme') || 'light';

        if (!api) {
            const errorSvg = generateErrorSVG('缺少必需参数', '请提供api参数', theme === 'dark');
            return new Response(errorSvg, {
                status: 400,
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache',
                    ...corsHeaders
                }
            });
        }

        try {
            const apiUrl = api.startsWith('http') ? api : `https://${api}`;
            const response = await fetch(apiUrl, {
                headers: { 'User-Agent': 'Device-SVG-Generator/2.0' }
            });

            if (!response.ok) {
                throw new Error(`API返回错误: ${response.status}`);
            }

            const devices = await response.json();

            if (!Array.isArray(devices)) {
                throw new Error('API返回的数据格式不正确，期望数组格式');
            }

            const svg = generateDeviceListSVG(devices, theme === 'dark');

            return new Response(svg, {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=300',
                    ...corsHeaders
                }
            });

        } catch (error) {
            const errorSvg = generateErrorSVG('生成SVG失败', error.message, theme === 'dark');
            return new Response(errorSvg, {
                status: 500,
                headers: {
                    'Content-Type': 'image/svg+xml',
                    ...corsHeaders
                }
            });
        }
    }

    // AI总结SVG
    if (path === '/ai-summary-svg') {
        const api = url.searchParams.get('api');
        const deviceId = url.searchParams.get('deviceId');
        const theme = url.searchParams.get('theme') || 'light';

        if (!api || !deviceId) {
            const errorSvg = generateErrorSVG(
                '缺少必需参数',
                '请提供api和deviceId参数',
                theme === 'dark'
            );
            return new Response(errorSvg, {
                status: 400,
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'no-cache',
                    ...corsHeaders
                }
            });
        }

        try {
            const apiBase = api.startsWith('http') ? api : `https://${api}`;
            const apiUrl = `${apiBase}/ai/summary/${deviceId}`;

            const response = await fetch(apiUrl, {
                headers: { 'User-Agent': 'AI-Summary-SVG-Generator/2.0' }
            });

            if (!response.ok) {
                throw new Error(`API返回错误: ${response.status}`);
            }

            const summaryData = await response.json();
            const svg = generateAISummarySVG(summaryData, theme === 'dark');

            return new Response(svg, {
                headers: {
                    'Content-Type': 'image/svg+xml',
                    'Cache-Control': 'public, max-age=300',
                    ...corsHeaders
                }
            });

        } catch (error) {
            const errorSvg = generateErrorSVG('获取AI总结失败', error.message, theme === 'dark');
            return new Response(errorSvg, {
                status: 500,
                headers: {
                    'Content-Type': 'image/svg+xml',
                    ...corsHeaders
                }
            });
        }
    }

    // 404
    return new Response('Not Found', {
        status: 404,
        headers: corsHeaders
    });
}

// Cloudflare Worker 入口
addEventListener('fetch', event => {
    event.respondWith(handleRequest(event.request));
});