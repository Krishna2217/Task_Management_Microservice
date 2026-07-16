export const ALL_ROLES = [
  { value: "ROLE_ADMIN", label: "Admin" },
  { value: "ROLE_USER", label: "User" },
  { value: "ROLE_TEACHER", label: "Teacher" },
  { value: "ROLE_STUDENT", label: "Student" },
  { value: "ROLE_PROJECT_HEAD", label: "Project Head" },
  { value: "ROLE_DEVELOPER", label: "Developer" },
];

export const roleLabel = (role: string): string =>
  ALL_ROLES.find((r) => r.value === role)?.label ?? role;
