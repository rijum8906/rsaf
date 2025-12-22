/**
 * This file conatains schema for validation for config
 * Created At: 22/12/2015
 */

import z from 'zod';

export const configSchema = z.object({
	appModulePath: z.string().nonempty('appModulePath is required'),
	htmlTemplatePath: z.string().nonempty('htmlTemplatePath is required'),
});

// export type
export type RsafConfig = z.infer<typeof configSchema>;
