# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

This is an Aging Process Management system - a React-based web application for monitoring industrial workstations during aging tests. The app manages workstations, protocols, aging processes, and provides analytics for manufacturing quality control.

## Tech Stack & Architecture

- **Frontend**: React 18 + TypeScript + Vite
- **Routing**: React Router DOM v6 with protected routes
- **UI Library**: Radix UI components with custom shadcn/ui styling
- **Styling**: Tailwind CSS with comprehensive theme system
- **State Management**: TanStack React Query for server state, React Context for auth
- **Charts**: Recharts for data visualization
- **Build Tool**: Vite with SWC for fast compilation, custom Dyad component tagger
- **Package Manager**: pnpm (v10.15.1)
- **Development Server**: Runs on port 8080 with IPv6 support

## Development Commands

```bash
# Development server (port 8080)
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

### Core Application Structure
- `src/App.tsx` - Main app component with routing, auth providers, and global state
- `src/main.tsx` - Application entry point
- `src/pages/` - Main application pages with authentication protection
- `src/contexts/` - React contexts (AuthContext for user management)
- `src/components/` - Feature-specific and reusable components

### Component Organization
- `src/components/ui/` - shadcn/ui components (accordion, button, card, etc.)
- `src/components/workstation/` - Workstation-specific components
- `src/components/protocol/` - Protocol management components
- `src/components/aging-process/` - Aging process components
- `src/components/dashboard/` - Dashboard-specific components
- `src/components/analytics/` - Analytics components

### Utilities & Configuration
- `src/lib/utils.ts` - Core utility functions (`cn()` for Tailwind class merging)
- `src/hooks/` - Custom React hooks
- `src/utils/` - Application-specific utilities

## Authentication System

The app uses a role-based authentication system with the following features:
- **AuthContext**: Manages user state and authentication
- **Protected Routes**: All main routes require authentication except `/login`
- **User Roles**: admin, viewer, maintainer, operator
- **Simple Auth**: Username equals password for demo purposes
- **Local Storage**: Persists user sessions

Valid login credentials (username = password):
- admin/admin, viewer/viewer, maintainer/maintainer, operator/operator

## User Permissions System

The application implements a comprehensive role-based permission system with four user roles:

### 🔴 **Admin (管理员)** - Complete Access
**Page Access**: ✅ All pages (Dashboard, Workstations, Protocols, Aging Processes, Analytics, **System Management**)
- **Dashboard**: View all data
- **Workstation Management**: Create/delete workstations, start/stop aging, device pairing, aging pairing
- **Protocol Management**: 
  - Device Types tab: View, create, delete, import, export, copy device types
  - Register Scan, Register Table, Probe Config - All tabs accessible
- **Aging Process Management**: Process Management, Process Config, Process Recording - All tabs, can create/edit/delete processes
- **Analytics**: View all analysis data
- **System Management**: Password changes and system settings (Admin only access)

### 🟡 **Maintainer (维护员)** - Limited Management Access
**Page Access**: ✅ Dashboard, Workstations, Protocols, Aging Processes, Analytics, ❌ **System Management**
- **Dashboard**: View all data
- **Workstation Management**: Create/delete workstations, start/stop aging, device pairing, aging pairing
- **Protocol Management**:
  - Device Types tab: View, create, delete, import, export, copy device types
  - Register Scan, Register Table, Probe Config - All tabs accessible
- **Aging Process Management**: Process Management, Process Config, Process Recording - All tabs, can create/edit/delete processes
- **Analytics**: View all analysis data

### 🟢 **Operator (操作员)** - Operation Restricted Access
**Page Access**: ✅ All pages including System Management
- **Dashboard**: View all data
- **Workstation Management**: **Only** workstation overview, start/stop aging, ❌ Cannot create/delete workstations or configure pairings
- **Protocol Management**:
  - Device Types tab: **View and export only**, ❌ Cannot create, delete, import, copy device types
  - ❌ Other tabs (Register Scan, etc.) not visible
- **Aging Process Management**: **Only** Process Management tab, ❌ Cannot configure/edit processes or create/delete
- **Analytics**: View all analysis data
- **System Management**: View system information

### 🔵 **Viewer (查看员)** - Read-Only Access
**Page Access**: ✅ All pages including System Management
- **Dashboard**: View all data
- **Workstation Management**: **Only** workstation overview, ❌ Cannot start/stop aging, create/delete, or configure
- **Protocol Management**:
  - Device Types tab: **View and export only**, ❌ Cannot create, delete, import, copy device types
  - ❌ Other tabs (Register Scan, etc.) not visible
- **Aging Process Management**: **Only** Process Management tab, ❌ Cannot start/stop or edit any processes
- **Analytics**: View all analysis data
- **System Management**: View system information

### Permission Summary Table

| Function | Admin | Maintainer | Operator | Viewer |
|----------|-------|------------|----------|--------|
| System Management Access | ✅ | ❌ | ✅ | ✅ |
| Create/Delete Workstations | ✅ | ✅ | ❌ | ❌ |
| Start/Stop Aging Processes | ✅ | ✅ | ✅ | ❌ |
| Workstation Device Pairing | ✅ | ✅ | ❌ | ❌ |
| Protocol Editing Rights | ✅ | ✅ | ❌ | ❌ |
| Device Type Create/Delete | ✅ | ✅ | ❌ | ❌ |
| Aging Process Configuration | ✅ | ✅ | ❌ | ❌ |

## Available Pages

1. **Dashboard** (`/`) - Main overview page
2. **Workstation Management** (`/workstations`) - Manage industrial workstations
3. **Protocol Management** (`/protocols`) - Configure device protocols
4. **Aging Process Management** (`/aging-processes`) - Manage test procedures
5. **Analytics** (`/analytics`) - Data visualization and reporting
6. **System Management** (`/system`) - System configuration
7. **Login** (`/login`) - Authentication page

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

## Development Guidelines

### Styling & UI
- Use Tailwind CSS classes exclusively with comprehensive theme system
- Leverage `cn()` utility from `@/lib/utils` for conditional classes
- Follow shadcn/ui patterns with Radix UI primitives
- Dark mode support via CSS custom properties
- Extensive color palette with sidebar-specific colors

### TypeScript Configuration
- Relaxed TypeScript settings for development speed:
  - `noImplicitAny: false`
  - `noUnusedParameters: false`
  - `strictNullChecks: false`
- Path aliases configured (`@/*` maps to `./src/*`)

### State Management
- TanStack React Query for server/async state
- React Context for authentication state
- Local component state with useState/useReducer for UI state
- Toast notifications via dual setup (shadcn toaster + sonner)

### File Organization
- Use absolute imports with `@/` alias (configured in both Vite and TypeScript)
- Keep component files focused and single-purpose
- Follow feature-based folder structure in components directory

## Special Notes

- **Chinese UI**: The app uses Chinese text for the UI (manufacturing context in China)
- **Workstation Focus**: Real-time workstation monitoring is the core feature
- **Modbus TCP**: Primary communication protocol on port 502
- **Development Tools**: Includes Dyad component tagger for enhanced development experience
- **Dual Toast Systems**: Uses both shadcn toaster and sonner for notifications