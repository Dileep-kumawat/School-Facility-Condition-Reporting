'use server';

import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { DB } from '@/lib/db';
import { DEFAULT_AVATAR } from '@/lib/constants';
import { setAuthCookie, removeAuthCookie, getCurrentUser } from '@/lib/auth';
import { signToken } from '@/lib/auth';
import bcrypt from 'bcryptjs';
import { IssueCategory, IssuePriority, IssueStatus, UserRole } from '@/types';
import { redirect } from 'next/navigation';

// AUTH ACTIONS
export async function loginAction(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  const user = await DB.getUserByEmail(email);
  if (!user || !user.password) {
    return { error: 'Invalid email or password.' };
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    return { error: 'Invalid email or password.' };
  }

  // Sign token
  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    name: user.name,
  });

  await setAuthCookie(token);

  if (user.role === 'admin') {
    redirect('/admin/dashboard');
  } else {
    redirect('/dashboard');
  }
}

export async function logoutAction() {
  await removeAuthCookie();
  redirect('/login');
}

export async function registerAction(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const role = formData.get('role') as UserRole;
  const schoolId = formData.get('schoolId') as string;

  if (!name || !email || !password || !role || !schoolId) {
    return { error: 'All fields are required.' };
  }

  const existingUser = await DB.getUserByEmail(email);
  if (existingUser) {
    return { error: 'Email is already registered.' };
  }

  // Hardcoded check: schoolId verification
  if (schoolId !== 'SCH-88291') {
    return { error: 'Invalid School Registration Code. Please contact school administration.' };
  }

  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const userId = `usr_${crypto.randomUUID().slice(0, 8)}`;
  
  // Set default avatar for all new users
  const avatar = DEFAULT_AVATAR;

  const newUser = {
    id: userId,
    name,
    email,
    password: hashedPassword,
    role,
    schoolId,
    avatar,
    createdAt: new Date().toISOString(),
  };

  await DB.addUser(newUser);

  // Auto-login after registration
  const token = signToken({
    userId: newUser.id,
    email: newUser.email,
    role: newUser.role,
    name: newUser.name,
  });

  await setAuthCookie(token);

  if (newUser.role === 'admin') {
    redirect('/admin/dashboard');
  } else {
    redirect('/dashboard');
  }
}

// ISSUE ACTIONS
export async function createIssueAction(data: {
  title: string;
  description: string;
  category: IssueCategory;
  priority: IssuePriority;
  location: string;
  building: string;
  room: string;
  images: string[];
  videos: string[];
}) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated.' };

  const issueId = `iss_${crypto.randomUUID().slice(0, 8)}`;

  const newIssue = {
    id: issueId,
    ...data,
    status: 'reported' as IssueStatus,
    createdBy: user.id,
    createdByName: user.name,
    createdByRole: user.role,
    createdAt: new Date().toISOString(),
  };

  await DB.addIssue(newIssue);

  // Add timeline event
  await DB.addTimeline({
    id: `tm_${crypto.randomUUID().slice(0, 8)}`,
    issueId,
    action: `Issue reported by ${user.name}`,
    updatedBy: user.name,
    timestamp: new Date().toISOString(),
  });

  // Notify admins
  const admins = (await DB.getUsers()).filter((u) => u.role === 'admin');
  for (const admin of admins) {
    await DB.addNotification({
      id: `not_${crypto.randomUUID().slice(0, 8)}`,
      userId: admin.id,
      title: 'New Issue Reported',
      message: `A new ${data.priority} priority issue "${data.title}" was reported in ${data.building}.`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  revalidatePath('/dashboard/my-reports');
  revalidatePath('/admin/issues');
  revalidatePath('/admin/dashboard');

  return { success: true, issueId };
}

export async function assignTechnicianAction(
  issueId: string,
  staffName: string,
  estimatedCompletion: string
) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    return { error: 'Not authorized.' };
  }

  const issue = await DB.getIssue(issueId);
  if (!issue) return { error: 'Issue not found.' };

  await DB.updateIssue(issueId, {
    status: 'assigned',
    assignedTo: staffName,
    estimatedCompletion,
  });

  // Add timeline event
  await DB.addTimeline({
    id: `tm_${crypto.randomUUID().slice(0, 8)}`,
    issueId,
    action: `Admin assigned repair task to ${staffName}`,
    updatedBy: user.name,
    timestamp: new Date().toISOString(),
  });

  // Notify reporter
  await DB.addNotification({
    id: `not_${crypto.randomUUID().slice(0, 8)}`,
    userId: issue.createdBy,
    title: 'Repair Task Assigned',
    message: `Your reported issue "${issue.title}" has been assigned to ${staffName}. Estimated completion: ${new Date(estimatedCompletion).toLocaleDateString()}.`,
    read: false,
    createdAt: new Date().toISOString(),
  });

  revalidatePath(`/dashboard/reports/${issueId}`);
  revalidatePath('/admin/issues');
  revalidatePath('/admin/dashboard');

  return { success: true };
}

export async function updateIssueStatusAction(
  issueId: string,
  status: IssueStatus,
  actionDetails?: string
) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated.' };

  const issue = await DB.getIssue(issueId);
  if (!issue) return { error: 'Issue not found.' };

  // Authorization checks
  if (user.role !== 'admin' && status === 'closed') {
    return { error: 'Only admins can close reports.' };
  }

  await DB.updateIssue(issueId, { status });

  // Capitalize status string for timeline display
  const formattedStatus = status.replace('_', ' ').replace(/\b\w/g, c => c.toUpperCase());

  // Add timeline event
  await DB.addTimeline({
    id: `tm_${crypto.randomUUID().slice(0, 8)}`,
    issueId,
    action: actionDetails || `Status updated to ${formattedStatus}`,
    updatedBy: user.name,
    timestamp: new Date().toISOString(),
  });

  // Notify reporter if updated by admin
  if (user.role === 'admin' && user.id !== issue.createdBy) {
    await DB.addNotification({
      id: `not_${crypto.randomUUID().slice(0, 8)}`,
      userId: issue.createdBy,
      title: `Issue Status Update: ${formattedStatus}`,
      message: `Your reported issue "${issue.title}" is now "${formattedStatus}".`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  revalidatePath(`/dashboard/reports/${issueId}`);
  revalidatePath('/dashboard/my-reports');
  revalidatePath('/admin/issues');
  revalidatePath('/admin/dashboard');

  return { success: true };
}

export async function addCommentAction(issueId: string, message: string) {
  const user = await getCurrentUser();
  if (!user) return { error: 'Not authenticated.' };

  const issue = await DB.getIssue(issueId);
  if (!issue) return { error: 'Issue not found.' };

  // Add comment timeline event
  await DB.addTimeline({
    id: `tm_${crypto.randomUUID().slice(0, 8)}`,
    issueId,
    action: `Comment: "${message}"`,
    updatedBy: user.name,
    timestamp: new Date().toISOString(),
  });

  // Notify counterpart
  const notifyId = user.role === 'admin' ? issue.createdBy : (await DB.getUsers()).filter(u => u.role === 'admin')[0]?.id;
  
  if (notifyId) {
    await DB.addNotification({
      id: `not_${crypto.randomUUID().slice(0, 8)}`,
      userId: notifyId,
      title: 'New Comment on Issue',
      message: `${user.name} added a comment to issue "${issue.title}".`,
      read: false,
      createdAt: new Date().toISOString(),
    });
  }

  revalidatePath(`/dashboard/reports/${issueId}`);
  
  return { success: true };
}

// NOTIFICATION ACTIONS
export async function markNotificationReadAction(id: string) {
  await DB.markNotificationAsRead(id);
  const user = await getCurrentUser();
  if (user) {
    revalidatePath('/dashboard/notifications');
    revalidatePath('/dashboard');
  }
}

export async function markAllNotificationsReadAction(userId: string) {
  await DB.markAllNotificationsAsRead(userId);
  revalidatePath('/dashboard/notifications');
  revalidatePath('/dashboard');
}

// IMAGEKIT SIGNATURE GENERATION ACTION (For client-side uploads)
export async function getImageKitAuthenticationAction() {
  const privateKey = process.env.IMAGEKIT_PRIVATE_KEY;
  if (!privateKey) {
    return { error: 'ImageKit private key is not configured.' };
  }

  const token = crypto.randomUUID();
  const expire = Math.floor(Date.now() / 1000) + 2400; // 40 minutes

  // Calculate signature
  const signature = crypto
    .createHmac('sha1', privateKey)
    .update(token + expire)
    .digest('hex');

  return {
    token,
    expire,
    signature,
  };
}
