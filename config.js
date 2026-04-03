// ============================================
// 🔧 导航页配置文件
// ============================================

const CONFIG = {
  // 网站标题
  siteName: '我的导航',

  // 密钥（Base64 编码，输入时无需解码）
  secretKey: 'bmFz',

  // 需要隐藏的分组名称
  hiddenGroups: ['💾 NAS & 存储'],

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
          url: 'https://blog.yeann.cn',
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
          url: 'https://qh.yeann.cn',
          desc: '文件管理'
        },
        {
          name: 'Synology Photos',
          icon: 'fas fa-images',
          color: '#ff7849',
          url: 'https://photo.yeann.cn',
          desc: '照片管理'
        },
        {
          name: 'Download Station',
          icon: 'fas fa-download',
          color: '#ffbf00',
          url: 'https://qh.yeann.cn/webman/3rdparty/DownloadStation/',
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
          url: 'https://router.yeann.cn',
          desc: '网络管理'
        },
        {
          name: 'Portainer',
          icon: 'fab fa-docker',
          color: '#0db7ed',
          url: 'https://portainer.yeann.cn',
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
          url: 'https://github.com',
          desc: '代码仓库'
        },
        {
          name: 'Vercel',
          icon: 'fas fa-bolt',
          color: '#000',
          url: 'https://vercel.com',
          desc: '部署平台'
        },
      ]
    },
  ],
};