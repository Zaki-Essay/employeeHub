import { Injectable } from '@angular/core';
import { Badge, Employee } from '../models';

const ALL_BADGES: Badge[] = [
    { 
      id: 'giver', 
      name: 'Generous Giver', 
      description: 'Sent the most kudos.', 
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M21 11.25v8.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5v-8.25M12 4.875A2.625 2.625 0 1 0 9.375 7.5H12m0-2.625V7.5m0-2.625A2.625 2.625 0 1 1 14.625 7.5H12m0 0V21m-8.625-9.75h18c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125h-18c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" /></svg>` 
    },
    { 
      id: 'receiver', 
      name: 'Kudos Champion', 
      description: 'Received the most kudos.', 
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M16.5 18.75h-9a9.75 9.75 0 0 0 9 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 15.75c0-1.31-1.065-2.375-2.375-2.375h-1.05c-.388 0-.754.11-1.065.312l-1.015.675c-.66.44-1.59.44-2.25 0l-1.015-.675A2.492 2.492 0 0 0 9.425 13.375h-1.05C7.065 13.375 6 14.44 6 15.75v3.375c0 .621.504 1.125 1.125 1.125h11.75c.621 0 1.125-.504 1.125-1.125v-3.375Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9.75 16.5 12h-9l2.25-2.25" /><path stroke-linecap="round" stroke-linejoin="round" d="M12 13.5V3.75m0 9.75a1.5 1.5 0 0 1-1.5-1.5V3.75a1.5 1.5 0 0 1 1.5-1.5h.008a1.5 1.5 0 0 1 1.5 1.5v8.25a1.5 1.5 0 0 1-1.5 1.5H12Z" /></svg>` 
    },
    { 
      id: 'project-pro', 
      name: 'Project Pro', 
      description: 'Assigned to 3 or more projects.', 
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M11.42 15.17 17.25 21A2.652 2.652 0 0 0 21 17.25l-5.877-5.877M11.42 15.17l2.472-2.472a3.375 3.375 0 0 0-4.773-4.773L6.75 15.75l2.472 2.472a3.375 3.375 0 0 0 4.773-4.773L11.42 15.17Z" /></svg>`
    },
    { 
      id: 'top-contributor', 
      name: 'Top Contributor', 
      description: 'Received over 200 kudos in total.', 
      icon: `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-full h-full"><path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456Z" /></svg>` 
    }
];

@Injectable({ providedIn: 'root' })
export class BadgeService {
    getBadges(): Badge[] {
        return ALL_BADGES;
    }

    getBadgesForEmployee(employee: Employee, allEmployees: Employee[]): Badge[] {
        const earnedBadges: Badge[] = [];

        // Most kudos sent
        const maxSent = Math.max(...allEmployees.map(e => e.kudosSent));
        if (employee.kudosSent > 0 && employee.kudosSent === maxSent) {
            const badge = ALL_BADGES.find(b => b.id === 'giver');
            if (badge) earnedBadges.push(badge);
        }
        
        // Most kudos received
        const maxReceived = Math.max(...allEmployees.map(e => e.kudosReceived));
        if (employee.kudosReceived > 0 && employee.kudosReceived === maxReceived) {
            const badge = ALL_BADGES.find(b => b.id === 'receiver');
            if (badge) earnedBadges.push(badge);
        }

        // Project pro
        if (employee.projectAssignments.length >= 3) {
            const badge = ALL_BADGES.find(b => b.id === 'project-pro');
            if (badge) earnedBadges.push(badge);
        }

        // Top contributor
        if (employee.kudosReceived >= 200) {
            const badge = ALL_BADGES.find(b => b.id === 'top-contributor');
            if(badge) earnedBadges.push(badge);
        }

        return earnedBadges;
    }
}