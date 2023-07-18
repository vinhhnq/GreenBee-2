let mix = require('laravel-mix');
    mix.sass('sass/novstyle.scss', 'assets')
    .options({
        processCssUrls: false,
        autoprefixer: false,
    });
    mix.disableNotifications();