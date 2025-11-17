import { type CamelCasedPropertiesDeep } from 'type-fest';

import type { Tables, TablesInsert, TablesUpdate } from '@db-types';

export type Document = CamelCasedPropertiesDeep<Tables<'documents'>>;

export type DocumentsInsert = CamelCasedPropertiesDeep<TablesInsert<'documents'>>;

export type DocumentsUpdate = CamelCasedPropertiesDeep<TablesUpdate<'documents'>>;
