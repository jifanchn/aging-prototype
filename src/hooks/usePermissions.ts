import { useAuth } from '@/contexts/AuthContext';

export type Permission = 
  // Page access permissions
  | 'access_dashboard'
  | 'access_workstations' 
  | 'access_protocols'
  | 'access_aging_processes'
  | 'access_analytics'
  | 'access_system'
  
  // Operation permissions  
  | 'edit_workstations'
  | 'delete_workstations'
  | 'edit_protocols'
  | 'edit_aging_processes'
  | 'edit_device_pairing'
  | 'edit_aging_pairing'
  | 'control_aging_processes' // start/stop aging processes
  | 'edit_system_settings';

export const usePermissions = () => {
  const { user } = useAuth();

  const hasPermission = (permission: Permission): boolean => {
    if (!user) return false;

    const { role } = user;

    // Admin has all permissions
    if (role === 'admin') return true;

    switch (permission) {
      // Page access permissions
      case 'access_dashboard':
      case 'access_workstations':
      case 'access_protocols':
      case 'access_aging_processes':
      case 'access_analytics':
        return true; // All roles can access these pages
      
      case 'access_system':
        return role === 'admin'; // Only admin can access system management
      
      // Operation permissions
      case 'edit_workstations':
      case 'edit_protocols':
      case 'edit_aging_processes':
      case 'edit_device_pairing':
      case 'edit_aging_pairing':
        return role === 'maintainer' || role === 'admin';
      
      case 'delete_workstations':
        return role === 'admin' || role === 'maintainer'; // Operator cannot delete
      
      case 'control_aging_processes':
        return role !== 'viewer'; // Viewer cannot start/stop processes
      
      case 'edit_system_settings':
        return role === 'admin';
      
      default:
        return false;
    }
  };

  const canAccess = (page: string): boolean => {
    switch (page) {
      case '/':
        return hasPermission('access_dashboard');
      case '/workstations':
        return hasPermission('access_workstations');
      case '/protocols':
        return hasPermission('access_protocols');
      case '/aging-processes':
        return hasPermission('access_aging_processes');
      case '/analytics':
        return hasPermission('access_analytics');
      case '/system':
        return hasPermission('access_system');
      default:
        return true;
    }
  };

  return {
    hasPermission,
    canAccess,
    user,
    // Convenience getters
    isAdmin: user?.role === 'admin',
    isViewer: user?.role === 'viewer',
    isMaintainer: user?.role === 'maintainer',
    isOperator: user?.role === 'operator'
  };
};