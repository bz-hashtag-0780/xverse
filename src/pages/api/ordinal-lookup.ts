import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { address } = req.query;

	if (!address) {
		return res.status(400).json({ error: 'Address is required' });
	}

	try {
		const response = await fetch(
			`https://api-3.xverse.app/v1/address/${address}/ordinal-utxo`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}

		const data = await response.json();
		console.log('API Data:', data); // Debugging line
		res.status(200).json(data);
	} catch (err) {
		const errorMessage =
			err instanceof Error ? err.message : 'An unknown error occurred';
		console.error('Error fetching data:', errorMessage); // Debugging line
		res.status(500).json({ error: errorMessage });
	}
}
