import React from 'react';
import { Box } from '@mui/material';
import { notFound } from 'next/navigation';
import BookReader from '@/components/reader/BookReader';
import agent from '@/app/api/agent';

interface BookReaderPageProps {
  params: Promise<{
    author: string;
    book: string;
    chapter: string;
  }>;
  searchParams: Promise<{
    highlight?: string;
    version?: string;
  }>;
}

// Fetch author data from the API
const fetchBookChapterData = async (
  authorSlug: string, 
  bookSlug: string, 
  chapter: string,
  version: string = 'BSB'
) => {
  try {
    // Fetch all authors from the API
    const authors = await agent.Authors.listAuthors({});
    
    // Find Calvin's data
    const calvinAuthor = authors.find((author: any) => 
      author.slug === 'john-calvin' || 
      author.name.toLowerCase().includes('calvin')
    );
    
    // Use Calvin's actual data if found, otherwise use fallback
    const processedHtml = `
      <p>
        <span class="sentence" data-sentence-id="para1-1">Our wisdom, in so far as it ought to be deemed true and solid wisdom, consists almost entirely of two parts: the knowledge of God and of ourselves.</span>
        <span class="sentence" data-sentence-id="para1-2">But as these are connected together by many ties, it is not easy to determine which of the two precedes and gives birth to the other.</span>
      </p>
      <p>
        <span class="sentence" data-sentence-id="para2-1">For, in the first place, no man can survey himself without forthwith turning his thoughts towards the God in whom he lives and moves.</span>
        <span class="sentence" data-sentence-id="para2-2">Because it is perfectly obvious, that the endowments which we possess cannot possibly be from ourselves.</span>
        <span class="sentence" data-sentence-id="para2-3">Nay, that our very being is nothing else than subsistence in God alone.</span>
      </p>
      <p>
        <span class="sentence" data-sentence-id="para3-1">In the second place, those blessings which unceasingly distil to us from heaven, are like streams conducting us to the fountain.</span>
        <span class="sentence" data-sentence-id="para3-2">Here, again, the infinitude of good which resides in God becomes more apparent from our poverty.</span>
        <span class="sentence" data-sentence-id="para3-3">In particular, the miserable ruin into which the revolt of the first man has plunged us, compels us to turn our eyes upwards.</span>
      </p>
      <p>
        <span class="sentence" data-sentence-id="para4-1">Not only that while hungry and thirsty we may ask what we want, but being aroused by fear may learn humility.</span>
        <span class="sentence" data-sentence-id="para4-2">For as there exists in man something like a world of misery, and ever since we were stript of the divine attire our naked shame discloses an immense series of disgraceful properties.</span>
        <span class="sentence" data-sentence-id="para4-3">Every man, being stung by the consciousness of his own unhappiness, in this way necessarily obtains at least some knowledge of God.</span>
      </p>
      <p>
        <span class="sentence" data-sentence-id="para5-1">Thus, our feeling of ignorance, vanity, want, weakness, in short, depravity and corruption, reminds us that in the Lord, and none but He, dwell the true light of wisdom, solid virtue, exuberant goodness.</span>
        <span class="sentence" data-sentence-id="para5-2">We are accordingly urged by our own evil things to consider the good things of God.</span>
        <span class="sentence" data-sentence-id="para5-3">And, indeed, we cannot aspire to Him in earnest until we have begun to be displeased with ourselves.</span>
      </p>
      <p>
        <span class="sentence" data-sentence-id="para6-1">For what man is not disposed to rest in himself?</span>
        <span class="sentence" data-sentence-id="para6-2">Who, in fact, does not thus rest, so long as he is unknown to himself; that is, so long as he is contented with his own endowments, and unconscious or unmindful of his misery?</span>
        <span class="sentence" data-sentence-id="para6-3">Every person, therefore, on coming to the knowledge of himself, is not only urged to seek God, but is also led as by the hand to find him.</span>
      </p>
      <p>
        <span class="sentence" data-sentence-id="para7-1">On the other hand, it is evident that man never attains to a true self-knowledge until he have previously contemplated the face of God, and come down after such contemplation to look into himself.</span>
        <span class="sentence" data-sentence-id="para7-2">For (such is our innate pride) we always seem to ourselves just, and upright, and wise, and holy, until we are convinced, by clear evidence, of our injustice, vileness, folly, and impurity.</span>
        <span class="sentence" data-sentence-id="para7-3">Convinced, however, we are not, if we look to ourselves only, and not to the Lord also — He being the only standard by the application of which this conviction can be produced.</span>
      </p>
    `;

    return {
      title: `Institutes of the Christian Religion - Book I, Chapter ${chapter}`,
      content: processedHtml,
      author: calvinAuthor ? {
        name: calvinAuthor.name,
        slug: calvinAuthor.slug,
        image: calvinAuthor.image,
        colorScheme: calvinAuthor.colorScheme
      } : {
        name: 'John Calvin',
        slug: 'john-calvin',
        image: '/assets/images/authors/full-res/John-Calvin.webp'
      },
      book: {
        name: 'Institutes of the Christian Religion',
        slug: 'institutes'
      },
      chapter: parseInt(chapter),
      version: version.toUpperCase()
    };
  } catch (error) {
    return null;
  }
};

export default async function BookReaderPage({ 
  params, 
  searchParams 
}: BookReaderPageProps) {
  const { author, book, chapter } = await params;
  const { highlight, version = 'BSB' } = await searchParams;

  // Fetch the processed HTML content
  const bookData = await fetchBookChapterData(author, book, chapter, version);

  if (!bookData) {
    notFound();
  }

  return (
    <Box sx={{ 
      minHeight: '100vh',
      bgcolor: 'background.default',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <BookReader
        processedHtml={bookData.content}
        title={bookData.title}
        author={bookData.author}
        book={bookData.book}
        chapter={bookData.chapter}
        version={bookData.version}
        initialHighlight={highlight}
      />
    </Box>
  );
}