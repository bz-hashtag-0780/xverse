import React, { useEffect, useState } from 'react';

interface SidebarProps {
	address: string;
	inscriptionId: string;
	onClose: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({
	address,
	inscriptionId,
	onClose,
}) => {
	const [data, setData] = useState<any>(null);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	useEffect(() => {
		const fetchInscriptionDetails = async () => {
			setLoading(true);
			setError('');
			try {
				const response = await fetch(
					`/api/inscription-details?address=${address}&inscriptionId=${inscriptionId}`
				);
				if (!response.ok) {
					throw new Error('Failed to fetch data');
				}
				const data = await response.json();
				setData(data);
			} catch (err) {
				setError('Failed to fetch data. Please try again.');
			} finally {
				setLoading(false);
			}
		};

		fetchInscriptionDetails();
	}, [address, inscriptionId]);

	const renderContent = () => {
		if (!data) {
			return null;
		}

		const contentType = data.content_type || '';

		const contentUrl = `https://ord.xverse.app/content/${inscriptionId}`;

		if (contentType.startsWith('image/')) {
			return (
				<img
					src={contentUrl}
					alt="Inscription content"
					className="max-w-full h-auto"
				/>
			);
		}

		if (contentType.startsWith('text/')) {
			return (
				<div>
					<h2 className="text-xl mb-4">Inscription Details</h2>
					<iframe
						src={contentUrl}
						className="w-full h-full border-none"
						sandbox="allow-scripts allow-same-origin"
						title="Inscription content"
					/>
				</div>
			);
		}

		if (contentType === '' || contentType === null) {
			return (
				<img
					src={contentUrl}
					alt="Inscription content"
					className="max-w-full h-auto"
				/>
			);
		}

		// Default case: Display the raw content as a text
		return (
			<div>
				<h2 className="text-xl mb-4">Inscription Details</h2>
				<pre className="whitespace-pre-wrap break-all">
					{data.content}
				</pre>
			</div>
		);
	};

	return (
		<div className="fixed top-0 right-0 w-1/3 h-full bg-gray-900 text-white shadow-lg p-4 transform transition-transform duration-300">
			<button onClick={onClose} className="text-red-500">
				Close
			</button>
			{loading && <div>Loading...</div>}
			{error && <div>{error}</div>}
			{data && renderContent()}
			{data && (
				<div>
					<h2 className="text-xl mb-4">Inscription Details</h2>
					<pre>{JSON.stringify(data, null, 2)}</pre>
				</div>
			)}
		</div>
	);
};

export default Sidebar;
