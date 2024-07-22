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
		<div className="bg-[#1A1A1A] text-white min-h-screen flex flex-col items-center">
			<div className="w-full max-w-md mt-6">
				<div className="p-6 pb-3">
					<div className="mb-6 font-medium text-center">
						Ordinal Inscription Lookup
					</div>
					<p className="mb-2 font-medium">Owner Bitcoin Address:</p>
					<div className="mb-4">
						<input
							className="w-full p-2 bg-[#24252C] text-white focus:outline-none"
							value={inputValue}
							onChange={handleInputChange}
						/>
					</div>
					<button
						onClick={() => handleLookup(0)}
						className="w-full bg-[#465AE9] text-white py-3 px-4 rounded-[10px] hover:bg-blue-600 transition duration-200"
						disabled={loading}
					>
						{loading ? 'Looking up...' : 'Look up'}
					</button>
					{error && <p className="text-red-500 mt-4">{error}</p>}
				</div>
				{results.length > 0 && (
					<div className="p-6 pt-0">
						<div className="mb-4">Results</div>
						<div className="space-y-2">
							{results.map((utxo) =>
								utxo.inscriptions.map((inscription: any) => (
									<div
										key={inscription.id}
										className="hover:bg-gray-700 py-4 cursor-pointer flex justify-between items-center font-medium"
										onClick={() =>
											handleInscriptionClick(
												inputValue,
												inscription.id
											)
										}
									>
										<span>
											Inscription{' '}
											{inscription.id.substring(0, 8)}
										</span>
										<svg
											width="9"
											height="16"
											viewBox="0 0 9 16"
											fill="none"
											xmlns="http://www.w3.org/2000/svg"
										>
											<path
												d="M1 1L8 8L1 15"
												stroke="white"
												strokeWidth="1.75"
												strokeLinecap="round"
												strokeLinejoin="round"
											/>
										</svg>
									</div>
								))
							)}
						</div>
						<div className="flex justify-between mt-4">
							<button
								onClick={() => handlePageClick(offset - limit)}
								disabled={offset === 0}
								className="bg-[#465AE9] text-white py-2 px-4 rounded hover:bg-[#3A4EC9] transition duration-200"
							>
								Previous
							</button>
							<div className="mt-2 text-center">
								Page {currentPage}
							</div>
							<button
								onClick={() => handlePageClick(offset + limit)}
								disabled={offset + limit >= total}
								className="bg-[#465AE9] text-white py-2 px-4 rounded hover:bg-[#3A4EC9] transition duration-200"
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
		</div>
	);
};

export default Lookup;
