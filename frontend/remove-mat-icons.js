const fs = require('fs');

const files = [
    "src/app/shared/components/data-grid/data-grid.component.html",
    "src/app/shared/components/not-found/not-found.component.html",
    "src/app/features/student/components/student-dashboard/student-dashboard.component.html",
    "src/app/shared/components/header/header.component.html",
    "src/app/features/student/components/profile/profile.component.html",
    "src/app/shared/components/enrollment-calendar/enrollment-calendar.component.html",
    "src/app/shared/components/footer/footer.component.html",
    "src/app/features/student/components/placement-status/placement-status.component.html",
    "src/app/features/student/components/interviews/interviews.component.html",
    "src/app/features/student/components/applications/applications.component.html",
    "src/app/features/lms/components/resources/resources.component.html",
    "src/app/features/admin/components/user-roles/user-roles.component.html",
    "src/app/features/lms/components/progress/progress.component.html",
    "src/app/features/company/components/profile/profile.component.html",
    "src/app/features/lms/components/lms-dashboard/lms-dashboard.component.html",
    "src/app/features/admin/components/user-management/user-management.component.html",
    "src/app/features/company/components/jobs/jobs.component.html",
    "src/app/features/lms/components/courses/courses.component.html",
    "src/app/features/company/components/interviews/interviews.component.html",
    "src/app/features/admin/components/user-activity/user-activity.component.html",
    "src/app/features/lms/components/assignments/assignments.component.html",
    "src/app/features/admin/components/course-enrollment/course-enrollment.component.html",
    "src/app/features/lms/components/assessment-taking/assessment-taking.component.html",
    "src/app/features/company/components/company-dashboard/company-dashboard.component.html",
    "src/app/features/admin/components/assessment-assignment/assessment-assignment.component.html",
    "src/app/features/lms/components/assessment-results/assessment-results.component.html",
    "src/app/features/company/components/candidates/candidates.component.html",
    "src/app/features/admin/components/admin-dashboard/admin-dashboard.component.html",
    "src/app/features/auth/components/login/login.component.html",
    "src/app/features/dashboard/components/main-dashboard/main-dashboard.component.html"
];

let totalRemoved = 0;
let filesProcessed = 0;

console.log('========================================');
console.log('Removing mat-icon elements from HTML files');
console.log('========================================\n');

files.forEach(file => {
    try {
        if (!fs.existsSync(file)) {
            console.log(`⚠️  File not found: ${file}`);
            return;
        }

        let content = fs.readFileSync(file, 'utf8');
        const originalContent = content;
        
        // Count mat-icons before removal
        const iconsBefore = (content.match(/<mat-icon[^>]*>[\s\S]*?<\/mat-icon>/g) || []).length;
        
        // Remove all mat-icon elements (including multiline)
        content = content.replace(/<mat-icon[^>]*>[\s\S]*?<\/mat-icon>/g, '');
        
        // Remove mat-icon attributes from other elements
        content = content.replace(/\s+mat-card-avatar/g, '');
        content = content.replace(/\s+matSuffix/g, '');
        content = content.replace(/\s+matPrefix/g, '');
        content = content.replace(/\s+mat-list-icon/g, '');
        
        // Clean up extra whitespace that might be left
        content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
        
        if (content !== originalContent) {
            fs.writeFileSync(file, content);
            console.log(`✅ ${file}`);
            console.log(`   Removed ${iconsBefore} mat-icon elements`);
            totalRemoved += iconsBefore;
            filesProcessed++;
        } else {
            console.log(`ℹ️  ${file} - No mat-icons found`);
        }
    } catch (error) {
        console.log(`❌ Error processing ${file}: ${error.message}`);
    }
});

console.log('\n========================================');
console.log('Removal Complete!');
console.log(`✅ Processed: ${filesProcessed} files`);
console.log(`🗑️  Removed: ${totalRemoved} mat-icon elements`);
console.log('========================================\n');