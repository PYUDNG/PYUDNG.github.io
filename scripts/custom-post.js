hexo.extend.injector.register('head_end', '<link rel="stylesheet" href="/css/custom-post-styles.css">', 'post');
hexo.extend.injector.register('head_end', '<script src="/js/custom-post-js.js"></script>', 'post');
console.log('[custom-post] registered custom-post-styles and custom-post-js.');