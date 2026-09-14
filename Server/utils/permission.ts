import { isEqualIds } from '.';
import { RoleCredential } from '../common/TokenData';

export const checkManipulatePermission = (args: {
  itemId: string;
  functionId: number;
  action: number;
  roleCredentials: Array<RoleCredential>
}) => {
  const { itemId, functionId, action, roleCredentials } = args;
  if (!roleCredentials.length) return false;
  const validCredentials = roleCredentials.filter((e) => e.itemId === null || isEqualIds(e.itemId, itemId));
  if (!validCredentials.length) return false;
  return validCredentials.some((cre) => (cre.mapActions[functionId] ?? []).includes(action));
};

export const checkAdminReadPermission = (args: {
  itemId: string | null;
  functionId: number;
  roleCredentials: Array<RoleCredential>
}) => {
  const { itemId, functionId, roleCredentials } = args;
  if (!roleCredentials.length) return false;
  const validCredentials = roleCredentials.filter((e) => e.itemId === null || isEqualIds(e.itemId, itemId));
  
  if (!validCredentials.length) return false;
  return !!validCredentials.some((cre) => cre.mapActions[functionId]);
};

export const RoleGroup = {
  CRM: 1,
  CMS: 2
} as const;
