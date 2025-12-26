import { existsSync } from 'node:fs';
import { mkdir, writeFile } from 'node:fs/promises';
import { dirname } from 'node:path';

import { AppError } from '@rsaf/core';

/**
 * This function saves a file (temp file) to a particular path
 * @param filePath - The path of the file
 * @param contents - The contents to be saved in the file
 * @throws {AppError} if the path doesn't exist
 */
export async function saveTempFile(filePath: string, contents: string): Promise<void> {
	try {
		const dir = dirname(filePath);
		await mkdir(dir, { recursive: true });
		const isDirExist = existsSync(dir);
		if (!isDirExist)
			throw new AppError(`path "${dir}" doesn't exist`, {
				category: 'filesystem',
				code: 'FILE_NOT_FOUND',
			});

		await writeFile(filePath, contents, 'utf8');
	} catch (
		error: any // eslint-disable-line
	) {
		throw new AppError(`Could'n write file in ${filePath}`, {
			code: 'BUILD_FAILED',
			category: 'runtime',
			cause: error,
		});
	}
}
