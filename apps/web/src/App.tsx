import {
	Badge,
	Button,
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
	Input,
	Label,
} from '@crm/ui';
import { useId, useState } from 'react';

export default function App() {
	const nameId = useId();
	const emailId = useId();
	const [saved, setSaved] = useState<string | null>(null);

	return (
		<main className="mx-auto flex min-h-svh max-w-2xl flex-col justify-center gap-8 px-6 py-16">
			<header className="flex flex-col gap-2">
				<div className="flex items-center gap-3">
					<h1 className="font-medium text-3xl text-fg-strong tracking-tight">CRM</h1>
					<Badge variant="accent">web</Badge>
				</div>
				<p className="text-sm">
					Vite + React on Bun, components from <code className="font-mono">@crm/ui</code>.
				</p>
			</header>

			<Card>
				<CardHeader>
					<CardTitle>New contact</CardTitle>
					<CardDescription>
						A placeholder form — enough to prove the component package is wired up.
					</CardDescription>
				</CardHeader>
				<CardContent className="flex flex-col gap-4">
					<div className="flex flex-col gap-2">
						<Label htmlFor={nameId}>Name</Label>
						<Input id={nameId} name="name" placeholder="Ada Lovelace" />
					</div>
					<div className="flex flex-col gap-2">
						<Label htmlFor={emailId}>Email</Label>
						<Input
							id={emailId}
							name="email"
							placeholder="ada@example.com"
							type="email"
						/>
					</div>
				</CardContent>
				<CardFooter>
					<Button onClick={() => setSaved(new Date().toLocaleTimeString())}>Save</Button>
					<Button onClick={() => setSaved(null)} variant="ghost">
						Reset
					</Button>
					{saved ? <Badge variant="success">Saved at {saved}</Badge> : null}
				</CardFooter>
			</Card>
		</main>
	);
}
