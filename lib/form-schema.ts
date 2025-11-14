import * as z from 'zod';

// Login schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, { message: 'Email là bắt buộc' })
    .email({ message: 'Email không hợp lệ' }),
  password: z
    .string()
    .min(1, { message: 'Mật khẩu là bắt buộc' })
    .min(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' }),
});

export type LoginSchema = z.infer<typeof loginSchema>;

// Register schema
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, { message: 'Tên là bắt buộc' })
    .min(2, { message: 'Tên phải có ít nhất 2 ký tự' })
    .max(50, { message: 'Tên không được vượt quá 50 ký tự' }),
  lastName: z
    .string()
    .min(1, { message: 'Họ là bắt buộc' })
    .min(2, { message: 'Họ phải có ít nhất 2 ký tự' })
    .max(50, { message: 'Họ không được vượt quá 50 ký tự' }),
  phone: z
    .string()
    .min(1, { message: 'Số điện thoại là bắt buộc' })
    .regex(/^0[35789][0-9]{8}$/, { message: 'Số điện thoại không hợp lệ (VD: 0987654321)' }),
  email: z
    .string()
    .min(1, { message: 'Email là bắt buộc' })
    .email({ message: 'Email không hợp lệ' }),
  password: z
    .string()
    .min(1, { message: 'Mật khẩu là bắt buộc' })
    .min(8, { message: 'Mật khẩu phải có ít nhất 8 ký tự' })
    .regex(/^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/, {
      message: 'Mật khẩu phải chứa chữ, số và ký tự đặc biệt',
    }),
});

export type RegisterSchema = z.infer<typeof registerSchema>;

