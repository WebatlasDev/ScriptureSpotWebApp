#!/usr/bin/env node

/**
 * Script to import sample commentaries as bookmarks for development testing
 * This creates mock bookmark data to test the BookmarksPage component
 */

const fs = require('fs');
const path = require('path');

const getOrdinalSuffix = (value) => {
  const absoluteValue = Math.abs(value);
  const lastTwoDigits = absoluteValue % 100;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 13) {
    return 'th';
  }

  switch (absoluteValue % 10) {
    case 1:
      return 'st';
    case 2:
      return 'nd';
    case 3:
      return 'rd';
    default:
      return 'th';
  }
};

const formatCenturyFromYear = (year) => {
  if (!year) {
    return '';
  }

  const century = Math.ceil(year / 100);
  return `${century}${getOrdinalSuffix(century)} Century`;
};

// Sample commentary data based on API response structure
const sampleCommentaries = [
  {
    id: "0692aa72-09cd-4c16-81c0-56d627f4202b",
    authorId: "4cbdb26f-ed4b-42d0-8592-6868ec89e4f9",
    slug: "/commentators/albert-barnes/commentaries/genesis/1/1",
    source: "Albert Barnes Old Testament Commentary",
    author: {
      id: "4cbdb26f-ed4b-42d0-8592-6868ec89e4f9",
      name: "Albert Barnes",
      nicknameOrTitle: "Bible Commentator",
      birthYear: 1798,
      deathYear: 1870,
      nationality: "American",
      occupation: "Theologian",
      religiousTradition: "Presbyterian",
      slug: "albert-barnes",
      image: "/assets/images/authors/Albert_Barnes_Small.webp",
      colorScheme: {
        primary: "#E9249A",
        gradient: "linear-gradient(0deg, rgba(233, 36, 154, 0.10) 0%, rgba(233, 36, 154, 0.10) 100%), #121212",
        outline: "rgba(233, 36, 154, 0.20)",
        chipBackground: "rgba(233, 36, 154, 0.30)",
        chipText: "#FF72C6",
        fadeColor: "#281420"
      }
    },
    excerpts: [
      {
        id: "61571812-eb3e-4bc1-91c5-c84473f7d7a5",
        content: "<p><em>ראשׁית</em> <i>rḕshı̂̂yt</i> — the \"head-part, beginning\" of a thing, in point of time. <em>ברא</em> <i>bārā'</i> — \"create, give being to something new.\" It always has God for its subject. Hence, creation is not confined to a single point of time.</p>"
      }
    ],
    reference: "Genesis 1:1"
  },
  {
    id: "967c1ae5-5350-4a34-8c01-12b7c4832564",
    authorId: "df9800db-518f-4b32-8bff-2970ac7b2747",
    slug: "/commentators/charles-ellicott/commentaries/genesis/1/1-31",
    source: "Ellicott Old Testament Commentary",
    author: {
      id: "df9800db-518f-4b32-8bff-2970ac7b2747",
      name: "Charles Ellicott",
      nicknameOrTitle: "Bishop and Commentator",
      birthYear: 1819,
      deathYear: 1905,
      nationality: "British",
      occupation: "Bishop",
      religiousTradition: "Anglican",
      slug: "charles-ellicott",
      image: "/assets/images/authors/Charles_Ellicott_Small.webp",
      colorScheme: {
        primary: "#9342F7",
        gradient: "linear-gradient(0deg, rgba(147, 66, 247, 0.10) 0%, rgba(147, 66, 247, 0.10) 100%), #121212",
        outline: "rgba(147, 66, 247, 0.20)",
        chipBackground: "rgba(147, 66, 247, 0.30)",
        chipText: "#BD88FF",
        fadeColor: "#281E14"
      }
    },
    excerpts: [
      {
        id: "0cebf02d-7d49-4098-9a37-7027762c3112",
        content: "<p><strong>EXCURSUS B: ON THE NAMES ELOHIM AND JEHOVAH-ELOHIM.</strong></p><p>Throughout the first account of creation the Deity is simply called <em>Elohim.</em> This word is strictly a plural of <em>Eloah,</em> which is used as the name of God only in poetry.</p>"
      }
    ],
    reference: "Genesis 1:1-31"
  },
  {
    id: "sample-spurgeon-1",
    authorId: "208d2d14-a519-4da9-9568-6690fcce92b9",
    slug: "/commentators/charles-spurgeon/commentaries/psalms/23/1",
    source: "Treasury of David",
    author: {
      id: "208d2d14-a519-4da9-9568-6690fcce92b9",
      name: "Charles Spurgeon",
      nicknameOrTitle: "Prince of Preachers",
      birthYear: 1834,
      deathYear: 1892,
      nationality: "British",
      occupation: "Preacher",
      religiousTradition: "Baptist",
      slug: "charles-spurgeon",
      image: "/assets/images/authors/Charles_Spurgeon_Small.webp",
      colorScheme: {
        primary: "#278EFF",
        gradient: "linear-gradient(0deg, rgba(39, 129, 255, 0.10) 0%, rgba(39, 129, 255, 0.10) 100%), #121212",
        outline: "rgba(39, 129, 255, 0.20)",
        chipBackground: "rgba(39, 129, 255, 0.30)",
        chipText: "#96C2FF",
        fadeColor: "#141D2A"
      }
    },
    excerpts: [
      {
        id: "spurgeon-psalm-23-1",
        content: "<p>\"<em>The Lord is my shepherd.</em>\" Here is a metaphor, \"my shepherd;\" here is a name of God, \"Jehovah;\" and here is a positive declaration, \"is.\" The clause contains the essence of faith. The Lord is my shepherd, therefore I shall not want.</p>"
      }
    ],
    reference: "Psalm 23:1"
  },
  {
    id: "sample-calvin-1",
    authorId: "f8a5c855-5191-4267-b77a-e16f3b58805b",
    slug: "/commentators/john-calvin/commentaries/romans/8/28",
    source: "Calvin's Commentaries",
    author: {
      id: "f8a5c855-5191-4267-b77a-e16f3b58805b",
      name: "John Calvin",
      nicknameOrTitle: "Reformer",
      birthYear: 1509,
      deathYear: 1564,
      nationality: "French",
      occupation: "Theologian",
      religiousTradition: "Protestant",
      slug: "john-calvin",
      image: "/assets/images/authors/John_Calvin_Small.webp",
      colorScheme: {
        primary: "#FFD427",
        gradient: "linear-gradient(0deg, rgba(255, 212, 39, 0.10) 0%, rgba(255, 212, 39, 0.10) 100%), #121212",
        outline: "rgba(255, 212, 39, 0.20)",
        chipBackground: "rgba(255, 212, 39, 0.30)",
        chipText: "#FFD427",
        fadeColor: "#281E14"
      }
    },
    excerpts: [
      {
        id: "calvin-romans-8-28",
        content: "<p>Here is set forth the fountain of all confidence, — that we are sure that God cares for our salvation. This is a most apt conclusion to the preceding argument; for Paul had been speaking of the miseries and troubles of the godly, and lest any should infer from them that God had forsaken them, he now teaches us that they are so far from being a hindrance to our salvation, that they are made to promote it.</p>"
      }
    ],
    reference: "Romans 8:28"
  },
  {
    id: "sample-henry-1",
    authorId: "3c59fe56-aebb-4d77-b674-5f0f3b92bd8a",
    slug: "/commentators/matthew-henry/commentaries/matthew/5/3",
    source: "Matthew Henry Commentary",
    author: {
      id: "3c59fe56-aebb-4d77-b674-5f0f3b92bd8a",
      name: "Matthew Henry",
      nicknameOrTitle: "Bible Commentator",
      birthYear: 1662,
      deathYear: 1714,
      nationality: "Welsh",
      occupation: "Minister",
      religiousTradition: "Presbyterian",
      slug: "matthew-henry",
      image: "/assets/images/authors/Matthew_Henry_Small.webp",
      colorScheme: {
        primary: "#FF272B",
        gradient: "linear-gradient(0deg, rgba(255, 39, 43, 0.10) 0%, rgba(255, 39, 43, 0.10) 100%), #121212",
        outline: "rgba(255, 39, 43, 0.20)",
        chipBackground: "rgba(255, 39, 43, 0.30)",
        chipText: "#FF6467",
        fadeColor: "#2A1415"
      }
    },
    excerpts: [
      {
        id: "henry-beatitudes-1",
        content: "<p><strong>Blessed are the poor in spirit: for theirs is the kingdom of heaven.</strong> This is the fundamental grace, the root of all other graces. To be poor in spirit is to be emptied of self, to be sensible of our spiritual poverty and want, and to be humbled under the mighty hand of God.</p>"
      }
    ],
    reference: "Matthew 5:3"
  }
];

// Generate bookmark data based on commentary structure
function generateBookmarks() {
  const bookmarks = [];
  const now = new Date();
  
  sampleCommentaries.forEach((commentary, index) => {
    const createdAt = new Date(now - (index * 24 * 60 * 60 * 1000)); // Space out by days
    const birthCenturyTag = formatCenturyFromYear(commentary.author.birthYear);

    const bookmark = {
      id: `bookmark-${commentary.id}`,
      userId: "dev-user-1",
      contentType: "commentary",
      contentId: commentary.id,
      title: `${commentary.author.name} on ${commentary.reference}`,
      description: commentary.excerpts[0]?.content?.replace(/<[^>]*>/g, '').substring(0, 200) + '...',
      reference: commentary.reference,
      author: commentary.author,
      slug: commentary.slug,
      tags: [
        ...(birthCenturyTag ? [birthCenturyTag] : []),
        ...(commentary.author.occupation ? [commentary.author.occupation] : []),
        ...(commentary.author.religiousTradition ? [commentary.author.religiousTradition] : [])
      ],
      createdAt: createdAt.toISOString(),
      updatedAt: createdAt.toISOString(),
      
      // Additional fields for display
      excerpts: commentary.excerpts,
      formattedReference: commentary.reference,
      formattedDate: createdAt.toLocaleDateString(),
      displayTags: [
        ...(birthCenturyTag ? [birthCenturyTag] : []),
        ...(commentary.author.occupation ? [commentary.author.occupation] : [])
      ],
      monthYear: `${createdAt.getFullYear()}-${(createdAt.getMonth() + 1).toString().padStart(2, '0')}`
    };
    
    bookmarks.push(bookmark);
  });
  
  return bookmarks;
}

// Save bookmarks to JSON file for development
function saveBookmarks() {
  const bookmarks = generateBookmarks();
  const bookmarksData = {
    bookmarks,
    totalCount: bookmarks.length,
    hasMore: false
  };
  
  const outputPath = path.join(__dirname, '..', 'dev-data', 'bookmarks.json');
  
  // Create dev-data directory if it doesn't exist
  const devDataDir = path.dirname(outputPath);
  if (!fs.existsSync(devDataDir)) {
    fs.mkdirSync(devDataDir, { recursive: true });
  }
  
  fs.writeFileSync(outputPath, JSON.stringify(bookmarksData, null, 2));
  
}

// Run if called directly
if (require.main === module) {
  saveBookmarks();
}

module.exports = { generateBookmarks, sampleCommentaries };
