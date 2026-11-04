function required(key: string): string {
  const value = process.env[key];
  
  if (!value || value.trim() === '') {
    throw new Error(`❌ Environment variable configuration error: "${key}" is missing or empty in your .env file.`);
  }
  
  return value; // TypeScript automatically narrows this from 'string | undefined' to 'string'
}

export const adminUser = {
    email: required('ADMIN_USER_EMAIL'),
    password: required('ADMIN_USER_PASSWORD'),
    username: required('ADMIN_USERNAME')
};

export type AdminUser = typeof adminUser;