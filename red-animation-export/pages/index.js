import React from 'react';
import HomeSection from '../components/HomeSection';

export default function Home() {
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