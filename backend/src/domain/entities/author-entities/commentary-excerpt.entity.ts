import { CommentaryExcerptType } from '../../enums/commentary-excerpt-type.enum';
import { Commentary } from './commentary.entity';

export interface CommentaryExcerpt {
  id: string;
  commentaryId?: string | null;
  order?: number | null;
  content?: string | null;
  type: CommentaryExcerptType;

  // Navigation properties
  commentary?: Commentary | null;
}
