-- CreateTable
CREATE TABLE "authors" (
    "id" UUID NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "slug" TEXT,
    "nickname_or_title" TEXT,
    "birth_year" INTEGER,
    "death_year" INTEGER,
    "nationality" TEXT,
    "occupation" TEXT,
    "religious_tradition" TEXT,
    "sermons_preached" INTEGER,
    "colors" TEXT,
    "image" TEXT,
    "bio" TEXT,
    "extended_bio" TEXT,

    CONSTRAINT "authors_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "books" (
    "id" UUID NOT NULL,
    "author_id" UUID,
    "content" TEXT,

    CONSTRAINT "books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "facts" (
    "id" UUID NOT NULL,
    "author_id" UUID,
    "content" TEXT NOT NULL,

    CONSTRAINT "facts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "works" (
    "id" UUID NOT NULL,
    "author_id" UUID,
    "content" TEXT,

    CONSTRAINT "works_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "quotes" (
    "id" UUID NOT NULL,
    "author_id" UUID,
    "bible_verse_id" UUID,
    "content" TEXT,
    "slug" TEXT,

    CONSTRAINT "quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentaries" (
    "id" UUID NOT NULL,
    "author_id" UUID,
    "bible_reference_id" UUID,
    "source" TEXT,
    "source_url" TEXT,
    "slug" TEXT,
    "group_id" TEXT,

    CONSTRAINT "commentaries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "commentary_excerpts" (
    "id" UUID NOT NULL,
    "commentary_id" UUID NOT NULL,
    "content" TEXT,
    "order" INTEGER NOT NULL,
    "type" INTEGER NOT NULL,

    CONSTRAINT "commentary_excerpts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_versions" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "abbreviation" TEXT,
    "language" TEXT,
    "copyright" TEXT,
    "license" TEXT,
    "description" TEXT,
    "contributors" TEXT,
    "publish_year" TEXT,
    "year" INTEGER,

    CONSTRAINT "bible_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_books" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "abbreviation" TEXT,
    "book_number" INTEGER,
    "description" TEXT,
    "slug" TEXT,
    "aliases" TEXT,

    CONSTRAINT "bible_books_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_book_overviews" (
    "id" UUID NOT NULL,
    "book_id" UUID NOT NULL,
    "author" TEXT,
    "audience" TEXT,
    "composition" TEXT,
    "objective" TEXT,
    "unique_elements" TEXT,
    "book_structure" TEXT,
    "key_themes" TEXT,
    "teaching_highlights" TEXT,
    "historical_context" TEXT,
    "cultural_background" TEXT,
    "political_landscape" TEXT,

    CONSTRAINT "bible_book_overviews_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_book_structures" (
    "id" UUID NOT NULL,
    "book_overview_id" UUID NOT NULL,
    "title" TEXT,
    "reference" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "bible_book_structures_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_chapters" (
    "id" UUID NOT NULL,
    "book_id" UUID,
    "chapter_number" INTEGER,

    CONSTRAINT "bible_chapters_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_verses" (
    "id" UUID NOT NULL,
    "chapter_id" UUID,
    "verse_number" INTEGER,

    CONSTRAINT "bible_verses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_verse_references" (
    "id" UUID NOT NULL,
    "start_verse_id" UUID,
    "end_verse_id" UUID,

    CONSTRAINT "bible_verse_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_verse_versions" (
    "id" UUID NOT NULL,
    "verse_id" UUID NOT NULL,
    "version_id" UUID NOT NULL,
    "text" TEXT,

    CONSTRAINT "bible_verse_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_verse_takeaways" (
    "id" UUID NOT NULL,
    "bible_reference_id" UUID,
    "slug" TEXT,

    CONSTRAINT "bible_verse_takeaways_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_verse_takeaway_excerpts" (
    "id" UUID NOT NULL,
    "takeaway_id" UUID NOT NULL,
    "content" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "bible_verse_takeaway_excerpts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_verse_takeaway_quotes" (
    "id" UUID NOT NULL,
    "takeaway_id" UUID NOT NULL,
    "author_id" UUID,
    "content" TEXT,
    "order" INTEGER NOT NULL,

    CONSTRAINT "bible_verse_takeaway_quotes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bible_verse_cross_references" (
    "id" UUID NOT NULL,
    "book" TEXT,
    "book_slug" TEXT,
    "chapter" TEXT,
    "verse" TEXT,
    "keyword" TEXT,
    "keyword_slug" TEXT,

    CONSTRAINT "bible_verse_cross_references_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "interlinear_words" (
    "id" UUID NOT NULL,
    "reference_id" UUID NOT NULL,
    "strongs_lexicon_id" UUID,
    "word_position" INTEGER NOT NULL,
    "word" TEXT,
    "transliteration" TEXT,
    "translation" TEXT,
    "morphology" TEXT,
    "hebrew_word" TEXT,
    "greek_word" TEXT,

    CONSTRAINT "interlinear_words_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "strongs_lexicons" (
    "id" UUID NOT NULL,
    "strongs_key" TEXT,
    "original_word" TEXT,
    "transliteration" TEXT,
    "pronunciation" TEXT,
    "strongs_def" TEXT,
    "short_definition" TEXT,
    "derivation" TEXT,

    CONSTRAINT "strongs_lexicons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catechisms" (
    "id" UUID NOT NULL,
    "name" TEXT,
    "description" TEXT,

    CONSTRAINT "catechisms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catechism_items" (
    "id" UUID NOT NULL,
    "catechism_id" UUID NOT NULL,
    "number" INTEGER,
    "question" TEXT,
    "answer" TEXT,

    CONSTRAINT "catechism_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "catechism_proof_texts" (
    "id" UUID NOT NULL,
    "catechism_item_id" UUID NOT NULL,
    "reference" TEXT,
    "text" TEXT,

    CONSTRAINT "catechism_proof_texts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "contacts" (
    "id" UUID NOT NULL,
    "user_id" TEXT,
    "name" TEXT,
    "email" TEXT,
    "subject" TEXT,
    "reason" TEXT,
    "message" TEXT,
    "target_email" TEXT,
    "url" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "contacts_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "subscriptions" (
    "id" UUID NOT NULL,
    "email" TEXT,
    "form" TEXT,
    "url" TEXT,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "unsubscribed_date" TIMESTAMP(3),
    "resubscribed_date" TIMESTAMP(3),

    CONSTRAINT "subscriptions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landing_pages" (
    "id" UUID NOT NULL,
    "title" TEXT,
    "slug" TEXT,
    "reference_slug" TEXT,
    "meta_description" TEXT,

    CONSTRAINT "landing_pages_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "landing_page_components" (
    "id" UUID NOT NULL,
    "landing_page_id" UUID NOT NULL,
    "component_type" TEXT,
    "entity_id" UUID NOT NULL,
    "order" INTEGER NOT NULL,
    "content" TEXT,

    CONSTRAINT "landing_page_components_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cta_tiles" (
    "id" UUID NOT NULL,
    "title" TEXT,
    "description" TEXT,
    "button_text" TEXT,
    "button_url" TEXT,
    "image_url" TEXT,

    CONSTRAINT "cta_tiles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "search_entries" (
    "id" UUID NOT NULL,
    "type" TEXT,
    "title" TEXT,
    "description" TEXT,
    "slug" TEXT,
    "book_slug" VARCHAR(450),
    "chapter_number" INTEGER,
    "verse_number" INTEGER,
    "start_verse_number" INTEGER,
    "end_verse_number" INTEGER,
    "author_name" TEXT,
    "author_slug" TEXT,
    "content" TEXT,

    CONSTRAINT "search_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "seo_keywords" (
    "id" UUID NOT NULL,
    "keyword" TEXT,
    "search_volume" INTEGER,
    "keyword_difficulty" INTEGER,
    "cpc_usd" DECIMAL(18,6),
    "competition_level" TEXT,
    "number_of_results" BIGINT,
    "search_intent" TEXT,
    "current_url" TEXT,
    "current_url_traffic" INTEGER,
    "current_url_position" INTEGER,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "submitted_for_indexing" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "seo_keywords_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitemap_groups" (
    "id" UUID NOT NULL,
    "identifier" TEXT,
    "group_type" TEXT,

    CONSTRAINT "sitemap_groups_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sitemap_entries" (
    "id" UUID NOT NULL,
    "sitemap_group_id" UUID NOT NULL,
    "url" TEXT,
    "last_modified" TIMESTAMP(3),
    "change_freq" TEXT,
    "priority" DECIMAL(3,2),

    CONSTRAINT "sitemap_entries_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "bookmarks" (
    "id" UUID NOT NULL,
    "user_id" TEXT,
    "type" INTEGER NOT NULL,
    "reference_id" UUID,
    "created_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "bookmarks_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_CrossReferenceVerseReferences" (
    "A" UUID NOT NULL,
    "B" UUID NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "bible_book_overviews_book_id_key" ON "bible_book_overviews"("book_id");

-- CreateIndex
CREATE INDEX "strongs_lexicons_strongs_key_idx" ON "strongs_lexicons"("strongs_key");

-- CreateIndex
CREATE INDEX "IX_SearchEntries_Book_Chapter_Verse" ON "search_entries"("book_slug", "chapter_number", "verse_number");

-- CreateIndex
CREATE UNIQUE INDEX "_CrossReferenceVerseReferences_AB_unique" ON "_CrossReferenceVerseReferences"("A", "B");

-- CreateIndex
CREATE INDEX "_CrossReferenceVerseReferences_B_index" ON "_CrossReferenceVerseReferences"("B");

-- AddForeignKey
ALTER TABLE "books" ADD CONSTRAINT "books_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "facts" ADD CONSTRAINT "facts_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "works" ADD CONSTRAINT "works_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "quotes" ADD CONSTRAINT "quotes_bible_verse_id_fkey" FOREIGN KEY ("bible_verse_id") REFERENCES "bible_verses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaries" ADD CONSTRAINT "commentaries_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "authors"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentaries" ADD CONSTRAINT "commentaries_bible_reference_id_fkey" FOREIGN KEY ("bible_reference_id") REFERENCES "bible_verse_references"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "commentary_excerpts" ADD CONSTRAINT "commentary_excerpts_commentary_id_fkey" FOREIGN KEY ("commentary_id") REFERENCES "commentaries"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_book_overviews" ADD CONSTRAINT "bible_book_overviews_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "bible_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_book_structures" ADD CONSTRAINT "bible_book_structures_book_overview_id_fkey" FOREIGN KEY ("book_overview_id") REFERENCES "bible_book_overviews"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_chapters" ADD CONSTRAINT "bible_chapters_book_id_fkey" FOREIGN KEY ("book_id") REFERENCES "bible_books"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verses" ADD CONSTRAINT "bible_verses_chapter_id_fkey" FOREIGN KEY ("chapter_id") REFERENCES "bible_chapters"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_references" ADD CONSTRAINT "bible_verse_references_start_verse_id_fkey" FOREIGN KEY ("start_verse_id") REFERENCES "bible_verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_references" ADD CONSTRAINT "bible_verse_references_end_verse_id_fkey" FOREIGN KEY ("end_verse_id") REFERENCES "bible_verses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_versions" ADD CONSTRAINT "bible_verse_versions_verse_id_fkey" FOREIGN KEY ("verse_id") REFERENCES "bible_verses"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_versions" ADD CONSTRAINT "bible_verse_versions_version_id_fkey" FOREIGN KEY ("version_id") REFERENCES "bible_versions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_takeaways" ADD CONSTRAINT "bible_verse_takeaways_bible_reference_id_fkey" FOREIGN KEY ("bible_reference_id") REFERENCES "bible_verse_references"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_takeaway_excerpts" ADD CONSTRAINT "bible_verse_takeaway_excerpts_takeaway_id_fkey" FOREIGN KEY ("takeaway_id") REFERENCES "bible_verse_takeaways"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "bible_verse_takeaway_quotes" ADD CONSTRAINT "bible_verse_takeaway_quotes_takeaway_id_fkey" FOREIGN KEY ("takeaway_id") REFERENCES "bible_verse_takeaways"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interlinear_words" ADD CONSTRAINT "interlinear_words_reference_id_fkey" FOREIGN KEY ("reference_id") REFERENCES "bible_verse_references"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "interlinear_words" ADD CONSTRAINT "interlinear_words_strongs_lexicon_id_fkey" FOREIGN KEY ("strongs_lexicon_id") REFERENCES "strongs_lexicons"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catechism_items" ADD CONSTRAINT "catechism_items_catechism_id_fkey" FOREIGN KEY ("catechism_id") REFERENCES "catechisms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "catechism_proof_texts" ADD CONSTRAINT "catechism_proof_texts_catechism_item_id_fkey" FOREIGN KEY ("catechism_item_id") REFERENCES "catechism_items"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "landing_page_components" ADD CONSTRAINT "landing_page_components_landing_page_id_fkey" FOREIGN KEY ("landing_page_id") REFERENCES "landing_pages"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "sitemap_entries" ADD CONSTRAINT "sitemap_entries_sitemap_group_id_fkey" FOREIGN KEY ("sitemap_group_id") REFERENCES "sitemap_groups"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrossReferenceVerseReferences" ADD CONSTRAINT "_CrossReferenceVerseReferences_A_fkey" FOREIGN KEY ("A") REFERENCES "bible_verse_cross_references"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CrossReferenceVerseReferences" ADD CONSTRAINT "_CrossReferenceVerseReferences_B_fkey" FOREIGN KEY ("B") REFERENCES "bible_verse_references"("id") ON DELETE CASCADE ON UPDATE CASCADE;
