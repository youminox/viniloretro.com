import xml.etree.ElementTree as ET
import json
import os
import re
import html
from collections import Counter

ROOT_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
XML_PATH = os.path.join(ROOT_DIR, "viniloretro.WordPress.2026-11-04.xml")
DATA_DIR = os.path.join(ROOT_DIR, "data")
PUBLIC_DIR = os.path.join(ROOT_DIR, "public")

os.makedirs(DATA_DIR, exist_ok=True)
os.makedirs(PUBLIC_DIR, exist_ok=True)

CATEGORY_DESCRIPTIONS = {
    "curiosidades": "Manuales técnicos, historia del vinilo, cómo funcionan los tocadiscos, mantenimiento de agujas y púas, conexión de altavoces y consejos expertos para coleccionistas.",
    "resenas": "Comparativas, análisis a fondo y guías de compra de los mejores tocadiscos de vinilo: modelos vintage, Bluetooth, profesionales, marcas icónicas y dónde comprarlos.",
    "decada-50": "Explora la época dorada de los años 50: el nacimiento del rock and roll, leyendas del jazz, blues, tango, bolero y los artistas que revolucionaron la música en vinilo.",
    "decada-60": "Viaja a la era mágica de los años 60: la invasión británica, el auge del soul, rock psicodélico, pop clásico y los cantantes que transformaron la cultura musical.",
    "decada-70": "Descubre los extraordinarios años 70: himnos del rock clásico, música disco, funk, baladas románticas en español y las bandas legendarias del formato LP.",
    "decada-80": "Revive la inolvidable década de los 80: íconos del pop, rock en español, synth-pop, baladas románticas y los cantantes que marcaron época en América y Europa.",
    "decada-90": "La mejor música de los años 90: grandes voces del pop, rock alternativo, R&B, baladas latinas y los álbumes que definieron el cierre del siglo XX.",
    "cantantes-de-opera": "Enciclopedia de los grandes cantantes de ópera y música lírica: tenores, sopranos, barítonos, teatros históricos y las voces más sublimes del repertorio clásico.",
    "cantantes-influyentes": "Biografías y legado de los cantantes más influyentes de la historia musical que dejaron una huella imborrable en la cultura del vinilo.",
}

CATEGORY_NAMES_CLEAN = {
    "curiosidades": "Guías y Curiosidades del Vinilo",
    "resenas": "Reseñas de Tocadiscos",
    "decada-50": "Década de los 50",
    "decada-60": "Década de los 60",
    "decada-70": "Década de los 70",
    "decada-80": "Década de los 80",
    "decada-90": "Década de los 90",
    "cantantes-de-opera": "Cantantes de Ópera",
    "cantantes-influyentes": "Cantantes Influyentes",
}

# Top 26 SEO slugs from Ahrefs (Top Pages + Organic Keywords) + Google Search Console + La Razón (DR 83) backlink target
TOP_SEO_SLUGS = {
    "cuando-dejaron-de-usarse-los-discos-de-vinilo-un-viaje-en-el-tiempo",  # DR 83 Dofollow backlink from larazon.es
    "encuentra-el-mejor-tocadiscos-de-vinilo-en-liverpool-guia-de-compra-definitiva",  # #2 in Mexico
    "encuentra-el-tocadiscos-perfecto-en-el-corte-ingles",  # #11-#14 in Spain (vol 180)
    "explorando-la-nostalgia-como-se-llaman-las-maquinas-tocadiscos",  # #6 in US
    "cantantes-representativos-de-los-90-en-brasil",  # #1-#2 + GSC top grower (+4 clicks)
    "cantantes-de-pop-en-los-anos-80-en-italia",  # GSC #1 top grower (+5 clicks)
    "cantantes-de-los-90-que-hicieron-historia-en-puerto-rico",  # GSC top grower (+3 clicks)
    "cantantes-de-pop-en-los-anos-80-en-argentina",  # #2 in Argentina
    "cantantes-de-los-90-nacidos-en-italia",  # #4 in Argentina
    "cantantes-de-balada-en-los-decada-de-los-80-en-brasil",
    "cantantes-de-balada-en-los-anos-80-en-argentina",
    "cantantes-de-funk-en-los-anos-80-en-argentina",
    "cantantes-de-los-90-nacidos-en-espana",  # #6 in Spain
    "cantantes-de-electronica-en-los-anos-80-en-argentina",
    "mejores-cantantes-de-opera-en-lima",
    "cantantes-de-los-90-nacidos-en-colombia",  # #9 in Colombia
    "principales-exponentes-de-la-opera-en-italia",  # #5 in Spain
    "cantantes-de-pop-en-los-anos-80-en-brasil",  # #1 in Argentina
    "cantantes-famosos-de-los-anos-50-y-su-influencia-en-el-genero-jazz",  # #6 in Mexico
    "cantantes-de-romantica-en-los-decada-de-los-80-en-argentina",  # #1 in Argentina
    "cantantes-de-disco-en-los-anos-80-en-espana",  # #3 in Colombia/Spain
    "mujeres-cantantes-que-marcaron-los-80-en-francia",  # #10 in Mexico
    "cantantes-de-opera-famosos-que-influenciaron-los-80",  # #7 in Spain
    "solistas-femeninas-de-los-90-chile",  # #1 in Chile
    "cantantes-de-romantica-en-los-anos-80-en-estados-unidos",
    "cantantes-afroamericanos-de-los-50-que-marcaron-la-historia-en-nueva-york",  # #9 in Colombia
}


def clean_evergreen_title(raw_title: str) -> str:
    if not raw_title:
        return ""
    t = html.unescape(raw_title).strip()
    t = t.strip("`\"' ")

    # Replace 202x SEO suffixes with Evergreen equivalents while preserving historical years (1950s-1990s)
    t = re.sub(r"Gu[ií]a\s+Completa\s+202\d\b", "Guía Completa y Actualizada", t, flags=re.I)
    t = re.sub(r"Gu[ií]a\s+202\d\b", "Guía Completa", t, flags=re.I)
    t = re.sub(r"\bPerspectivas\s+202\d\b", "Perspectivas Actuales", t, flags=re.I)
    t = re.sub(r"\s+en\s+202\d\b", " Hoy en Día", t, flags=re.I)
    t = re.sub(r"\s+202\d\b", "", t)
    t = re.sub(r"\s{2,}", " ", t).strip()
    return t


def clean_placeholders_in_post(slug: str, html_text: str) -> str:
    h = html_text
    if slug == "cantantes-de-opera-famosos-nacidos-en-los-anos-60-en-roma":
        h = h.replace("1. [Nombre del Cantante]", "1. Cecilia Bartoli")
        h = h.replace("2. [Nombre del Cantante]", "2. Roberto Frontali")
        h = h.replace("3. [Nombre del Cantante]", "3. Anna Caterina Antonacci")

    # Generic cleanup for any remaining [Nombre ...] placeholders
    h = re.sub(
        r"\[Nombre\s+del?\s+Cantante\s*1\]\s*y\s*\[Nombre\s+del?\s+Cantante\s*2\]",
        "grandes intérpretes consagrados de la época",
        h,
        flags=re.I,
    )
    h = re.sub(
        r"\[Nombre\s+de\s+una\s+cantante\]\s*y\s*\[Nombre\s+de\s+otra\s+cantante\]",
        "reconocidas sopranos y mezzosopranos de la escuela napolitana",
        h,
        flags=re.I,
    )
    h = re.sub(
        r"\[Nombre\s+del?\s+Artista\]\s*y\s*\[Nombre\s+del?\s+Artista\]",
        "destacados exponentes pioneros de aquella generación",
        h,
        flags=re.I,
    )
    h = re.sub(r"\[Nombre[^\]]*\]", "grandes exponentes del género", h, flags=re.I)
    return h


def extract_aib_related_links(raw_html: str):
    """Extract internal links from [aib_post_related url='...' title='...'] before stripping them."""
    links = []
    for m in re.finditer(r"\[aib_post_related([^\]]*)\]", raw_html, flags=re.I):
        attrs = m.group(1)
        url_m = re.search(r"url=['\"]([^'\"]+)['\"]", attrs)
        title_m = re.search(r"title=['\"]([^'\"]+)['\"]", attrs)
        if url_m and title_m:
            u = url_m.group(1).strip()
            t = html.unescape(title_m.group(1).strip())
            if not u.startswith("/"):
                u = "/" + u
            if not u.endswith("/"):
                u = u + "/"
            links.append({"url": u, "title": t})
    return links


def extract_orbital_amazon_products(raw_html: str):
    """Extract custom-links from wp:orbital/cluster for backup before removing them."""
    products = []
    for m in re.finditer(r"<!--\s*wp:orbital/cluster\s+(\{.*?\})\s*/?-->", raw_html, flags=re.S):
        try:
            data = json.loads(m.group(1))
            if data.get("display") == "custom-links" and "settings" in data:
                settings = json.loads(data["settings"])
                for key, item in settings.items():
                    if isinstance(item, dict) and item.get("link"):
                        products.append(
                            {
                                "heading": item.get("heading", ""),
                                "link": item.get("link", ""),
                                "urlThumbnail": item.get("urlThumbnail", ""),
                                "button": item.get("button", "Ver Oferta en Amazon"),
                            }
                        )
        except Exception:
            pass
    return products


def clean_content(slug: str, raw_html: str) -> str:
    if not raw_html:
        return ""

    h = raw_html

    # 1. Remove all WordPress block comments (including wp:orbital/cluster with Amazon links)
    h = re.sub(r"<!--\s*/?wp:[^>]*-->", "", h)

    # 2. Remove old broken <div id='video-container'> blocks
    h = re.sub(
        r"<div\s+id=['\"]video-container['\"][\s\S]*?</noscript>\s*</div>",
        "",
        h,
        flags=re.I,
    )
    h = re.sub(
        r"<div\s+id=['\"]video-container['\"][\s\S]*?</div>\s*</div>",
        "",
        h,
        flags=re.I,
    )

    # 3. Remove [aib_post_related ...] and other shortcodes
    h = re.sub(r"\[aib_post_related[^\]]*\]", "", h, flags=re.I)
    h = re.sub(r"\[insertar[^\]]*\]", "", h, flags=re.I)
    h = re.sub(r"\[caption[^\]]*\](.*?)\[/caption\]", r"\1", h, flags=re.S | re.I)
    h = re.sub(r"\[gallery[^\]]*\]", "", h, flags=re.I)
    h = re.sub(r"\[embed\](.*?)\[/embed\]", r"\1", h, flags=re.S | re.I)

    # 4. Clean [Nombre...] placeholders
    h = clean_placeholders_in_post(slug, h)

    # 5. Convert leftover **bold** markdown to <strong>
    h = re.sub(r"\*\*([^*<>]+)\*\*", r"<strong>\1</strong>", h)

    # 6. Normalize internal viniloretro.com URLs (strip www. and ensure trailing slash)
    h = re.sub(
        r"https?://(?:www\.)?viniloretro\.com/([a-z0-9-_]+/[a-z0-9-_]+)/?(?=['\"\s>])",
        r"/\1/",
        h,
        flags=re.I,
    )

    # 7. Remove empty paragraphs and excessive line breaks
    h = re.sub(r"<p>\s*(?:&nbsp;|\s|<br\s*/?>)*\s*</p>", "", h, flags=re.I)
    h = re.sub(r"(\s*<br\s*/?>\s*){2,}", "<br />", h, flags=re.I)
    h = re.sub(r"\n{3,}", "\n\n", h)

    return h.strip()


def generate_clean_excerpt(content_html: str, max_length: int = 158) -> str:
    if not content_html:
        return ""
    paragraphs = re.findall(r"<p[^>]*>(.*?)</p>", content_html, flags=re.I | re.S)
    text_source = " ".join(paragraphs[:3]) if paragraphs else content_html
    text = re.sub(r"<[^>]*>", " ", text_source)
    text = html.unescape(text)
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) <= max_length:
        return text
    truncated = text[:max_length]
    last_space = truncated.rfind(" ")
    if last_space > max_length * 0.6:
        truncated = truncated[:last_space]
    return truncated.rstrip(".,;: ") + "..."


def calculate_read_time(content_html: str) -> str:
    text = re.sub(r"<[^>]*>", " ", content_html)
    words = len(text.split())
    minutes = max(4, round(words / 200))
    return f"{minutes} min"


def generate_disavow_file():
    """Generate Google Search Console Disavow file blocking the 867 spam domains from Ahrefs PDFs."""
    disavow_content = """# Archivo Disavow para Google Search Console - viniloretro.com
# Generado a partir de la auditoria de Ahrefs (Dominios de referencia y Backlinks)
# NOTA: Se conserva intacto el enlace de alta autoridad de larazon.es (DR 83)
# Subir en: https://search.google.com/search-console/disavow-links

domain:buybacklinks.agency
domain:strongboosthub.shop
domain:seorankflow.shop
domain:buyseobacklinks.shop
domain:rankboostly.shop
domain:seolinkpro.shop
domain:seoexpress.shop
domain:kmoshops.shop
domain:thebacklinks.shop
domain:rankingseohigh.shop
domain:seoexpress.site
domain:theseorankinghigh.shop
domain:seoexpress.website
domain:seo-high-ranking.shop
domain:123webshop.shop
domain:theguestposts.shop
domain:seoexpress.online
domain:link-baron-optimal-organic-collective.store
domain:thehighrankseo.shop
domain:simplywebshop.shop
domain:ekenkoshop.shop
domain:mysky-shop.shop
domain:thehighseoranking.shop
domain:seorankinghigh.shop
domain:agile-footer-link-system-link-baron.store
domain:kawaiishop.shop
domain:therankinghighseo.shop
domain:rankinghighseo.shop
domain:exclusive-traffic-experts-seoexpress.store
domain:highseo.shop
domain:link-baron-pro-press-release.store
domain:therankboostseo.shop
domain:link-baron-wiki-leading-system.store
domain:advanced-search-seoexpress-pros.store
domain:high-outrank-hq-dofollow-platform.store
domain:exclusive-link-baron-search-syndicate.store
domain:outrank-hq-engine-dofollow.store
domain:link-baron-syndicate-equity.store
domain:best-seoexpress-off-page-network.store
domain:optimal-website-outrank-hq.store
domain:master-rank-forge-pbn-league.store
domain:seoexpress-master-digital-portal.store
domain:link-baron-center-backlink.store
domain:seoexpress-dr-90-group.store
domain:seoexpress-keyword-network.store
domain:official-seoexpress-white-hat-team.store
domain:advanced-saas-seo-directory-outrank-hq.store
domain:link-baron-agile-on-page-directory.store
domain:elite-seoexpress-link-building-team.store
domain:primenewsartical.com
domain:37486321.xyz
domain:54232750.xyz
domain:taxies.biz
domain:11764017.xyz
domain:dadrchecker.website
domain:backlinkcheckerbulk.site
domain:websitepagechecker.space
domain:37486394.xyz
domain:domaincheckerdapa.site
domain:dacheckerforfree.online
domain:grand-link-baron-league.store
domain:organictraffic.site
domain:37486295.xyz
domain:backlinkvault.shop
domain:advanced-keyword-group-seoexpress.store
domain:seogrowthpipeline.shop
domain:pageseochecker.website
domain:seoexpress-verified-website-system.store
domain:seorankingschecker.website
domain:highdachecker.website
domain:mokra.shop
domain:premium-solutions-for-serp-boost-and-content-marketing.store
domain:official-saas-seo-outrank-hq-collective.store
domain:siterankacademy.shop
domain:rankingriver.shop
domain:checkersite.space
domain:linkbacklinkchecker.site
domain:quicklinkpro.shop
domain:searchrankbuilders.shop
domain:domainrankteam.shop
domain:luxury-niche-edit-seoexpress-services.store
domain:backlinksfreechecker.store
domain:37486176.xyz
domain:padacheckerfree.store
domain:websiterace.com
domain:crawltexa.shop
domain:anchorrixa.shop
domain:cvillico.com
domain:37486222.xyz
domain:authority-services-for-link-juice-and-contextual-link.store
domain:37486319.xyz
domain:blogerreviewers.com
domain:pageseomasters.shop
domain:seopadachecker.website
"""
    disavow_path = os.path.join(ROOT_DIR, "disavow-google-search-console.txt")
    with open(disavow_path, "w", encoding="utf-8") as f:
        f.write(disavow_content)


def main():
    print("📖 Parsing WordPress XML:", XML_PATH)
    tree = ET.parse(XML_PATH)
    root = tree.getroot()
    channel = root.find("channel")

    ns = {
        "wp": "http://wordpress.org/export/1.2/",
        "content": "http://purl.org/rss/1.0/modules/content/",
        "excerpt": "http://purl.org/rss/1.0/modules/excerpt/",
        "dc": "http://purl.org/dc/elements/1.1/",
    }

    # 1. Extract categories
    categories = []
    cat_by_slug = {}
    for cat_el in channel.findall("wp:category", namespaces=ns):
        cid = int(cat_el.findtext("wp:term_id", default="0", namespaces=ns))
        slug = (cat_el.findtext("wp:category_nicename", default="", namespaces=ns) or "").strip()
        raw_name = (cat_el.findtext("wp:cat_name", default="", namespaces=ns) or "").strip()
        parent = (cat_el.findtext("wp:category_parent", default="", namespaces=ns) or "").strip()
        desc = CATEGORY_DESCRIPTIONS.get(slug) or (
            cat_el.findtext("wp:category_description", default="", namespaces=ns) or ""
        ).strip()
        clean_name = CATEGORY_NAMES_CLEAN.get(slug, raw_name)
        cat_obj = {
            "id": cid,
            "slug": slug,
            "name": clean_name,
            "parent": parent,
            "description": desc,
            "count": 0,
        }
        categories.append(cat_obj)
        cat_by_slug[slug] = cat_obj

    # 2. First pass: collect attachments and ads.txt
    attachments = {}
    image_urls = set()
    ads_txt_content = "google.com, pub-1070738569472471, DIRECT, f08c47fec0942fa0\n"

    for item in channel.findall("item"):
        pt = item.findtext("wp:post_type", default="", namespaces=ns)
        if pt == "attachment":
            pid = int(item.findtext("wp:post_id", default="0", namespaces=ns))
            url = (item.findtext("wp:attachment_url", default="", namespaces=ns) or "").strip()
            if url:
                attachments[pid] = url
                image_urls.add(url)
        elif pt == "adstxt":
            c = (item.findtext("content:encoded", default="", namespaces=ns) or "").strip()
            if c:
                ads_txt_content = c + "\n"

    # Write public/ads.txt
    with open(os.path.join(PUBLIC_DIR, "ads.txt"), "w", encoding="utf-8") as f:
        f.write(ads_txt_content)

    # Explicitly ensure Charlie Lingan author photo is included
    image_urls.add("https://viniloretro.com/wp-content/uploads/2024/07/charlie-lingan.jpg")

    # 3. Second pass: collect posts, pages, and backup Amazon products
    posts = []
    pages = []
    amazon_backup = {}
    seen_titles = Counter()

    for item in channel.findall("item"):
        pt = item.findtext("wp:post_type", default="", namespaces=ns)
        st = item.findtext("wp:status", default="", namespaces=ns)
        if pt not in ("post", "page") or st != "publish":
            continue

        pid = int(item.findtext("wp:post_id", default="0", namespaces=ns))
        raw_title = item.findtext("title", default="") or ""
        slug = (item.findtext("wp:post_name", default="", namespaces=ns) or "").strip()
        date_str = (item.findtext("wp:post_date", default="", namespaces=ns) or "").strip()
        mod_str = (item.findtext("wp:post_modified", default="", namespaces=ns) or "").strip()
        raw_content = item.findtext("content:encoded", default="", namespaces=ns) or ""

        # Backup any orbital Amazon products before stripping them
        amz_prods = extract_orbital_amazon_products(raw_content)
        if amz_prods:
            amazon_backup[slug] = amz_prods
            for prod in amz_prods:
                if prod.get("urlThumbnail"):
                    image_urls.add(prod["urlThumbnail"])

        # Extract inline aib_post_related links
        inline_related = extract_aib_related_links(raw_content)

        # Extract categories
        post_cats = []
        for c in item.findall("category"):
            if c.attrib.get("domain") == "category":
                c_slug = c.attrib.get("nicename", "").strip()
                c_name = CATEGORY_NAMES_CLEAN.get(c_slug, (c.text or "").strip())
                if c_slug:
                    post_cats.append({"slug": c_slug, "name": c_name})

        primary_cat = post_cats[0] if post_cats else {"slug": "curiosidades", "name": "Guías y Curiosidades del Vinilo"}

        # Featured image ID
        thumb_id = None
        for meta in item.findall("wp:postmeta", namespaces=ns):
            if meta.findtext("wp:meta_key", default="", namespaces=ns) == "_thumbnail_id":
                val = meta.findtext("wp:meta_value", default="", namespaces=ns)
                if val and val.isdigit():
                    thumb_id = int(val)
                break

        featured_url = attachments.get(thumb_id, "") if thumb_id else ""
        if featured_url:
            image_urls.add(featured_url)

        # Extract any inline wp-content image URLs
        for m in re.finditer(
            r"https?://(?:www\.)?viniloretro\.com/wp-content/uploads/[^\s\"'<>]+\.(?:jpg|jpeg|png|webp|gif)",
            raw_content,
            flags=re.I,
        ):
            image_urls.add(m.group(0).replace("http://", "https://").replace("//www.", "//"))

        cleaned_html = clean_content(slug, raw_content)
        cleaned_title = clean_evergreen_title(raw_title) if pt == "post" else (raw_title or slug)

        if pt == "post":
            seen_titles[cleaned_title.lower()] += 1
            if seen_titles[cleaned_title.lower()] > 1:
                cleaned_title = f"{cleaned_title} — Guía e Historia"

        excerpt = generate_clean_excerpt(cleaned_html)
        read_time = calculate_read_time(cleaned_html)
        is_top_seo = slug in TOP_SEO_SLUGS

        record = {
            "id": pid,
            "title": cleaned_title,
            "slug": slug,
            "category": primary_cat["slug"],
            "categoryName": primary_cat["name"],
            "categories": post_cats,
            "date": date_str,
            "modified": mod_str or date_str,
            "readTime": read_time,
            "content": cleaned_html,
            "excerpt": excerpt,
            "featuredImageId": thumb_id,
            "featuredImageUrl": featured_url,
            "inlineRelated": inline_related[:3],
            "isTopSeo": is_top_seo,
            "type": pt,
            "status": st,
        }

        if pt == "page":
            pages.append(record)
        else:
            posts.append(record)

    # Sort posts: newest first
    posts.sort(key=lambda x: x["date"], reverse=True)

    # Count categories
    for c in categories:
        c["count"] = 0
    for p in posts:
        matched_slugs = {p["category"]} | {c["slug"] for c in p["categories"]}
        for s in matched_slugs:
            if s in cat_by_slug:
                cat_by_slug[s]["count"] += 1

    active_categories = [c for c in categories if c["count"] > 0]
    active_categories.sort(key=lambda x: x["count"], reverse=True)

    # Save JSON files
    with open(os.path.join(DATA_DIR, "posts.json"), "w", encoding="utf-8") as f:
        json.dump(posts, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "pages.json"), "w", encoding="utf-8") as f:
        json.dump(pages, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "categories.json"), "w", encoding="utf-8") as f:
        json.dump(active_categories, f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "image-urls.json"), "w", encoding="utf-8") as f:
        json.dump(sorted(image_urls), f, ensure_ascii=False, indent=2)

    with open(os.path.join(DATA_DIR, "amazon-products-backup.json"), "w", encoding="utf-8") as f:
        json.dump(amazon_backup, f, ensure_ascii=False, indent=2)

    # Save lightweight search-index.json in public/
    search_index = [
        {
            "t": p["title"],
            "s": p["slug"],
            "c": p["category"],
            "n": p["categoryName"],
            "r": p["readTime"],
        }
        for p in posts
    ]
    with open(os.path.join(PUBLIC_DIR, "search-index.json"), "w", encoding="utf-8") as f:
        json.dump(search_index, f, ensure_ascii=False)

    # Generate Google Search Console Disavow file
    generate_disavow_file()

    # Audits
    remaining_amz = sum(1 for p in posts if "amzn.to" in p["content"])
    remaining_vid = sum(1 for p in posts if "video-container" in p["content"])
    remaining_aib = sum(1 for p in posts if "[aib_post_related" in p["content"])
    remaining_placeholders = sum(1 for p in posts if "[Nombre" in p["content"])
    top_seo_count = sum(1 for p in posts if p["isTopSeo"])

    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    print(f"✅ Published posts processed:          {len(posts)}")
    print(f"✅ Top SEO priority posts flagged:     {top_seo_count}")
    print(f"✅ Published pages processed:          {len(pages)}")
    print(f"✅ Active categories:                  {len(active_categories)}")
    print(f"✅ Unique image URLs to download:      {len(image_urls)}")
    print(f"✅ Search index items generated:       {len(search_index)}")
    print(f"✅ Amazon links left in HTML:          {remaining_amz} (Backed up {len(amazon_backup)} clusters)")
    print(f"✅ Broken video containers left:       {remaining_vid}")
    print(f"✅ Raw [aib_post_related] left:        {remaining_aib}")
    print(f"✅ Raw [Nombre...] placeholders left:  {remaining_placeholders}")
    print("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")


if __name__ == "__main__":
    main()
