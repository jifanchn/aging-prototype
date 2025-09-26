# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Aging Process Management system - a React-based web application for monitoring industrial workstations during aging tests. The app manages workstations, protocols, aging processes, and provides analytics for manufacturing quality control.

## Tech Stack & Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM v6
- **UI Library**: Radix UI components with custom shadcn/ui styling
- **Styling**: Tailwind CSS with CSS-in-JS support
- **State Management**: TanStack React Query for server state, React hooks for local state
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite with SWC for fast compilation
- **Package Manager**: pnpm (v10.15.1)

## Development Commands

```bash
# Development server
pnpm dev

# Build for production  
pnpm build

# Build for development environment
pnpm build:dev

# Lint code
pnpm lint

# Preview production build
pnpm preview
```

## Project Structure

- `src/pages/` - Main application pages (Dashboard, WorkstationManagement, ProtocolManagement, AgingProcessManagement, Analytics)
- `src/components/ui/` - Reusable UI components following shadcn/ui patterns
- `src/components/workstation/` - Workstation-specific components
- `src/hooks/` - Custom React hooks
- `src/lib/` - Utility functions (mainly `cn()` for class merging)
- `src/utils/` - Application utilities

## Key Application Concepts

### Workstations
Industrial workstations that run aging processes on devices. Each workstation has:
- Status tracking (running, passed, failed, stopped, paused)
- Device connections (Modbus TCP protocol support)
- Real-time monitoring (temperature, voltage, current, etc.)
- Execution logs and uptime tracking

### Aging Processes  
Test procedures that workstations execute to validate device reliability over time.

### Protocol Management
Configuration for device communication protocols (primarily Modbus TCP).

### Device Types & Mapping
- Temperature sensors, voltage monitors, humidity sensors, etc.
- Register mapping for Modbus communication
- Device-to-workstation pairing

## Component Patterns

### UI Components
- Follow shadcn/ui patterns with Radix UI primitives
- Use `cn()` utility for conditional styling with Tailwind
- Consistent prop interfaces and TypeScript types
- All components in `/components/ui/` are styled with Tailwind classes

### Data Components  
- Use TanStack React Query for server state management
- Mock data patterns for development (see Dashboard.tsx for examples)
- Consistent interface definitions (Workstation, Device types)

### Forms & Configuration
- React Hook Form with Zod validation
- Complex configuration forms for device protocols and workstation setup

## Development Guidelines

### Styling
- Use Tailwind CSS classes exclusively
- Leverage `cn()` utility from `@/lib/utils` for conditional classes
- Follow existing color schemes and spacing patterns
- Use Radix UI components as base for custom components

### TypeScript
- Strict type checking enabled
- Define interfaces for all data structures
- Use proper typing for component props and hooks

### State Management
- Use React Query for server/async state
- Local component state with useState/useReducer for UI state
- Context providers for global UI state (toasts, tooltips)

### File Organization
- Use absolute imports with `@/` alias
- Keep component files focused and single-purpose
- Separate business logic from presentation components

## Special Notes

- The app uses Chinese text for the UI (manufacturing context in China)
- Workstation monitoring is the core feature with real-time status updates
- Device communication primarily uses Modbus TCP protocol on port 502
- Charts and analytics use Recharts library for consistent styling
- Toast notifications use dual setup (shadcn toaster + sonner)