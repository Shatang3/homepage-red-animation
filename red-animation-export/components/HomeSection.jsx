"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"

import gsap, { 
  customEases, 
  animationPresets, 
  performantAnimate, 
  createTimeline,
  ScrollSmoother, // 保持注册
  ScrollTrigger
} from "../utils/gsapConfig"




export default function HomeSection(props) {
  const [contentVisible, setContentVisible] = useState(true);
  const [textAnimationComplete, setTextAnimationComplete] = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  
  const containerRef = useRef(null);

  // 控制大字动画显示 - 使用GSAP确保动画效果
  useEffect(() => {
    if (contentVisible) {
      const bigTexts = document.querySelectorAll('.big-text');
      
      // 将文字分为两组：
      // 第一组：前两个元素 "Je" "pense,"
      // 第二组：后三个元素 "donc" "je" "suis."
      const firstGroup = Array.from(bigTexts).slice(0, 2);  // "Je" "pense,"
      const secondGroup = Array.from(bigTexts).slice(2);    // "donc" "je" "suis."
      
      // 设置初始状态
      gsap.set(bigTexts, animationPresets.slideUp.from);
      
      // 创建文字动画时间线
      const textTimeline = createTimeline();
      
      // 第一组同时出现 - 使用优化的动画预设
      textTimeline.to(firstGroup, {
        ...animationPresets.slideUp.to,
        duration: 1.5,
        ease: customEases.custom,
        delay: 0.3
      })
      // 第二组延迟后同时出现 - 链式动画
      .to(secondGroup, {
        ...animationPresets.slideUp.to,
        duration: 1.5,
        ease: customEases.custom,
        onComplete: () => {
          // 文字动画完成，允许滚动
          setTextAnimationComplete(true);
        }
      }, "-=0.5"); // 提前0.5秒开始第二组动画
    }
  }, [contentVisible]);



  // 简化的动画更新逻辑 - 只保留区域1动画
  const updateAnimationProgress = useCallback((animProgress) => {
    const bg = document.querySelector('.scroll-bg-animate');
    const text = document.querySelector('.center-text');
    if (!bg || !text) return;
    
    setScrollProgress(animProgress);
    
    // 控制显示与渐隐（即时设置，无滞后）
    if (animProgress === 0) {
      gsap.set(bg, { opacity: 0, width: '5px', height: '5px', borderRadius: '50%' });
      return;
    } else if (animProgress > 0) {
      gsap.set(bg, { opacity: 1 });
    }
    
    // 简化的动画阶段
    let width, height, borderRadius;
    const minSize = 5;
    const maxWidth = window.innerWidth;
    const maxHeight = window.innerHeight;
    
    if (animProgress < 0.3) {
      // 阶段1：小圆形
      width = minSize;
      height = minSize;
      borderRadius = '50%';
    } else if (animProgress < 0.6) {
      // 阶段2：竖条拉伸
      const p = (animProgress - 0.3) / 0.3;
      width = minSize;
      height = gsap.utils.interpolate(minSize, maxHeight, p);
      borderRadius = gsap.utils.interpolate(50, 0, p) + '%';
   } else if (animProgress === 0.6) {
      // 第二阶段完成状态 - 确保竖条完全拉伸
      width = minSize;
      height = maxHeight;
      borderRadius = '0%';
    } else if (animProgress <= 1.0) {
      // 阶段3：横向扩展 - 只有在第二阶段完全完成后才开始，严格限制在区域1内
      const p = (animProgress - 0.6) / 0.4;
      width = gsap.utils.interpolate(minSize, maxWidth, p);
      height = maxHeight;
      borderRadius = '0%';
    }
    
    // 即时设置，避免动画滞后
    gsap.set(bg, {
      width: width,
      height: height,
      borderRadius: borderRadius,
      background: '#ad001f'
    });
    
    // 设置位置
    gsap.set(bg, {
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50
    });
    
    // 文字即时响应
    let scale = 1, opacity = 1;
    if (animProgress >= 0.6) {
      const p = (animProgress - 0.6) / 0.4;
      scale = 1 + p * 0.8;
      opacity = 1 - p * 0.5;
    }
    gsap.set(text, { scale, opacity });

    // 文字分离动画
    const textContainer = text.querySelector('div > div');
    const firstLine = textContainer ? textContainer.children[0] : null;
    const secondLine = textContainer ? textContainer.children[1] : null;
    
    if (firstLine && secondLine) {
      const splitStart = 0.9;
      const d = 88;
      if (animProgress <= splitStart) {
        gsap.set(firstLine, { y: 0 });
        gsap.set(secondLine, { y: 0 });
      } else {
        const t = Math.min(1, (animProgress - splitStart) / (1 - splitStart));
        gsap.set(firstLine, { y: -d * t });
        gsap.set(secondLine, { y: d * t });
      }
    }
  }, []);

  // 使用 ScrollTrigger 的 Pin + Scrub 控制区块1动画
  useEffect(() => {
    if (isLoading || !contentVisible || !textAnimationComplete) return;

    const el = containerRef.current;
    const bg = document.querySelector('.scroll-bg-animate');
    const text = document.querySelector('.center-text');
    if (!el || !bg || !text) return;

    // 初始状态（与原始进度驱动逻辑一致）
    gsap.set(bg, {
      opacity: 0,
      width: 5,
      height: 5,
      borderRadius: '50%',
      background: '#ad001f',
      position: 'absolute',
      left: '50%',
      top: '50%',
      xPercent: -50,
      yPercent: -50
    });
    gsap.set(text, { scale: 1, opacity: 1 });

    // 用滚动进度直接驱动原 updateAnimationProgress，保留既有视觉效果
    const st = ScrollTrigger.create({
      trigger: el,
      start: 'top top',
      end: '+=1600',
      scrub: true,
      pin: true,
      pinSpacing: true,
      onUpdate: (self) => {
        // 精确匹配原三阶段：0-0.3(点) -> 0.3-0.6(竖条) -> 0.6-1(横向)
        const s = Math.min(Math.max(self.progress, 0), 1);
        const SEG1 = 0.33;
        const SEG2 = 0.66;
        const map = (a, b, t) => a + (b - a) * t;
        const inv = (a, b, v) => (v - a) / (b - a);

        let animP = 0;
        if (s <= SEG1) {
          animP = map(0.0, 0.3, inv(0.0, SEG1, s));
        } else if (s <= SEG2) {
          animP = map(0.3, 0.6, inv(SEG1, SEG2, s));
        } else {
          animP = map(0.6, 1.0, inv(SEG2, 1.0, s));
        }

        animP = Math.min(Math.max(animP, 0), 1);
        updateAnimationProgress(animP);
        setScrollProgress(animP);
      }
    });

    return () => {
      st.kill();
    };
  }, [isLoading, contentVisible, textAnimationComplete]);



  // 字母悬停效果处理函数 - 使用优化的GSAP动画
  const handleLetterMouseEnter = (e, symbol) => {
    if (!contentVisible || isLoading) return;
    
    performantAnimate(e.target, {
      scale: 1.2,
      rotation: 15,
      color: "#ff6b6b",
      duration: 0.3,
      ease: customEases.bounce
    });
    
    e.target.textContent = symbol;
  };

  const handleLetterMouseLeave = (e, originalLetter) => {
    if (!contentVisible || isLoading) return;
    
    performantAnimate(e.target, {
      scale: 1,
      rotation: 0,
      color: "inherit",
      duration: 0.3,
      ease: customEases.bounce
    });
    
    e.target.textContent = originalLetter;
  };

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100vw",
        minHeight: "100vh", // 只需要一个区域
        overflow: "visible",
        zIndex: 0,
        background: "#ffffff", // 纯白背景
        color: "#333",
        fontFamily: "'Inter', sans-serif",
      }}
    >

      {/* 背景动画容器 - 限制在第一个视口区域，只在首页时显示 */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          overflow: 'hidden',
          pointerEvents: 'none',
          zIndex: 10,
        }}
      >
        {/* 背景动画层 - 滚动动画背景 */}
        <div 
          className="scroll-bg-animate" 
          style={{ 
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
            width: '5px',
            height: '5px',
            borderRadius: '50%',
            background: '#ad001f',
            opacity: 0,
            pointerEvents: 'none',
            transition: "opacity 0.4s, width 0.4s, height 0.4s, border-radius 0.4s, background 0.4s", 
          }} 
        />
      </div>
      

      
      {/* 首页2：个人介绍内容 - 位于红色背景区域中央 */}
      {scrollProgress >= 0.99 && (
        <div 
          className="home-about-content"
          style={{
            position: 'absolute',
            top: '50vh', // 位于红色背景区域的中央
            left: '50%',
            transform: 'translate(-50%, -50%)',
            display: 'flex',
            alignItems: 'center',
            gap: '40px',
            zIndex: 9999,
            maxWidth: '1000px',
            padding: '40px',
            backgroundColor: 'rgba(255, 255, 255, 0.9)',
            borderRadius: '15px',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(0,0,0,0.1)',
            opacity: 1,
            transition: 'all 0.6s ease-out',
            animation: 'slideInFromBottom 0.8s ease-out'
          }}
        >

          
          <div
            style={{
              textAlign: "left",
              color: "#fff",
              fontSize: "1.5rem",
              fontWeight: "600",
              fontFamily: "'Arial Black', 'Helvetica Neue', Arial, sans-serif",
              letterSpacing: "1px",
              lineHeight: "1.6",
              maxWidth: "600px",
            }}
          >
            Hi, I'm Liu Yuxiang, a graduate of the Software Engineering program at DLUFL. I'm also an explorer passionate about programming. I enjoy putting all kinds of wild and imaginative ideas into practice and have a love for psychology.
          </div>
        </div>
      )}
      
      
      <div
        className="center-text"

        style={{
          position: "absolute",
          top: "50vh", // 位于第一个屏幕的中央
          left: "50%",
          transform: "translate(-50%, -50%)",
          zIndex: 100,
          width: "100vw",
          textAlign: "center",
          pointerEvents: "auto", // 改为auto，允许子元素响应鼠标事件
          opacity: 1, // 始终保持可见
          transition: "opacity 0.8s ease-in-out",
          visibility: "visible", // 始终可见
        }}
      >
        {/* 个人简介内容已删除 */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", pointerEvents: "auto" }}>
          <div
            style={{ display: "flex", gap: "32px", justifyContent: "center", pointerEvents: "auto" }}
          >
            <span className="big-text">J<span 
              className="morphing-letter" 
              data-original="e" 
              data-symbol="●"
              onMouseEnter={(e) => handleLetterMouseEnter(e, '●')}
              onMouseLeave={(e) => handleLetterMouseLeave(e, 'e')}
              style={{
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                zIndex: 999
              }}
            >e</span></span>
            <span className="big-text">p<span 
              className="morphing-letter" 
              data-original="e" 
              data-symbol="●"
              onMouseEnter={(e) => handleLetterMouseEnter(e, '●')}
              onMouseLeave={(e) => handleLetterMouseLeave(e, 'e')}
              style={{
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                zIndex: 999
              }}
            >e</span>ns<span 
              className="morphing-letter" 
              data-original="e" 
              data-symbol="●"
              onMouseEnter={(e) => handleLetterMouseEnter(e, '●')}
              onMouseLeave={(e) => handleLetterMouseLeave(e, 'e')}
              style={{
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                zIndex: 999
              }}
            >e</span>,</span>
          </div>
          <div
            style={{ display: "flex", gap: "32px", justifyContent: "center", pointerEvents: "auto", marginTop: "20px" }}
          >
            <span className="big-text">d<span 
              className="morphing-letter" 
              data-original="o" 
              data-symbol="○"
              onMouseEnter={(e) => handleLetterMouseEnter(e, '○')}
              onMouseLeave={(e) => handleLetterMouseLeave(e, 'o')}
              style={{
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                zIndex: 999
              }}
            >o</span>nc</span>
            <span className="big-text">j<span 
              className="morphing-letter" 
              data-original="e" 
              data-symbol="●"
              onMouseEnter={(e) => handleLetterMouseEnter(e, '●')}
              onMouseLeave={(e) => handleLetterMouseLeave(e, 'e')}
              style={{
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                zIndex: 999
              }}
            >e</span></span>
            <span className="big-text"><span 
              className="morphing-letter" 
              data-original="s" 
              data-symbol="◊"
              onMouseEnter={(e) => handleLetterMouseEnter(e, '◊')}
              onMouseLeave={(e) => handleLetterMouseLeave(e, 's')}
              style={{
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                zIndex: 999
              }}
            >s</span>ui<span 
              className="morphing-letter" 
              data-original="s" 
              data-symbol="◊"
              onMouseEnter={(e) => handleLetterMouseEnter(e, '◊')}
              onMouseLeave={(e) => handleLetterMouseLeave(e, 's')}
              style={{
                cursor: 'pointer',
                display: 'inline-block',
                transition: 'all 0.3s ease',
                pointerEvents: 'auto',
                zIndex: 999
              }}
            >s</span>.</span>
          </div>
        </div>
      </div>
      

    </div>
  )
}