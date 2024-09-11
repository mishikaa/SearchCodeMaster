# CodeMaster - A DSA Problem Search Engine

## Project Overview
**CodeMaster** is a search engine designed to efficiently process and rank documents (DSA problems) from a large dataset (corpus) by utilizing advanced text processing techniques like TF-IDF and BM25. The core objective is to return the most relevant documents based on a user's search query, while addressing edge cases and ensuring accurate ranking and search results.

## Key Features
- **Efficient Search Functionality**: Utilizes TF-IDF and BM25 to accurately rank documents based on relevance to the user's search query.
- **Advanced Text Processing**: Handles edge cases like misspellings, numeric conversions, camel casing, lemmatization, and title similarity.
- **Web Scraping**: Extracts DSA problems using Selenium from sources like LeetCode and InterviewBit.
- **Real-Time Ranking**: Ranks documents using BM25, giving higher weightage to trusted sources and displaying the top 10 results.

## Workflow
### 1. Data Extraction
- Scrape DSA problems using Selenium, automating the collection of the dataset.

### 2. Keyword Generation and Scoring
- **Traditional String Matching**: Initial approach, but inefficient for large datasets.
- **Term Frequency (TF)**: Measures term occurrences in a document but is biased towards longer documents.
- **Inverse Document Frequency (IDF)**: Corrects bias by giving more importance to terms that appear in fewer documents.
- **TF-IDF**: Combines TF and IDF to rank keywords.

### 3. Normalization and BM-25 Scoring
- **Normalization**: Adjusts term frequency by document length to remove bias.
- **BM-25**: Caps the contribution of individual keywords to avoid over-influence.

### 4. Text Processing and Query Handling
- **Preprocessing**: Removes stopwords, punctuation, converts text to lowercase.
- **Keyword Extraction**: Focuses on query-relevant keywords, dropping irrelevant ones.
- **Edge Cases**: Handles:
  - Spelling Corrections
  - Numeric Conversions (e.g., "two" and "2")
  - CamelCase Handling (e.g., "twoSum" becomes "two sum")
  - Lemmatization: Converts words to their base forms for accurate matching.

### 5. Search and Ranking
- **Query Processing**: Extracts and processes query keywords, calculates TF-IDF scores.
- **Cosine Similarity**: Measures similarity between the query and documents.
- **Title Similarity**: Adds additional weight to documents whose titles closely match the query.
- **Ranking**: Uses BM-25 to rank documents and displays the top 10 results.

## Edge Cases Handled
- **Stopwords Removal**: Removes common words like "is" and "the."
- **Punctuation Removal**: Strips punctuation to avoid mismatches.
- **Spell Check**: Automatically corrects misspelled query words.
- **Lemmatization**: Reduces words to their base forms (e.g., "running" to "run").
- **Number-Word Conversion**: Treats numeric digits and their word forms as equivalent.
- **CamelCase Handling**: Splits camel-cased words for better matching.
- **Title Similarity**: Considers titles in ranking documents.

## RAM-Based Indexing
- **TF-IDF Storage**: TF-IDF values are stored in files and loaded into RAM during startup for faster access, enhancing search performance.
