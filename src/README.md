## Project Overview

This project is a React-based application that allows users to perform ordinal inscription lookups for Bitcoin addresses. Ordinal inscriptions are similar to NFTs on the Bitcoin base layer, and this app enables users to view the inscriptions stored in a specific Bitcoin wallet.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Features

Lookup Ordinal Inscriptions: Input a Bitcoin wallet address to lookup ordinal inscriptions stored in the wallet.
Inscription Details: Click on an inscription to view its details in a sidebar that slides in from the side.
Pagination: Browse through multiple pages of inscriptions with navigation controls.
Issues and Considerations for Improvement

### Issues

1. Pagination:
   There are more pages displayed than actual inscriptions, which would need further debugging and fine-tuning.

2. Content Types:
   The application must handle many different content formats and edge cases to ensure the quality and usability of the content displayed to the user.

3. Scrolling on Sidebar:
   There are instances where the sidebar does not scroll all the way down, preventing users from seeing all the content.
   Improvements

4. Loading:
   Implement a skeleton screen or loading animation while waiting for content to load, providing a better user experience.
   Ensure smoother pagination loading to avoid abrupt changes and enhance user experience.

5. UI Design:
   Ensure that the app adheres closer to the provided Figma design, refining the UI components and layout to match the design specifications.

## Usage

To use the application, simply enter a Bitcoin wallet address in the input field and click "Look up". The results will be displayed below, and you can click on any inscription to view its details in a sidebar.
