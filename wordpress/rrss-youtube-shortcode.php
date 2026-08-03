<?php
/**
 * ============================================================
 * RRSS - YouTube AUTOMATIKOA (WordPress)
 * ============================================================
 * Honekin, WordPress-ek berak lortzen du Borda Ardoak-en YouTube
 * kanaleko AZKEN bideoa automatikoki, esteka eskuz jarri gabe.
 * Ez du API key-rik, loginik ez pluginik behar: WordPress-en
 * berezko RSS irakurgailua erabiltzen du (fetch_feed), YouTube-ren
 * kanal-feed publikoarekin.
 *
 * NOLA JARRI WORDPRESS-EN:
 * 1. Zure ostatatzeko kPanel/WordPress-en, joan:
 *    Apariencia > Editor de archivos del tema > functions.php
 *    (Hobe oraindik: instalatu "Code Snippets" plugin doakoa eta
 *    sortu snippet berri bat horrekin — arriskutsuagoa da
 *    functions.php zuzenean ukitzea, akats batek gunea hondatu
 *    baitezake).
 * 2. Kopiatu fitxategi honen eduki OSOA (goiko "<?php" barne) eta
 *    itsatsi functions.php-ren amaieran (edo Code Snippets-en).
 * 3. Orriaren edizioan, RRSS bideoa nahi duzun tokian, jarri
 *    "Shortcode" bloke bat honekin: [rrss_youtube]
 *
 * Kanalaren ID-a jada jarrita dago ($channel_id) Borda Ardoak-en
 * benetako YouTube kanalarena da. Beste kanal bat balitz, aldatu
 * balio hori bakarrik.
 * ============================================================
 */

function borda_rrss_youtube_shortcode() {
    $channel_id = 'UCIe8XMdWtZCMT4L8Qz5m30A';
    $feed_url = 'https://www.youtube.com/feeds/videos.xml?channel_id=' . $channel_id;

    $feed = fetch_feed($feed_url);

    if (is_wp_error($feed) || $feed->get_item_quantity() === 0) {
        return '';
    }

    $item = $feed->get_item(0);
    $video_url = $item->get_link();

    if (!preg_match('/(?:v=|youtu\.be\/|embed\/|shorts\/)([a-zA-Z0-9_-]{6,})/', $video_url, $matches)) {
        return '';
    }
    $video_id = esc_attr($matches[1]);
    $video_title = esc_attr($item->get_title());

    return '<div class="rrss-youtube-embed" style="position:relative;width:100%;max-width:605px;aspect-ratio:16/9;margin:0 auto;">'
        . '<iframe src="https://www.youtube.com/embed/' . $video_id . '" '
        . 'title="' . $video_title . '" '
        . 'style="position:absolute;inset:0;width:100%;height:100%;border:0;border-radius:12px;" '
        . 'allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" '
        . 'allowfullscreen loading="lazy"></iframe></div>';
}
add_shortcode('rrss_youtube', 'borda_rrss_youtube_shortcode');
