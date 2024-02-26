FHE Playground is a simple interface which you can easily try the Fully Homomorphic Encryption(FHE).

## Getting Started

First, run the development server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## ToDo

- show keys (and warn to make sure its a test key but never expose it)
- show bytesize for each
- show calculation time for each
- show visual explanation
- show formula and paper link
- support other schemes: BGV, TFHE, CKKS
- support other libraries: OpenFHE, tfhe-rs