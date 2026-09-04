import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from './button';

/**
 * Seam: <Button>'s props and the DOM it produces. Nothing here asserts a class
 * name -- buttonVariants is an implementation detail, and a test that pinned
 * its output would break on every restyle without a behaviour changing.
 */
describe('Button', () => {
	it('renders its children into an actual button element', () => {
		render(<Button>Save</Button>);

		// `type="button"` is the component's default and matters: inside a form
		// the browser default of type="submit" would submit it.
		expect(screen.getByRole('button', { name: 'Save' })).toHaveAttribute('type', 'button');
	});

	it('calls onClick when the user clicks it', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(<Button onClick={onClick}>Save</Button>);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onClick).toHaveBeenCalledOnce();
	});

	it('does not call onClick while disabled', async () => {
		const user = userEvent.setup();
		const onClick = vi.fn();
		render(
			<Button disabled onClick={onClick}>
				Save
			</Button>,
		);

		await user.click(screen.getByRole('button', { name: 'Save' }));

		expect(onClick).not.toHaveBeenCalled();
	});
});
