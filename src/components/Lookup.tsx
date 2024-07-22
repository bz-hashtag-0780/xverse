import React, { useState } from 'react';

const Lookup: React.FC = () => {
	const [inputValue, setInputValue] = useState('');
	const handleInputChange = (e: any) => {
		const value = e.target.value;
		setInputValue(value);
	};
	return (
		<div>
			<div>Ordinal Inscription Lookup</div>
			<div>
				<p>Owner Bitcoin Address:</p>
				<div>
					<input
						className="w-[600px] border border-[#000] border-[3px] p-1 rounded bg-[#fff] w-full focus:outline-none outline-none"
						value={inputValue}
						onChange={handleInputChange}
					/>
				</div>
				<button>Look up</button>
			</div>
			{inputValue && (
				<div>
					<div>Results</div>
				</div>
			)}
		</div>
	);
};

export default Lookup;
