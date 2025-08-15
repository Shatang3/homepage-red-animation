import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { TextPlugin } from "gsap/TextPlugin";
import { MorphSVGPlugin } from "gsap/MorphSVGPlugin";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";

// 注册GSAP插件
gsap.registerPlugin(ScrollTrigger, ScrollToPlugin, ScrollSmoother, TextPlugin);

// 尝试注册高级插件（如果可用）
try {
  gsap.registerPlugin(MorphSVGPlugin, DrawSVGPlugin);
} catch (error) {
  console.log("高级GSAP插件未可用，使用基础功能");
}

// GSAP全局配置
gsap.config({
  force3D: true,
  nullTargetWarn: false,
  trialWarn: false
});

// 设置默认动画参数
gsap.defaults({
  duration: 0.6,
  ease: "power2.out"
});

// 自定义缓动函数
export const customEases = {
  smooth: "power2.inOut",
  bounce: "back.out(1.7)",
  elastic: "elastic.out(1, 0.3)",
  expo: "expo.out",
  circ: "circ.out",
  custom: "cubic-bezier(0.16, 1, 0.3, 1)",
  damping: "power4.out"
};

// 动画预设
export const animationPresets = {
  fadeIn: {
    from: { opacity: 0, y: 30 },
    to: { opacity: 1, y: 0, duration: 0.8, ease: customEases.smooth }
  },
  slideUp: {
    from: { opacity: 0, y: 50, scale: 0.95 },
    to: { opacity: 1, y: 0, scale: 1, duration: 1, ease: customEases.custom }
  },
  scaleIn: {
    from: { opacity: 0, scale: 0.8 },
    to: { opacity: 1, scale: 1, duration: 0.6, ease: customEases.bounce }
  },
  morphBackground: {
    from: { width: 5, height: 5, borderRadius: "50%" },
    to: { duration: 0.8, ease: customEases.smooth }
  }
};

// 性能优化的动画函数
export const performantAnimate = (target, vars) => {
  return gsap.to(target, {
    ...vars,
    force3D: true,
    transformOrigin: "center center"
  });
};

// 批量动画函数
export const batchAnimate = (targets, vars, stagger = 0.1) => {
  return gsap.to(targets, {
    ...vars,
    stagger: stagger,
    force3D: true
  });
};

// 时间线创建函数
export const createTimeline = (options = {}) => {
  return gsap.timeline({
    defaults: { ease: customEases.smooth, force3D: true },
    ...options
  });
};

// ScrollTrigger辅助函数
export const createScrollTrigger = (element, animation, options = {}) => {
  return ScrollTrigger.create({
    trigger: element,
    start: "top 80%",
    end: "bottom 20%",
    animation: animation,
    toggleActions: "play none none reverse",
    ...options
  });
};

// 清理函数
export const killAllAnimations = () => {
  gsap.killTweensOf("*");
  ScrollTrigger.killAll();
};

// 响应式动画函数
export const responsiveAnimate = (target, mobileVars, desktopVars) => {
  const isMobile = window.innerWidth <= 768;
  return gsap.to(target, isMobile ? mobileVars : desktopVars);
};

// ScrollSmoother配置
export const scrollSmootherConfig = {
  wrapper: "#smooth-wrapper",
  content: "#smooth-content",
  smooth: 1.2,
  effects: true,
  smoothTouch: 0.1,
  normalizeScroll: true,
  ignoreMobileResize: true
};

// 初始化ScrollSmoother
export const initScrollSmoother = () => {
  if (typeof window !== 'undefined') {
    return ScrollSmoother.create(scrollSmootherConfig);
  }
  return null;
};

// 导出ScrollSmoother与ScrollTrigger以供其他组件使用
export { ScrollSmoother, ScrollTrigger };

export default gsap;