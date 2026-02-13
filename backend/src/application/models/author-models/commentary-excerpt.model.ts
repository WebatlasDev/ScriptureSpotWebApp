import { CommentaryExcerptType } from '@/domain/enums/commentary-excerpt-type.enum';

export interface CommentaryExcerptModel {
  id: string;
  commentaryId?: string | null;
  order?: number | null;
  content?: string | null;
  type: CommentaryExcerptType;
}
