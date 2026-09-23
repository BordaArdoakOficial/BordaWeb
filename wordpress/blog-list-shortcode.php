<?php
/**
 * ============================================================
 * BLOG ZERRENDA — WordPress-eko sarrerak automatikoki bistaratu
 * ============================================================
 * blog.html orriaren edukian, [borda_blog_list] shortcode-a jarrita
 * dagoen tokian, azken 12 WordPress sarrerak (Entradak) kargatzen
 * ditu zuzenean zerbitzaritik (JS-rik gabe, WP_Query erabiliz).
 * Artikulu bakoitzaren esteka WordPress-en jatorrizko orrira doa
 * (adib. /hola-mundo/), theme lehenetsiak automatikoki errendatzen
 * duena.
 *
 * NOLA JARRI WORDPRESS-EN:
 * "Code Snippets" edo "WPCode" pluginean, sortu PHP snippet berri
 * bat, itsatsi fitxategi honen eduki osoa, eta aktibatu.
 * Ondoren, Blog orriaren edizioan, jarri "Shortcode" bloke bat
 * honekin: [borda_blog_list]
 * ============================================================
 */

function borda_blog_read_more_label() {
    return is_rtl() ? 'Irakurri gehiago →' : 'Irakurri gehiago →';
}

function borda_blog_card_html($post, $is_featured) {
    $title = get_the_title($post);
    $link = get_permalink($post);
    $excerpt = wp_trim_words(
        $post->post_excerpt ? $post->post_excerpt : wp_strip_all_tags($post->post_content),
        26
    );
    $date = get_the_date('d/m/Y', $post);
    $img = get_the_post_thumbnail_url($post, $is_featured ? 'large' : 'medium_large');

    $tags = get_the_tags($post->ID);
    $tag_html = '';
    if ($tags && !is_wp_error($tags)) {
        foreach ($tags as $t) {
            $tag_html .= '<span class="tag">' . esc_html($t->name) . '</span>';
        }
    }

    $media_class = $is_featured ? 'blog-featured-media' : 'blog-card-media';
    $media = $img
        ? '<div class="' . $media_class . '"><img src="' . esc_url($img) . '" alt="' . esc_attr($title) . '" loading="lazy" /></div>'
        : '';

    $wrapper_class = $is_featured ? 'blog-featured' : 'blog-card';
    $body_class = $is_featured ? 'blog-featured-body' : 'blog-card-body';

    return '<a class="' . $wrapper_class . '" href="' . esc_url($link) . '">' . $media .
        '<div class="' . $body_class . '">' .
        '<div class="blog-meta">' . $tag_html . '<span>' . esc_html($date) . '</span></div>' .
        '<h2>' . esc_html($title) . '</h2>' .
        '<p>' . esc_html($excerpt) . '</p>' .
        '<span class="read-more">' . borda_blog_read_more_label() . '</span>' .
        '</div></a>';
}

function borda_blog_list_shortcode() {
    $posts = get_posts([
        'numberposts' => 12,
        'post_status' => 'publish',
    ]);

    if (empty($posts)) {
        return '<p class="blog-empty-text">Oraindik ez dago artikulurik argitaratuta.</p>';
    }

    $featured_post = array_shift($posts);
    $featured_html = borda_blog_card_html($featured_post, true);

    $list_html = '';
    foreach ($posts as $p) {
        $list_html .= borda_blog_card_html($p, false);
    }

    return '<div id="blog-featured">' . $featured_html . '</div>' .
        '<div class="blog-list" id="blog-list">' . $list_html . '</div>';
}
add_shortcode('borda_blog_list', 'borda_blog_list_shortcode');
