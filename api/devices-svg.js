// Cloudflare Workers 版本
// 在 wrangler.toml 中配置或直接部署

// 生成电池SVG
function generateBatterySVG(batteryLevel, isDarkMode = false) {
    if (batteryLevel <= 0) return '';

    const fillColor = batteryLevel > 20 ? '#10b981' : '#ef4444';
    const strokeColor = isDarkMode ? '#9ca3af' : '#6b7280';

    return `
    <g>
      <!-- 电池外壳 -->
      <rect x="0" y="0" width="18" height="11" rx="1.5" fill="none" stroke="${strokeColor}" stroke-width="1"/>
      <!-- 电池正极 -->
      <rect x="18.5" y="3" width="2" height="5" rx="0.5" fill="${strokeColor}"/>
      <!-- 电池电量 -->
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
  
  <!-- 背景 -->
  <rect width="100%" height="100%" fill="${bgColor}" rx="8"/>
  
  <!-- 标题栏 -->
  <g transform="translate(${padding}, ${padding})">
    <!-- 设备图标 -->
    <g transform="translate(0, 10)">
      <rect x="0" y="0" width="20" height="14" rx="2" fill="none" stroke="${textColor}" stroke-width="1.5"/>
      <rect x="4" y="3" width="12" height="8" rx="1" fill="none" stroke="${textColor}" stroke-width="1"/>
      <rect x="8" y="16" width="4" height="2" fill="${textColor}"/>
      <rect x="6" y="18" width="8" height="1" fill="${textColor}"/>
    </g>
    <text x="30" y="25" class="title">设备列表</text>
    
  </g>
`;

    // 生成设备卡片
    devices.forEach((device, index) => {
        const y = headerHeight + padding + (index * (cardHeight + cardSpacing));

        svgContent += `
  <!-- 设备卡片 ${index + 1} -->
  <g transform="translate(${padding}, ${y})">
    <rect width="${width - 2 * padding}" height="${cardHeight}" rx="8" 
          fill="${cardBgColor}" stroke="${borderColor}" stroke-width="1"/>
    
    <!-- 设备名称 -->
    <text x="15" y="25" class="device-name">${device.device}</text>
    
    <!-- 当前应用 -->
    <text x="15" y="42" class="device-info">当前应用: ${device.currentApp || '无'}</text>
    
    <!-- 电量显示 -->
    ${device.batteryLevel > 0 ? `
    <g transform="translate(15, 50)">
      <text x="0" y="12" class="device-info">电量:</text>
      <g transform="translate(35, 2)">
        ${generateBatterySVG(parseInt(device.batteryLevel), isDarkMode)}
      </g>
      <text x="60" y="12" class="device-info">${device.batteryLevel}%</text>
    </g>
    ` : ''}
    
    <!-- 状态指示器 -->
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

// 生成错误SVG
function generateErrorSVG(message, details = '') {
    return `
<svg width="400" height="120" xmlns="http://www.w3.org/2000/svg">
  <rect width="100%" height="100%" fill="#fee2e2" rx="8"/>
  <text x="200" y="40" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" font-weight="600" fill="#dc2626">
    ❌ ${message}
  </text>
  <text x="200" y="65" text-anchor="middle" font-family="Arial, sans-serif" font-size="12" fill="#7f1d1d">
    ${details}
  </text>
  <text x="200" y="85" text-anchor="middle" font-family="Arial, sans-serif" font-size="10" fill="#991b1b">
    请检查API地址是否正确且可访问
  </text>
</svg>
    `;
}

// 路由处理函数
async function handleDevicesSVG(request) {
    try {
        const url = new URL(request.url);
        const api = url.searchParams.get('api');
        const theme = url.searchParams.get('theme') || 'light';

        if (!api) {
            return new Response(
                generateErrorSVG('缺少API参数', '请提供api参数'),
                {
                    status: 400,
                    headers: {
                        'Content-Type': 'image/svg+xml',
                        'Access-Control-Allow-Origin': '*',
                    }
                }
            );
        }

        // 获取设备数据
        const response = await fetch(api, {
            timeout: 5000,
            headers: {
                'User-Agent': 'Device-SVG-Generator/1.0'
            }
        });

        if (!response.ok) {
            throw new Error(`API返回错误: ${response.status}`);
        }

        const devices = await response.json();

        if (!Array.isArray(devices)) {
            throw new Error('API返回的数据格式不正确，期望数组格式');
        }

        // 生成SVG
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

        let errorMessage = '生成SVG时发生错误';

        if (error.message.includes('fetch')) {
            errorMessage = 'API地址无法访问';
        } else if (error.message.includes('timeout')) {
            errorMessage = 'API请求超时';
        }

        const errorSvg = generateErrorSVG(errorMessage, error.message);

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
            version: '1.0.0',
            platform: 'Cloudflare Workers'
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
            name: '设备列表SVG生成器 (Cloudflare Workers)',
            version: '1.0.0',
            platform: 'Cloudflare Workers',
            endpoints: {
                '/devices-svg': {
                    method: 'GET',
                    description: '生成设备列表SVG',
                    parameters: {
                        api: '必需 - 设备数据API地址',
                        theme: '可选 - 主题模式 (light/dark，默认为light)'
                    },
                    example: `${baseUrl}/devices-svg?api=https://api-usage.1812z.top/api/devices&theme=dark`
                },
                '/health': {
                    method: 'GET',
                    description: '健康检查'
                }
            },
            usage: {
                github_readme: `在README中使用: ![设备状态](${baseUrl}/devices-svg?api=your-api-url)`,
                direct_access: `直接访问SVG: ${baseUrl}/devices-svg?api=your-api-url`
            }
        }),
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
            case '/health':
                return handleHealth();
            case '/':
                return handleRoot(request);
            default:
                return new Response('Not Found', { status: 404 });
        }
    }
};