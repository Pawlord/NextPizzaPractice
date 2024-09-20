import { useFormContext } from "react-hook-form";
import { Input } from "../../ui";
import { ClearButton } from "../clear-button";
import { ErrorText } from "../error-text";
import { RequiredSymbol } from "../required-symbol";

interface Props extends React.InputHTMLAttributes<HTMLInputElement>{
    name: string;
    label?: string;
    required?: boolean;
    className?: string;
}

export const FormInput: React.FC<Props> = ({name, label, required, className, ...props}) => {
    //С помощью этого хука данный компонент будет использовать контекст из FormProvider
    const {
        register, //Позволяет зарегистрировать инпут, чтобы он понимал что работает в рамках useForm
        formState: {errors}, //Позволяет получить текст ошибки 
        watch, //Позволяет получать текст инпута и следить за каждым его изменением в рамках useForm
        setValue, //Позволяет установить value для инпута с указанным name
    } = useFormContext();

    const value = watch(name);
    const errorText = errors[name]?.message as string;

    const onClickClear = () => {
        setValue(name, '', {shouldValidate: true}) //Третий параметр нужен чтобы указать доп функционал по типу 
        //При очистке инпута чтобы выводилось сообщение об ошибке 
    }

    return(
        <div className={className}>
            {
                label && (
                    <p className="font-medium mb-2">
                        {label} {required && <RequiredSymbol />}
                    </p>
                )
            }

            <div className="relative"> 
                <Input className="h-12 text-md" {...register(name)} {...props} />

                {value && <ClearButton onClick={onClickClear} />}
            </div>

            {errorText && <ErrorText text={errorText} className="mt-2" />}
        </div>
    )
}