let mix = require('laravel-mix');
    mix.sass('sass/novstyle.scss', 'assets/novstyle.css')
    .options({
        processCssUrls: false,
        autoprefixer: false,
    });
    mix.disableNotifications();