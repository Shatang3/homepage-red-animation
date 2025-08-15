# 首页红色动画效果

这是一个基于GSAP的首页红色动画效果项目，包含了完整的动画逻辑和样式文件。

## 项目结构

```
red-animation-export/
├── README.md                 # 项目说明文档
├── components/
│   └── HomeSection.jsx       # 主要组件文件，包含红色动画逻辑
├── utils/
│   └── gsapConfig.js         # GSAP配置和动画预设
├── styles/
│   ├── globals.css           # 全局样式
│   └── style.css             # 主要样式文件
└── package.json              # 依赖配置
```

## 核心功能

### 红色动画效果
- **三阶段动画**：点状 → 竖条 → 横向扩展
- **动态步长**：根据进度调整滚动速度
- **阻尼机制**：在关键过渡点增加阻力
- **文字分离动画**：红色背景展开时的文字分离效果

### 技术特点
- 使用GSAP ScrollTrigger实现滚动驱动动画
- 性能优化的动画预设
- 响应式设计
- 平滑的缓动函数

## 安装和使用

1. 安装依赖：
```bash
npm install gsap
```

2. 将文件复制到你的Next.js项目中

3. 在你的页面中引入HomeSection组件：
```jsx
import HomeSection from './components/HomeSection'

export default function Home() {
  return <HomeSection />
}
```

## 自定义配置

### 动画参数调整
在 `utils/gsapConfig.js` 中可以调整：
- 缓动函数
- 动画持续时间
- 动画预设

### 样式自定义
在 `styles/style.css` 中可以修改：
- 红色背景颜色 (`#ad001f`)
- 文字样式
- 动画过渡效果

## 浏览器兼容性
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## 许可证
MIT License