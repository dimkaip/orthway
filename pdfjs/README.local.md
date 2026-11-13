# Local PDF.js distribution

- Version: 6.3.289 (legacy generic build for wider mobile-browser support)
- Source: https://github.com/mozilla/pdf.js/releases/download/v6.3.289/pdfjs-6.3.289-legacy-dist.zip
- SHA-256: `51683fac4aff7dd31ed91e9ab735a2098a78d50899d1ec529aed6dc8aa19400d`
- License: Apache License 2.0; see `LICENSE` in this directory.
- Local entry point: `../pdf-reader.html`

The upstream distribution files are kept unmodified. The local entry page loads
`apot.pdf` by passing its same-origin relative URL to `web/viewer.html`.
