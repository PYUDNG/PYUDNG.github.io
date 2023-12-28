'use strict';

// match markdown image and covert to asset_img 
hexo.extend.filter.register('before_post_render', function(data){

    data.content = data.content.replace(/!{1}\[([^\[\]]*)\]\((.*)\s?(?:".*")?\)/g,
        function(match_str, label, path){

            // if only one /
            if( (path.split("/")).length == 2){
                const asset_img_str = `{% asset_img ${path.split("/")[1]} ${label ? `"${label}" ` : ''}%}`;
                console.debug("Markdown Image Path: " + match_str);
                console.debug("asset_img string: " + asset_img_str);
                return asset_img_str;
            }else if( (path.split("/")).length == 3  && path.substring(0,2) == "./" ){
                const asset_img_str = `{% asset_img ${path.split("/")[2]} ${label ? `"${label}" ` : ''}%}`;
                console.debug("Markdown Image Path: " + match_str);
                return asset_img_str;
            }else{
                console.debug(match_str);
                console.debug("Label :"+label);
                console.debug(path);
                console.debug("Markdown Image Path does not exists!");
                return match_str;
            }

        });

    return data;
});
