import React, { useState } from 'react';
import Sidebar from './Sidebar';

const Lookup: React.FC = () => {
	const [inputValue, setInputValue] = useState('');
	const [results, setResults] = useState<any[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');
	const [selectedInscription, setSelectedInscription] = useState<{
		address: string;
		inscriptionId: string;
	} | null>(null);
	const [limit] = useState(5);
	const [offset, setOffset] = useState(0);
	const [total, setTotal] = useState(0);

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setInputValue(e.target.value);
	};

	const handleLookup = async (newOffset = 0) => {
		setLoading(true);
		setError('');
		setResults([]);
		try {
			const response = await fetch(
				`/api/ordinal-lookup?address=${inputValue}&limit=${limit}&offset=${newOffset}`
			);
			if (!response.ok) {
				throw new Error('Failed to fetch data');
			}
			const data = await response.json();
			console.log('Fetched Data:', data);

			if (!Array.isArray(data.results)) {
				throw new Error('Unexpected API response format');
			}

			setResults(data.results);
			setTotal(data.total);
			setOffset(newOffset);
		} catch (err) {
			setError(
				'Failed to fetch data. Please check the address and try again.'
			);
		} finally {
			setLoading(false);
		}
	};

	const handleInscriptionClick = (address: string, inscriptionId: string) => {
		setSelectedInscription({ address, inscriptionId });
	};

	const handleCloseSidebar = () => {
		setSelectedInscription(null);
	};

	const handlePageClick = (newOffset: number) => {
		handleLookup(newOffset);
	};

	const currentPage = Math.floor(offset / limit) + 1;

	return (
		<div className="bg-black text-white min-h-screen flex flex-col items-center justify-center">
			<div className="text-2xl mb-6">Ordinal Inscription Lookup</div>
			<div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
				<p className="mb-2">Owner Bitcoin Address:</p>
				<div className="mb-4">
					<input
						className="w-full border border-gray-600 p-2 rounded bg-gray-700 text-white focus:outline-none"
						value={inputValue}
						onChange={handleInputChange}
					/>
				</div>
				<button
					onClick={() => handleLookup(0)}
					className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
					disabled={loading}
				>
					{loading ? 'Looking up...' : 'Look up'}
				</button>
				{error && <p className="text-red-500 mt-4">{error}</p>}
			</div>
			{results.length > 0 && (
				<div className="mt-6 bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
					<div className="text-xl mb-4">Results</div>
					<div className="space-y-2">
						{results.map((utxo) =>
							utxo.inscriptions.map((inscription: any) => (
								<div
									key={inscription.id}
									className="bg-gray-700 p-2 rounded cursor-pointer"
									onClick={() =>
										handleInscriptionClick(
											inputValue,
											inscription.id
										)
									}
								>
									Inscription {inscription.id}
								</div>
							))
						)}
					</div>
					<div className="flex justify-between mt-4">
						<button
							onClick={() => handlePageClick(offset - limit)}
							disabled={offset === 0}
							className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
						>
							Previous
						</button>
						<div className="mt-2 text-center">
							Page {currentPage}
						</div>
						<button
							onClick={() => handlePageClick(offset + limit)}
							disabled={offset + limit >= total}
							className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition duration-200"
						>
							Next
						</button>
					</div>
				</div>
			)}
			{selectedInscription && (
				<Sidebar
					address={selectedInscription.address}
					inscriptionId={selectedInscription.inscriptionId}
					onClose={handleCloseSidebar}
				/>
			)}
		</div>
	);
};

export default Lookup;
