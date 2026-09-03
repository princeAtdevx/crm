/*
    withCatch
    accepts promise and the array of error classes
    handles the promise and returns the tuple of error and data

    return type Promise<[instanceType<constrctor>, awaited<Promise>]>
*/

type ErrorConstructor = new (...args: any[]) => Error;

export async function withCatch<T, E extends readonly ErrorConstructor[]>(
	promise: Promise<T>,
	errorClasses?: E,
): Promise<[InstanceType<E[number]>, undefined] | [undefined, T]> {
	try {
		const data = await promise;
		return [undefined, data];
	} catch (error) {
		if (!errorClasses || errorClasses.some((Err) => error instanceof Err)) {
			return [error as InstanceType<E[number]>, undefined];
		}

		throw error;
	}
}
