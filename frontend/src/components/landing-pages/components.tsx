import BlogBookOverviewSection from './BlogBookOverviewSection'
import BlogVerseTakeawaysSection from './BlogVerseTakeawaysSection'
import BlogChapterStudySection from './BlogChapterStudySection'
import BlogPlaceholderSection from './BlogPlaceholderSection'
import { ComponentType } from 'react'

export const componentMap: Record<string, ComponentType<any>> = {
  BookOverviewSection: BlogBookOverviewSection,
  VerseTakeawaySection: BlogVerseTakeawaysSection,
  ChapterStudySection: BlogChapterStudySection,
}

export function getBlogComponent(type: string): ComponentType<any> {
  return componentMap[type] || ((props: any) => <BlogPlaceholderSection componentType={type} {...props} />)
}
