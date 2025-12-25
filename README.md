# Handtenna - 20m Pedestrian Antenna Base Designer

A modern Next.js application for designing 3D-printable antenna bases for amateur radio operation.

![Antenna Base Designer](https://img.shields.io/badge/Next.js-15.x-black?style=flat-square&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=flat-square&logo=typescript)
![Three.js](https://img.shields.io/badge/Three.js-r172-black?style=flat-square&logo=three.js)

## Features

- 🎛️ **Interactive Parameter Controls** - Adjust all antenna dimensions in real-time
- 📊 **RF Calculations** - Automatic inductance and coil turn calculations
- 🎨 **3D Preview** - Real-time WebGL visualization with orbit controls
- 📦 **STL Export** - Export models for 3D printing
- 💾 **Parameter Export** - Save design specifications as JSON

## Getting Started

### Prerequisites

- Node.js 18.x or later
- npm or yarn

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### Building for Production

```bash
npm run build
```

The static site will be generated in the `out/` directory.

## Deployment to GitHub Pages

This project is configured for automatic deployment to GitHub Pages:

1. Push your code to the `main` branch
2. Go to your repository Settings → Pages
3. Set "Source" to "GitHub Actions"
4. The workflow will automatically build and deploy on each push

### Manual Configuration

If deploying to a repository with a custom name, update `next.config.ts`:

```typescript
const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: { unoptimized: true },
  basePath: '/your-repo-name',
  assetPrefix: '/your-repo-name/',
};
```

## Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── layout.tsx          # Root layout
│   ├── page.tsx            # Main page
│   └── globals.css         # Global styles
├── components/
│   ├── sidebar/            # Control panel components
│   │   ├── Sidebar.tsx
│   │   ├── RFParametersSection.tsx
│   │   ├── CoilFormerSection.tsx
│   │   └── ...
│   ├── viewport/           # 3D viewer components
│   │   ├── Viewport.tsx
│   │   ├── Scene.tsx
│   │   └── AntennaModel.tsx
│   └── ui/                 # Reusable UI components
│       ├── Button.tsx
│       ├── RangeSlider.tsx
│       └── ...
├── hooks/
│   └── useAntennaParams.ts # State management hook
├── lib/
│   ├── csg/                # CSG boolean operations library
│   ├── geometry.ts         # Geometry helpers
│   ├── model-builder.ts    # Antenna model construction
│   ├── rf.ts               # RF calculations
│   └── stl-exporter.ts     # STL file export
└── types/
    └── antenna.ts          # TypeScript types
```

## Design Notes

The antenna base is designed for pedestrian mobile operation on the 20m amateur band:

- **Coil Former**: Adjustable winding grooves for inductance coils
- **Base**: BNC or SMA connector mount with counterpoise connection
- **Whip Mount**: Hex nut pocket for standard whip antenna attachment
- **Wire Channels**: Pre-cut paths for coil wire routing

## Technologies

- [Next.js 15](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [Three.js](https://threejs.org/) - 3D graphics library
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber) - React renderer for Three.js
- [TypeScript](https://www.typescriptlang.org/) - Type safety

## License

MIT License - see LICENSE file for details.

