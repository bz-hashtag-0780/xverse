import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse
) {
	const { address, limit = '5', offset = '0' } = req.query;

	if (!address) {
		return res.status(400).json({ error: 'Address is required' });
	}

	try {
		const response = await fetch(
			`https://api-3.xverse.app/v1/address/${address}/ordinal-utxo?limit=${limit}&offset=${offset}`
		);
		if (!response.ok) {
			throw new Error('Failed to fetch data');
		}

		const data = await response.json();
		console.log('API Data:', data);
		res.status(200).json(data);
	} catch (err) {
		const errorMessage =
			err instanceof Error ? err.message : 'An unknown error occurred';
		res.status(500).json({ error: errorMessage });
	}
}
