// This is the actual structure from your API
export interface AuthorFromAPI {
    id: string;
    name: string;
    nicknameOrTitle: string | null;
    birthYear: number | null;
    deathYear: number | null;
    nationality: string | null;
    occupation: string | null;
    religiousTradition: string | null;
    sermonsPreached: number | null;
    slug: string;
    image: string;
    colorScheme: {
      primary: string;
      gradient: string;
      outline: string;
      chipBackground: string;
      chipText: string;
      fadeColor: string;
    };
  }
  
  // Extended Author type for the components (includes additional data we'll fetch separately)
  export interface Author extends AuthorFromAPI {
    // Computed/formatted fields
    years?: string;
    displayName?: string;
    headerImageUrl?: string;
    profileImageUrl?: string;
    
    // Stats object for components
    stats?: {
      sermonsPreached?: number;
      publishedWorks?: number;
      versesExposited?: number;
      hymnsWritten?: number;
      volumes?: number;
      contributors?: number;
      booksOfBible?: number;
    };
    
    // Content sections - these would come from separate API calls
    biography?: {
      summary: string;
      fullText?: string;
    };
    
    majorWorks?: Array<{
      id: string;
      title: string;
      description: string;
      purchaseLink?: string;
    }>;
    
    sermonLibrary?: Array<{
      id: string;
      title: string;
      date: string;
      slug?: string;
    }>;
    
    hymnLibrary?: Array<{
      id: string;
      title: string;
      year?: string;
      slug?: string;
    }>;
    
    interestingFacts?: Array<{
      id: string;
      fact: string;
    }>;
    
    contributors?: Array<{
      id: string;
      name: string;
      role?: string;
    }>;
    
    isCommentaryCollection?: boolean;
  }