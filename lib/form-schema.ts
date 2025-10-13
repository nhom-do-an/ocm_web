import * as z from 'zod';
export const formAuthenticationSchema = z.object({
  username: z.string().min(5, { message: 'Tài khoản yêu cầu bắt buộc.' }),
  password: z.string().min(5, { message: 'Mật khẩu yêu cầu bắt buộc' }),
});

export type FormAuthenticationSchema = z.infer<typeof formAuthenticationSchema>;
