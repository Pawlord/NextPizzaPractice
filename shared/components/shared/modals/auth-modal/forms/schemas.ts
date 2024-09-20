import {z} from 'zod';

export const passwordSchema = z.string().min(4, {message: 'Пароль должен содержать не менее 4 символов.'})
 
export const formLoginSchema = z.object({
    email: z.string().email({message: 'Введите корректную почту!'}),
    password: passwordSchema,
})

export const formRegisterSchema = formLoginSchema.merge(
    z.object({
        fullName: z.string().min(2, {message: 'Введите имя и фамилию'}),
        confirmPassword: passwordSchema,
    })
).refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают!',
    path: ['confirmPassword'],
}) //Это проверка совпадения паролей, которая будет срабатывать при каждом изменении поля 
// confirmPassword
export const formProfileSchema = (
    z.object({
        email: z.string().email({message: 'Введите корректную почту!'}),
        fullName: z.string().min(2, {message: 'Введите имя и фамилию'}),
        password: z.string().optional(),
        confirmPassword: z.string().optional(),
    })
).refine(data => data.password === data.confirmPassword, {
    message: 'Пароли не совпадают!',
    path: ['confirmPassword'],
})

export type TFormLoginValues = z.infer<typeof formLoginSchema>;
export type TFormRegisterValues = z.infer<typeof formRegisterSchema>;
export type TFormProfileValues = z.infer<typeof formProfileSchema>;

