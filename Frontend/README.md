# HD Notes Frontend

## 🌐 Live Application

**Host URL:** https://highdelite-notes-app.netlify.app

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository** (if not already done)

   ```bash
   git clone <repository-url>
   cd HD-Notes/Frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

### Running Locally

1. **Start the development server**

   ```bash
   npm run dev
   ```

2. **Open your browser**
   - Navigate to `http://localhost:5173`
   - The application will automatically reload when you make changes

### Development Features

- **Hot Module Replacement (HMR)**: Changes reflect immediately in the browser
- **TypeScript Support**: Full TypeScript integration with type checking
- **ESLint**: Code linting for better code quality
- **Vite**: Fast build tool for development and production

## 🏗️ Building for Production

### Build Command

```bash
npm run build
```

This command will:

- Compile and bundle all TypeScript/React code
- Optimize assets for production
- Generate static files in the `dist` folder
- Create minified and optimized builds

### Preview Production Build

After building, you can preview the production build locally:

```bash
npm run preview
```

### Build Output

The build process creates a `dist` folder containing:

- Optimized HTML, CSS, and JavaScript files
- Static assets (images, fonts, etc.)
- Ready-to-deploy files for hosting platforms

## 📁 Project Structure

```
Frontend/
├── src/
│   ├── app/           # Main application components
│   │   ├── auth/      # Authentication components
│   │   └── Notes.tsx  # Notes application
│   ├── components/    # Reusable UI components
│   ├── hooks/         # Custom React hooks
│   ├── layouts/       # Layout components
│   ├── lib/           # Utilities and services
│   └── routes/        # Routing components
├── public/            # Static assets
└── package.json       # Dependencies and scripts
```

## 🔧 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint for code quality

## 🌍 Environment Variables

Create a `.env` file in the root directory for environment-specific configurations:

```env
VITE_API_URL= //You backend api string
```

## 🚀 Deployment

The application is configured for deployment on Netlify. The build process creates optimized static files that can be deployed to any static hosting service.

### Netlify Deployment

- Connect your repository to Netlify
- Build command: `npm run build`
- Publish directory: `dist`
- The application will be automatically deployed on push to main branch

## 📱 Features

- **Authentication**: Sign up and sign in functionality
- **Notes Management**: Create, read, update, and delete notes
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Built with shadcn/ui components
- **TypeScript**: Full type safety throughout the application

