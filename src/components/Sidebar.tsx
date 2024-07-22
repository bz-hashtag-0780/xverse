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

	const InfoRow: React.FC<{ label: string; value: string | number }> = ({
		label,
		value,
	}) => (
		<div className="mb-4">
			<div className="text-[12px] font-medium text-[#BABABA]">
				{label}
			</div>
			<div className="break-words whitespace-pre-wrap">{value}</div>
		</div>
	);

	const AttributeRow: React.FC<{ label: string; value: string | number }> = ({
		label,
		value,
	}) => (
		<div className="mb-4">
			<div className="text-[12px] font-medium text-[#BABABA]">
				{label}
			</div>
			<div className="bg-[#24252C] rounded-[8px] py-2 px-3 break-words whitespace-pre-wrap">
				{value}
			</div>
		</div>
	);

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
				<h2 className="text-xl mb-4">Details</h2>
				<pre className="whitespace-pre-wrap break-all">
					{data.content}
				</pre>
			</div>
		);
	};

	return (
		<div className="fixed top-0 right-0 w-full h-full bg-[#1A1A1A] text-white shadow-lg p-4 transform transition-transform duration-300 md:w-1/3">
			<button onClick={onClose} className="p-6">
				<svg
					width="10"
					height="16"
					viewBox="0 0 10 16"
					fill="none"
					xmlns="http://www.w3.org/2000/svg"
				>
					<path
						d="M8.5 1L1.5 8L8.5 15"
						stroke="white"
						strokeWidth="1.75"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			</button>
			<div className="overflow-y-auto h-full">
				{loading && <div>Loading...</div>}
				{error && <div>{error}</div>}
				{data && renderContent()}
				{data && (
					<div>
						<div className="font-semibold pt-3 mb-6">
							Inscription {data.number}
						</div>
						<InfoRow label="Inscription ID" value={data.id} />
						<InfoRow label="Owner Address" value={data.address} />
						<div className="font-semibold mb-6">Attributes</div>
						<AttributeRow label="Output Value" value={data.value} />
						<AttributeRow
							label="Content Type"
							value={data.content_type}
						/>
						<AttributeRow
							label="Content Length"
							value={data.content_length + ' bytes'}
						/>
						<AttributeRow label="Location" value={data.location} />
						<AttributeRow
							label="Genesis Transaction"
							value={data.value}
						/>
					</div>
				)}
				{data && (
					<div>
						<pre>{JSON.stringify(data, null, 2)}</pre>
					</div>
				)}
			</div>
		</div>
	);
};

export default Sidebar;
