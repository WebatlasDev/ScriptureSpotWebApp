import { IRequest } from '@/lib/mediator';
import { BibleBookModel } from '@/application/models/bible-models';

export class ListBooksQuery implements IRequest<BibleBookModel[]> {}
