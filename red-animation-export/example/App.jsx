'use client'

import React from 'react';
import HomeSection from '../components/HomeSection';
import '../styles/style.css';

// 使用示例：首页红色动画效果
function App() {
  return (
    <div className="App">
      {/* 主要内容区域 */}
      <main>
        {/* 首页区域 - 包含红色动画效果 */}
        <section id="section1" className="page-section">
          <div id="react-home-root">
            <HomeSection />
          </div>
        </section>
      </main>
    </div>
  );
}

export default App;

/*
使用说明：

1. 安装依赖：
   npm install

2. 启动开发服务器：
   npm run dev

3. 红色动画特性：
   - 动态步长：进度小于0.6时步长为0.08，大于等于0.6时步长为0.1
   - 阻尼机制：在进度0.6-0.65之间设置阻尼阶段，需要连续滚动6次才能突破
   - 性能优化：使用requestAnimationFrame优化动画性能
   - 事件清理：确保组件卸载时正确清理事件监听器

4. 自定义配置：
   - 可以在HomeSection组件中调整动画参数
   - 可以在style.css中修改红色动画的视觉效果
   - 可以在gsapConfig.js中调整GSAP动画配置

5. 浏览器兼容性：
   - 支持现代浏览器（Chrome 60+, Firefox 55+, Safari 12+）
   - 使用了CSS Grid、Flexbox、CSS变量等现代特性
*/