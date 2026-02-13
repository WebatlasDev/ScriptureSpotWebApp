/*
  Warnings:

  - The primary key for the `authors` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bio` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `birth_year` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `colors` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `death_year` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `extended_bio` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `image` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `nationality` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `nickname_or_title` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `religious_tradition` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `sermons_preached` on the `authors` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `authors` table. All the data in the column will be lost.
  - The primary key for the `bible_book_overviews` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `audience` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `author` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `book_id` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `book_structure` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `composition` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `cultural_background` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `historical_context` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `key_themes` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `objective` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `political_landscape` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `teaching_highlights` on the `bible_book_overviews` table. All the data in the column will be lost.
  - You are about to drop the column `unique_elements` on the `bible_book_overviews` table. All the data in the column will be lost.
  - The primary key for the `bible_book_structures` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `book_overview_id` on the `bible_book_structures` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_book_structures` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `bible_book_structures` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `bible_book_structures` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `bible_book_structures` table. All the data in the column will be lost.
  - The primary key for the `bible_books` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `abbreviation` on the `bible_books` table. All the data in the column will be lost.
  - You are about to drop the column `aliases` on the `bible_books` table. All the data in the column will be lost.
  - You are about to drop the column `book_number` on the `bible_books` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `bible_books` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_books` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `bible_books` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `bible_books` table. All the data in the column will be lost.
  - The primary key for the `bible_chapters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `book_id` on the `bible_chapters` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_number` on the `bible_chapters` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_chapters` table. All the data in the column will be lost.
  - The primary key for the `bible_verse_cross_references` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `book` on the `bible_verse_cross_references` table. All the data in the column will be lost.
  - You are about to drop the column `book_slug` on the `bible_verse_cross_references` table. All the data in the column will be lost.
  - You are about to drop the column `chapter` on the `bible_verse_cross_references` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_verse_cross_references` table. All the data in the column will be lost.
  - You are about to drop the column `keyword` on the `bible_verse_cross_references` table. All the data in the column will be lost.
  - You are about to drop the column `keyword_slug` on the `bible_verse_cross_references` table. All the data in the column will be lost.
  - You are about to drop the column `verse` on the `bible_verse_cross_references` table. All the data in the column will be lost.
  - The primary key for the `bible_verse_references` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `end_verse_id` on the `bible_verse_references` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_verse_references` table. All the data in the column will be lost.
  - You are about to drop the column `start_verse_id` on the `bible_verse_references` table. All the data in the column will be lost.
  - The primary key for the `bible_verse_takeaway_excerpts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `content` on the `bible_verse_takeaway_excerpts` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_verse_takeaway_excerpts` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `bible_verse_takeaway_excerpts` table. All the data in the column will be lost.
  - You are about to drop the column `takeaway_id` on the `bible_verse_takeaway_excerpts` table. All the data in the column will be lost.
  - The primary key for the `bible_verse_takeaway_quotes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `bible_verse_takeaway_quotes` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `bible_verse_takeaway_quotes` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_verse_takeaway_quotes` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `bible_verse_takeaway_quotes` table. All the data in the column will be lost.
  - You are about to drop the column `takeaway_id` on the `bible_verse_takeaway_quotes` table. All the data in the column will be lost.
  - The primary key for the `bible_verse_takeaways` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `bible_reference_id` on the `bible_verse_takeaways` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_verse_takeaways` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `bible_verse_takeaways` table. All the data in the column will be lost.
  - The primary key for the `bible_verse_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `bible_verse_versions` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `bible_verse_versions` table. All the data in the column will be lost.
  - You are about to drop the column `verse_id` on the `bible_verse_versions` table. All the data in the column will be lost.
  - You are about to drop the column `version_id` on the `bible_verse_versions` table. All the data in the column will be lost.
  - The primary key for the `bible_verses` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `chapter_id` on the `bible_verses` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_verses` table. All the data in the column will be lost.
  - You are about to drop the column `verse_number` on the `bible_verses` table. All the data in the column will be lost.
  - The primary key for the `bible_versions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `abbreviation` on the `bible_versions` table. All the data in the column will be lost.
  - You are about to drop the column `contributors` on the `bible_versions` table. All the data in the column will be lost.
  - You are about to drop the column `copyright` on the `bible_versions` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `bible_versions` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bible_versions` table. All the data in the column will be lost.
  - You are about to drop the column `language` on the `bible_versions` table. All the data in the column will be lost.
  - You are about to drop the column `license` on the `bible_versions` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `bible_versions` table. All the data in the column will be lost.
  - You are about to drop the column `publish_year` on the `bible_versions` table. All the data in the column will be lost.
  - You are about to drop the column `year` on the `bible_versions` table. All the data in the column will be lost.
  - The primary key for the `bookmarks` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_date` on the `bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `reference_id` on the `bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `bookmarks` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `bookmarks` table. All the data in the column will be lost.
  - The primary key for the `books` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `books` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `books` table. All the data in the column will be lost.
  - The primary key for the `catechism_items` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `answer` on the `catechism_items` table. All the data in the column will be lost.
  - You are about to drop the column `catechism_id` on the `catechism_items` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `catechism_items` table. All the data in the column will be lost.
  - You are about to drop the column `number` on the `catechism_items` table. All the data in the column will be lost.
  - You are about to drop the column `question` on the `catechism_items` table. All the data in the column will be lost.
  - The primary key for the `catechism_proof_texts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `catechism_item_id` on the `catechism_proof_texts` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `catechism_proof_texts` table. All the data in the column will be lost.
  - You are about to drop the column `reference` on the `catechism_proof_texts` table. All the data in the column will be lost.
  - You are about to drop the column `text` on the `catechism_proof_texts` table. All the data in the column will be lost.
  - The primary key for the `catechisms` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `description` on the `catechisms` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `catechisms` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `catechisms` table. All the data in the column will be lost.
  - The primary key for the `commentaries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `commentaries` table. All the data in the column will be lost.
  - You are about to drop the column `bible_reference_id` on the `commentaries` table. All the data in the column will be lost.
  - You are about to drop the column `group_id` on the `commentaries` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `commentaries` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `commentaries` table. All the data in the column will be lost.
  - You are about to drop the column `source` on the `commentaries` table. All the data in the column will be lost.
  - You are about to drop the column `source_url` on the `commentaries` table. All the data in the column will be lost.
  - The primary key for the `commentary_excerpts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `commentary_id` on the `commentary_excerpts` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `commentary_excerpts` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `commentary_excerpts` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `commentary_excerpts` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `commentary_excerpts` table. All the data in the column will be lost.
  - The primary key for the `contacts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_date` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `message` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `reason` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `subject` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `target_email` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `contacts` table. All the data in the column will be lost.
  - You are about to drop the column `user_id` on the `contacts` table. All the data in the column will be lost.
  - The primary key for the `cta_tiles` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `button_text` on the `cta_tiles` table. All the data in the column will be lost.
  - You are about to drop the column `button_url` on the `cta_tiles` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `cta_tiles` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `cta_tiles` table. All the data in the column will be lost.
  - You are about to drop the column `image_url` on the `cta_tiles` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `cta_tiles` table. All the data in the column will be lost.
  - The primary key for the `facts` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `facts` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `facts` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `facts` table. All the data in the column will be lost.
  - The primary key for the `interlinear_words` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `greek_word` on the `interlinear_words` table. All the data in the column will be lost.
  - You are about to drop the column `hebrew_word` on the `interlinear_words` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `interlinear_words` table. All the data in the column will be lost.
  - You are about to drop the column `morphology` on the `interlinear_words` table. All the data in the column will be lost.
  - You are about to drop the column `reference_id` on the `interlinear_words` table. All the data in the column will be lost.
  - You are about to drop the column `strongs_lexicon_id` on the `interlinear_words` table. All the data in the column will be lost.
  - You are about to drop the column `translation` on the `interlinear_words` table. All the data in the column will be lost.
  - You are about to drop the column `transliteration` on the `interlinear_words` table. All the data in the column will be lost.
  - You are about to drop the column `word` on the `interlinear_words` table. All the data in the column will be lost.
  - You are about to drop the column `word_position` on the `interlinear_words` table. All the data in the column will be lost.
  - The primary key for the `landing_page_components` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `component_type` on the `landing_page_components` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `landing_page_components` table. All the data in the column will be lost.
  - You are about to drop the column `entity_id` on the `landing_page_components` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `landing_page_components` table. All the data in the column will be lost.
  - You are about to drop the column `landing_page_id` on the `landing_page_components` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `landing_page_components` table. All the data in the column will be lost.
  - The primary key for the `landing_pages` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `landing_pages` table. All the data in the column will be lost.
  - You are about to drop the column `meta_description` on the `landing_pages` table. All the data in the column will be lost.
  - You are about to drop the column `reference_slug` on the `landing_pages` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `landing_pages` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `landing_pages` table. All the data in the column will be lost.
  - The primary key for the `quotes` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `quotes` table. All the data in the column will be lost.
  - You are about to drop the column `bible_verse_id` on the `quotes` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `quotes` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `quotes` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `quotes` table. All the data in the column will be lost.
  - The primary key for the `search_entries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_name` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `author_slug` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `book_slug` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `chapter_number` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `end_verse_number` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `slug` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `start_verse_number` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `type` on the `search_entries` table. All the data in the column will be lost.
  - You are about to drop the column `verse_number` on the `search_entries` table. All the data in the column will be lost.
  - The primary key for the `seo_keywords` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `competition_level` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `cpc_usd` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `created_date` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `current_url` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `current_url_position` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `current_url_traffic` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `keyword` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `keyword_difficulty` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `number_of_results` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `search_intent` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `search_volume` on the `seo_keywords` table. All the data in the column will be lost.
  - You are about to drop the column `submitted_for_indexing` on the `seo_keywords` table. All the data in the column will be lost.
  - The primary key for the `sitemap_entries` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `change_freq` on the `sitemap_entries` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `sitemap_entries` table. All the data in the column will be lost.
  - You are about to drop the column `last_modified` on the `sitemap_entries` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `sitemap_entries` table. All the data in the column will be lost.
  - You are about to drop the column `sitemap_group_id` on the `sitemap_entries` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `sitemap_entries` table. All the data in the column will be lost.
  - The primary key for the `sitemap_groups` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `group_type` on the `sitemap_groups` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `sitemap_groups` table. All the data in the column will be lost.
  - You are about to drop the column `identifier` on the `sitemap_groups` table. All the data in the column will be lost.
  - The primary key for the `strongs_lexicons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `derivation` on the `strongs_lexicons` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `strongs_lexicons` table. All the data in the column will be lost.
  - You are about to drop the column `original_word` on the `strongs_lexicons` table. All the data in the column will be lost.
  - You are about to drop the column `pronunciation` on the `strongs_lexicons` table. All the data in the column will be lost.
  - You are about to drop the column `short_definition` on the `strongs_lexicons` table. All the data in the column will be lost.
  - You are about to drop the column `strongs_def` on the `strongs_lexicons` table. All the data in the column will be lost.
  - You are about to drop the column `strongs_key` on the `strongs_lexicons` table. All the data in the column will be lost.
  - You are about to drop the column `transliteration` on the `strongs_lexicons` table. All the data in the column will be lost.
  - The primary key for the `subscriptions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `created_date` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `form` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `resubscribed_date` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `unsubscribed_date` on the `subscriptions` table. All the data in the column will be lost.
  - You are about to drop the column `url` on the `subscriptions` table. All the data in the column will be lost.
  - The primary key for the `works` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `author_id` on the `works` table. All the data in the column will be lost.
  - You are about to drop the column `content` on the `works` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `works` table. All the data in the column will be lost.
  - You are about to drop the `_CrossReferenceVerseReferences` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[BookId]` on the table `bible_book_overviews` will be added. If there are existing duplicate values, this will fail.
  - The required column `Id` was added to the `authors` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `Name` to the `authors` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `bible_book_overviews` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_book_structures` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_books` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_chapters` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_verse_cross_references` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_verse_references` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_verse_takeaway_excerpts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_verse_takeaway_quotes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_verse_takeaways` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_verse_versions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_verses` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bible_versions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `bookmarks` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `books` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `CatechismId` to the `catechism_items` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `catechism_items` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `catechism_proof_texts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `catechisms` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `commentaries` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `commentary_excerpts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `Email` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `contacts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `Name` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - Added the required column `TargetEmail` to the `contacts` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `cta_tiles` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `facts` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `interlinear_words` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `EntityId` to the `landing_page_components` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `landing_page_components` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `LandingPageId` to the `landing_page_components` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `landing_pages` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `quotes` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `search_entries` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `seo_keywords` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `sitemap_entries` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `SitemapGroupId` to the `sitemap_entries` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GroupIdentifier` to the `sitemap_groups` table without a default value. This is not possible if the table is not empty.
  - Added the required column `GroupType` to the `sitemap_groups` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `sitemap_groups` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `strongs_lexicons` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - Added the required column `Email` to the `subscriptions` table without a default value. This is not possible if the table is not empty.
  - The required column `Id` was added to the `subscriptions` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `Id` was added to the `works` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "_CrossReferenceVerseReferences" DROP CONSTRAINT "_CrossReferenceVerseReferences_A_fkey";

-- DropForeignKey
ALTER TABLE "_CrossReferenceVerseReferences" DROP CONSTRAINT "_CrossReferenceVerseReferences_B_fkey";

-- DropForeignKey
ALTER TABLE "bible_book_overviews" DROP CONSTRAINT "bible_book_overviews_book_id_fkey";

-- DropForeignKey
ALTER TABLE "bible_book_structures" DROP CONSTRAINT "bible_book_structures_book_overview_id_fkey";

-- DropForeignKey
ALTER TABLE "bible_chapters" DROP CONSTRAINT "bible_chapters_book_id_fkey";

-- DropForeignKey
ALTER TABLE "bible_verse_references" DROP CONSTRAINT "bible_verse_references_end_verse_id_fkey";

-- DropForeignKey
ALTER TABLE "bible_verse_references" DROP CONSTRAINT "bible_verse_references_start_verse_id_fkey";

-- DropForeignKey
ALTER TABLE "bible_verse_takeaway_excerpts" DROP CONSTRAINT "bible_verse_takeaway_excerpts_takeaway_id_fkey";

-- DropForeignKey
ALTER TABLE "bible_verse_takeaway_quotes" DROP CONSTRAINT "bible_verse_takeaway_quotes_takeaway_id_fkey";

-- DropForeignKey
ALTER TABLE "bible_verse_takeaways" DROP CONSTRAINT "bible_verse_takeaways_bible_reference_id_fkey";

-- DropForeignKey
ALTER TABLE "bible_verse_versions" DROP CONSTRAINT "bible_verse_versions_verse_id_fkey";

-- DropForeignKey
ALTER TABLE "bible_verse_versions" DROP CONSTRAINT "bible_verse_versions_version_id_fkey";

-- DropForeignKey
ALTER TABLE "bible_verses" DROP CONSTRAINT "bible_verses_chapter_id_fkey";

-- DropForeignKey
ALTER TABLE "books" DROP CONSTRAINT "books_author_id_fkey";

-- DropForeignKey
ALTER TABLE "catechism_items" DROP CONSTRAINT "catechism_items_catechism_id_fkey";

-- DropForeignKey
ALTER TABLE "catechism_proof_texts" DROP CONSTRAINT "catechism_proof_texts_catechism_item_id_fkey";

-- DropForeignKey
ALTER TABLE "commentaries" DROP CONSTRAINT "commentaries_author_id_fkey";

-- DropForeignKey
ALTER TABLE "commentaries" DROP CONSTRAINT "commentaries_bible_reference_id_fkey";

-- DropForeignKey
ALTER TABLE "commentary_excerpts" DROP CONSTRAINT "commentary_excerpts_commentary_id_fkey";

-- DropForeignKey
ALTER TABLE "facts" DROP CONSTRAINT "facts_author_id_fkey";

-- DropForeignKey
ALTER TABLE "interlinear_words" DROP CONSTRAINT "interlinear_words_reference_id_fkey";

-- DropForeignKey
ALTER TABLE "interlinear_words" DROP CONSTRAINT "interlinear_words_strongs_lexicon_id_fkey";

-- DropForeignKey
ALTER TABLE "landing_page_components" DROP CONSTRAINT "landing_page_components_landing_page_id_fkey";

-- DropForeignKey
ALTER TABLE "quotes" DROP CONSTRAINT "quotes_author_id_fkey";

-- DropForeignKey
ALTER TABLE "quotes" DROP CONSTRAINT "quotes_bible_verse_id_fkey";

-- DropForeignKey
ALTER TABLE "sitemap_entries" DROP CONSTRAINT "sitemap_entries_sitemap_group_id_fkey";

-- DropForeignKey
ALTER TABLE "works" DROP CONSTRAINT "works_author_id_fkey";

-- DropIndex
DROP INDEX "bible_book_overviews_book_id_key";

-- DropIndex
DROP INDEX "IX_SearchEntries_Book_Chapter_Verse";

-- DropIndex
DROP INDEX "strongs_lexicons_strongs_key_idx";

-- AlterTable
ALTER TABLE "authors" DROP CONSTRAINT "authors_pkey",
DROP COLUMN "bio",
DROP COLUMN "birth_year",
DROP COLUMN "colors",
DROP COLUMN "death_year",
DROP COLUMN "extended_bio",
DROP COLUMN "id",
DROP COLUMN "image",
DROP COLUMN "name",
DROP COLUMN "nationality",
DROP COLUMN "nickname_or_title",
DROP COLUMN "occupation",
DROP COLUMN "religious_tradition",
DROP COLUMN "sermons_preached",
DROP COLUMN "slug",
ADD COLUMN     "Biography" TEXT,
ADD COLUMN     "BirthYear" INTEGER,
ADD COLUMN     "BooksWritten" INTEGER,
ADD COLUMN     "Colors" TEXT,
ADD COLUMN     "DeathYear" INTEGER,
ADD COLUMN     "FullResImage" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Image" TEXT,
ADD COLUMN     "IsBook" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Name" VARCHAR(255) NOT NULL,
ADD COLUMN     "Nationality" TEXT,
ADD COLUMN     "NicknameOrTitle" TEXT,
ADD COLUMN     "Occupation" TEXT,
ADD COLUMN     "ReadingLevel" TEXT,
ADD COLUMN     "ReligiousTradition" TEXT,
ADD COLUMN     "SermonsPreached" INTEGER,
ADD COLUMN     "Slug" TEXT,
ADD COLUMN     "UpdatedDate" TIMESTAMP(3),
ADD CONSTRAINT "authors_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_book_overviews" DROP CONSTRAINT "bible_book_overviews_pkey",
DROP COLUMN "audience",
DROP COLUMN "author",
DROP COLUMN "book_id",
DROP COLUMN "book_structure",
DROP COLUMN "composition",
DROP COLUMN "cultural_background",
DROP COLUMN "historical_context",
DROP COLUMN "id",
DROP COLUMN "key_themes",
DROP COLUMN "objective",
DROP COLUMN "political_landscape",
DROP COLUMN "teaching_highlights",
DROP COLUMN "unique_elements",
ADD COLUMN     "Audience" TEXT,
ADD COLUMN     "Author" TEXT,
ADD COLUMN     "BookId" UUID,
ADD COLUMN     "BookStructure" TEXT,
ADD COLUMN     "Composition" TEXT,
ADD COLUMN     "CulturalBackground" TEXT,
ADD COLUMN     "HistoricalContext" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "KeyThemes" TEXT,
ADD COLUMN     "Objective" TEXT,
ADD COLUMN     "PoliticalLandscape" TEXT,
ADD COLUMN     "TeachingHighlights" TEXT,
ADD COLUMN     "UniqueElements" TEXT,
ADD CONSTRAINT "bible_book_overviews_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_book_structures" DROP CONSTRAINT "bible_book_structures_pkey",
DROP COLUMN "book_overview_id",
DROP COLUMN "id",
DROP COLUMN "order",
DROP COLUMN "reference",
DROP COLUMN "title",
ADD COLUMN     "BookOverviewId" UUID,
ADD COLUMN     "Description" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Order" INTEGER,
ADD COLUMN     "Title" TEXT,
ADD COLUMN     "VerseReferenceSlug" TEXT,
ADD COLUMN     "Verses" TEXT,
ADD CONSTRAINT "bible_book_structures_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_books" DROP CONSTRAINT "bible_books_pkey",
DROP COLUMN "abbreviation",
DROP COLUMN "aliases",
DROP COLUMN "book_number",
DROP COLUMN "description",
DROP COLUMN "id",
DROP COLUMN "name",
DROP COLUMN "slug",
ADD COLUMN     "Abbreviation" TEXT,
ADD COLUMN     "Aliases" TEXT,
ADD COLUMN     "BookNumber" INTEGER,
ADD COLUMN     "Chapters" INTEGER,
ADD COLUMN     "Description" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Name" TEXT,
ADD COLUMN     "Slug" TEXT,
ADD COLUMN     "Testament" TEXT,
ADD COLUMN     "Verses" INTEGER,
ADD CONSTRAINT "bible_books_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_chapters" DROP CONSTRAINT "bible_chapters_pkey",
DROP COLUMN "book_id",
DROP COLUMN "chapter_number",
DROP COLUMN "id",
ADD COLUMN     "BookId" UUID,
ADD COLUMN     "ChapterNumber" INTEGER,
ADD COLUMN     "Id" UUID NOT NULL,
ADD CONSTRAINT "bible_chapters_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_verse_cross_references" DROP CONSTRAINT "bible_verse_cross_references_pkey",
DROP COLUMN "book",
DROP COLUMN "book_slug",
DROP COLUMN "chapter",
DROP COLUMN "id",
DROP COLUMN "keyword",
DROP COLUMN "keyword_slug",
DROP COLUMN "verse",
ADD COLUMN     "Book" TEXT,
ADD COLUMN     "BookSlug" TEXT,
ADD COLUMN     "Chapter" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Keyword" TEXT,
ADD COLUMN     "KeywordSlug" TEXT,
ADD COLUMN     "Verse" TEXT,
ADD CONSTRAINT "bible_verse_cross_references_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_verse_references" DROP CONSTRAINT "bible_verse_references_pkey",
DROP COLUMN "end_verse_id",
DROP COLUMN "id",
DROP COLUMN "start_verse_id",
ADD COLUMN     "BibleVerseCrossReferenceId" UUID,
ADD COLUMN     "EndVerseId" UUID,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "StartVerseId" UUID,
ADD CONSTRAINT "bible_verse_references_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_verse_takeaway_excerpts" DROP CONSTRAINT "bible_verse_takeaway_excerpts_pkey",
DROP COLUMN "content",
DROP COLUMN "id",
DROP COLUMN "order",
DROP COLUMN "takeaway_id",
ADD COLUMN     "BibleVerseTakeawayId" UUID,
ADD COLUMN     "Content" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Order" INTEGER,
ADD COLUMN     "TakeAwayId" UUID,
ADD COLUMN     "Title" TEXT,
ADD CONSTRAINT "bible_verse_takeaway_excerpts_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_verse_takeaway_quotes" DROP CONSTRAINT "bible_verse_takeaway_quotes_pkey",
DROP COLUMN "author_id",
DROP COLUMN "content",
DROP COLUMN "id",
DROP COLUMN "order",
DROP COLUMN "takeaway_id",
ADD COLUMN     "AuthorId" UUID,
ADD COLUMN     "BibleVerseTakeawayId" UUID,
ADD COLUMN     "Content" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Order" INTEGER,
ADD COLUMN     "Source" TEXT,
ADD COLUMN     "TakeAwayId" UUID,
ADD COLUMN     "Title" TEXT,
ADD CONSTRAINT "bible_verse_takeaway_quotes_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_verse_takeaways" DROP CONSTRAINT "bible_verse_takeaways_pkey",
DROP COLUMN "bible_reference_id",
DROP COLUMN "id",
DROP COLUMN "slug",
ADD COLUMN     "BibleReferenceId" UUID,
ADD COLUMN     "CommentaryAuthors" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Slug" TEXT,
ADD CONSTRAINT "bible_verse_takeaways_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_verse_versions" DROP CONSTRAINT "bible_verse_versions_pkey",
DROP COLUMN "id",
DROP COLUMN "text",
DROP COLUMN "verse_id",
DROP COLUMN "version_id",
ADD COLUMN     "BibleVersionId" UUID,
ADD COLUMN     "Content" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "VerseId" UUID,
ADD CONSTRAINT "bible_verse_versions_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_verses" DROP CONSTRAINT "bible_verses_pkey",
DROP COLUMN "chapter_id",
DROP COLUMN "id",
DROP COLUMN "verse_number",
ADD COLUMN     "ChapterId" UUID,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "VerseNumber" INTEGER,
ADD CONSTRAINT "bible_verses_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bible_versions" DROP CONSTRAINT "bible_versions_pkey",
DROP COLUMN "abbreviation",
DROP COLUMN "contributors",
DROP COLUMN "copyright",
DROP COLUMN "description",
DROP COLUMN "id",
DROP COLUMN "language",
DROP COLUMN "license",
DROP COLUMN "name",
DROP COLUMN "publish_year",
DROP COLUMN "year",
ADD COLUMN     "Abbreviation" TEXT,
ADD COLUMN     "Contributors" TEXT,
ADD COLUMN     "Copyright" TEXT,
ADD COLUMN     "Description" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Language" TEXT,
ADD COLUMN     "License" TEXT,
ADD COLUMN     "Name" TEXT,
ADD COLUMN     "PublishYear" TEXT,
ADD COLUMN     "Publisher" TEXT,
ADD COLUMN     "Source" TEXT,
ADD CONSTRAINT "bible_versions_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "bookmarks" DROP CONSTRAINT "bookmarks_pkey",
DROP COLUMN "created_date",
DROP COLUMN "id",
DROP COLUMN "reference_id",
DROP COLUMN "type",
DROP COLUMN "user_id",
ADD COLUMN     "CreatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "ReferenceId" UUID,
ADD COLUMN     "Type" INTEGER,
ADD COLUMN     "UserId" TEXT,
ADD CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "books" DROP CONSTRAINT "books_pkey",
DROP COLUMN "author_id",
DROP COLUMN "content",
DROP COLUMN "id",
ADD COLUMN     "AuthorId" UUID,
ADD COLUMN     "Content" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Slug" TEXT,
ADD CONSTRAINT "books_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "catechism_items" DROP CONSTRAINT "catechism_items_pkey",
DROP COLUMN "answer",
DROP COLUMN "catechism_id",
DROP COLUMN "id",
DROP COLUMN "number",
DROP COLUMN "question",
ADD COLUMN     "Answer" TEXT,
ADD COLUMN     "CatechismId" UUID NOT NULL,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Number" INTEGER,
ADD COLUMN     "Question" TEXT,
ADD COLUMN     "Section" TEXT,
ADD COLUMN     "Slug" TEXT,
ADD CONSTRAINT "catechism_items_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "catechism_proof_texts" DROP CONSTRAINT "catechism_proof_texts_pkey",
DROP COLUMN "catechism_item_id",
DROP COLUMN "id",
DROP COLUMN "reference",
DROP COLUMN "text",
ADD COLUMN     "CatechismItemId" UUID,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "ProofText" TEXT,
ADD CONSTRAINT "catechism_proof_texts_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "catechisms" DROP CONSTRAINT "catechisms_pkey",
DROP COLUMN "description",
DROP COLUMN "id",
DROP COLUMN "name",
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Slug" TEXT,
ADD COLUMN     "Source" TEXT,
ADD CONSTRAINT "catechisms_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "commentaries" DROP CONSTRAINT "commentaries_pkey",
DROP COLUMN "author_id",
DROP COLUMN "bible_reference_id",
DROP COLUMN "group_id",
DROP COLUMN "id",
DROP COLUMN "slug",
DROP COLUMN "source",
DROP COLUMN "source_url",
ADD COLUMN     "AuthorId" UUID,
ADD COLUMN     "BibleReferenceId" UUID,
ADD COLUMN     "GroupId" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Slug" TEXT,
ADD COLUMN     "Source" TEXT,
ADD COLUMN     "SourceUrl" TEXT,
ADD CONSTRAINT "commentaries_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "commentary_excerpts" DROP CONSTRAINT "commentary_excerpts_pkey",
DROP COLUMN "commentary_id",
DROP COLUMN "content",
DROP COLUMN "id",
DROP COLUMN "order",
DROP COLUMN "type",
ADD COLUMN     "CommentaryId" UUID,
ADD COLUMN     "Content" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Order" INTEGER,
ADD COLUMN     "Type" INTEGER NOT NULL DEFAULT 0,
ADD CONSTRAINT "commentary_excerpts_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "contacts" DROP CONSTRAINT "contacts_pkey",
DROP COLUMN "created_date",
DROP COLUMN "email",
DROP COLUMN "id",
DROP COLUMN "message",
DROP COLUMN "name",
DROP COLUMN "reason",
DROP COLUMN "subject",
DROP COLUMN "target_email",
DROP COLUMN "url",
DROP COLUMN "user_id",
ADD COLUMN     "CreatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Message" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Name" TEXT NOT NULL,
ADD COLUMN     "Reason" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Subject" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "TargetEmail" TEXT NOT NULL,
ADD COLUMN     "Url" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "UserId" TEXT,
ADD CONSTRAINT "contacts_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "cta_tiles" DROP CONSTRAINT "cta_tiles_pkey",
DROP COLUMN "button_text",
DROP COLUMN "button_url",
DROP COLUMN "description",
DROP COLUMN "id",
DROP COLUMN "image_url",
DROP COLUMN "title",
ADD COLUMN     "DestinationUrl" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Message" TEXT,
ADD COLUMN     "PlacementRule" TEXT,
ADD COLUMN     "Type" TEXT,
ADD CONSTRAINT "cta_tiles_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "facts" DROP CONSTRAINT "facts_pkey",
DROP COLUMN "author_id",
DROP COLUMN "content",
DROP COLUMN "id",
ADD COLUMN     "AuthorId" UUID,
ADD COLUMN     "Content" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD CONSTRAINT "facts_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "interlinear_words" DROP CONSTRAINT "interlinear_words_pkey",
DROP COLUMN "greek_word",
DROP COLUMN "hebrew_word",
DROP COLUMN "id",
DROP COLUMN "morphology",
DROP COLUMN "reference_id",
DROP COLUMN "strongs_lexicon_id",
DROP COLUMN "translation",
DROP COLUMN "transliteration",
DROP COLUMN "word",
DROP COLUMN "word_position",
ADD COLUMN     "BibleReferenceId" UUID,
ADD COLUMN     "EnglishWord" TEXT,
ADD COLUMN     "GrammarCompact" TEXT,
ADD COLUMN     "GrammarDetailed" TEXT,
ADD COLUMN     "GreekWord" TEXT,
ADD COLUMN     "HebrewWord" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Punctuation" TEXT,
ADD COLUMN     "StrongsLexiconId" UUID,
ADD COLUMN     "Transliteration" TEXT,
ADD COLUMN     "WordPosition" INTEGER,
ADD CONSTRAINT "interlinear_words_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "landing_page_components" DROP CONSTRAINT "landing_page_components_pkey",
DROP COLUMN "component_type",
DROP COLUMN "content",
DROP COLUMN "entity_id",
DROP COLUMN "id",
DROP COLUMN "landing_page_id",
DROP COLUMN "order",
ADD COLUMN     "AllowRandomOrder" BOOLEAN,
ADD COLUMN     "ComponentType" TEXT,
ADD COLUMN     "EntityId" UUID NOT NULL,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "LandingPageId" UUID NOT NULL,
ADD COLUMN     "Order" INTEGER,
ADD CONSTRAINT "landing_page_components_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "landing_pages" DROP CONSTRAINT "landing_pages_pkey",
DROP COLUMN "id",
DROP COLUMN "meta_description",
DROP COLUMN "reference_slug",
DROP COLUMN "slug",
DROP COLUMN "title",
ADD COLUMN     "Header" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "MetaDescription" TEXT,
ADD COLUMN     "MetaKeywords" TEXT,
ADD COLUMN     "ReferenceSlug" TEXT,
ADD COLUMN     "Slug" TEXT,
ADD COLUMN     "Subheader" TEXT,
ADD CONSTRAINT "landing_pages_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "quotes" DROP CONSTRAINT "quotes_pkey",
DROP COLUMN "author_id",
DROP COLUMN "bible_verse_id",
DROP COLUMN "content",
DROP COLUMN "id",
DROP COLUMN "slug",
ADD COLUMN     "AuthorId" UUID,
ADD COLUMN     "BibleVerseId" UUID,
ADD COLUMN     "Content" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Slug" TEXT,
ADD CONSTRAINT "quotes_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "search_entries" DROP CONSTRAINT "search_entries_pkey",
DROP COLUMN "author_name",
DROP COLUMN "author_slug",
DROP COLUMN "book_slug",
DROP COLUMN "chapter_number",
DROP COLUMN "content",
DROP COLUMN "description",
DROP COLUMN "end_verse_number",
DROP COLUMN "id",
DROP COLUMN "slug",
DROP COLUMN "start_verse_number",
DROP COLUMN "title",
DROP COLUMN "type",
DROP COLUMN "verse_number",
ADD COLUMN     "AuthorName" TEXT,
ADD COLUMN     "BookAliases" TEXT,
ADD COLUMN     "BookName" TEXT,
ADD COLUMN     "BookSlug" VARCHAR(450),
ADD COLUMN     "ChapterNumber" INTEGER,
ADD COLUMN     "EndVerseNumber" INTEGER,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Reference" TEXT,
ADD COLUMN     "Slug" TEXT,
ADD COLUMN     "StartVerseNumber" INTEGER,
ADD COLUMN     "TakeawayContent" TEXT,
ADD COLUMN     "Text" TEXT,
ADD COLUMN     "Type" TEXT,
ADD COLUMN     "VerseNumber" INTEGER,
ADD CONSTRAINT "search_entries_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "seo_keywords" DROP CONSTRAINT "seo_keywords_pkey",
DROP COLUMN "competition_level",
DROP COLUMN "cpc_usd",
DROP COLUMN "created_date",
DROP COLUMN "current_url",
DROP COLUMN "current_url_position",
DROP COLUMN "current_url_traffic",
DROP COLUMN "id",
DROP COLUMN "keyword",
DROP COLUMN "keyword_difficulty",
DROP COLUMN "number_of_results",
DROP COLUMN "search_intent",
DROP COLUMN "search_volume",
DROP COLUMN "submitted_for_indexing",
ADD COLUMN     "AddedDate" TIMESTAMP(3),
ADD COLUMN     "CPC_USD" DECIMAL(18,6),
ADD COLUMN     "Click_potential" INTEGER,
ADD COLUMN     "Competitive_Density" INTEGER,
ADD COLUMN     "Competitor_on_TOP_10_1" TEXT,
ADD COLUMN     "Competitor_on_TOP_10_10" TEXT,
ADD COLUMN     "Competitor_on_TOP_10_2" TEXT,
ADD COLUMN     "Competitor_on_TOP_10_3" TEXT,
ADD COLUMN     "Competitor_on_TOP_10_4" TEXT,
ADD COLUMN     "Competitor_on_TOP_10_5" TEXT,
ADD COLUMN     "Competitor_on_TOP_10_6" TEXT,
ADD COLUMN     "Competitor_on_TOP_10_7" TEXT,
ADD COLUMN     "Competitor_on_TOP_10_8" TEXT,
ADD COLUMN     "Competitor_on_TOP_10_9" TEXT,
ADD COLUMN     "Content_reference_1" TEXT,
ADD COLUMN     "Content_reference_10" TEXT,
ADD COLUMN     "Content_reference_2" TEXT,
ADD COLUMN     "Content_reference_3" TEXT,
ADD COLUMN     "Content_reference_4" TEXT,
ADD COLUMN     "Content_reference_5" TEXT,
ADD COLUMN     "Content_reference_6" TEXT,
ADD COLUMN     "Content_reference_7" TEXT,
ADD COLUMN     "Content_reference_8" TEXT,
ADD COLUMN     "Content_reference_9" TEXT,
ADD COLUMN     "Database" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Intent" TEXT,
ADD COLUMN     "Keyword" TEXT,
ADD COLUMN     "Keyword_Classification" TEXT,
ADD COLUMN     "Keyword_Difficulty" INTEGER,
ADD COLUMN     "Number_of_Results" BIGINT,
ADD COLUMN     "Page" TEXT,
ADD COLUMN     "Page_type" TEXT,
ADD COLUMN     "SERP_Features" TEXT,
ADD COLUMN     "Seed_keyword" TEXT,
ADD COLUMN     "SubmittedForIndexing" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "Tags" TEXT,
ADD COLUMN     "Topic" TEXT,
ADD COLUMN     "Trend" TEXT,
ADD COLUMN     "Volume" INTEGER,
ADD CONSTRAINT "seo_keywords_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "sitemap_entries" DROP CONSTRAINT "sitemap_entries_pkey",
DROP COLUMN "change_freq",
DROP COLUMN "id",
DROP COLUMN "last_modified",
DROP COLUMN "priority",
DROP COLUMN "sitemap_group_id",
DROP COLUMN "url",
ADD COLUMN     "CreatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Loc" TEXT,
ADD COLUMN     "SitemapGroupId" UUID NOT NULL,
ADD COLUMN     "Title" TEXT,
ADD CONSTRAINT "sitemap_entries_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "sitemap_groups" DROP CONSTRAINT "sitemap_groups_pkey",
DROP COLUMN "group_type",
DROP COLUMN "id",
DROP COLUMN "identifier",
ADD COLUMN     "GeneratedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "GroupIdentifier" TEXT NOT NULL,
ADD COLUMN     "GroupType" TEXT NOT NULL,
ADD COLUMN     "Id" UUID NOT NULL,
ADD CONSTRAINT "sitemap_groups_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "strongs_lexicons" DROP CONSTRAINT "strongs_lexicons_pkey",
DROP COLUMN "derivation",
DROP COLUMN "id",
DROP COLUMN "original_word",
DROP COLUMN "pronunciation",
DROP COLUMN "short_definition",
DROP COLUMN "strongs_def",
DROP COLUMN "strongs_key",
DROP COLUMN "transliteration",
ADD COLUMN     "BdbDef" TEXT,
ADD COLUMN     "Frequency" INTEGER,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "KjvTranslation" TEXT,
ADD COLUMN     "Language" TEXT,
ADD COLUMN     "NasbTranslation" TEXT,
ADD COLUMN     "OriginalWord" TEXT,
ADD COLUMN     "PartOfSpeech" TEXT,
ADD COLUMN     "PhoneticSpelling" TEXT,
ADD COLUMN     "Pronunciation" TEXT,
ADD COLUMN     "ShortDefinition" TEXT,
ADD COLUMN     "StrongsDef" TEXT,
ADD COLUMN     "StrongsKey" VARCHAR(450),
ADD COLUMN     "Transliteration" TEXT,
ADD COLUMN     "WordOrigin" TEXT,
ADD CONSTRAINT "strongs_lexicons_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "subscriptions" DROP CONSTRAINT "subscriptions_pkey",
DROP COLUMN "created_date",
DROP COLUMN "email",
DROP COLUMN "form",
DROP COLUMN "id",
DROP COLUMN "resubscribed_date",
DROP COLUMN "unsubscribed_date",
DROP COLUMN "url",
ADD COLUMN     "CreatedDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "Form" TEXT NOT NULL DEFAULT '',
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "ResubscribedDate" TIMESTAMP(3),
ADD COLUMN     "UnsubscribedDate" TIMESTAMP(3),
ADD COLUMN     "Url" TEXT NOT NULL DEFAULT '',
ADD CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("Id");

-- AlterTable
ALTER TABLE "works" DROP CONSTRAINT "works_pkey",
DROP COLUMN "author_id",
DROP COLUMN "content",
DROP COLUMN "id",
ADD COLUMN     "AaUrl" TEXT,
ADD COLUMN     "AuthorId" UUID,
ADD COLUMN     "Content" TEXT,
ADD COLUMN     "Id" UUID NOT NULL,
ADD COLUMN     "Slug" TEXT,
ADD CONSTRAINT "works_pkey" PRIMARY KEY ("Id");

-- DropTable
DROP TABLE "_CrossReferenceVerseReferences";

-- CreateIndex
CREATE UNIQUE INDEX "bible_book_overviews_BookId_key" ON "bible_book_overviews"("BookId");

-- CreateIndex
CREATE INDEX "bible_book_structures_BookOverviewId_idx" ON "bible_book_structures"("BookOverviewId");

-- CreateIndex
CREATE INDEX "bible_chapters_BookId_idx" ON "bible_chapters"("BookId");

-- CreateIndex
CREATE INDEX "bible_verse_references_BibleVerseCrossReferenceId_idx" ON "bible_verse_references"("BibleVerseCrossReferenceId");

-- CreateIndex
CREATE INDEX "bible_verse_references_EndVerseId_idx" ON "bible_verse_references"("EndVerseId");

-- CreateIndex
CREATE INDEX "bible_verse_references_StartVerseId_idx" ON "bible_verse_references"("StartVerseId");

-- CreateIndex
CREATE INDEX "bible_verse_takeaway_excerpts_BibleVerseTakeawayId_idx" ON "bible_verse_takeaway_excerpts"("BibleVerseTakeawayId");

-- CreateIndex
CREATE INDEX "bible_verse_takeaway_excerpts_TakeAwayId_idx" ON "bible_verse_takeaway_excerpts"("TakeAwayId");

-- CreateIndex
CREATE INDEX "bible_verse_takeaway_quotes_AuthorId_idx" ON "bible_verse_takeaway_quotes"("AuthorId");

-- CreateIndex
CREATE INDEX "bible_verse_takeaway_quotes_BibleVerseTakeawayId_idx" ON "bible_verse_takeaway_quotes"("BibleVerseTakeawayId");

-- CreateIndex
CREATE INDEX "bible_verse_takeaway_quotes_TakeAwayId_idx" ON "bible_verse_takeaway_quotes"("TakeAwayId");

-- CreateIndex
CREATE INDEX "bible_verse_versions_BibleVersionId_idx" ON "bible_verse_versions"("BibleVersionId");

-- CreateIndex
CREATE INDEX "bible_verse_versions_VerseId_idx" ON "bible_verse_versions"("VerseId");

-- CreateIndex
CREATE INDEX "bible_verses_ChapterId_idx" ON "bible_verses"("ChapterId");

-- CreateIndex
CREATE INDEX "books_AuthorId_idx" ON "books"("AuthorId");

-- CreateIndex
CREATE INDEX "catechism_items_CatechismId_idx" ON "catechism_items"("CatechismId");

-- CreateIndex
CREATE INDEX "catechism_proof_texts_CatechismItemId_idx" ON "catechism_proof_texts"("CatechismItemId");

-- CreateIndex
CREATE INDEX "commentaries_AuthorId_idx" ON "commentaries"("AuthorId");

-- CreateIndex
CREATE INDEX "commentary_excerpts_CommentaryId_idx" ON "commentary_excerpts"("CommentaryId");

-- CreateIndex
CREATE INDEX "facts_AuthorId_idx" ON "facts"("AuthorId");

-- CreateIndex
CREATE INDEX "interlinear_words_BibleReferenceId_idx" ON "interlinear_words"("BibleReferenceId");

-- CreateIndex
CREATE INDEX "interlinear_words_StrongsLexiconId_idx" ON "interlinear_words"("StrongsLexiconId");

-- CreateIndex
CREATE INDEX "landing_page_components_LandingPageId_idx" ON "landing_page_components"("LandingPageId");

-- CreateIndex
CREATE INDEX "quotes_AuthorId_idx" ON "quotes"("AuthorId");

-- CreateIndex
CREATE INDEX "quotes_BibleVerseId_idx" ON "quotes"("BibleVerseId");

-- CreateIndex
CREATE INDEX "IX_SearchEntries_Book_Chapter_Verse" ON "search_entries"("BookSlug", "ChapterNumber", "VerseNumber");

-- CreateIndex
CREATE INDEX "sitemap_entries_SitemapGroupId_idx" ON "sitemap_entries"("SitemapGroupId");

-- CreateIndex
CREATE INDEX "strongs_lexicons_StrongsKey_idx" ON "strongs_lexicons"("StrongsKey");

-- CreateIndex
CREATE INDEX "works_AuthorId_idx" ON "works"("AuthorId");

-- AddForeignKey
ALTER TABLE "bible_book_overviews" ADD CONSTRAINT "bible_book_overviews_BookId_fkey" FOREIGN KEY ("BookId") REFERENCES "bible_books"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_book_structures" ADD CONSTRAINT "bible_book_structures_BookOverviewId_fkey" FOREIGN KEY ("BookOverviewId") REFERENCES "bible_book_overviews"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_chapters" ADD CONSTRAINT "bible_chapters_BookId_fkey" FOREIGN KEY ("BookId") REFERENCES "bible_books"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_references" ADD CONSTRAINT "bible_verse_references_BibleVerseCrossReferenceId_fkey" FOREIGN KEY ("BibleVerseCrossReferenceId") REFERENCES "bible_verse_cross_references"("Id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_references" ADD CONSTRAINT "bible_verse_references_EndVerseId_fkey" FOREIGN KEY ("EndVerseId") REFERENCES "bible_verses"("Id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_references" ADD CONSTRAINT "bible_verse_references_StartVerseId_fkey" FOREIGN KEY ("StartVerseId") REFERENCES "bible_verses"("Id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verses" ADD CONSTRAINT "bible_verses_ChapterId_fkey" FOREIGN KEY ("ChapterId") REFERENCES "bible_chapters"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_takeaway_excerpts" ADD CONSTRAINT "bible_verse_takeaway_excerpts_BibleVerseTakeawayId_fkey" FOREIGN KEY ("BibleVerseTakeawayId") REFERENCES "bible_verse_takeaways"("Id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_takeaway_excerpts" ADD CONSTRAINT "bible_verse_takeaway_excerpts_TakeAwayId_fkey" FOREIGN KEY ("TakeAwayId") REFERENCES "bible_verse_takeaways"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_takeaway_quotes" ADD CONSTRAINT "bible_verse_takeaway_quotes_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "authors"("Id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_takeaway_quotes" ADD CONSTRAINT "bible_verse_takeaway_quotes_BibleVerseTakeawayId_fkey" FOREIGN KEY ("BibleVerseTakeawayId") REFERENCES "bible_verse_takeaways"("Id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_takeaway_quotes" ADD CONSTRAINT "bible_verse_takeaway_quotes_TakeAwayId_fkey" FOREIGN KEY ("TakeAwayId") REFERENCES "bible_verse_takeaways"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_takeaways" ADD CONSTRAINT "bible_verse_takeaways_BibleReferenceId_fkey" FOREIGN KEY ("BibleReferenceId") REFERENCES "bible_verse_references"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_versions" ADD CONSTRAINT "bible_verse_versions_VerseId_fkey" FOREIGN KEY ("VerseId") REFERENCES "bible_verses"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_versions" ADD CONSTRAINT "bible_verse_versions_BibleVersionId_fkey" FOREIGN KEY ("BibleVersionId") REFERENCES "bible_versions"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "authors"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catechism_items" ADD CONSTRAINT "catechism_items_CatechismId_fkey" FOREIGN KEY ("CatechismId") REFERENCES "catechisms"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catechism_proof_texts" ADD CONSTRAINT "catechism_proof_texts_CatechismItemId_fkey" FOREIGN KEY ("CatechismItemId") REFERENCES "catechism_items"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaries" ADD CONSTRAINT "commentaries_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "authors"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaries" ADD CONSTRAINT "commentaries_BibleReferenceId_fkey" FOREIGN KEY ("BibleReferenceId") REFERENCES "bible_verse_references"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentary_excerpts" ADD CONSTRAINT "commentary_excerpts_CommentaryId_fkey" FOREIGN KEY ("CommentaryId") REFERENCES "commentaries"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facts" ADD CONSTRAINT "facts_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "authors"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interlinear_words" ADD CONSTRAINT "interlinear_words_BibleReferenceId_fkey" FOREIGN KEY ("BibleReferenceId") REFERENCES "bible_verse_references"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interlinear_words" ADD CONSTRAINT "interlinear_words_StrongsLexiconId_fkey" FOREIGN KEY ("StrongsLexiconId") REFERENCES "strongs_lexicons"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landing_page_components" ADD CONSTRAINT "landing_page_components_LandingPageId_fkey" FOREIGN KEY ("LandingPageId") REFERENCES "landing_pages"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "authors"("Id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_BibleVerseId_fkey" FOREIGN KEY ("BibleVerseId") REFERENCES "bible_verses"("Id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitemap_entries" ADD CONSTRAINT "sitemap_entries_SitemapGroupId_fkey" FOREIGN KEY ("SitemapGroupId") REFERENCES "sitemap_groups"("Id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "works" ADD CONSTRAINT "works_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "authors"("Id") ON DELETE CASCADE ON UPDATE CASCADE;
