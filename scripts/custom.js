const scripts = [{
    url: '/js/custom-post-js.js',
    to: 'post'
}, {
    url: '/js/you-are-right.js'
}].map(script => Object.assign({
    url: 'data:text/javascript, console.log(\'%25ccustom.js%3A%20script%20url%20missing!\'%2C%20\'color%3A%20orange%3B\')',
    to: 'default'
}, script));

const styles = [{
    url: '/css/custom-post-styles.css',
    to: 'post'
}].map(style => Object.assign({
    url: 'data:text/css,',
    to: 'default'
}, style));

styles.forEach(style => hexo.extend.injector.register('head_end', `<link rel="stylesheet" href=${escJsStr(style.url)}>`, style.to));
scripts.forEach(script => hexo.extend.injector.register('head_end', `<script src=${escJsStr(script.url)}></script>`, script.to));
//console.log(`[custom.js] registered ${scripts.length} scripts and ${styles.length} styles`);

// escape str into javascript written format
function escJsStr(str, quote='"') {
    str = str.replaceAll('\\', '\\\\').replaceAll(quote, '\\' + quote).replaceAll('\t', '\\t');
    str = quote === '`' ? str.replaceAll(/(\$\{[^\}]*\})/g, '\\$1') : str.replaceAll('\r', '\\r').replaceAll('\n', '\\n');
    return quote + str + quote;
}