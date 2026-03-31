// ============================================
// 🔧 导航页配置文件
// 修改此文件来自定义你的导航链接
// ============================================

const CONFIG = {
  // 网站标题
  siteName: '我的导航',

  // 内外网检测方式: 'ip' | 'ping' | 'manual'
  // ip: 根据访问 IP 判断（推荐外网部署）
  // ping: 尝试访问内网地址判断（推荐内网部署）
  // manual: 手动切换
  detectMode: 'ping',

  // [ip模式] 你的内网 IP 段，匹配到则认为在内网
  internalIPs: ['192.168.', '10.', '172.16.', '172.17.', '172.18.', '172.19.', '172.20.', '172.21.', '172.22.', '172.23.', '172.24.', '172.25.', '172.26.', '172.27.', '172.28.', '172.29.', '172.30.', '172.31.'],

  // [ping模式] 用于检测内网连通性的地址
  pingTarget: 'http://192.168.1.1',

  // 默认模式: 'internal' | 'external'
  defaultMode: 'external',

  // 分组配置
  groups: [
    {
      name: '🏠 主页',
      icon: 'fas fa-home',
      items: [
        {
          name: '个人博客',
          icon: 'fas fa-blog',
          color: '#49b1f5',
          internal: 'http://192.168.1.100:4000',
          external: 'https://blog.yeann.cn',
          desc: 'Hexo 博客'
        },
      ]
    },
    {
      name: '💾 NAS & 存储',
      icon: 'fas fa-server',
      items: [
        {
          name: '群晖 DSM',
          icon: 'fas fa-hard-drive',
          color: '#ef50a8',
          internal: 'http://192.168.1.100:5000',
          external: 'https://qh.yeann.cn',
          desc: '文件管理'
        },
        {
          name: 'Synology Photos',
          icon: 'fas fa-images',
          color: '#ff7849',
          internal: 'http://192.168.1.100:3232',
          external: 'https://photo.yeann.cn',
          desc: '照片管理'
        },
        {
          name: 'Download Station',
          icon: 'fas fa-download',
          color: '#ffbf00',
          internal: 'http://192.168.1.100:5000/webman/3rdparty/DownloadStation/',
          external: 'https://qh.yeann.cn/webman/3rdparty/DownloadStation/',
          desc: '下载管理'
        },
      ]
    },
    {
      name: '🛠️ 工具',
      icon: 'fas fa-wrench',
      items: [
        {
          name: '路由器',
          icon: 'fas fa-wifi',
          color: '#57c850',
          internal: 'http://192.168.1.1',
          external: 'https://router.yeann.cn',
          desc: '网络管理'
        },
        {
          name: 'Portainer',
          icon: 'fab fa-docker',
          color: '#0db7ed',
          internal: 'http://192.168.1.100:9000',
          external: 'https://portainer.yeann.cn',
          desc: 'Docker 管理'
        },
      ]
    },
    {
      name: '🌐 外部链接',
      icon: 'fas fa-link',
      items: [
        {
          name: 'GitHub',
          icon: 'fab fa-github',
          color: '#858585',
          internal: 'https://github.com',
          external: 'https://github.com',
          desc: '代码仓库',
          isExternalOnly: true
        },
        {
          name: 'Vercel',
          icon: 'fas fa-bolt',
          color: '#000',
          internal: 'https://vercel.com',
          external: 'https://vercel.com',
          desc: '部署平台',
          isExternalOnly: true
        },
      ]
    },
  ],
};
