import { getPopularTemplateIds } from '@notify/shared';

export const POPULAR_GROUPED_NAME = 'Popular';
export const POPULAR_TEMPLATES_ID_LIST = getPopularTemplateIds({ production: process.env.NODE_ENV === 'production' });
