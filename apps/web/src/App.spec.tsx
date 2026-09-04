import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

/**
 * Seam: the rendered app as a user meets it. This is the one test that proves
 * apps/web can render a component graph that reaches into @crm/ui -- which is
 * shipped as raw .tsx and only works because the shared preset lists it in
 * ssr.noExternal.
 */
describe('App', () => {
	it('confirms the save by name, not by timestamp', async () => {
		const user = userEvent.setup();
		render(<App />);

		expect(screen.queryByText(/^Saved at /)).not.toBeInTheDocument();

		await user.click(screen.getByRole('button', { name: 'Save' }));

		// Matching the prefix rather than the clock: asserting the exact time
		// would just recompute what the component did.
		expect(screen.getByText(/^Saved at /)).toBeInTheDocument();
	});

	it('clears the confirmation on reset', async () => {
		const user = userEvent.setup();
		render(<App />);

		await user.click(screen.getByRole('button', { name: 'Save' }));
		await user.click(screen.getByRole('button', { name: 'Reset' }));

		expect(screen.queryByText(/^Saved at /)).not.toBeInTheDocument();
	});
});
