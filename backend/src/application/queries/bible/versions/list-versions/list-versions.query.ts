import { IRequest } from '@/lib/mediator';
import { BibleVersionModel } from '@/application/models/bible-models';

export class ListVersionsQuery implements IRequest<BibleVersionModel[]> {}
