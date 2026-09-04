import { withCatch } from './index';

/**
 * Seam: the withCatch() function itself. The tuple it returns is the whole
 * public surface -- there is nothing underneath it to reach into.
 */
describe('withCatch', () => {
	it('returns the value in the second slot when the promise resolves', async () => {
		const [error, data] = await withCatch(Promise.resolve({ id: 'usr_1' }));

		expect(error).toBeUndefined();
		expect(data).toEqual({ id: 'usr_1' });
	});

	it('returns the error in the first slot instead of throwing', async () => {
		const thrown = new Error('nope');

		const [error, data] = await withCatch(Promise.reject(thrown));

		expect(error).toBe(thrown);
		expect(data).toBeUndefined();
	});

	it('rethrows an error whose class was not listed', async () => {
		class NotFoundError extends Error {}

		// A TypeError is not a NotFoundError, so it must escape rather than be
		// flattened into the tuple and silently ignored by the caller.
		await expect(
			withCatch(Promise.reject(new TypeError('bad shape')), [NotFoundError]),
		).rejects.toBeInstanceOf(TypeError);
	});
});
